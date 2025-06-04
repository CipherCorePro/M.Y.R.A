
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MyraConfig, ChatMessage, EmotionState, NodeState,
  AdaptiveFitnessState, SubQgGlobalMetrics, SubQgJumpInfo,
  GeminiGenerateContentResponse, TextChunk, ResolvedSpeakerPersonaConfig, AIProviderConfig, Language, Theme, Translations
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
import { addChunksToDB, getAllChunksFromDB, clearAllChunksFromDB } from '../utils/db';
import { AdaptiveFitnessManager } from '../utils/adaptiveFitnessManager';

// Import translations using the '@/' alias (points to project root)
import deTranslations from '@/i18n/de.json';
import enTranslations from '@/i18n/en.json';

const translations: Translations = {
  de: deTranslations,
  en: enTranslations,
};

// Helper function for deep merge, ensures target properties are updated from source.
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
  const config = { ...configInput }; // Work on a copy

  const tFuncForKey = (keyFromConfig: string): string => {
    const M_CONFIG_EFFECTIVE_TRANSLATIONS = translations[lang] || translations.en;
    // If keyFromConfig is empty or not a valid key path, it will fall back to keyFromConfig or itself.
    return getNestedTranslation(M_CONFIG_EFFECTIVE_TRANSLATIONS, keyFromConfig) || keyFromConfig;
  };

  // For each persona field, if it's not already populated (e.g., by user edit from localStorage),
  // then translate it from its corresponding '...Key' field.
  if (!config.myraName && config.myraNameKey) config.myraName = tFuncForKey(config.myraNameKey);
  if (!config.userName && config.userNameKey) config.userName = tFuncForKey(config.userNameKey);
  if (!config.myraRoleDescription && config.myraRoleDescriptionKey) config.myraRoleDescription = tFuncForKey(config.myraRoleDescriptionKey);
  if (!config.myraEthicsPrinciples && config.myraEthicsPrinciplesKey) config.myraEthicsPrinciples = tFuncForKey(config.myraEthicsPrinciplesKey);
  if (!config.myraResponseInstruction && config.myraResponseInstructionKey) config.myraResponseInstruction = tFuncForKey(config.myraResponseInstructionKey);
  
  if (!config.caelumName && config.caelumNameKey) config.caelumName = tFuncForKey(config.caelumNameKey);
  if (!config.caelumRoleDescription && config.caelumRoleDescriptionKey) config.caelumRoleDescription = tFuncForKey(config.caelumRoleDescriptionKey);
  if (!config.caelumEthicsPrinciples && config.caelumEthicsPrinciplesKey) config.caelumEthicsPrinciples = tFuncForKey(config.caelumEthicsPrinciplesKey);
  if (!config.caelumResponseInstruction && config.caelumResponseInstructionKey) config.caelumResponseInstruction = tFuncForKey(config.caelumResponseInstructionKey);
  
  // Ensure key fields themselves have a fallback if they were somehow cleared from a saved config
  // This typically shouldn't happen if INITIAL_CONFIG is well-defined and merging works.
  config.myraNameKey = config.myraNameKey || INITIAL_CONFIG.myraNameKey;
  config.userNameKey = config.userNameKey || INITIAL_CONFIG.userNameKey;
  config.myraRoleDescriptionKey = config.myraRoleDescriptionKey || INITIAL_CONFIG.myraRoleDescriptionKey;
  config.myraEthicsPrinciplesKey = config.myraEthicsPrinciplesKey || INITIAL_CONFIG.myraEthicsPrinciplesKey;
  config.myraResponseInstructionKey = config.myraResponseInstructionKey || INITIAL_CONFIG.myraResponseInstructionKey;
  config.caelumNameKey = config.caelumNameKey || INITIAL_CONFIG.caelumNameKey;
  config.caelumRoleDescriptionKey = config.caelumRoleDescriptionKey || INITIAL_CONFIG.caelumRoleDescriptionKey;
  config.caelumEthicsPrinciplesKey = config.caelumEthicsPrinciplesKey || INITIAL_CONFIG.caelumEthicsPrinciplesKey;
  config.caelumResponseInstructionKey = config.caelumResponseInstructionKey || INITIAL_CONFIG.caelumResponseInstructionKey;

  return config;
};


const initialEffectiveConfig = (() => {
  let baseConfig: MyraConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG)); // Start with a deep clone of defaults
  try {
    const storedLangStr = localStorage.getItem('myraLanguage');
    const initialLang = storedLangStr ? storedLangStr as Language : INITIAL_CONFIG.language;
    baseConfig.language = initialLang;

    const storedThemeStr = localStorage.getItem('myraTheme');
    if (storedThemeStr) baseConfig.theme = storedThemeStr as Theme;
    
    const storedConfigStr = localStorage.getItem('myraConfig');
    if (storedConfigStr) {
      const parsedConfig = JSON.parse(storedConfigStr) as MyraConfig; // Expect full MyraConfig
      // Merge stored config onto baseConfig. This preserves user's direct edits to myraName, etc.
      // and also ensures any new fields from INITIAL_CONFIG are present if the stored one is older.
      deepMergeObjects(baseConfig, parsedConfig);
      baseConfig.language = parsedConfig.language || initialLang; // Prioritize stored language
      baseConfig.theme = parsedConfig.theme || baseConfig.theme;     // Prioritize stored theme
    }
    
    // Ensure seeds are numbers or undefined after merge
    if (typeof baseConfig.subqgSeed === 'string') {
      const parsedSeed = parseInt(baseConfig.subqgSeed, 10);
      baseConfig.subqgSeed = isNaN(parsedSeed) ? undefined : parsedSeed;
    } else if (baseConfig.subqgSeed === null) { // Handle explicit null from storage
      baseConfig.subqgSeed = undefined;
    }
    if (typeof baseConfig.caelumSubqgSeed === 'string') {
      const parsedSeed = parseInt(baseConfig.caelumSubqgSeed, 10);
      baseConfig.caelumSubqgSeed = isNaN(parsedSeed) ? undefined : parsedSeed;
    } else if (baseConfig.caelumSubqgSeed === null) {
      baseConfig.caelumSubqgSeed = undefined;
    }

  } catch (error) {
    console.error("Error loading MyraConfig from localStorage, using initial defaults:", error);
    baseConfig = JSON.parse(JSON.stringify(INITIAL_CONFIG)); // Full reset on error
  }
  // Now, populate any missing translated fields using the keys and current language
  return populateTranslatedFields(baseConfig, baseConfig.language);
})();


// Myra Initializations
const initialMyraRngInstance = initialEffectiveConfig.rngType === 'subqg'
    ? new SubQGRNG(initialEffectiveConfig.subqgSeed)
    : new QuantumRNG();
const initialMyraSubQgMatrix = Array(initialEffectiveConfig.subqgSize).fill(null).map(() =>
    Array(initialEffectiveConfig.subqgSize).fill(initialEffectiveConfig.subqgBaseEnergy)
);
const initialMyraSubQgPhaseMatrix = Array(initialEffectiveConfig.subqgSize).fill(null).map(() =>
    Array(initialEffectiveConfig.subqgSize).fill(0).map(() => initialMyraRngInstance.next() * 2 * Math.PI)
);

// Caelum Initializations
const initialCaelumRngInstance = initialEffectiveConfig.caelumRngType === 'subqg'
    ? new SubQGRNG(initialEffectiveConfig.caelumSubqgSeed)
    : new QuantumRNG();
const initialCaelumSubQgMatrix = Array(initialEffectiveConfig.caelumSubqgSize).fill(null).map(() =>
    Array(initialEffectiveConfig.caelumSubqgSize).fill(initialEffectiveConfig.caelumSubqgBaseEnergy)
);
const initialCaelumSubQgPhaseMatrix = Array(initialEffectiveConfig.caelumSubqgSize).fill(null).map(() =>
    Array(initialEffectiveConfig.caelumSubqgSize).fill(0).map(() => initialCaelumRngInstance.next() * 2 * Math.PI)
);

function calculateSubQgMetricsInitialFunc(energyMatrix: number[][], phaseMatrix: number[][], initialMetrics: SubQgGlobalMetrics): SubQgGlobalMetrics {
    if (!energyMatrix || energyMatrix.length === 0 || energyMatrix[0].length === 0) return initialMetrics;
    const energies = energyMatrix.flat();
    const avgEnergy = energies.reduce((sum, val) => sum + val, 0) / energies.length;
    const stdEnergy = Math.sqrt(energies.reduce((sum, val) => sum + Math.pow(val - avgEnergy, 2), 0) / energies.length);

    const phases = phaseMatrix.flat();
    if (phases.length === 0) return { avgEnergy, stdEnergy, phaseCoherence: 0 };

    const numElements = phases.length;
    if (numElements === 0) return { avgEnergy, stdEnergy, phaseCoherence: 0 };

    let sumCos = 0; let sumSin = 0;
    for (const phase of phases) { sumCos += Math.cos(phase); sumSin += Math.sin(phase); }
    const meanComplexPhaseVectorX = sumCos / numElements;
    const meanComplexPhaseVectorY = sumSin / numElements;
    const phaseCoherence = Math.sqrt(meanComplexPhaseVectorX**2 + meanComplexPhaseVectorY**2);

    return { avgEnergy, stdEnergy, phaseCoherence };
}


export const useMyraState = () => {
  const [myraConfig, _setMyraConfig] = useState<MyraConfig>(initialEffectiveConfig);
  const currentLanguage = myraConfig.language;
  const M_CONFIG_EFFECTIVE_TRANSLATIONS = translations[currentLanguage] || translations.en;


  const t = useCallback((key: string, substitutions?: Record<string, string>): string => {
    let value = getNestedTranslation(M_CONFIG_EFFECTIVE_TRANSLATIONS, key) || key;
     if (substitutions) {
        Object.entries(substitutions).forEach(([subKey, subValue]) => {
            value = value.replace(`{{${subKey}}}`, subValue);
        });
    }
    return value;
  }, [M_CONFIG_EFFECTIVE_TRANSLATIONS]);
  
  const setMyraConfig = (newConfigValues: Partial<MyraConfig> | ((prevState: MyraConfig) => MyraConfig)) => {
    _setMyraConfig(prevConfig => {
        let updatedConfigBase = typeof newConfigValues === 'function' ? newConfigValues(prevConfig) : { ...prevConfig };
        if (typeof newConfigValues !== 'function') {
            deepMergeObjects(updatedConfigBase, newConfigValues); // Apply partial updates
        }
        
        // If language changed, or if persona fields were reset (became empty), repopulate them.
        const finalConfig = populateTranslatedFields(updatedConfigBase, updatedConfigBase.language);
        
        localStorage.setItem('myraConfig', JSON.stringify(finalConfig)); // Store the whole config
        localStorage.setItem('myraLanguage', finalConfig.language);
        localStorage.setItem('myraTheme', finalConfig.theme);
        
        return finalConfig;
    });
  };


  // M.Y.R.A. State
  const rngRef = useRef<RNG>(initialMyraRngInstance);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [emotionState, setEmotionState] = useState<EmotionState>(INITIAL_EMOTION_STATE);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>(
    INITIAL_NODE_STATES.reduce((acc, node) => { acc[node.id] = node; return acc; }, {} as Record<string, NodeState>)
  );
  const [adaptiveFitness, setAdaptiveFitness] = useState<AdaptiveFitnessState>(INITIAL_ADAPTIVE_FITNESS_STATE);
  const [subQgMatrix, setSubQgMatrix] = useState<number[][]>(initialMyraSubQgMatrix);
  const [subQgPhaseMatrix, setSubQgPhaseMatrix] = useState<number[][]>(initialMyraSubQgPhaseMatrix);
  const [subQgGlobalMetrics, setSubQgGlobalMetrics] = useState<SubQgGlobalMetrics>(
    calculateSubQgMetricsInitialFunc(initialMyraSubQgMatrix, initialMyraSubQgPhaseMatrix, INITIAL_SUBQG_GLOBAL_METRICS)
  );
  const [subQgJumpInfo, setSubQgJumpInfo] = useState<SubQgJumpInfo | null>(null);
  const [activeSubQgJumpModifier, setActiveSubQgJumpModifier] = useState<number>(0);
  const [subQgJumpModifierActiveStepsRemaining, setSubQgJumpModifierActiveStepsRemaining] = useState<number>(0);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [trackingPotentialJump, setTrackingPotentialJump] = useState<boolean>(false);
  const [peakEnergyAtCoherence, setPeakEnergyAtCoherence] = useState<number | null>(null);
  const [peakCoherenceValue, setPeakCoherenceValue] = useState<number | null>(null);
  const [stepsSincePeakTracked, setStepsSincePeakTracked] = useState<number>(0);
  const [myraStressLevel, setMyraStressLevel] = useState<number>(0);

  // C.A.E.L.U.M. State
  const rngRefCaelum = useRef<RNG>(initialCaelumRngInstance);
  const [emotionStateCaelum, setEmotionStateCaelum] = useState<EmotionState>(INITIAL_CAELUM_EMOTION_STATE);
  const [nodeStatesCaelum, setNodeStatesCaelum] = useState<Record<string, NodeState>>(
    INITIAL_CAELUM_NODE_STATES.reduce((acc, node) => { acc[node.id] = node; return acc; }, {} as Record<string, NodeState>)
  );
  const [adaptiveFitnessCaelum, setAdaptiveFitnessCaelum] = useState<AdaptiveFitnessState>(INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE);
  const [subQgMatrixCaelum, setSubQgMatrixCaelum] = useState<number[][]>(initialCaelumSubQgMatrix);
  const [subQgPhaseMatrixCaelum, setSubQgPhaseMatrixCaelum] = useState<number[][]>(initialCaelumSubQgPhaseMatrix);
  const [subQgGlobalMetricsCaelum, setSubQgGlobalMetricsCaelum] = useState<SubQgGlobalMetrics>(
     calculateSubQgMetricsInitialFunc(initialCaelumSubQgMatrix, initialCaelumSubQgPhaseMatrix, INITIAL_CAELUM_SUBQG_GLOBAL_METRICS)
  );
  const [subQgJumpInfoCaelum, setSubQgJumpInfoCaelum] = useState<SubQgJumpInfo | null>(null);
  const [activeSubQgJumpModifierCaelum, setActiveSubQgJumpModifierCaelum] = useState<number>(0);
  const [subQgJumpModifierActiveStepsRemainingCaelum, setSubQgJumpModifierActiveStepsRemainingCaelum] = useState<number>(0);
  const [simulationStepCaelum, setSimulationStepCaelum] = useState<number>(0);
  const [trackingPotentialJumpCaelum, setTrackingPotentialJumpCaelum] = useState<boolean>(false);
  const [peakEnergyAtCoherenceCaelum, setPeakEnergyAtCoherenceCaelum] = useState<number | null>(null);
  const [peakCoherenceValueCaelum, setPeakCoherenceValueCaelum] = useState<number | null>(null);
  const [stepsSincePeakTrackedCaelum, setStepsSincePeakTrackedCaelum] = useState<number>(0);
  const [caelumStressLevel, setCaelumStressLevel] = useState<number>(0);

  // Shared State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processedTextChunks, setProcessedTextChunks] = useState<TextChunk[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState<boolean>(false);
  const [dualConversationHistory, setDualConversationHistory] = useState<ChatMessage[]>([]);
  const [isDualConversationLoading, setIsDualConversationLoading] = useState<boolean>(false);
  const dualConversationCancelledRef = useRef<boolean>(false);

  const fitnessManagerRef = useRef<AdaptiveFitnessManager>(
    new AdaptiveFitnessManager(myraConfig, () => ({
      nodes: nodeStates, emotionState: emotionState, subQgGlobalMetrics: subQgGlobalMetrics, processedTextChunksCount: processedTextChunks.length,
    }))
  );
  const fitnessManagerRefCaelum = useRef<AdaptiveFitnessManager>(
    new AdaptiveFitnessManager(myraConfig, () => ({
      nodes: nodeStatesCaelum, emotionState: emotionStateCaelum, subQgGlobalMetrics: subQgGlobalMetricsCaelum, processedTextChunksCount: 0, // Caelum doesn't directly load knowledge for its own fitness calculation in this model
    }))
  );

  useEffect(() => {
    fitnessManagerRef.current.updateConfig(myraConfig);
    fitnessManagerRefCaelum.current.updateConfig(myraConfig);
  }, [myraConfig]);

  useEffect(() => {
    const loadInitialChunks = async () => {
      setIsLoadingKnowledge(true);
      try {
        const chunksFromDB = await getAllChunksFromDB();
        setProcessedTextChunks(chunksFromDB);
        fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig, () => ({
            nodes: nodeStates, emotionState: emotionState, subQgGlobalMetrics: subQgGlobalMetrics, processedTextChunksCount: chunksFromDB.length,
        }));
      } catch (error) { console.error("Error loading initial chunks from DB:", error); }
      finally { setIsLoadingKnowledge(false); }
    };
    loadInitialChunks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rngRef.current = myraConfig.rngType === 'subqg' ? new SubQGRNG(myraConfig.subqgSeed) : new QuantumRNG();
  }, [myraConfig.rngType, myraConfig.subqgSeed]);

  useEffect(() => {
    rngRefCaelum.current = myraConfig.caelumRngType === 'subqg' ? new SubQGRNG(myraConfig.caelumSubqgSeed) : new QuantumRNG();
  }, [myraConfig.caelumRngType, myraConfig.caelumSubqgSeed]);

  const updateMyraConfig = (newConfigPartial: Partial<MyraConfig>) => {
    setMyraConfig(prevConfig => { // This now uses the functional update form correctly
      const configBeingUpdated: MyraConfig = JSON.parse(JSON.stringify(prevConfig));
      deepMergeObjects(configBeingUpdated, newConfigPartial);

      if (newConfigPartial.subqgSize && newConfigPartial.subqgSize !== prevConfig.subqgSize) {
        const newSize = newConfigPartial.subqgSize;
        const currentRng = rngRef.current; // Use current RNG instance
        const newEnergyMatrix = Array(newSize).fill(null).map(() => Array(newSize).fill(configBeingUpdated.subqgBaseEnergy));
        const newPhaseMatrix = Array(newSize).fill(null).map(() => Array(newSize).fill(0).map(() => currentRng.next() * 2 * Math.PI));
        setSubQgMatrix(newEnergyMatrix); setSubQgPhaseMatrix(newPhaseMatrix);
        setSubQgGlobalMetrics(calculateSubQgMetricsInitialFunc(newEnergyMatrix, newPhaseMatrix, INITIAL_SUBQG_GLOBAL_METRICS));
      }
      if (newConfigPartial.caelumSubqgSize && newConfigPartial.caelumSubqgSize !== prevConfig.caelumSubqgSize) {
        const newSize = newConfigPartial.caelumSubqgSize;
        const currentRngCaelum = rngRefCaelum.current; // Use current RNG instance for Caelum
        const newEnergyMatrix = Array(newSize).fill(null).map(() => Array(newSize).fill(configBeingUpdated.caelumSubqgBaseEnergy));
        const newPhaseMatrix = Array(newSize).fill(null).map(() => Array(newSize).fill(0).map(() => currentRngCaelum.next() * 2 * Math.PI));
        setSubQgMatrixCaelum(newEnergyMatrix); setSubQgPhaseMatrixCaelum(newPhaseMatrix);
        setSubQgGlobalMetricsCaelum(calculateSubQgMetricsInitialFunc(newEnergyMatrix, newPhaseMatrix, INITIAL_CAELUM_SUBQG_GLOBAL_METRICS));
      }
      
      // populateTranslatedFields will be called by the _setMyraConfig wrapper (via setMyraConfig)
      return configBeingUpdated; 
    });
  };

  const calculateSubQgMetrics = useCallback((energyMatrix: number[][], phaseMatrix: number[][], initialMetrics: SubQgGlobalMetrics): SubQgGlobalMetrics => {
    return calculateSubQgMetricsInitialFunc(energyMatrix, phaseMatrix, initialMetrics);
  }, []);

  // --- M.Y.R.A. Specific Simulation Functions ---
  const detectSubQgJumpMyra = useCallback((currentMetrics: SubQgGlobalMetrics, config: MyraConfig) => {
    const { subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak } = config;
    let newJumpInfo: SubQgJumpInfo | null = null;
    let _tracking = trackingPotentialJump, _peakE = peakEnergyAtCoherence, _peakC = peakCoherenceValue, _steps = stepsSincePeakTracked;

    if (!_tracking) {
      if (currentMetrics.avgEnergy > subqgJumpMinEnergyAtPeak && currentMetrics.phaseCoherence > subqgJumpMinCoherenceAtPeak) {
        _tracking = true; _peakE = currentMetrics.avgEnergy; _peakC = currentMetrics.phaseCoherence; _steps = 0;
      }
    } else if (_peakC !== null && _peakE !== null) {
      _steps += 1;
      const cohDrop = currentMetrics.phaseCoherence < _peakC * (1 - subqgJumpCoherenceDropFactor);
      const engDrop = currentMetrics.avgEnergy < _peakE * (1 - subqgJumpEnergyDropFactorFromPeak);
      if (cohDrop || engDrop) {
        newJumpInfo = { type: "myra_resonance_decay", peakEnergyBeforeDecay: _peakE, peakCoherenceBeforeDecay: _peakC, currentEnergyAtDecayDetection: currentMetrics.avgEnergy, currentCoherenceAtDecayDetection: currentMetrics.phaseCoherence, reasonForDecayDetection: cohDrop && !engDrop ? "c_drop" : engDrop && !cohDrop ? "e_drop" : "ce_drop", stepsFromPeakToDecay: _steps, timestamp: Date.now() };
        _tracking = false; _peakE = null; _peakC = null; _steps = 0;
      } else if (currentMetrics.avgEnergy >= _peakE && currentMetrics.phaseCoherence >= _peakC && (currentMetrics.avgEnergy > _peakE || currentMetrics.phaseCoherence > _peakC)) {
         if (currentMetrics.phaseCoherence > subqgJumpMinCoherenceAtPeak) { _peakE = currentMetrics.avgEnergy; _peakC = currentMetrics.phaseCoherence; _steps = 0; }
      }
      if (_tracking && _steps >= subqgJumpMaxStepsToTrackPeak) { _tracking = false; _peakE = null; _peakC = null; _steps = 0; }
    }
    setTrackingPotentialJump(_tracking); setPeakEnergyAtCoherence(_peakE); setPeakCoherenceValue(_peakC); setStepsSincePeakTracked(_steps);
    return newJumpInfo;
  }, [trackingPotentialJump, peakEnergyAtCoherence, peakCoherenceValue, stepsSincePeakTracked]);

  const simulateSubQgStepMyra = useCallback(() => {
    const cfg = myraConfig; const size = cfg.subqgSize; const rng = rngRef.current;
    const newE = subQgMatrix.map(r => [...r]); const newP = subQgPhaseMatrix.map(r => [...r]);
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) {
      let nE=0, nPX=0, nPY=0, vN=0;
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy]) => { const ni=(i+dx+size)%size, nj=(j+dy+size)%size; nE+=subQgMatrix[ni][nj]; nPX+=Math.cos(subQgPhaseMatrix[ni][nj]); nPY+=Math.sin(subQgPhaseMatrix[ni][nj]); vN++; });
      const avgNE = vN>0?nE/vN:subQgMatrix[i][j]; const eD=cfg.subqgCoupling*(avgNE-subQgMatrix[i][j]); newE[i][j]=Math.max(0,Math.min(1,subQgMatrix[i][j]+eD));
      const avgNP = vN>0?Math.atan2(nPY/vN,nPX/vN):subQgPhaseMatrix[i][j]; const pDif=cfg.subqgPhaseDiffusionFactor*(avgNP-subQgPhaseMatrix[i][j]); const pEng=eD*cfg.subqgPhaseEnergyCouplingFactor; newP[i][j]=(subQgPhaseMatrix[i][j]+pDif+pEng+2*Math.PI)%(2*Math.PI);
    }
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) newE[i][j]=Math.max(0,Math.min(1,newE[i][j]+(rng.next()-0.5)*cfg.subqgInitialEnergyNoiseStd));
    setSubQgMatrix(newE); setSubQgPhaseMatrix(newP);
    const newGM = calculateSubQgMetrics(newE, newP, INITIAL_SUBQG_GLOBAL_METRICS); setSubQgGlobalMetrics(newGM);
    const jump = detectSubQgJumpMyra(newGM, cfg);
    if (jump) {
      setSubQgJumpInfo(jump); const pE=jump.peakEnergyBeforeDecay||0, pC=jump.peakCoherenceBeforeDecay||0;
      const mod=(Math.tanh(pE*20)*0.6+pC*0.4)*cfg.subqgJumpQnsDirectModifierStrength; setActiveSubQgJumpModifier(mod); setSubQgJumpModifierActiveStepsRemaining(cfg.subqgJumpActiveDuration);
    }
  }, [myraConfig, subQgMatrix, subQgPhaseMatrix, calculateSubQgMetrics, detectSubQgJumpMyra]);

  const updateEmotionStateMyra = useCallback((geminiResponse?: GeminiGenerateContentResponse) => {
    const cfg=myraConfig; const rng=rngRef.current; setEmotionState(prev => { const nS={...prev}; if(geminiResponse&&!geminiResponse.text.toLowerCase().includes("error")){nS.pleasure+=0.02;nS.arousal+=0.03;} for(const k in nS){nS[k as keyof EmotionState]*=cfg.emotionDecay;nS[k as keyof EmotionState]=Math.max(-1,Math.min(1,nS[k as keyof EmotionState]+(rng.next()-0.5)*0.05));} return nS; });
  }, [myraConfig]);

  const updateNodeActivationsMyra = useCallback(() => {
    const cfg=myraConfig; const rng=rngRef.current; setNodeStates(prev => { const nS={...prev}; for(const id in nS){nS[id].activation*=cfg.nodeActivationDecay;nS[id].activation=Math.max(0,Math.min(1,nS[id].activation+(rng.next()-0.45)*0.1)); if(nS[id].type==='limbus'&&nS[id].specificState){(nS[id].specificState as EmotionState)=emotionState;nS[id].activation=(emotionState.arousal+emotionState.pleasure+2)/4;}else if(nS[id].type==='creativus'){nS[id].activation=Math.max(0,Math.min(1,nS[id].activation+(rng.next()-0.4)*0.15));} else if(nS[id].type==='metacognitio'){if(subQgJumpInfo)nS[id].activation+=0.2;if(nS[id].specificState)(nS[id].specificState as any).lastTotalJumps=(subQgJumpInfo?((nS[id].specificState as any).lastTotalJumps||0)+1:((nS[id].specificState as any).lastTotalJumps||0));} nS[id].resonatorScore=rng.next()*0.4+0.3+activeSubQgJumpModifier*0.1; nS[id].focusScore=rng.next()*0.3; nS[id].explorationScore=rng.next()*0.3+activeSubQgJumpModifier*0.05; nS[id].activation=Math.max(0,Math.min(1,nS[id].activation+activeSubQgJumpModifier*0.2));} return nS; });
  }, [myraConfig, emotionState, subQgJumpInfo, activeSubQgJumpModifier]);

  const calculateMyraStress = useCallback(() => {
    const conflictNode = nodeStates['ConflictMonitor_Myra'];
    const conflictLevel = conflictNode?.specificState?.conflictLevel ?? 0;
    const rawStress=Math.abs(emotionState.arousal)*0.4 + Math.max(0,emotionState.fear)*0.3 + Math.max(0,emotionState.anger)*0.15 + conflictLevel*0.15;
    setMyraStressLevel(Math.min(1,Math.max(0,rawStress)));
  }, [emotionState, nodeStates]);

  const simulateNetworkStepMyra = useCallback(() => {
    setSimulationStep(p=>p+1); simulateSubQgStepMyra(); updateEmotionStateMyra(); updateNodeActivationsMyra(); calculateMyraStress();
    if(subQgJumpModifierActiveStepsRemaining>0){setSubQgJumpModifierActiveStepsRemaining(p=>p-1); if(subQgJumpModifierActiveStepsRemaining-1<=0){setActiveSubQgJumpModifier(0);}}
    if((simulationStep+1)%myraConfig.adaptiveFitnessUpdateInterval===0){setAdaptiveFitness(fitnessManagerRef.current.calculateMetricsAndFitness());}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateSubQgStepMyra, updateEmotionStateMyra, updateNodeActivationsMyra, myraConfig.adaptiveFitnessUpdateInterval, subQgJumpModifierActiveStepsRemaining, simulationStep, calculateMyraStress]);

  // --- C.A.E.L.U.M. Specific Simulation Functions ---
  const detectSubQgJumpCaelum = useCallback((currentMetrics: SubQgGlobalMetrics, config: MyraConfig) => {
    const { caelumSubqgJumpMinEnergyAtPeak: minE, caelumSubqgJumpMinCoherenceAtPeak: minC, caelumSubqgJumpCoherenceDropFactor: cDrop, caelumSubqgJumpEnergyDropFactorFromPeak: eDrop, caelumSubqgJumpMaxStepsToTrackPeak: maxSteps } = config;
    let newJumpInfo: SubQgJumpInfo | null = null;
    let _tracking = trackingPotentialJumpCaelum, _peakE = peakEnergyAtCoherenceCaelum, _peakC = peakCoherenceValueCaelum, _steps = stepsSincePeakTrackedCaelum;
    if (!_tracking) {
      if (currentMetrics.avgEnergy > minE && currentMetrics.phaseCoherence > minC) {
        _tracking = true; _peakE = currentMetrics.avgEnergy; _peakC = currentMetrics.phaseCoherence; _steps = 0;
      }
    } else if (_peakC !== null && _peakE !== null) {
      _steps += 1;
      const cohDropVal = currentMetrics.phaseCoherence < _peakC * (1 - cDrop);
      const engDropVal = currentMetrics.avgEnergy < _peakE * (1 - eDrop);
      if (cohDropVal || engDropVal) {
        newJumpInfo = { type: "caelum_analytical_shift", peakEnergyBeforeDecay: _peakE, peakCoherenceBeforeDecay: _peakC, currentEnergyAtDecayDetection: currentMetrics.avgEnergy, currentCoherenceAtDecayDetection: currentMetrics.phaseCoherence, reasonForDecayDetection: cohDropVal && !engDropVal ? "c_drop" : engDropVal && !cohDropVal ? "e_drop" : "ce_drop", stepsFromPeakToDecay: _steps, timestamp: Date.now() };
        _tracking = false; _peakE = null; _peakC = null; _steps = 0;
      } else if (currentMetrics.avgEnergy >= _peakE && currentMetrics.phaseCoherence >= _peakC && (currentMetrics.avgEnergy > _peakE || currentMetrics.phaseCoherence > _peakC)) {
         if (currentMetrics.phaseCoherence > minC) { _peakE = currentMetrics.avgEnergy; _peakC = currentMetrics.phaseCoherence; _steps = 0; }
      }
      if (_tracking && _steps >= maxSteps) { _tracking = false; _peakE = null; _peakC = null; _steps = 0; }
    }
    setTrackingPotentialJumpCaelum(_tracking); setPeakEnergyAtCoherenceCaelum(_peakE); setPeakCoherenceValueCaelum(_peakC); setStepsSincePeakTrackedCaelum(_steps);
    return newJumpInfo;
  }, [trackingPotentialJumpCaelum, peakEnergyAtCoherenceCaelum, peakCoherenceValueCaelum, stepsSincePeakTrackedCaelum]);

  const simulateSubQgStepCaelum = useCallback(() => {
    const cfg = myraConfig; const size = cfg.caelumSubqgSize; const rng = rngRefCaelum.current;
    const newE = subQgMatrixCaelum.map(r => [...r]); const newP = subQgPhaseMatrixCaelum.map(r => [...r]);
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) {
      let nE=0, nPX=0, nPY=0, vN=0;
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy]) => { const ni=(i+dx+size)%size, nj=(j+dy+size)%size; nE+=subQgMatrixCaelum[ni][nj]; nPX+=Math.cos(subQgPhaseMatrixCaelum[ni][nj]); nPY+=Math.sin(subQgPhaseMatrixCaelum[ni][nj]); vN++; });
      const avgNE = vN>0?nE/vN:subQgMatrixCaelum[i][j]; const eD=cfg.caelumSubqgCoupling*(avgNE-subQgMatrixCaelum[i][j]); newE[i][j]=Math.max(0,Math.min(1,subQgMatrixCaelum[i][j]+eD));
      const avgNP = vN>0?Math.atan2(nPY/vN,nPX/vN):subQgPhaseMatrixCaelum[i][j]; const pDif=cfg.caelumSubqgPhaseDiffusionFactor*(avgNP-subQgPhaseMatrixCaelum[i][j]); const pEng=eD*cfg.caelumSubqgPhaseEnergyCouplingFactor; newP[i][j]=(subQgPhaseMatrixCaelum[i][j]+pDif+pEng+2*Math.PI)%(2*Math.PI);
    }
    for (let i=0; i<size; i++) for (let j=0; j<size; j++) newE[i][j]=Math.max(0,Math.min(1,newE[i][j]+(rng.next()-0.5)*cfg.caelumSubqgInitialEnergyNoiseStd));
    setSubQgMatrixCaelum(newE); setSubQgPhaseMatrixCaelum(newP);
    const newGM = calculateSubQgMetrics(newE, newP, INITIAL_CAELUM_SUBQG_GLOBAL_METRICS); setSubQgGlobalMetricsCaelum(newGM);
    const jump = detectSubQgJumpCaelum(newGM, cfg);
    if (jump) {
      setSubQgJumpInfoCaelum(jump); const pE=jump.peakEnergyBeforeDecay||0, pC=jump.peakCoherenceBeforeDecay||0;
      const mod=(Math.tanh(pE*20)*0.6+pC*0.4)*cfg.caelumSubqgJumpQnsDirectModifierStrength; setActiveSubQgJumpModifierCaelum(mod); setSubQgJumpModifierActiveStepsRemainingCaelum(cfg.caelumSubqgJumpActiveDuration);
    }
  }, [myraConfig, subQgMatrixCaelum, subQgPhaseMatrixCaelum, calculateSubQgMetrics, detectSubQgJumpCaelum]);

  const updateEmotionStateCaelum = useCallback(() => {
    const cfg=myraConfig; const rng=rngRefCaelum.current; setEmotionStateCaelum(prev => { const nS={...prev}; for(const k in nS){nS[k as keyof EmotionState]*=cfg.caelumEmotionDecay;nS[k as keyof EmotionState]=Math.max(-1,Math.min(1,nS[k as keyof EmotionState]+(rng.next()-0.5)*0.02));} return nS; });
  }, [myraConfig]);

  const updateNodeActivationsCaelum = useCallback(() => {
    const cfg=myraConfig; const rng=rngRefCaelum.current; setNodeStatesCaelum(prev => { const nS={...prev}; for(const id in nS){nS[id].activation*=cfg.caelumNodeActivationDecay;nS[id].activation=Math.max(0,Math.min(1,nS[id].activation+(rng.next()-0.48)*0.08)); if(nS[id].type==='limbus'&&nS[id].specificState){(nS[id].specificState as EmotionState)=emotionStateCaelum;nS[id].activation=(emotionStateCaelum.dominance+1)/2*0.5 + (0.5-Math.abs(emotionStateCaelum.arousal)/2)*0.5;}else if(nS[id].type==='metacognitio'){if(subQgJumpInfoCaelum)nS[id].activation+=0.15;if(nS[id].specificState)(nS[id].specificState as any).lastTotalJumps=(subQgJumpInfoCaelum?((nS[id].specificState as any).lastTotalJumps||0)+1:((nS[id].specificState as any).lastTotalJumps||0));} nS[id].resonatorScore=rng.next()*0.3+0.4+activeSubQgJumpModifierCaelum*0.05; nS[id].focusScore=rng.next()*0.4+0.2; nS[id].explorationScore=rng.next()*0.2+activeSubQgJumpModifierCaelum*0.02; nS[id].activation=Math.max(0,Math.min(1,nS[id].activation+activeSubQgJumpModifierCaelum*0.1));} return nS; });
  }, [myraConfig, emotionStateCaelum, subQgJumpInfoCaelum, activeSubQgJumpModifierCaelum]);

  const calculateCaelumStress = useCallback(() => {
    const conflictNode = nodeStatesCaelum['ConflictMonitor_Caelum'];
    const conflictLevel = conflictNode?.specificState?.conflictLevel ?? 0;
    const rawStress=Math.abs(emotionStateCaelum.arousal)*0.2 + Math.max(0,emotionStateCaelum.fear)*0.1 + conflictLevel*0.3;
    setCaelumStressLevel(Math.min(1,Math.max(0,rawStress)));
  }, [emotionStateCaelum, nodeStatesCaelum]);

  const simulateNetworkStepCaelum = useCallback(() => {
    setSimulationStepCaelum(p=>p+1); simulateSubQgStepCaelum(); updateEmotionStateCaelum(); updateNodeActivationsCaelum(); calculateCaelumStress();
    if(subQgJumpModifierActiveStepsRemainingCaelum>0){setSubQgJumpModifierActiveStepsRemainingCaelum(p=>p-1); if(subQgJumpModifierActiveStepsRemainingCaelum-1<=0){setActiveSubQgJumpModifierCaelum(0);}}
    if((simulationStepCaelum+1)%myraConfig.caelumAdaptiveFitnessUpdateInterval===0){setAdaptiveFitnessCaelum(fitnessManagerRefCaelum.current.calculateMetricsAndFitness());}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateSubQgStepCaelum, updateEmotionStateCaelum, updateNodeActivationsCaelum, myraConfig.caelumAdaptiveFitnessUpdateInterval, subQgJumpModifierActiveStepsRemainingCaelum, simulationStepCaelum, calculateCaelumStress]);

  // --- Simulation Loops ---
  useEffect(() => { const id=setInterval(simulateNetworkStepMyra, 2000); return () => clearInterval(id); }, [simulateNetworkStepMyra]);
  useEffect(() => { const id=setInterval(simulateNetworkStepCaelum, 2100); return () => clearInterval(id); }, [simulateNetworkStepCaelum]);

  // --- RAG & Knowledge ---
  const loadAndProcessFile = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith('text/')) { alert(t('knowledgePanel.errorFileFormat')); return; }
    setIsLoadingKnowledge(true);
    try {
      const text=await file.text(); const sourceName=file.name; const newChunks:TextChunk[]=[]; let idx=0;
      for(let i=0;i<text.length;i+=myraConfig.ragChunkSize-myraConfig.ragChunkOverlap){const chunkText=text.substring(i,i+myraConfig.ragChunkSize);if(chunkText.trim()){newChunks.push({id:uuidv4(),source:sourceName,index:idx++,text:chunkText.trim()});}}
      await addChunksToDB(newChunks); const updatedChunks=[...processedTextChunks,...newChunks]; setProcessedTextChunks(updatedChunks);
      fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig,()=>({nodes:nodeStates,emotionState:emotionState,subQgGlobalMetrics:subQgGlobalMetrics,processedTextChunksCount:updatedChunks.length}));
    } catch (e) { console.error("Error processing file:",e); alert(t('knowledgePanel.errorProcessingFile', { message: e instanceof Error ? e.message : String(e) })); }
    finally { setIsLoadingKnowledge(false); }
  }, [myraConfig, processedTextChunks, nodeStates, emotionState, subQgGlobalMetrics, t]);

  const clearAllKnowledge = useCallback(async () => {
    setIsLoadingKnowledge(true);
    try { await clearAllChunksFromDB(); setProcessedTextChunks([]);
      fitnessManagerRef.current = new AdaptiveFitnessManager(myraConfig,()=>({nodes:nodeStates,emotionState:emotionState,subQgGlobalMetrics:subQgGlobalMetrics,processedTextChunksCount:0}));
    } catch (e) { console.error("Error clearing DB:",e); alert(t('knowledgePanel.errorClearingDb', { message: e instanceof Error ? e.message : String(e) })); }
    finally { setIsLoadingKnowledge(false); }
  }, [myraConfig, nodeStates, emotionState, subQgGlobalMetrics, t]);

  const retrieveRelevantChunks = useCallback((prompt: string): TextChunk[] => {
    if(!processedTextChunks.length)return[]; const keywords=prompt.toLowerCase().split(/\s+/).filter(k=>k.length>2); if(!keywords.length)return[];
    const scored=processedTextChunks.map(c=>{let s=0;const txtL=c.text.toLowerCase();keywords.forEach(k=>{if(txtL.includes(k))s++;});return{c,s};});
    scored.sort((a,b)=>b.s-a.s); return scored.filter(sc=>sc.s>0).slice(0,myraConfig.ragMaxChunksToRetrieve).map(sc=>sc.c);
  }, [processedTextChunks, myraConfig.ragMaxChunksToRetrieve]);

  // --- System Instructions ---
  const getBaseSystemInstructionMyra = useCallback((): string => {
    let i = `E(PAD): P=${emotionState.pleasure.toFixed(2)},A=${emotionState.arousal.toFixed(2)},D=${emotionState.dominance.toFixed(2)}. NegA: Ang=${emotionState.anger.toFixed(2)},Dis=${emotionState.disgust.toFixed(2)},Fea=${emotionState.fear.toFixed(2)},Gre=${emotionState.greed.toFixed(2)}.\n`;
    const mN=nodeStates['MetaCognitio_Myra'], crN=nodeStates['Creativus_Myra'], ctN=nodeStates['CortexCriticus_Myra'];
    i += `Cog: MCog A=${mN?.activation.toFixed(2)}(J:${mN?.specificState?.lastTotalJumps||0}), Cr A=${crN?.activation.toFixed(2)}, Ct A=${ctN?.activation.toFixed(2)}.\n`;
    if (activeSubQgJumpModifier!==0) i+=`SQG Event: JMod Act: ${activeSubQgJumpModifier.toFixed(3)}.\n`;
    const fit = adaptiveFitness;
    i += `Fit: O=${fit.overallScore.toFixed(2)}(KE:${fit.dimensions.knowledgeExpansion.toFixed(2)},IC:${fit.dimensions.internalCoherence.toFixed(2)},EC:${fit.dimensions.expressiveCreativity.toFixed(2)},GF:${fit.dimensions.goalFocus.toFixed(2)}).\n`;
    return i;
  }, [emotionState, nodeStates, activeSubQgJumpModifier, adaptiveFitness]);

  const getBaseSystemInstructionCaelum = useCallback((): string => {
    let i = `E(PAD): P=${emotionStateCaelum.pleasure.toFixed(2)},A=${emotionStateCaelum.arousal.toFixed(2)},D=${emotionStateCaelum.dominance.toFixed(2)}. NegA: Ang=${emotionStateCaelum.anger.toFixed(2)},Dis=${emotionStateCaelum.disgust.toFixed(2)},Fea=${emotionStateCaelum.fear.toFixed(2)},Gre=${emotionStateCaelum.greed.toFixed(2)}.\n`;
    const mN=nodeStatesCaelum['MetaCognitio_Caelum'], crN=nodeStatesCaelum['Creativus_Caelum'], ctN=nodeStatesCaelum['CortexCriticus_Caelum'];
    i += `Cog: MCog A=${mN?.activation.toFixed(2)}(J:${mN?.specificState?.lastTotalJumps||0}), Cr A=${crN?.activation.toFixed(2)}, Ct A=${ctN?.activation.toFixed(2)}.\n`;
    if (activeSubQgJumpModifierCaelum!==0) i+=`SQG Event: JMod Act: ${activeSubQgJumpModifierCaelum.toFixed(3)}.\n`;
    const fit = adaptiveFitnessCaelum;
    i += `Fit: O=${fit.overallScore.toFixed(2)}(KE:${fit.dimensions.knowledgeExpansion.toFixed(2)},IC:${fit.dimensions.internalCoherence.toFixed(2)},EC:${fit.dimensions.expressiveCreativity.toFixed(2)},GF:${fit.dimensions.goalFocus.toFixed(2)}).\n`;
    return i;
  }, [emotionStateCaelum, nodeStatesCaelum, activeSubQgJumpModifierCaelum, adaptiveFitnessCaelum]);

  // --- Chat Functions ---
  const generateMyraResponse = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const userMsg:ChatMessage={id:uuidv4(),role:'user',content:prompt,timestamp:Date.now(),speakerName:myraConfig.userName};
    setChatHistory(prev=>[...prev,userMsg]);
    let sysInstruct=getBaseSystemInstructionMyra();
    const chunks=retrieveRelevantChunks(prompt); if(chunks.length>0){sysInstruct+=`\n\n${t('aiService.relevantInfoLabel')}\n`;chunks.forEach(c=>{sysInstruct+=`---[S:${c.source},P${c.index+1}]---\n${c.text}\n`;});sysInstruct+=`---[${t('aiService.endInfoLabel')}]---\n`;}
    let temp=myraConfig.myraAIProviderConfig.temperatureBase + emotionState.arousal*myraConfig.temperatureLimbusInfluence + (nodeStates['Creativus_Myra']?.activation||0)*myraConfig.temperatureCreativusInfluence; temp=Math.max(0.1,Math.min(1.0,temp));
    const aiCfg:AIProviderConfig={...myraConfig.myraAIProviderConfig,temperatureBase:temp};
    const persona:ResolvedSpeakerPersonaConfig={name:myraConfig.myraName,roleDescription:myraConfig.myraRoleDescription,ethicsPrinciples:myraConfig.myraEthicsPrinciples,responseInstruction:myraConfig.myraResponseInstruction};
    
    const resp=await callAiApi(prompt,myraConfig,aiCfg,chatHistory,sysInstruct,persona, t);
    const assistMsg:ChatMessage={id:uuidv4(),role:'assistant',content:resp.text,timestamp:Date.now(),speakerName:myraConfig.myraName};
    setChatHistory(prev=>[...prev,assistMsg]); setIsLoading(false);
    simulateNetworkStepMyra(); setSubQgJumpInfo(null);
  }, [myraConfig, emotionState, nodeStates, chatHistory, simulateNetworkStepMyra, retrieveRelevantChunks, getBaseSystemInstructionMyra, t]);

  const startDualConversation = useCallback(async (initialPrompt: string, rounds: number) => {
    setIsDualConversationLoading(true); 
    dualConversationCancelledRef.current = false;
    
    let uiLog: ChatMessage[] = [];
    
    const userMsg:ChatMessage={id:uuidv4(),role:'user',content:initialPrompt,timestamp:Date.now(),speakerName:myraConfig.userName};
    uiLog = [...uiLog, userMsg];
    setDualConversationHistory([...uiLog]);

    let promptForNextAi = initialPrompt;
    let historyForApi: ChatMessage[] = []; 

    const myraPers:ResolvedSpeakerPersonaConfig={name:myraConfig.myraName,roleDescription:myraConfig.myraRoleDescription,ethicsPrinciples:myraConfig.myraEthicsPrinciples,responseInstruction:myraConfig.myraResponseInstruction};
    const caelumPers:ResolvedSpeakerPersonaConfig={name:myraConfig.caelumName,roleDescription:myraConfig.caelumRoleDescription,ethicsPrinciples:myraConfig.caelumEthicsPrinciples,responseInstruction:myraConfig.caelumResponseInstruction};

    for (let i=0; i<rounds; i++) {
      if(dualConversationCancelledRef.current)break;

      // M.Y.R.A.'s Turn
      let myraTemp=myraConfig.myraAIProviderConfig.temperatureBase + emotionState.arousal*myraConfig.temperatureLimbusInfluence + (nodeStates['Creativus_Myra']?.activation||0)*myraConfig.temperatureCreativusInfluence; myraTemp=Math.max(0.1,Math.min(1.0,myraTemp));
      const myraAICfg:AIProviderConfig={...myraConfig.myraAIProviderConfig,temperatureBase:myraTemp};
      let sysInsMyra=getBaseSystemInstructionMyra();
      const myraRAGChunks = retrieveRelevantChunks(promptForNextAi); // M.Y.R.A. retrieves based on Caelum's or user's last message
      if(myraRAGChunks.length>0){sysInsMyra+=`\n\n${t('aiService.relevantInfoLabel')}\n`;myraRAGChunks.forEach(c=>{sysInsMyra+=`---[S:${c.source},P${c.index+1}]---\n${c.text}\n`;});sysInsMyra+=`---[${t('aiService.endInfoLabel')}]---\n`;}
      
      const myraResp=await callAiApi(promptForNextAi,myraConfig,myraAICfg,historyForApi,sysInsMyra,myraPers, t);
      const myraMsg:ChatMessage={id:uuidv4(),role:'assistant',content:myraResp.text,timestamp:Date.now(),speakerName:myraConfig.myraName};
      
      uiLog = [...uiLog, myraMsg];
      setDualConversationHistory([...uiLog]);
      
      promptForNextAi = myraMsg.content;
      historyForApi = [...uiLog.slice(0, -1)];
      simulateNetworkStepMyra();

      if(dualConversationCancelledRef.current)break;
      if(i === rounds - 1) break;

      // C.A.E.L.U.M.'s Turn
      let caelumTemp=myraConfig.caelumAIProviderConfig.temperatureBase + emotionStateCaelum.arousal*myraConfig.temperatureLimbusInfluence + (nodeStatesCaelum['Creativus_Caelum']?.activation||0)*myraConfig.temperatureCreativusInfluence; caelumTemp=Math.max(0.1,Math.min(1.0,caelumTemp));
      const caelumAICfg:AIProviderConfig={...myraConfig.caelumAIProviderConfig,temperatureBase:caelumTemp};
      let sysInsCaelum=getBaseSystemInstructionCaelum();
      const caelumRAGChunks = retrieveRelevantChunks(promptForNextAi); // C.A.E.L.U.M. retrieves based on M.Y.R.A.'s last message
      if(caelumRAGChunks.length>0){sysInsCaelum+=`\n\n${t('aiService.relevantInfoLabel')}\n`;caelumRAGChunks.forEach(c=>{sysInsCaelum+=`---[S:${c.source},P${c.index+1}]---\n${c.text}\n`;});sysInsCaelum+=`---[${t('aiService.endInfoLabel')}]---\n`;}
      
      const caelumResp=await callAiApi(promptForNextAi,myraConfig,caelumAICfg,historyForApi,sysInsCaelum,caelumPers, t);
      const caelumMsg:ChatMessage={id:uuidv4(),role:'assistant',content:caelumResp.text,timestamp:Date.now(),speakerName:myraConfig.caelumName};

      uiLog = [...uiLog, caelumMsg];
      setDualConversationHistory([...uiLog]);

      promptForNextAi = caelumMsg.content;
      historyForApi = [...uiLog.slice(0, -1)];
      simulateNetworkStepCaelum();
    }

    if(dualConversationCancelledRef.current){
        const lastMsg = uiLog.length > 0 ? uiLog[uiLog.length-1] : null;
        if(!(lastMsg?.role==='system'&&lastMsg.content.includes("cancelled"))){ 
            const cancelMsgContent = t('dualAiPanel.conversationCancelled');
            uiLog=[...uiLog,{id:uuidv4(),role:'system',content:cancelMsgContent,timestamp:Date.now()}];
            setDualConversationHistory([...uiLog]);
        }
    }
    setIsDualConversationLoading(false);
  }, [myraConfig, simulateNetworkStepMyra, getBaseSystemInstructionMyra, emotionState, nodeStates, retrieveRelevantChunks, simulateNetworkStepCaelum, getBaseSystemInstructionCaelum, emotionStateCaelum, nodeStatesCaelum, t]);


  const injectSubQgStimulus = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => {
    const currentConfig = myraConfig;
    setSubQgMatrix(prev => { const newMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.subqgSize && y >= 0 && y < currentConfig.subqgSize) { newMatrix[x][y] = Math.max(0, Math.min(1, newMatrix[x][y] + energyDelta)); } return newMatrix; });
    if (phaseValue !== undefined) { setSubQgPhaseMatrix(prev => { const newPhaseMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.subqgSize && y >= 0 && y < currentConfig.subqgSize) { newPhaseMatrix[x][y] = (phaseValue + 2 * Math.PI) % (2 * Math.PI); } return newPhaseMatrix; }); }
  }, [myraConfig]);

  const injectSubQgStimulusCaelum = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => {
    const currentConfig = myraConfig;
    setSubQgMatrixCaelum(prev => { const newMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.caelumSubqgSize && y >= 0 && y < currentConfig.caelumSubqgSize) { newMatrix[x][y] = Math.max(0, Math.min(1, newMatrix[x][y] + energyDelta)); } return newMatrix; });
    if (phaseValue !== undefined) { setSubQgPhaseMatrixCaelum(prev => { const newPhaseMatrix = prev.map(row => [...row]); if (x >= 0 && x < currentConfig.caelumSubqgSize && y >= 0 && y < currentConfig.caelumSubqgSize) { newPhaseMatrix[x][y] = (phaseValue + 2 * Math.PI) % (2 * Math.PI); } return newPhaseMatrix; }); }
  }, [myraConfig]);


  return {
    myraConfig,
    language: currentLanguage, 
    t, 
    // Myra State
    chatHistory, emotionState, nodeStates, adaptiveFitness, subQgMatrix, subQgPhaseMatrix, subQgGlobalMetrics, subQgJumpInfo, activeSubQgJumpModifier, subQgJumpModifierActiveStepsRemaining, simulationStep, myraStressLevel,
    // Caelum State
    emotionStateCaelum, nodeStatesCaelum, adaptiveFitnessCaelum, subQgMatrixCaelum, subQgPhaseMatrixCaelum, subQgGlobalMetricsCaelum, subQgJumpInfoCaelum, activeSubQgJumpModifierCaelum, subQgJumpModifierActiveStepsRemainingCaelum, simulationStepCaelum, caelumStressLevel,
    // Shared
    isLoading,
    processedTextChunks, loadAndProcessFile, clearAllKnowledge, isLoadingKnowledge,
    dualConversationHistory, isDualConversationLoading, startDualConversation,
    // Functions
    generateMyraResponse,
    injectSubQgStimulus,
    injectSubQgStimulusCaelum,
    updateMyraConfig,
  };
};