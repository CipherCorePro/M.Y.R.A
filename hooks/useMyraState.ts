
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MyraConfig, ChatMessage, EmotionState, NodeState,
  AdaptiveFitnessState, SubQgGlobalMetrics, SubQgJumpInfo,
  GeminiGenerateContentResponse, TextChunk, ResolvedSpeakerPersonaConfig, AIProviderConfig, Language, Theme, Translations,
  PADRecord
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_EMOTION_STATE, INITIAL_NODE_STATES,
  INITIAL_ADAPTIVE_FITNESS_STATE, INITIAL_SUBQG_GLOBAL_METRICS,
  INITIAL_CAELUM_EMOTION_STATE, INITIAL_CAELUM_NODE_STATES,
  INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE, INITIAL_CAELUM_SUBQG_GLOBAL_METRICS
} from '../constants';
import { callAiApi } from '../services/aiService';
import { v4 as uuidv4 } from 'uuid';
import { RNG, SubQGRNG, QuantumRNG } from '../utils/rng';
import { addChunksToDB, getAllChunksFromDB, clearAllChunksFromDB, clearChunksBySourceFromDB } from '../utils/db';
import { AdaptiveFitnessManager } from '../utils/adaptiveFitnessManager';
import { getDominantAffect } from '../utils/uiHelpers';
import readXlsxFile from 'read-excel-file';
import mammoth from 'mammoth';


// Import translations using relative paths
import deTranslations from '../i18n/de.json';
import enTranslations from '../i18n/en.json';

const translations: Translations = {
  de: deTranslations,
  en: enTranslations,
};

const DOCUMENTATION_BASE_PATHS = [
  '/Dokumentation', 
  '/docs/config_adaptive_fitness',
  '/docs/config_ai_provider',
  '/docs/config_knowledge_rag',
  '/docs/config_persona_behavior',
  '/docs/config_subqg_simulation',
];

function deepMergeObjects(target: any, source: any) {
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);

    if (!isObject(target) || !isObject(source)) {
        return source !== undefined ? source : target;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (isObject(sourceValue)) {
            if (!isObject(targetValue)) {
                 target[key] = JSON.parse(JSON.stringify(sourceValue));
            } else {
                deepMergeObjects(targetValue, sourceValue);
            }
        } else if (sourceValue !== undefined) {
            target[key] = sourceValue;
        }
    });
    return target;
}

const getNestedTranslation = (langObject: any, key: string): string | undefined => {
  const keys = key.split('.');
  let current = langObject;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
};


const populateTranslatedFields = (configInput: MyraConfig, lang: Language): MyraConfig => {
  const config = { ...configInput }; 

  const tFuncForKey = (keyFromConfig: string): string => {
    const M_CONFIG_EFFECTIVE_TRANSLATIONS = translations[lang] || translations.en;
    return getNestedTranslation(M_CONFIG_EFFECTIVE_TRANSLATIONS, keyFromConfig) || keyFromConfig;
  };
  
  const fieldsToTranslate: Array<keyof MyraConfig> = [
    'myraName', 'myraRoleDescription', 'myraEthicsPrinciples', 'myraResponseInstruction',
    'caelumName', 'caelumRoleDescription', 'caelumEthicsPrinciples', 'caelumResponseInstruction', 'userName'
  ];
  const keyFields: Partial<Record<keyof MyraConfig, keyof MyraConfig>> = {
    'myraName': 'myraNameKey',
    'myraRoleDescription': 'myraRoleDescriptionKey',
    'myraEthicsPrinciples': 'myraEthicsPrinciplesKey',
    'myraResponseInstruction': 'myraResponseInstructionKey',
    'caelumName': 'caelumNameKey',
    'caelumRoleDescription': 'caelumRoleDescriptionKey',
    'caelumEthicsPrinciples': 'caelumEthicsPrinciplesKey',
    'caelumResponseInstruction': 'caelumResponseInstructionKey',
    'userName': 'userNameKey'
  };

  fieldsToTranslate.forEach(field => {
    const currentFieldValue = config[field] as string;
    const correspondingKeyField = keyFields[field];
    
    if (correspondingKeyField) {
        const keyFromConfig = config[correspondingKeyField] as string;
        // Only translate if the current value is empty, the same as the key, or already the translated version of the key
        // This prevents overriding user's direct edits in the settings panel if they are different from default translations
        if (!currentFieldValue || currentFieldValue === keyFromConfig || currentFieldValue === tFuncForKey(keyFromConfig)) {
            (config as any)[field] = tFuncForKey(keyFromConfig);
        }
    }
  });

  return config;
};


export const useMyraState = () => {
  const [myraConfig, setMyraConfig] = useState<MyraConfig>(() => {
    const savedConfig = localStorage.getItem('myraConfig');
    let baseConfigCopy = JSON.parse(JSON.stringify(INITIAL_CONFIG));
    let finalConfig = baseConfigCopy;

    if (savedConfig) {
        try {
            const loadedFromStorage = JSON.parse(savedConfig);
            finalConfig = deepMergeObjects(baseConfigCopy, loadedFromStorage);
        } catch (e) {
            console.error("Failed to parse myraConfig from localStorage, using defaults.", e);
        }
    }
    
    const minPadHistorySize = 50; 
    if (typeof finalConfig.maxPadHistorySize !== 'number' || finalConfig.maxPadHistorySize < minPadHistorySize) {
        console.warn(`Sanitizing myraConfig.maxPadHistorySize from ${finalConfig.maxPadHistorySize} to ${INITIAL_CONFIG.maxPadHistorySize}.`);
        finalConfig.maxPadHistorySize = INITIAL_CONFIG.maxPadHistorySize;
    }
    
    return populateTranslatedFields(finalConfig, finalConfig.language || INITIAL_CONFIG.language);
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [subQgMatrix, setSubQgMatrix] = useState<number[][]>(() => Array(myraConfig.subqgSize).fill(0).map(() => Array(myraConfig.subqgSize).fill(myraConfig.subqgBaseEnergy)));
  const [subQgPhaseMatrix, setSubQgPhaseMatrix] = useState<number[][]>(() => Array(myraConfig.subqgSize).fill(0).map(() => Array(myraConfig.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)));
  const [subQgGlobalMetrics, setSubQgGlobalMetrics] = useState<SubQgGlobalMetrics>(INITIAL_SUBQG_GLOBAL_METRICS);
  const [emotionState, setEmotionState] = useState<EmotionState>(INITIAL_EMOTION_STATE);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>(() => INITIAL_NODE_STATES.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}));
  const [adaptiveFitness, setAdaptiveFitness] = useState<AdaptiveFitnessState>(INITIAL_ADAPTIVE_FITNESS_STATE);
  const [activeSubQgJumpModifier, setActiveSubQgJumpModifier] = useState(0);
  const [subQgJumpModifierActiveStepsRemaining, setSubQgJumpModifierActiveStepsRemaining] = useState(0);
  const [subQgJumpInfo, setSubQgJumpInfo] = useState<SubQgJumpInfo | null>(null);
  const [myraStressLevel, setMyraStressLevel] = useState(0.1);
  const [padHistoryMyra, setPadHistoryMyra] = useState<PADRecord[]>([]);

  const [simulationStepCaelum, setSimulationStepCaelum] = useState(0);
  const [subQgMatrixCaelum, setSubQgMatrixCaelum] = useState<number[][]>(() => Array(myraConfig.caelumSubqgSize).fill(0).map(() => Array(myraConfig.caelumSubqgSize).fill(myraConfig.caelumSubqgBaseEnergy)));
  const [subQgPhaseMatrixCaelum, setSubQgPhaseMatrixCaelum] = useState<number[][]>(() => Array(myraConfig.caelumSubqgSize).fill(0).map(() => Array(myraConfig.caelumSubqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)));
  const [subQgGlobalMetricsCaelum, setSubQgGlobalMetricsCaelum] = useState<SubQgGlobalMetrics>(INITIAL_CAELUM_SUBQG_GLOBAL_METRICS);
  const [emotionStateCaelum, setEmotionStateCaelum] = useState<EmotionState>(INITIAL_CAELUM_EMOTION_STATE);
  const [nodeStatesCaelum, setNodeStatesCaelum] = useState<Record<string, NodeState>>(() => INITIAL_CAELUM_NODE_STATES.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}));
  const [adaptiveFitnessCaelum, setAdaptiveFitnessCaelum] = useState<AdaptiveFitnessState>(INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE);
  const [activeSubQgJumpModifierCaelum, setActiveSubQgJumpModifierCaelum] = useState(0);
  const [subQgJumpModifierActiveStepsRemainingCaelum, setSubQgJumpModifierActiveStepsRemainingCaelum] = useState(0);
  const [subQgJumpInfoCaelum, setSubQgJumpInfoCaelum] = useState<SubQgJumpInfo | null>(null);
  const [caelumStressLevel, setCaelumStressLevel] = useState(0.05);
  const [padHistoryCaelum, setPadHistoryCaelum] = useState<PADRecord[]>([]);

  const [dualConversationHistory, setDualConversationHistory] = useState<ChatMessage[]>([]);
  const [isDualConversationLoading, setIsDualConversationLoading] = useState(false);
  const dualConversationAbortControllerRef = useRef<AbortController | null>(null);

  const [processedTextChunks, setProcessedTextChunks] = useState<TextChunk[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);

  const rngRef = useRef<RNG>(myraConfig.rngType === 'subqg' ? new SubQGRNG(myraConfig.subqgSeed) : new QuantumRNG());
  const rngRefCaelum = useRef<RNG>(myraConfig.caelumRngType === 'subqg' ? new SubQGRNG(myraConfig.caelumSubqgSeed) : new QuantumRNG());

  const t = useCallback((key: string, substitutions?: Record<string, string>): string => {
    const lang = myraConfig.language;
    const langSet = translations[lang] || translations.en; 
    let translation = getNestedTranslation(langSet, key) || key; 
    if (substitutions) {
      Object.entries(substitutions).forEach(([subKey, subValue]) => {
        translation = translation.replace(new RegExp(`{{${subKey}}}`, 'g'), subValue);
      });
    }
    return translation;
  }, [myraConfig.language]);

  const myraFitnessManagerRef = useRef<AdaptiveFitnessManager | null>(null);
  const caelumFitnessManagerRef = useRef<AdaptiveFitnessManager | null>(null);

  const getMyraSystemStateSnapshot = useCallback(() => ({
    nodes: nodeStates,
    emotionState: emotionState,
    subQgGlobalMetrics: subQgGlobalMetrics,
    processedTextChunksCount: processedTextChunks.length,
  }), [nodeStates, emotionState, subQgGlobalMetrics, processedTextChunks.length]);

  const getCaelumSystemStateSnapshot = useCallback(() => ({
    nodes: nodeStatesCaelum,
    emotionState: emotionStateCaelum,
    subQgGlobalMetrics: subQgGlobalMetricsCaelum,
    processedTextChunksCount: processedTextChunks.length, 
  }), [nodeStatesCaelum, emotionStateCaelum, subQgGlobalMetricsCaelum, processedTextChunks.length]);

  useEffect(() => {
    myraFitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, getMyraSystemStateSnapshot);
    caelumFitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, getCaelumSystemStateSnapshot);
  }, [myraConfig, getMyraSystemStateSnapshot, getCaelumSystemStateSnapshot]);
  
  const updateMyraConfig = useCallback((newConfigPartial: Partial<MyraConfig>) => {
    setMyraConfig(prevConfig => {
      let updatedConfig = { ...prevConfig, ...newConfigPartial };

      if (newConfigPartial.myraAIProviderConfig) {
        updatedConfig.myraAIProviderConfig = { ...prevConfig.myraAIProviderConfig, ...newConfigPartial.myraAIProviderConfig };
      }
      if (newConfigPartial.caelumAIProviderConfig) {
        updatedConfig.caelumAIProviderConfig = { ...prevConfig.caelumAIProviderConfig, ...newConfigPartial.caelumAIProviderConfig };
      }
      if (newConfigPartial.adaptiveFitnessConfig) {
        updatedConfig.adaptiveFitnessConfig = deepMergeObjects(
          JSON.parse(JSON.stringify(prevConfig.adaptiveFitnessConfig)), // Deep copy to avoid modifying original
          newConfigPartial.adaptiveFitnessConfig
        );
      }
      
      if (newConfigPartial.language && newConfigPartial.language !== prevConfig.language) {
        updatedConfig = populateTranslatedFields(updatedConfig, newConfigPartial.language);
      }
      
      const personaKeyFields: (keyof MyraConfig)[] = [
        'myraNameKey', 'myraRoleDescriptionKey', 'myraEthicsPrinciplesKey', 'myraResponseInstructionKey', 'userNameKey',
        'caelumNameKey', 'caelumRoleDescriptionKey', 'caelumEthicsPrinciplesKey', 'caelumResponseInstructionKey'
      ];
      let keyFieldChanged = false;
      for (const pk of personaKeyFields) {
        if (newConfigPartial[pk] && newConfigPartial[pk] !== prevConfig[pk]) {
            keyFieldChanged = true;
            break;
        }
      }
      if (keyFieldChanged) {
          updatedConfig = populateTranslatedFields(updatedConfig, updatedConfig.language);
      }

      localStorage.setItem('myraConfig', JSON.stringify(updatedConfig));

      if (newConfigPartial.subqgSize !== undefined && newConfigPartial.subqgSize !== prevConfig.subqgSize) {
        setSubQgMatrix(Array(updatedConfig.subqgSize).fill(0).map(() => Array(updatedConfig.subqgSize).fill(updatedConfig.subqgBaseEnergy)));
        setSubQgPhaseMatrix(Array(updatedConfig.subqgSize).fill(0).map(() => Array(updatedConfig.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)));
      }
      if (newConfigPartial.caelumSubqgSize !== undefined && newConfigPartial.caelumSubqgSize !== prevConfig.caelumSubqgSize) {
        setSubQgMatrixCaelum(Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Array(updatedConfig.caelumSubqgSize).fill(updatedConfig.caelumSubqgBaseEnergy)));
        setSubQgPhaseMatrixCaelum(Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)));
      }
      
      if (newConfigPartial.rngType !== undefined || newConfigPartial.subqgSeed !== undefined) {
        rngRef.current = updatedConfig.rngType === 'subqg' ? new SubQGRNG(updatedConfig.subqgSeed) : new QuantumRNG();
      }
      if (newConfigPartial.caelumRngType !== undefined || newConfigPartial.caelumSubqgSeed !== undefined) {
        rngRefCaelum.current = updatedConfig.caelumRngType === 'subqg' ? new SubQGRNG(updatedConfig.caelumSubqgSeed) : new QuantumRNG();
      }

      if (myraFitnessManagerRef.current) myraFitnessManagerRef.current.updateConfig(updatedConfig);
      if (caelumFitnessManagerRef.current) caelumFitnessManagerRef.current.updateConfig(updatedConfig);

      return updatedConfig;
    });
  }, [setMyraConfig]);

  const getBaseSystemInstruction = useCallback((
      currentEmotionState: EmotionState,
      currentNodeStates: Record<string, NodeState>,
      currentSubQgMetrics: SubQgGlobalMetrics,
      currentFitness: AdaptiveFitnessState,
      currentStress: number,
      tFunc: typeof t,
      agentNameForInstruction: string,
      isCaelum: boolean = false
    ): string => {
    let instruction = tFunc('aiService.currentInternalContextLabel', { speakerName: agentNameForInstruction }) + "\n";
    instruction += `Emotion State (PAD): P:${currentEmotionState.pleasure.toFixed(2)}, A:${currentEmotionState.arousal.toFixed(2)}, D:${currentEmotionState.dominance.toFixed(2)}\n`;
    instruction += `Dominant Affects: Anger:${currentEmotionState.anger.toFixed(2)}, Fear:${currentEmotionState.fear.toFixed(2)}, Greed:${currentEmotionState.greed.toFixed(2)}\n`;
    instruction += `Stress Level: ${currentStress.toFixed(2)}\n`;
    
    const mainNodeIDs = isCaelum 
      ? ['LimbusAffektus_Caelum', 'Creativus_Caelum', 'CortexCriticus_Caelum', 'MetaCognitio_Caelum']
      : ['LimbusAffektus_Myra', 'Creativus_Myra', 'CortexCriticus_Myra', 'MetaCognitio_Myra'];
    
    mainNodeIDs.forEach(nodeId => {
        const node = currentNodeStates[nodeId];
        if (node) { 
            instruction += `${node.label}: Act:${node.activation.toFixed(2)}, Res:${node.resonatorScore.toFixed(2)}\n`;
        }
    });

    instruction += `SubQG State: AvgEnergy:${currentSubQgMetrics.avgEnergy.toFixed(4)}, Coherence:${currentSubQgMetrics.phaseCoherence.toFixed(3)}\n`;
    instruction += `Adaptive Fitness: Overall:${currentFitness.overallScore.toFixed(3)} (Know:${currentFitness.dimensions.knowledgeExpansion.toFixed(2)}, Coh:${currentFitness.dimensions.internalCoherence.toFixed(2)}, Crea:${currentFitness.dimensions.expressiveCreativity.toFixed(2)}, Foc:${currentFitness.dimensions.goalFocus.toFixed(2)})\n`;
    return instruction;
  }, []);

  const getMyraBaseSystemInstruction = useCallback(() => {
    return getBaseSystemInstruction(emotionState, nodeStates, subQgGlobalMetrics, adaptiveFitness, myraStressLevel, t, myraConfig.myraName, false);
  }, [emotionState, nodeStates, subQgGlobalMetrics, adaptiveFitness, myraStressLevel, t, myraConfig.myraName, getBaseSystemInstruction]);

  const getCaelumBaseSystemInstruction = useCallback(() => {
    return getBaseSystemInstruction(emotionStateCaelum, nodeStatesCaelum, subQgGlobalMetricsCaelum, adaptiveFitnessCaelum, caelumStressLevel, t, myraConfig.caelumName, true);
  }, [emotionStateCaelum, nodeStatesCaelum, subQgGlobalMetricsCaelum, adaptiveFitnessCaelum, caelumStressLevel, t, myraConfig.caelumName, getBaseSystemInstruction]);

  const retrieveRelevantChunks = useCallback(async (query: string, maxChunks: number): Promise<TextChunk[]> => {
    if (!query.trim() || maxChunks <= 0) return [];
    try {
      const allChunks = processedTextChunks; 
      if (allChunks.length === 0) return [];

      const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      if (queryWords.length === 0) return [];
      
      const scoredChunks = allChunks.map(chunk => {
        let score = 0;
        const chunkTextLower = chunk.text.toLowerCase();
        queryWords.forEach(word => {
          if (chunkTextLower.includes(word)) {
            score++;
          }
        });
        return { ...chunk, score };
      }).filter(chunk => chunk.score > 0);

      scoredChunks.sort((a, b) => b.score - a.score);
      return scoredChunks.slice(0, maxChunks);

    } catch (error) {
      console.error("Error retrieving relevant chunks:", error);
      return [];
    }
  }, [processedTextChunks]);

  const simulateSubQgStep = useCallback((
    currentMatrix: number[][],
    currentPhaseMatrix: number[][],
    config: { size: number, baseEnergy: number, coupling: number, noiseStd: number, phaseEnergyFactor: number, phaseDiffusion: number },
    rng: RNG
  ) => {
    const { size, baseEnergy, coupling, noiseStd, phaseEnergyFactor, phaseDiffusion } = config;
    const newMatrix = currentMatrix.map(row => [...row]);
    const newPhaseMatrix = currentPhaseMatrix.map(row => [...row]);

    let totalEnergy = 0;
    let totalPhaseVectorX = 0;
    let totalPhaseVectorY = 0;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let energySum = 0;
        let phaseSumX = 0;
        let phaseSumY = 0;
        let neighborCount = 0;

        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            const ni = (i + di + size) % size;
            const nj = (j + dj + size) % size;
            energySum += currentMatrix[ni][nj];
            phaseSumX += Math.cos(currentPhaseMatrix[ni][nj]);
            phaseSumY += Math.sin(currentPhaseMatrix[ni][nj]);
            neighborCount++;
          }
        }
        
        const avgNeighborEnergy = energySum / neighborCount;
        const energyChange = (avgNeighborEnergy - currentMatrix[i][j]) * coupling;
        newMatrix[i][j] += energyChange + (rng.next() - 0.5) * noiseStd;
        newMatrix[i][j] = Math.max(0, newMatrix[i][j] + baseEnergy * 0.05 * (rng.next() - 0.5));

        const avgNeighborPhase = Math.atan2(phaseSumY / neighborCount, phaseSumX / neighborCount);
        let phaseChange = (avgNeighborPhase - currentPhaseMatrix[i][j]) * phaseDiffusion;
        phaseChange = ((phaseChange + Math.PI) % (2 * Math.PI)) - Math.PI;

        newPhaseMatrix[i][j] += phaseChange;
        newPhaseMatrix[i][j] += energyChange * phaseEnergyFactor * (rng.next() - 0.5); 
        newPhaseMatrix[i][j] = (newPhaseMatrix[i][j] + 2 * Math.PI) % (2 * Math.PI); 

        totalEnergy += newMatrix[i][j];
        totalPhaseVectorX += Math.cos(newPhaseMatrix[i][j]);
        totalPhaseVectorY += Math.sin(newPhaseMatrix[i][j]);
      }
    }

    const avgEnergy = totalEnergy / (size * size);
    const stdEnergy = Math.sqrt(newMatrix.flat().reduce((sum, val) => sum + Math.pow(val - avgEnergy, 2), 0) / (size * size));
    const phaseCoherence = Math.sqrt(Math.pow(totalPhaseVectorX / (size * size), 2) + Math.pow(totalPhaseVectorY / (size * size), 2));
    
    return { newMatrix, newPhaseMatrix, metrics: { avgEnergy, stdEnergy, phaseCoherence } };
  }, []);

  const peakTrackingStateRefMyra = useRef({
    peakEnergy: -1, peakCoherence: -1, stepsAtPeak: 0, trackingActive: false
  });
  const peakTrackingStateRefCaelum = useRef({
    peakEnergy: -1, peakCoherence: -1, stepsAtPeak: 0, trackingActive: false
  });

  const detectAndProcessSubQgJump = useCallback((
    metrics: SubQgGlobalMetrics,
    config: {
      minEnergyAtPeak: number, minCoherenceAtPeak: number,
      coherenceDropFactor: number, energyDropFactorFromPeak: number,
      maxStepsToTrackPeak: number, activeDuration: number,
      qnsModifierStrength: number
    },
    peakTrackingStateRef: React.MutableRefObject<{ peakEnergy: number, peakCoherence: number, stepsAtPeak: number, trackingActive: boolean }>,
    setJumpInfo: (info: SubQgJumpInfo | null) => void,
    setActiveJumpModifier: (mod: number) => void,
    setJumpModifierStepsRemaining: (steps: number) => void,
    currentJumpInfo: SubQgJumpInfo | null 
  ) => {
    let jumpDetected = false;
    let jumpType = "unknown";
    let jumpModifier = 0;
    let jumpInfoUpdate: SubQgJumpInfo | null = null;

    if (peakTrackingStateRef.current.trackingActive) {
      peakTrackingStateRef.current.stepsAtPeak++;
      const energyDrop = peakTrackingStateRef.current.peakEnergy - metrics.avgEnergy;
      const coherenceDrop = peakTrackingStateRef.current.peakCoherence - metrics.phaseCoherence;

      if (energyDrop > config.energyDropFactorFromPeak * peakTrackingStateRef.current.peakEnergy && energyDrop > 0.001) {
        jumpDetected = true;
        jumpType = `EnergyDrop (from ${peakTrackingStateRef.current.peakEnergy.toFixed(4)} to ${metrics.avgEnergy.toFixed(4)})`;
        jumpModifier = config.qnsModifierStrength * (energyDrop / (config.energyDropFactorFromPeak * peakTrackingStateRef.current.peakEnergy + 1e-6));
        jumpInfoUpdate = { type: jumpType, peakEnergyBeforeDecay: peakTrackingStateRef.current.peakEnergy, currentEnergyAtDecayDetection: metrics.avgEnergy, stepsFromPeakToDecay: peakTrackingStateRef.current.stepsAtPeak, timestamp: Date.now() };
      } else if (coherenceDrop > config.coherenceDropFactor && coherenceDrop > 0.01) {
        jumpDetected = true;
        jumpType = `CoherenceDrop (from ${peakTrackingStateRef.current.peakCoherence.toFixed(3)} to ${metrics.phaseCoherence.toFixed(3)})`;
        jumpModifier = -config.qnsModifierStrength * (coherenceDrop / (config.coherenceDropFactor + 1e-6)); 
        jumpInfoUpdate = { type: jumpType, peakCoherenceBeforeDecay: peakTrackingStateRef.current.peakCoherence, currentCoherenceAtDecayDetection: metrics.phaseCoherence, stepsFromPeakToDecay: peakTrackingStateRef.current.stepsAtPeak, timestamp: Date.now() };
      }

      if (peakTrackingStateRef.current.stepsAtPeak >= config.maxStepsToTrackPeak && !jumpDetected) {
        peakTrackingStateRef.current.trackingActive = false;
        jumpInfoUpdate = { type: "PeakSustainedOrDissipated", peakEnergyBeforeDecay: peakTrackingStateRef.current.peakEnergy, peakCoherenceBeforeDecay: peakTrackingStateRef.current.peakCoherence, stepsFromPeakToDecay: peakTrackingStateRef.current.stepsAtPeak, timestamp: Date.now() };
      }
    } else {
      if (metrics.avgEnergy > config.minEnergyAtPeak && metrics.phaseCoherence > config.minCoherenceAtPeak) {
        peakTrackingStateRef.current = {
          peakEnergy: metrics.avgEnergy, peakCoherence: metrics.phaseCoherence, stepsAtPeak: 0, trackingActive: true
        };
        jumpInfoUpdate = { type: "PeakCandidateDetected", peakEnergyBeforeDecay: metrics.avgEnergy, peakCoherenceBeforeDecay: metrics.phaseCoherence, timestamp: Date.now() };
      }
    }

    if (jumpDetected) {
      setActiveJumpModifier(jumpModifier);
      setJumpModifierStepsRemaining(config.activeDuration);
      peakTrackingStateRef.current.trackingActive = false; 
    }
    
    if (jumpInfoUpdate) {
        setJumpInfo(jumpInfoUpdate);
    }
    return jumpDetected;
  }, []); 

  const simulateNetworkStepMyra = useCallback(() => {
    const currentSimStep = simulationStep + 1;
    setSimulationStep(currentSimStep);

    const { newMatrix, newPhaseMatrix, metrics } = simulateSubQgStep(
      subQgMatrix, subQgPhaseMatrix,
      {
        size: myraConfig.subqgSize, baseEnergy: myraConfig.subqgBaseEnergy, coupling: myraConfig.subqgCoupling,
        noiseStd: myraConfig.subqgInitialEnergyNoiseStd, phaseEnergyFactor: myraConfig.subqgPhaseEnergyCouplingFactor,
        phaseDiffusion: myraConfig.subqgPhaseDiffusionFactor
      },
      rngRef.current
    );
    setSubQgMatrix(newMatrix);
    setSubQgPhaseMatrix(newPhaseMatrix);
    setSubQgGlobalMetrics(metrics);

    detectAndProcessSubQgJump(
      metrics,
      {
        minEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, minCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak,
        coherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, energyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak,
        maxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, activeDuration: myraConfig.subqgJumpActiveDuration,
        qnsModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength
      },
      peakTrackingStateRefMyra, setSubQgJumpInfo, setActiveSubQgJumpModifier, setSubQgJumpModifierActiveStepsRemaining, subQgJumpInfo
    );
    
    const newCalculatedEmotionStateMyra: EmotionState = {
        pleasure: emotionState.pleasure * myraConfig.emotionDecay + (rngRef.current.next() - 0.5) * 0.05,
        arousal: emotionState.arousal * myraConfig.emotionDecay + (rngRef.current.next() - 0.5) * 0.1,
        dominance: emotionState.dominance * myraConfig.emotionDecay + (rngRef.current.next() - 0.5) * 0.03,
        anger: Math.max(0, emotionState.anger * myraConfig.emotionDecay + (rngRef.current.next() - 0.45) * 0.02),
        disgust: Math.max(0, emotionState.disgust * myraConfig.emotionDecay + (rngRef.current.next() - 0.48) * 0.01),
        fear: Math.max(0, emotionState.fear * myraConfig.emotionDecay + (rngRef.current.next() - 0.4) * 0.03),
        greed: Math.max(0, emotionState.greed * myraConfig.emotionDecay + (rngRef.current.next() - 0.49) * 0.005),
    };
    setEmotionState(newCalculatedEmotionStateMyra);

    const dominantAffMyra = getDominantAffect(newCalculatedEmotionStateMyra, t);
    setPadHistoryMyra(prevHistory => {
        const newRecord: PADRecord = {
            pleasure: newCalculatedEmotionStateMyra.pleasure, arousal: newCalculatedEmotionStateMyra.arousal,
            dominance: newCalculatedEmotionStateMyra.dominance, timestamp: Date.now(), dominantAffect: dominantAffMyra
        };
        const updatedHistory = [...prevHistory, newRecord];
        if (myraConfig.maxPadHistorySize > 0 && updatedHistory.length > myraConfig.maxPadHistorySize) {
            return updatedHistory.slice(updatedHistory.length - myraConfig.maxPadHistorySize);
        }
        return updatedHistory;
    });

    setNodeStates(prev => {
      const newNodes = { ...prev };
      let totalJumpCountForMeta = newNodes['MetaCognitio_Myra']?.specificState?.lastTotalJumps || 0;
      if (subQgJumpInfo && subQgJumpInfo.timestamp > (newNodes['MetaCognitio_Myra']?.specificState?.lastJumpTimestamp || 0)) {
          totalJumpCountForMeta++;
      }

      for (const id in newNodes) {
        const node = newNodes[id];
        let activationChange = (rngRef.current.next() - 0.5) * 0.1; 
        
        if (subQgJumpModifierActiveStepsRemaining > 0) {
          if (node.type === 'creativus' || node.type === 'limbus' || node.type === 'metacognitio') {
            activationChange += activeSubQgJumpModifier * 0.2 * (rngRef.current.next()); 
          } else if (node.type === 'criticus') {
            activationChange -= activeSubQgJumpModifier * 0.1 * (rngRef.current.next());
          }
        }
        if (node.type === 'limbus') activationChange += (metrics.avgEnergy - myraConfig.subqgBaseEnergy) * 5;
        if (node.type === 'creativus') activationChange += metrics.phaseCoherence * 0.05;

        node.activation = Math.max(0, Math.min(1, node.activation * myraConfig.nodeActivationDecay + activationChange));
        node.resonatorScore = Math.max(0, Math.min(1, node.resonatorScore * 0.9 + node.activation * 0.1 + (rngRef.current.next() - 0.5) * 0.02));
        node.focusScore = Math.max(0, Math.min(1, node.focusScore * 0.92 + (node.type === 'criticus' ? node.activation * 0.1 : 0) + (rngRef.current.next() - 0.5) * 0.01));
        node.explorationScore = Math.max(0, Math.min(1, node.explorationScore * 0.93 + (node.type === 'creativus' ? node.activation * 0.1 : 0) + (rngRef.current.next() - 0.5) * 0.015));

        if (node.id === 'MetaCognitio_Myra') {
             node.specificState = { ...node.specificState, lastTotalJumps: totalJumpCountForMeta, lastJumpTimestamp: subQgJumpInfo?.timestamp || node.specificState?.lastJumpTimestamp };
        }
      }
      return newNodes;
    });
    
    setMyraStressLevel(prevStress => {
        let newStress = prevStress * 0.9; 
        newStress += Math.abs(newCalculatedEmotionStateMyra.arousal) * 0.05; 
        newStress += (1 - subQgGlobalMetrics.phaseCoherence) * 0.03; 
        newStress += (subQgGlobalMetrics.stdEnergy / (subQgGlobalMetrics.avgEnergy + 1e-6)) * 0.02; 
        const currentConflictNode = nodeStates['ConflictMonitor_Myra']; 
        if (currentConflictNode?.specificState?.conflictLevel > 0.5) {
            newStress += currentConflictNode.specificState.conflictLevel * 0.1;
        }
        return Math.max(0, Math.min(1, newStress));
    });

    if (subQgJumpModifierActiveStepsRemaining > 0) {
      setSubQgJumpModifierActiveStepsRemaining(prev => prev - 1);
      if (subQgJumpModifierActiveStepsRemaining -1 === 0) {
          setActiveSubQgJumpModifier(0); 
      }
    }
    
    if (currentSimStep % myraConfig.adaptiveFitnessUpdateInterval === 0 && myraFitnessManagerRef.current) {
      const newFitness = myraFitnessManagerRef.current.calculateMetricsAndFitness();
      setAdaptiveFitness(newFitness);
    }
  }, [
      myraConfig, subQgMatrix, subQgPhaseMatrix, simulateSubQgStep, detectAndProcessSubQgJump, 
      activeSubQgJumpModifier, subQgJumpModifierActiveStepsRemaining, subQgJumpInfo,
      nodeStates, simulationStep, t, emotionState
    ]);

  const simulateNetworkStepCaelum = useCallback(() => {
    const currentSimStep = simulationStepCaelum + 1;
    setSimulationStepCaelum(currentSimStep);

    const { newMatrix, newPhaseMatrix, metrics } = simulateSubQgStep(
      subQgMatrixCaelum, subQgPhaseMatrixCaelum,
      {
        size: myraConfig.caelumSubqgSize, baseEnergy: myraConfig.caelumSubqgBaseEnergy, coupling: myraConfig.caelumSubqgCoupling,
        noiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, phaseEnergyFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor,
        phaseDiffusion: myraConfig.caelumSubqgPhaseDiffusionFactor
      },
      rngRefCaelum.current
    );
    setSubQgMatrixCaelum(newMatrix);
    setSubQgPhaseMatrixCaelum(newPhaseMatrix);
    setSubQgGlobalMetricsCaelum(metrics);
    
     detectAndProcessSubQgJump(
      metrics,
      {
        minEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, minCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak,
        coherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, energyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak,
        maxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, activeDuration: myraConfig.caelumSubqgJumpActiveDuration,
        qnsModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength
      },
      peakTrackingStateRefCaelum, setSubQgJumpInfoCaelum, setActiveSubQgJumpModifierCaelum, setSubQgJumpModifierActiveStepsRemainingCaelum, subQgJumpInfoCaelum
    );

    const newCalculatedEmotionStateCaelum: EmotionState = {
        pleasure: emotionStateCaelum.pleasure * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.5) * 0.02,
        arousal: emotionStateCaelum.arousal * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.5) * 0.05,
        dominance: emotionStateCaelum.dominance * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.5) * 0.02,
        anger: Math.max(0, emotionStateCaelum.anger * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.49) * 0.005),
        disgust: Math.max(0, emotionStateCaelum.disgust * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.49) * 0.002),
        fear: Math.max(0, emotionStateCaelum.fear * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.45) * 0.01),
        greed: Math.max(0, emotionStateCaelum.greed * myraConfig.caelumEmotionDecay + (rngRefCaelum.current.next() - 0.495) * 0.001),
    };
    setEmotionStateCaelum(newCalculatedEmotionStateCaelum);

    const dominantAffCaelum = getDominantAffect(newCalculatedEmotionStateCaelum, t);
    setPadHistoryCaelum(prevHistory => {
        const newRecord: PADRecord = {
            pleasure: newCalculatedEmotionStateCaelum.pleasure, arousal: newCalculatedEmotionStateCaelum.arousal,
            dominance: newCalculatedEmotionStateCaelum.dominance, timestamp: Date.now(), dominantAffect: dominantAffCaelum
        };
        const updatedHistory = [...prevHistory, newRecord];
        if (myraConfig.maxPadHistorySize > 0 && updatedHistory.length > myraConfig.maxPadHistorySize) {
            return updatedHistory.slice(updatedHistory.length - myraConfig.maxPadHistorySize);
        }
        return updatedHistory;
    });

    setNodeStatesCaelum(prev => {
      const newNodes = { ...prev };
      let totalJumpCountForMeta = newNodes['MetaCognitio_Caelum']?.specificState?.lastTotalJumps || 0;
      if (subQgJumpInfoCaelum && subQgJumpInfoCaelum.timestamp > (newNodes['MetaCognitio_Caelum']?.specificState?.lastJumpTimestamp || 0)) {
          totalJumpCountForMeta++;
      }

      for (const id in newNodes) {
        const node = newNodes[id];
        let activationChange = (rngRefCaelum.current.next() - 0.5) * 0.05; 
        
        if (subQgJumpModifierActiveStepsRemainingCaelum > 0) {
          if (node.type === 'creativus' || node.type === 'metacognitio') { 
            activationChange += activeSubQgJumpModifierCaelum * 0.25 * (rngRefCaelum.current.next()); 
          } else if (node.type === 'criticus') { 
            activationChange -= activeSubQgJumpModifierCaelum * 0.15 * (rngRefCaelum.current.next());
          }
        }
        if (node.type === 'limbus') activationChange += (metrics.avgEnergy - myraConfig.caelumSubqgBaseEnergy) * 3;
        if (node.type === 'creativus') activationChange += metrics.phaseCoherence * 0.03; 

        node.activation = Math.max(0, Math.min(1, node.activation * myraConfig.caelumNodeActivationDecay + activationChange));
        node.resonatorScore = Math.max(0, Math.min(1, node.resonatorScore * 0.93 + node.activation * 0.07 + (rngRefCaelum.current.next() - 0.5) * 0.01));
        node.focusScore = Math.max(0, Math.min(1, node.focusScore * 0.95 + (node.type === 'criticus' ? node.activation * 0.15 : 0) + (rngRefCaelum.current.next() - 0.5) * 0.005));
        node.explorationScore = Math.max(0, Math.min(1, node.explorationScore * 0.94 + (node.type === 'creativus' ? node.activation * 0.08 : 0) + (rngRefCaelum.current.next() - 0.5) * 0.01));
        
        if (node.id === 'MetaCognitio_Caelum') {
             node.specificState = { ...node.specificState, lastTotalJumps: totalJumpCountForMeta, lastJumpTimestamp: subQgJumpInfoCaelum?.timestamp || node.specificState?.lastJumpTimestamp };
        }
      }
      return newNodes;
    });

    setCaelumStressLevel(prevStress => {
        let newStress = prevStress * 0.95; 
        newStress += Math.abs(newCalculatedEmotionStateCaelum.arousal) * 0.03;
        newStress += (1 - subQgGlobalMetricsCaelum.phaseCoherence) * 0.02;
        newStress += (subQgGlobalMetricsCaelum.stdEnergy / (subQgGlobalMetricsCaelum.avgEnergy + 1e-6)) * 0.01;
        const currentConflictNodeCaelum = nodeStatesCaelum['ConflictMonitor_Caelum']; 
         if (currentConflictNodeCaelum?.specificState?.conflictLevel > 0.3) { 
            newStress += currentConflictNodeCaelum.specificState.conflictLevel * 0.05;
        }
        return Math.max(0, Math.min(1, newStress));
    });

    if (subQgJumpModifierActiveStepsRemainingCaelum > 0) {
      setSubQgJumpModifierActiveStepsRemainingCaelum(prev => prev - 1);
      if (subQgJumpModifierActiveStepsRemainingCaelum -1 === 0) {
          setActiveSubQgJumpModifierCaelum(0);
      }
    }

    if (currentSimStep % myraConfig.caelumAdaptiveFitnessUpdateInterval === 0 && caelumFitnessManagerRef.current) {
      const newFitness = caelumFitnessManagerRef.current.calculateMetricsAndFitness();
      setAdaptiveFitnessCaelum(newFitness);
    }
  }, [
    myraConfig, subQgMatrixCaelum, subQgPhaseMatrixCaelum, simulateSubQgStep, detectAndProcessSubQgJump,
    activeSubQgJumpModifierCaelum, subQgJumpModifierActiveStepsRemainingCaelum, subQgJumpInfoCaelum,
    nodeStatesCaelum, simulationStepCaelum, t, emotionStateCaelum
  ]);

  useEffect(() => {
    const myraIntervalId = setInterval(simulateNetworkStepMyra, 2000);
    return () => clearInterval(myraIntervalId);
  }, [simulateNetworkStepMyra]);

  useEffect(() => {
    const caelumIntervalId = setInterval(simulateNetworkStepCaelum, 2100); 
    return () => clearInterval(caelumIntervalId);
  }, [simulateNetworkStepCaelum]);

  const generateActiveAgentChatResponse = async (prompt: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { 
        id: uuidv4(), 
        role: 'user', 
        content: prompt, 
        timestamp: Date.now(), 
        speakerName: myraConfig.userName 
    };
    const currentChatHistory = [...chatHistory, userMessage];
    setChatHistory(currentChatHistory);

    const isCaelumActive = myraConfig.activeChatAgent === 'caelum';
    const activeAgentConfig = isCaelumActive ? myraConfig.caelumAIProviderConfig : myraConfig.myraAIProviderConfig;
    const activeAgentPersona: ResolvedSpeakerPersonaConfig = {
        name: isCaelumActive ? myraConfig.caelumName : myraConfig.myraName,
        roleDescription: isCaelumActive ? myraConfig.caelumRoleDescription : myraConfig.myraRoleDescription,
        ethicsPrinciples: isCaelumActive ? myraConfig.caelumEthicsPrinciples : myraConfig.myraEthicsPrinciples,
        responseInstruction: isCaelumActive ? myraConfig.caelumResponseInstruction : myraConfig.myraResponseInstruction,
    };
    const activeAgentBaseSystemInstruction = isCaelumActive ? getCaelumBaseSystemInstruction() : getMyraBaseSystemInstruction();
    const activeAgentEmotionState = isCaelumActive ? emotionStateCaelum : emotionState;
    const activeAgentNodeStates = isCaelumActive ? nodeStatesCaelum : nodeStates;
    const activeAgentCreativusNodeId = isCaelumActive ? 'Creativus_Caelum' : 'Creativus_Myra';

    const relevantChunks = await retrieveRelevantChunks(prompt, myraConfig.ragMaxChunksToRetrieve);
    let systemInstruction = activeAgentBaseSystemInstruction;
    if (relevantChunks.length > 0) {
      systemInstruction += `\n\n${t('aiService.relevantInfoLabel')}\n` + relevantChunks.map(c => c.text).join("\n---\n") + `\n${t('aiService.endInfoLabel')}`;
    }
    
    const effectiveTemp = Math.max(0, Math.min(2.0, 
        activeAgentConfig.temperatureBase + 
        (activeAgentEmotionState.arousal * myraConfig.temperatureLimbusInfluence) + 
        ((activeAgentNodeStates[activeAgentCreativusNodeId]?.activation || 0.5) * myraConfig.temperatureCreativusInfluence)
    ));

    const response = await callAiApi(prompt, myraConfig, {...activeAgentConfig, temperatureBase: effectiveTemp} , currentChatHistory.slice(0, -1), systemInstruction, activeAgentPersona, t); // Pass history WITHOUT the current user message
    const assistantMessage: ChatMessage = { 
        id: uuidv4(), 
        role: 'assistant', 
        content: response.text || t('aiService.error.geminiGenerationError', {speakerName: activeAgentPersona.name}), 
        timestamp: Date.now(), 
        speakerName: activeAgentPersona.name,
        retrievedChunks: relevantChunks.map(chunk => ({ source: chunk.source, text: chunk.text }))
    };
    setChatHistory(prev => [...prev, assistantMessage]);
    setIsLoading(false);

    if (isCaelumActive) {
        simulateNetworkStepCaelum();
    } else {
        simulateNetworkStepMyra(); 
    }
  };


  const startDualConversation = async (initialPrompt: string, rounds: number) => {
    if (isDualConversationLoading) return;

    setIsDualConversationLoading(true);
    dualConversationAbortControllerRef.current = new AbortController();
    const { signal } = dualConversationAbortControllerRef.current;

    const userMessage: ChatMessage = {
      id: uuidv4(), role: 'user', content: initialPrompt, timestamp: Date.now(), speakerName: myraConfig.userName
    };
    
    let currentDualHistory: ChatMessage[] = [userMessage];
    setDualConversationHistory(currentDualHistory);
    let lastMessageContent = initialPrompt;

    try {
      for (let i = 0; i < rounds; i++) {
        if (signal.aborted) {
            setDualConversationHistory(prev => [...prev, {id: uuidv4(), role: 'system', content: t('dualAiPanel.conversationCancelled'), timestamp: Date.now()}]);
            break;
        }

        // M.Y.R.A.'s turn
        const myraChunks = await retrieveRelevantChunks(lastMessageContent, myraConfig.ragMaxChunksToRetrieve);
        let myraSystemInstruction = getMyraBaseSystemInstruction();
        if (myraChunks.length > 0) {
          myraSystemInstruction += `\n\n${t('aiService.relevantInfoLabel')}\n` + myraChunks.map(c => c.text).join("\n---\n") + `\n${t('aiService.endInfoLabel')}`;
        }
        const myraPersona: ResolvedSpeakerPersonaConfig = { name: myraConfig.myraName, roleDescription: myraConfig.myraRoleDescription, ethicsPrinciples: myraConfig.myraEthicsPrinciples, responseInstruction: myraConfig.myraResponseInstruction };
        const myraEffectiveTemp = Math.max(0, Math.min(2.0, myraConfig.myraAIProviderConfig.temperatureBase + (emotionState.arousal * myraConfig.temperatureLimbusInfluence) + ((nodeStates['Creativus_Myra']?.activation || 0.5) * myraConfig.temperatureCreativusInfluence)));
        
        const myraResponse = await callAiApi(lastMessageContent, myraConfig, {...myraConfig.myraAIProviderConfig, temperatureBase: myraEffectiveTemp}, currentDualHistory, myraSystemInstruction, myraPersona, t);
        const myraMessage: ChatMessage = { 
            id: uuidv4(), 
            role: 'assistant', 
            content: myraResponse.text || t('aiService.error.geminiGenerationError', {speakerName: myraConfig.myraName}), 
            timestamp: Date.now(), 
            speakerName: myraConfig.myraName,
            retrievedChunks: myraChunks.map(chunk => ({ source: chunk.source, text: chunk.text }))
        };
        currentDualHistory = [...currentDualHistory, myraMessage];
        setDualConversationHistory(currentDualHistory);
        lastMessageContent = myraMessage.content;
        simulateNetworkStepMyra();
        if (signal.aborted) {
             setDualConversationHistory(prev => [...prev, {id: uuidv4(), role: 'system', content: t('dualAiPanel.conversationCancelled'), timestamp: Date.now()}]);
             break;
        }

        // C.A.E.L.U.M.'s turn
        const caelumChunks = await retrieveRelevantChunks(lastMessageContent, myraConfig.ragMaxChunksToRetrieve);
        let caelumSystemInstruction = getCaelumBaseSystemInstruction();
        if (caelumChunks.length > 0) {
          caelumSystemInstruction += `\n\n${t('aiService.relevantInfoLabel')}\n` + caelumChunks.map(c => c.text).join("\n---\n") + `\n${t('aiService.endInfoLabel')}`;
        }
        const caelumPersona: ResolvedSpeakerPersonaConfig = { name: myraConfig.caelumName, roleDescription: myraConfig.caelumRoleDescription, ethicsPrinciples: myraConfig.caelumEthicsPrinciples, responseInstruction: myraConfig.caelumResponseInstruction };
        const caelumEffectiveTemp = Math.max(0, Math.min(2.0, myraConfig.caelumAIProviderConfig.temperatureBase + (emotionStateCaelum.arousal * myraConfig.temperatureLimbusInfluence) + ((nodeStatesCaelum['Creativus_Caelum']?.activation || 0.5) * myraConfig.temperatureCreativusInfluence)));
        
        const caelumResponse = await callAiApi(lastMessageContent, myraConfig, {...myraConfig.caelumAIProviderConfig, temperatureBase: caelumEffectiveTemp}, currentDualHistory, caelumSystemInstruction, caelumPersona, t);
        const caelumMessage: ChatMessage = { 
            id: uuidv4(), 
            role: 'assistant', 
            content: caelumResponse.text || t('aiService.error.geminiGenerationError', {speakerName: myraConfig.caelumName}), 
            timestamp: Date.now(), 
            speakerName: myraConfig.caelumName,
            retrievedChunks: caelumChunks.map(chunk => ({ source: chunk.source, text: chunk.text }))
        };
        currentDualHistory = [...currentDualHistory, caelumMessage];
        setDualConversationHistory(currentDualHistory);
        lastMessageContent = caelumMessage.content;
        simulateNetworkStepCaelum();
      }
    } catch (error) {
      console.error("Error during dual conversation:", error);
      setDualConversationHistory(prev => [...prev, {id: uuidv4(), role: 'system', content: `Error: ${(error as Error).message}`, timestamp: Date.now()}]);
    } finally {
      setIsDualConversationLoading(false);
      dualConversationAbortControllerRef.current = null;
    }
  };

  const injectSubQgStimulus = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => {
    setSubQgMatrix(prevMatrix => {
      const newMatrix = prevMatrix.map(row => [...row]);
      if (newMatrix[x] && newMatrix[x][y] !== undefined) {
        newMatrix[x][y] = Math.max(0, newMatrix[x][y] + energyDelta);
      }
      return newMatrix;
    });
    if (phaseValue !== undefined) {
       setSubQgPhaseMatrix(prevPhaseMatrix => {
         const newPhaseMatrix = prevPhaseMatrix.map(row => [...row]);
         if (newPhaseMatrix[x] && newPhaseMatrix[x][y] !== undefined) {
           newPhaseMatrix[x][y] = (phaseValue + 2 * Math.PI) % (2 * Math.PI);
         }
         return newPhaseMatrix;
       });
    }
  }, []);

  const injectSubQgStimulusCaelum = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => {
    setSubQgMatrixCaelum(prevMatrix => {
      const newMatrix = prevMatrix.map(row => [...row]);
      if (newMatrix[x] && newMatrix[x][y] !== undefined) {
        newMatrix[x][y] = Math.max(0, newMatrix[x][y] + energyDelta);
      }
      return newMatrix;
    });
     if (phaseValue !== undefined) {
       setSubQgPhaseMatrixCaelum(prevPhaseMatrix => {
         const newPhaseMatrix = prevPhaseMatrix.map(row => [...row]);
         if (newPhaseMatrix[x] && newPhaseMatrix[x][y] !== undefined) {
           newPhaseMatrix[x][y] = (phaseValue + 2 * Math.PI) % (2 * Math.PI);
         }
         return newPhaseMatrix;
       });
    }
  }, []);
  
  const loadInitialKnowledgeFromDB = useCallback(async () => {
    setIsLoadingKnowledge(true);
    try {
      const chunks = await getAllChunksFromDB();
      setProcessedTextChunks(chunks);
    } catch (error) {
      console.error("Failed to load knowledge from DB:", error);
    }
    setIsLoadingKnowledge(false);
  }, []);

 const loadDocumentationKnowledge = useCallback(async () => {
    setIsLoadingKnowledge(true);
    const currentLang = myraConfig.language || 'de';
    const fallbackLang = 'en';

    for (const basePath of DOCUMENTATION_BASE_PATHS) {
        let filePath = `${basePath}_${currentLang}.md`;
        let success = false;
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const content = await response.text();
                const sourceName = `${basePath.split('/').pop()}_${currentLang}.md`;
                
                await clearChunksBySourceFromDB(sourceName);

                const newChunks: TextChunk[] = [];
                for (let i = 0; i < content.length; i += myraConfig.ragChunkSize - myraConfig.ragChunkOverlap) {
                    const chunkText = content.substring(i, i + myraConfig.ragChunkSize);
                    newChunks.push({
                        id: uuidv4(),
                        source: sourceName,
                        index: newChunks.length,
                        text: chunkText
                    });
                }
                if (newChunks.length > 0) {
                   await addChunksToDB(newChunks);
                }
                success = true;
            }
        } catch (e) { console.error(`Error fetching or processing ${filePath}`, e); }

        if (!success && currentLang !== fallbackLang) {
            filePath = `${basePath}_${fallbackLang}.md`;
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const content = await response.text();
                    const sourceName = `${basePath.split('/').pop()}_${fallbackLang}.md`;
                    await clearChunksBySourceFromDB(sourceName);
                    const newChunks: TextChunk[] = [];
                    for (let i = 0; i < content.length; i += myraConfig.ragChunkSize - myraConfig.ragChunkOverlap) {
                        const chunkText = content.substring(i, i + myraConfig.ragChunkSize);
                        newChunks.push({ id: uuidv4(), source: sourceName, index: newChunks.length, text: chunkText });
                    }
                     if (newChunks.length > 0) {
                       await addChunksToDB(newChunks);
                    }
                }
            } catch (e) { console.error(`Error fetching or processing fallback ${filePath}`, e); }
        }
    }
    await loadInitialKnowledgeFromDB(); // Reload all chunks into state
    setIsLoadingKnowledge(false);
  }, [myraConfig.language, myraConfig.ragChunkSize, myraConfig.ragChunkOverlap, loadInitialKnowledgeFromDB]);

  useEffect(() => {
    loadDocumentationKnowledge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to load documentation initially. Relies on loadInitialKnowledgeFromDB for state update.


  const loadAndProcessFile = async (file: File) => {
    setIsLoadingKnowledge(true);
    let text = '';
    const fileName = file.name.toLowerCase();

    try {
      const arrayBuffer = await file.arrayBuffer(); // Keep for .txt, .md, .docx

      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        text = new TextDecoder().decode(arrayBuffer);
      } else if (fileName.endsWith('.xlsx')) {
        let fullText = '';
        // Use 'file' object directly for read-excel-file
        const sheets = await readXlsxFile(file, { getSheets: true });
        for (const sheet of sheets) {
            const rows = await readXlsxFile(file, { sheet: sheet.name });
            rows.forEach(row => {
                fullText += row.map(cell => (cell !== null && cell !== undefined) ? String(cell) : '').join(' ') + '\n';
            });
        }
        text = fullText;
      } else if (fileName.endsWith('.docx')) {
        // mammoth uses arrayBuffer
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        throw new Error(t('knowledgePanel.errorFileFormat'));
      }

      if (text.trim()) {
        const newChunks: TextChunk[] = [];
        for (let i = 0; i < text.length; i += myraConfig.ragChunkSize - myraConfig.ragChunkOverlap) {
          const chunkText = text.substring(i, i + myraConfig.ragChunkSize);
          newChunks.push({
            id: uuidv4(),
            source: file.name,
            index: newChunks.length,
            text: chunkText
          });
        }
        await clearChunksBySourceFromDB(file.name);
        await addChunksToDB(newChunks);
        await loadInitialKnowledgeFromDB();
      }
    } catch (error) {
      console.error(t('knowledgePanel.errorProcessingFile', { message: (error as Error).message }));
      // Optionally, display this error to the user via a toast or message area
    }
    setIsLoadingKnowledge(false);
  };

  const clearAllKnowledge = async () => {
    setIsLoadingKnowledge(true);
    try {
      await clearAllChunksFromDB();
      setProcessedTextChunks([]);
    } catch (error) {
       console.error(t('knowledgePanel.errorClearingDb', { message: (error as Error).message }));
    }
    setIsLoadingKnowledge(false);
  };

  return {
    myraConfig,
    updateMyraConfig,
    chatHistory,
    isLoading,
    generateActiveAgentChatResponse,
    simulationStep,
    subQgMatrix,
    subQgPhaseMatrix,
    subQgGlobalMetrics,
    emotionState,
    nodeStates,
    adaptiveFitness,
    injectSubQgStimulus,
    activeSubQgJumpModifier,
    subQgJumpModifierActiveStepsRemaining,
    subQgJumpInfo,
    myraStressLevel,
    padHistoryMyra,

    simulationStepCaelum,
    subQgMatrixCaelum,
    subQgPhaseMatrixCaelum,
    subQgGlobalMetricsCaelum,
    emotionStateCaelum,
    nodeStatesCaelum,
    adaptiveFitnessCaelum,
    injectSubQgStimulusCaelum,
    activeSubQgJumpModifierCaelum,
    subQgJumpModifierActiveStepsRemainingCaelum,
    subQgJumpInfoCaelum,
    caelumStressLevel,
    padHistoryCaelum,
    
    dualConversationHistory,
    isDualConversationLoading,
    startDualConversation,

    processedTextChunks,
    isLoadingKnowledge,
    loadAndProcessFile,
    clearAllKnowledge,
    t,
    language: myraConfig.language,
  };
};