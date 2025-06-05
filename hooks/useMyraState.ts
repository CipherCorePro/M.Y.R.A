
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MyraConfig, ChatMessage, EmotionState, NodeState,
  AdaptiveFitnessState, SubQgGlobalMetrics, SubQgJumpInfo,
  GeminiGenerateContentResponse, TextChunk, ResolvedSpeakerPersonaConfig, AIProviderConfig, Language, Theme, Translations,
  PADRecord, ConfigurableAgentPersona, AgentSystemCoreConfig, AgentRuntimeState, InspectedAgentID, AdaptiveFitnessConfig
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_EMOTION_STATE, INITIAL_NODE_STATES,
  INITIAL_ADAPTIVE_FITNESS_STATE,
  INITIAL_CAELUM_EMOTION_STATE, INITIAL_CAELUM_NODE_STATES,
  INITIAL_ADAPTIVE_FITNESS_CONFIG, createInitialAgentRuntimeState
} from '../constants';
import { callAiApi } from '../services/aiService';
import { v4 as uuidv4 } from 'uuid';
import { RNG, SubQGRNG, QuantumRNG } from '../utils/rng';
import { addChunksToDB, getAllChunksFromDB, clearAllChunksFromDB, clearChunksBySourceFromDB } from '../utils/db';
import { AdaptiveFitnessManager } from '../utils/adaptiveFitnessManager';
import { getDominantAffect } from '../utils/uiHelpers';
import readXlsxFile from 'read-excel-file';
import mammoth from 'mammoth';

import deTranslations from '../i18n/de.json';
import enTranslations from '../i18n/en.json';

const translations: Translations = { de: deTranslations, en: enTranslations };

const DOCUMENTATION_BASE_PATHS = [
  '/Dokumentation', '/docs/config_adaptive_fitness', '/docs/config_ai_provider',
  '/docs/config_knowledge_rag', '/docs/config_persona_behavior', '/docs/config_subqg_simulation',
];

function deepMergeObjects(target: any, source: any) {
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);
    if (!isObject(target) || !isObject(source)) return source !== undefined ? source : target;
    Object.keys(source).forEach(key => {
        const targetValue = target[key]; const sourceValue = source[key];
        if (key === 'configurableAgents' && Array.isArray(sourceValue)) {
            target[key] = JSON.parse(JSON.stringify(sourceValue));
        } else if (isObject(sourceValue)) {
            if (!isObject(targetValue)) target[key] = JSON.parse(JSON.stringify(sourceValue));
            else deepMergeObjects(targetValue, sourceValue);
        } else if (sourceValue !== undefined) target[key] = sourceValue;
    }); return target;
}

const getNestedTranslation = (langObject: any, key: string): string | undefined => {
  const keys = key.split('.'); let current = langObject;
  for (const k of keys) { if (current && typeof current === 'object' && k in current) current = current[k]; else return undefined; }
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
  fieldsToTranslate.forEach(fieldKey => {
    const translationKeyField = `${fieldKey}Key` as keyof MyraConfig;
    if (config[translationKeyField]) (config as any)[fieldKey] = tFuncForKey(config[translationKeyField] as string);
    else (config as any)[fieldKey] = tFuncForKey(`${fieldKey.replace(/([A-Z])/g, '.$1').toLowerCase()}`);
  }); return config;
};

const sanitizeSeedValue = (value: any): number | undefined => {
    if (value === null || typeof value === 'undefined' || String(value).trim() === '') return undefined;
    const num = Number(value); return isNaN(num) ? undefined : num;
};

export const useMyraState = () => {
  const [myraConfig, setMyraConfig] = useState<MyraConfig>(() => {
    const savedConfig = localStorage.getItem('myraConfig');
    let loadedConfig = savedConfig ? JSON.parse(savedConfig) : INITIAL_CONFIG;
    loadedConfig.subqgSeed = sanitizeSeedValue(loadedConfig.subqgSeed);
    loadedConfig.caelumSubqgSeed = sanitizeSeedValue(loadedConfig.caelumSubqgSeed);
    if (loadedConfig.configurableAgents) {
        loadedConfig.configurableAgents.forEach((agent: ConfigurableAgentPersona) => {
            if (agent.systemConfig) agent.systemConfig.subqgSeed = sanitizeSeedValue(agent.systemConfig.subqgSeed);
        });
    }
    loadedConfig = deepMergeObjects(JSON.parse(JSON.stringify(INITIAL_CONFIG)), loadedConfig);
    if (loadedConfig.configurableAgents) {
        loadedConfig.configurableAgents = loadedConfig.configurableAgents.map((agent: ConfigurableAgentPersona) => {
            const baseAgentDefaults = INITIAL_CONFIG.configurableAgents.find(da => da.name.startsWith(agent.name.split(" ")[0])) || 
                                      (INITIAL_CONFIG.configurableAgents.length > 0 ? INITIAL_CONFIG.configurableAgents[0] : null) || 
                                      { name: "Default Agent Profile", roleDescription: "Default role.", ethicsPrinciples: "Default ethics.", responseInstruction: "Default instruction.",
                                        aiProviderConfig: JSON.parse(JSON.stringify(INITIAL_CONFIG.myraAIProviderConfig)),
                                        systemConfig: JSON.parse(JSON.stringify(INITIAL_CONFIG)), 
                                        adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
                                      };
            const defaultSystemCoreConfig: AgentSystemCoreConfig = { subqgSize: INITIAL_CONFIG.subqgSize, subqgBaseEnergy: INITIAL_CONFIG.subqgBaseEnergy, subqgCoupling: INITIAL_CONFIG.subqgCoupling, subqgInitialEnergyNoiseStd: INITIAL_CONFIG.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: INITIAL_CONFIG.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: INITIAL_CONFIG.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: INITIAL_CONFIG.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: INITIAL_CONFIG.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: INITIAL_CONFIG.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: INITIAL_CONFIG.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: INITIAL_CONFIG.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: INITIAL_CONFIG.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: INITIAL_CONFIG.subqgPhaseDiffusionFactor, rngType: INITIAL_CONFIG.rngType, subqgSeed: undefined, nodeActivationDecay: INITIAL_CONFIG.nodeActivationDecay, emotionDecay: INITIAL_CONFIG.emotionDecay, adaptiveFitnessUpdateInterval: INITIAL_CONFIG.adaptiveFitnessUpdateInterval };
            return { ...JSON.parse(JSON.stringify(baseAgentDefaults)), ...agent, 
                aiProviderConfig: deepMergeObjects(JSON.parse(JSON.stringify(baseAgentDefaults.aiProviderConfig || INITIAL_CONFIG.myraAIProviderConfig)), agent.aiProviderConfig || {}),
                systemConfig: deepMergeObjects(JSON.parse(JSON.stringify(baseAgentDefaults.systemConfig || defaultSystemCoreConfig)), agent.systemConfig || {}),
                adaptiveFitnessConfig: deepMergeObjects(JSON.parse(JSON.stringify(baseAgentDefaults.adaptiveFitnessConfig || INITIAL_ADAPTIVE_FITNESS_CONFIG)), agent.adaptiveFitnessConfig || {}),
            };
        });
    } return populateTranslatedFields(loadedConfig, loadedConfig.language);
  });

  const [language, setLanguage] = useState<Language>(myraConfig.language);
  const [theme, setTheme] = useState<Theme>(myraConfig.theme);
  const [inspectedAgentId, setInspectedAgentId] = useState<InspectedAgentID>('myra');

  const [agentRuntimeStates, setAgentRuntimeStates] = useState<Record<string, AgentRuntimeState>>(() => {
    const states: Record<string, AgentRuntimeState> = {};
    const myraSystemConfig = { subqgSize: myraConfig.subqgSize, subqgBaseEnergy: myraConfig.subqgBaseEnergy, subqgCoupling: myraConfig.subqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.subqgPhaseDiffusionFactor, rngType: myraConfig.rngType, subqgSeed: myraConfig.subqgSeed, nodeActivationDecay: myraConfig.nodeActivationDecay, emotionDecay: myraConfig.emotionDecay, adaptiveFitnessUpdateInterval: myraConfig.adaptiveFitnessUpdateInterval };
    states['myra'] = createInitialAgentRuntimeState('myra', myraSystemConfig, myraConfig.adaptiveFitnessConfig, INITIAL_EMOTION_STATE, INITIAL_NODE_STATES, myraConfig);
    
    const caelumSystemConfig = { subqgSize: myraConfig.caelumSubqgSize, subqgBaseEnergy: myraConfig.caelumSubqgBaseEnergy, subqgCoupling: myraConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.caelumSubqgPhaseDiffusionFactor, rngType: myraConfig.caelumRngType, subqgSeed: myraConfig.caelumSubqgSeed, nodeActivationDecay: myraConfig.caelumNodeActivationDecay, emotionDecay: myraConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: myraConfig.caelumAdaptiveFitnessUpdateInterval };
    // C.A.E.L.U.M. uses the global adaptiveFitnessConfig, not INITIAL_ADAPTIVE_FITNESS_CONFIG.
    states['caelum'] = createInitialAgentRuntimeState('caelum', caelumSystemConfig, myraConfig.adaptiveFitnessConfig, INITIAL_CAELUM_EMOTION_STATE, INITIAL_CAELUM_NODE_STATES, myraConfig );
    
    myraConfig.configurableAgents.forEach(agent => {
        states[agent.id] = createInitialAgentRuntimeState(agent.id, agent.systemConfig, agent.adaptiveFitnessConfig, INITIAL_EMOTION_STATE, INITIAL_NODE_STATES, myraConfig); 
    });
    return states;
  });

  const t = useCallback((key: string, substitutions?: Record<string, string>): string => {
    const langObj = translations[language] || translations.en;
    let translation = getNestedTranslation(langObj, key);
    if (translation === undefined) { const enLangObj = translations.en; translation = getNestedTranslation(enLangObj, key); }
    if (translation === undefined) { console.warn(`Translation not found for key: ${key} in language: ${language}`); return key; }
    if (substitutions) Object.keys(substitutions).forEach(subKey => { translation = translation!.replace(`{{${subKey}}}`, substitutions[subKey]); });
    return translation!;
  }, [language]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processedTextChunks, setProcessedTextChunks] = useState<TextChunk[]>([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
  const [dualConversationHistory, setDualConversationHistory] = useState<ChatMessage[]>([]);
  const [isDualConversationLoading, setIsDualConversationLoading] = useState(false);
  const [multiAgentConversationHistory, setMultiAgentConversationHistory] = useState<ChatMessage[]>([]);
  const [isMultiAgentConversationLoading, setIsMultiAgentConversationLoading] = useState(false);

  const [emotionState, setEmotionState] = useState<EmotionState>(agentRuntimeStates['myra']?.emotionState || INITIAL_EMOTION_STATE);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>(agentRuntimeStates['myra']?.nodeStates || {});
  const [subQgMatrix, setSubQgMatrix] = useState<number[][]>(agentRuntimeStates['myra']?.subQgMatrix || []);
  const [subQgPhaseMatrix, setSubQgPhaseMatrix] = useState<number[][]>(agentRuntimeStates['myra']?.subQgPhaseMatrix || []);
  const [adaptiveFitness, setAdaptiveFitness] = useState<AdaptiveFitnessState>(agentRuntimeStates['myra']?.adaptiveFitness || INITIAL_ADAPTIVE_FITNESS_STATE);
  const [subQgGlobalMetrics, setSubQgGlobalMetrics] = useState<SubQgGlobalMetrics>(agentRuntimeStates['myra']?.subQgGlobalMetrics || {avgEnergy:0,stdEnergy:0,phaseCoherence:0});
  const [subQgJumpInfo, setSubQgJumpInfo] = useState<SubQgJumpInfo | null>(agentRuntimeStates['myra']?.subQgJumpInfo || null);
  const [simulationStep, setSimulationStep] = useState(agentRuntimeStates['myra']?.simulationStep || 0);
  const [activeSubQgJumpModifier, setActiveSubQgJumpModifier] = useState(agentRuntimeStates['myra']?.activeSubQgJumpModifier || 0);
  const [subQgJumpModifierActiveStepsRemaining, setSubQgJumpModifierActiveStepsRemaining] = useState(agentRuntimeStates['myra']?.subQgJumpModifierActiveStepsRemaining || 0);
  const [myraStressLevel, setMyraStressLevel] = useState(agentRuntimeStates['myra']?.stressLevel || 0);
  const [padHistoryMyra, setPadHistoryMyra] = useState<PADRecord[]>(agentRuntimeStates['myra']?.padHistory || []);

  const [emotionStateCaelum, setEmotionStateCaelum] = useState<EmotionState>(agentRuntimeStates['caelum']?.emotionState || INITIAL_CAELUM_EMOTION_STATE);
  const [nodeStatesCaelum, setNodeStatesCaelum] = useState<Record<string, NodeState>>(agentRuntimeStates['caelum']?.nodeStates || {});
  const [subQgMatrixCaelum, setSubQgMatrixCaelum] = useState<number[][]>(agentRuntimeStates['caelum']?.subQgMatrix || []);
  const [subQgPhaseMatrixCaelum, setSubQgPhaseMatrixCaelum] = useState<number[][]>(agentRuntimeStates['caelum']?.subQgPhaseMatrix || []);
  const [adaptiveFitnessCaelum, setAdaptiveFitnessCaelum] = useState<AdaptiveFitnessState>(agentRuntimeStates['caelum']?.adaptiveFitness || INITIAL_ADAPTIVE_FITNESS_STATE);
  const [subQgGlobalMetricsCaelum, setSubQgGlobalMetricsCaelum] = useState<SubQgGlobalMetrics>(agentRuntimeStates['caelum']?.subQgGlobalMetrics || {avgEnergy:0,stdEnergy:0,phaseCoherence:0});
  const [subQgJumpInfoCaelum, setSubQgJumpInfoCaelum] = useState<SubQgJumpInfo | null>(agentRuntimeStates['caelum']?.subQgJumpInfo || null);
  const [simulationStepCaelum, setSimulationStepCaelum] = useState(agentRuntimeStates['caelum']?.simulationStep || 0);
  const [activeSubQgJumpModifierCaelum, setActiveSubQgJumpModifierCaelum] = useState(agentRuntimeStates['caelum']?.activeSubQgJumpModifier || 0);
  const [subQgJumpModifierActiveStepsRemainingCaelum, setSubQgJumpModifierActiveStepsRemainingCaelum] = useState(agentRuntimeStates['caelum']?.subQgJumpModifierActiveStepsRemaining || 0);
  const [caelumStressLevel, setCaelumStressLevel] = useState(agentRuntimeStates['caelum']?.stressLevel || 0);
  const [padHistoryCaelum, setPadHistoryCaelum] = useState<PADRecord[]>(agentRuntimeStates['caelum']?.padHistory || []);

  useEffect(() => {
    const myraRTState = agentRuntimeStates['myra'];
    if (myraRTState) {
      setEmotionState(myraRTState.emotionState); setNodeStates(myraRTState.nodeStates);
      setSubQgMatrix(myraRTState.subQgMatrix); setSubQgPhaseMatrix(myraRTState.subQgPhaseMatrix);
      setAdaptiveFitness(myraRTState.adaptiveFitness); setSubQgGlobalMetrics(myraRTState.subQgGlobalMetrics);
      setSubQgJumpInfo(myraRTState.subQgJumpInfo); setSimulationStep(myraRTState.simulationStep);
      setActiveSubQgJumpModifier(myraRTState.activeSubQgJumpModifier);
      setSubQgJumpModifierActiveStepsRemaining(myraRTState.subQgJumpModifierActiveStepsRemaining);
      setMyraStressLevel(myraRTState.stressLevel); setPadHistoryMyra(myraRTState.padHistory);
    }
  }, [agentRuntimeStates['myra']]);

  useEffect(() => {
    const caelumRTState = agentRuntimeStates['caelum'];
    if (caelumRTState) {
      setEmotionStateCaelum(caelumRTState.emotionState); setNodeStatesCaelum(caelumRTState.nodeStates);
      setSubQgMatrixCaelum(caelumRTState.subQgMatrix); setSubQgPhaseMatrixCaelum(caelumRTState.subQgPhaseMatrix);
      setAdaptiveFitnessCaelum(caelumRTState.adaptiveFitness); setSubQgGlobalMetricsCaelum(caelumRTState.subQgGlobalMetrics);
      setSubQgJumpInfoCaelum(caelumRTState.subQgJumpInfo); setSimulationStepCaelum(caelumRTState.simulationStep);
      setActiveSubQgJumpModifierCaelum(caelumRTState.activeSubQgJumpModifier);
      setSubQgJumpModifierActiveStepsRemainingCaelum(caelumRTState.subQgJumpModifierActiveStepsRemaining);
      setCaelumStressLevel(caelumRTState.stressLevel); setPadHistoryCaelum(caelumRTState.padHistory);
    }
  }, [agentRuntimeStates['caelum']]);

  const updateMyraConfig = useCallback((newPartialConfig: Partial<MyraConfig> | ((prev: MyraConfig) => MyraConfig)) => {
    setMyraConfig(prevConfig => {
      const configToUpdate = typeof newPartialConfig === 'function' ? newPartialConfig(prevConfig) : newPartialConfig;
      let updatedConfig = deepMergeObjects(JSON.parse(JSON.stringify(prevConfig)), configToUpdate);
      updatedConfig.subqgSeed = sanitizeSeedValue(updatedConfig.subqgSeed);
      updatedConfig.caelumSubqgSeed = sanitizeSeedValue(updatedConfig.caelumSubqgSeed);
      
      setAgentRuntimeStates(prevRuntimeStates => {
        const newRuntimeStates = { ...prevRuntimeStates };
        const myraSysConf = { subqgSize: updatedConfig.subqgSize, subqgBaseEnergy: updatedConfig.subqgBaseEnergy, subqgCoupling: updatedConfig.subqgCoupling, subqgInitialEnergyNoiseStd: updatedConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: updatedConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: updatedConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: updatedConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: updatedConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: updatedConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: updatedConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: updatedConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: updatedConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: updatedConfig.subqgPhaseDiffusionFactor, rngType: updatedConfig.rngType, subqgSeed: updatedConfig.subqgSeed, nodeActivationDecay: updatedConfig.nodeActivationDecay, emotionDecay: updatedConfig.emotionDecay, adaptiveFitnessUpdateInterval: updatedConfig.adaptiveFitnessUpdateInterval };
        const caelumSysConf = { subqgSize: updatedConfig.caelumSubqgSize, subqgBaseEnergy: updatedConfig.caelumSubqgBaseEnergy, subqgCoupling: updatedConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: updatedConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: updatedConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: updatedConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: updatedConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: updatedConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: updatedConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: updatedConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: updatedConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: updatedConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: updatedConfig.caelumSubqgPhaseDiffusionFactor, rngType: updatedConfig.caelumRngType, subqgSeed: updatedConfig.caelumSubqgSeed, nodeActivationDecay: updatedConfig.caelumNodeActivationDecay, emotionDecay: updatedConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: updatedConfig.caelumAdaptiveFitnessUpdateInterval };

        if (newRuntimeStates['myra']) {
            if (configToUpdate.rngType !== undefined || configToUpdate.subqgSeed !== undefined ) {
                newRuntimeStates['myra'].rng = updatedConfig.rngType === 'subqg' ? new SubQGRNG(updatedConfig.subqgSeed) : new QuantumRNG();
            }
            if (configToUpdate.subqgSize !== undefined && configToUpdate.subqgSize !== newRuntimeStates['myra'].subQgMatrix.length) {
                 newRuntimeStates['myra'].subQgMatrix = Array(updatedConfig.subqgSize).fill(0).map(() => Array(updatedConfig.subqgSize).fill(myraSysConf.subqgBaseEnergy));
                 newRuntimeStates['myra'].subQgPhaseMatrix = Array(updatedConfig.subqgSize).fill(0).map(() => Array(updatedConfig.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI));
            }
             newRuntimeStates['myra'].adaptiveFitnessManager.updateConfig({...updatedConfig, adaptiveFitnessConfig: updatedConfig.adaptiveFitnessConfig});
        }
        if (newRuntimeStates['caelum']) {
            if (configToUpdate.caelumRngType !== undefined || configToUpdate.caelumSubqgSeed !== undefined ) {
                newRuntimeStates['caelum'].rng = updatedConfig.caelumRngType === 'subqg' ? new SubQGRNG(updatedConfig.caelumSubqgSeed) : new QuantumRNG();
            }
            if (configToUpdate.caelumSubqgSize !== undefined && configToUpdate.caelumSubqgSize !== newRuntimeStates['caelum'].subQgMatrix.length) {
                newRuntimeStates['caelum'].subQgMatrix = Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Array(updatedConfig.caelumSubqgSize).fill(caelumSysConf.subqgBaseEnergy));
                newRuntimeStates['caelum'].subQgPhaseMatrix = Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Array(updatedConfig.caelumSubqgSize).fill(0).map(() => Math.random() * 2 * Math.PI));
            }
            // C.A.E.L.U.M. uses the global adaptiveFitnessConfig
            newRuntimeStates['caelum'].adaptiveFitnessManager.updateConfig({...updatedConfig, adaptiveFitnessConfig: updatedConfig.adaptiveFitnessConfig});
        }

        if (updatedConfig.configurableAgents) {
            const currentAgentIds = new Set(updatedConfig.configurableAgents.map(a => a.id));
            updatedConfig.configurableAgents.forEach((agentConfig: ConfigurableAgentPersona) => {
                if (agentConfig.systemConfig) agentConfig.systemConfig.subqgSeed = sanitizeSeedValue(agentConfig.systemConfig.subqgSeed);
                const existingRuntime = newRuntimeStates[agentConfig.id];
                if (existingRuntime) { 
                    if (agentConfig.systemConfig.rngType !== existingRuntime.rng.constructor.name.toLowerCase().replace('rng','') || agentConfig.systemConfig.subqgSeed !== (existingRuntime.rng as SubQGRNG).getState?.()) {
                        existingRuntime.rng = agentConfig.systemConfig.rngType === 'subqg' ? new SubQGRNG(agentConfig.systemConfig.subqgSeed) : new QuantumRNG();
                    }
                    if (agentConfig.systemConfig.subqgSize !== existingRuntime.subQgMatrix.length) {
                        existingRuntime.subQgMatrix = Array(agentConfig.systemConfig.subqgSize).fill(0).map(() => Array(agentConfig.systemConfig.subqgSize).fill(agentConfig.systemConfig.subqgBaseEnergy));
                        existingRuntime.subQgPhaseMatrix = Array(agentConfig.systemConfig.subqgSize).fill(0).map(() => Array(agentConfig.systemConfig.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI));
                    }
                    existingRuntime.adaptiveFitnessManager.updateConfig({...updatedConfig, adaptiveFitnessConfig: agentConfig.adaptiveFitnessConfig });
                } else { 
                    newRuntimeStates[agentConfig.id] = createInitialAgentRuntimeState(agentConfig.id, agentConfig.systemConfig, agentConfig.adaptiveFitnessConfig, INITIAL_EMOTION_STATE, INITIAL_NODE_STATES, updatedConfig);
                }
            });
            Object.keys(newRuntimeStates).forEach(agentId => {
                if (agentId !== 'myra' && agentId !== 'caelum' && !currentAgentIds.has(agentId)) {
                    delete newRuntimeStates[agentId];
                }
            });
        }
        return newRuntimeStates;
      });
      
      updatedConfig = populateTranslatedFields(updatedConfig, configToUpdate.language || prevConfig.language);
      localStorage.setItem('myraConfig', JSON.stringify(updatedConfig));
      if (configToUpdate.language) setLanguage(configToUpdate.language);
      if (configToUpdate.theme) setTheme(configToUpdate.theme);
      return updatedConfig;
    });
  }, []);

  const simulateAgentStepInternal = useCallback((
    agentId: string,
    agentBaseConfig: AgentSystemCoreConfig,
    agentAdaptiveFitnessConfig: AdaptiveFitnessConfig, 
    currentRuntimeState: AgentRuntimeState,
    globalConfig: MyraConfig 
  ): AgentRuntimeState => {
    let newRuntimeState = JSON.parse(JSON.stringify(currentRuntimeState)) as AgentRuntimeState; 
    newRuntimeState.rng = currentRuntimeState.rng; 
    newRuntimeState.adaptiveFitnessManager = currentRuntimeState.adaptiveFitnessManager;

    const { rng, adaptiveFitnessManager } = newRuntimeState;

    newRuntimeState.emotionState = { ...newRuntimeState.emotionState };
    (Object.keys(newRuntimeState.emotionState) as Array<keyof EmotionState>).forEach(key => {
      newRuntimeState.emotionState[key] *= agentBaseConfig.emotionDecay;
      newRuntimeState.emotionState[key] = Math.max(-1, Math.min(1, newRuntimeState.emotionState[key]));
    });
    newRuntimeState.emotionState.pleasure += (rng.next() - 0.5) * 0.02;
    newRuntimeState.emotionState.arousal += (rng.next() - 0.5) * 0.02;
    newRuntimeState.emotionState.dominance += (rng.next() - 0.5) * 0.02;

    const newNodesTemp = { ...newRuntimeState.nodeStates };
    Object.values(newNodesTemp).forEach(node => {
      node.activation *= agentBaseConfig.nodeActivationDecay;
      const limbusNodeKey = Object.keys(newNodesTemp).find(k => newNodesTemp[k].type === 'limbus');
      const limbus = limbusNodeKey ? newNodesTemp[limbusNodeKey] : undefined;
      if (limbus && node.type !== 'limbus') node.activation += (limbus.activation - 0.5) * 0.01 * rng.next();
      if (newRuntimeState.activeSubQgJumpModifier !== 0 && node.type !== 'limbus') node.activation += newRuntimeState.activeSubQgJumpModifier * (rng.next() * 0.5) * agentBaseConfig.subqgJumpQnsDirectModifierStrength;
      node.activation = Math.max(0, Math.min(1, node.activation + (rng.next() - 0.5) * 0.05));
    });
    newRuntimeState.nodeStates = newNodesTemp;

    const prevEnergyMatrix = newRuntimeState.subQgMatrix;
    const newEnergyMatrix = prevEnergyMatrix.map(row => [...row]);
    const { subqgSize, subqgCoupling, subqgBaseEnergy, subqgInitialEnergyNoiseStd } = agentBaseConfig;
    for (let i = 0; i < subqgSize; i++) { for (let j = 0; j < subqgSize; j++) {
        let energySum = 0; let count = 0;
        for (let di = -1; di <= 1; di++) { for (let dj = -1; dj <= 1; dj++) { if (di === 0 && dj === 0) continue; const ni = i + di; const nj = j + dj; if (ni >= 0 && ni < subqgSize && nj >= 0 && nj < subqgSize) { energySum += prevEnergyMatrix[ni][nj]; count++; }}}
        const avgNeighborEnergy = count > 0 ? energySum / count : 0;
        newEnergyMatrix[i][j] += (avgNeighborEnergy - prevEnergyMatrix[i][j]) * subqgCoupling;
        newEnergyMatrix[i][j] = Math.max(subqgBaseEnergy * 0.1, newEnergyMatrix[i][j] * (1 - subqgBaseEnergy * 0.5));
        newEnergyMatrix[i][j] += (rng.next() - 0.5) * subqgInitialEnergyNoiseStd * 0.1;
    }}
    newRuntimeState.subQgMatrix = newEnergyMatrix;

    const prevPhaseMatrix = newRuntimeState.subQgPhaseMatrix;
    const newPhaseMatrix = prevPhaseMatrix.map(row => [...row]);
    const { subqgPhaseEnergyCouplingFactor, subqgPhaseDiffusionFactor } = agentBaseConfig;
    for (let i = 0; i < subqgSize; i++) { for (let j = 0; j < subqgSize; j++) {
        let phaseSumSin = 0; let phaseSumCos = 0; let neighborCount = 0;
        for (let di = -1; di <= 1; di++) { for (let dj = -1; dj <= 1; dj++) { if (di === 0 && dj === 0) continue; const ni = i + di; const nj = j + dj; if (ni >= 0 && ni < subqgSize && nj >= 0 && nj < subqgSize) { phaseSumSin += Math.sin(prevPhaseMatrix[ni][nj]); phaseSumCos += Math.cos(prevPhaseMatrix[ni][nj]); neighborCount++; }}}
        if (neighborCount > 0) { const avgNeighborPhase = Math.atan2(phaseSumSin / neighborCount, phaseSumCos / neighborCount); let phaseDiff = avgNeighborPhase - newPhaseMatrix[i][j]; while (phaseDiff > Math.PI) phaseDiff -= 2 * Math.PI; while (phaseDiff < -Math.PI) phaseDiff += 2 * Math.PI; newPhaseMatrix[i][j] += phaseDiff * subqgPhaseDiffusionFactor; }
        const energyChangeEffect = (newRuntimeState.subQgMatrix[i][j] - subqgBaseEnergy) * 10;
        newPhaseMatrix[i][j] += (rng.next() - 0.5) * subqgPhaseEnergyCouplingFactor * Math.tanh(energyChangeEffect);
        newPhaseMatrix[i][j] = (newPhaseMatrix[i][j] % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
    }}
    newRuntimeState.subQgPhaseMatrix = newPhaseMatrix;

    let totalEnergy = 0; newRuntimeState.subQgMatrix.forEach(row => row.forEach(cell => totalEnergy += cell)); const avgEnergy = totalEnergy / (subqgSize * subqgSize);
    let sumSqDiff = 0; newRuntimeState.subQgMatrix.forEach(row => row.forEach(cell => sumSqDiff += Math.pow(cell - avgEnergy, 2))); const stdEnergy = Math.sqrt(sumSqDiff / (subqgSize * subqgSize));
    let sumSin = 0; let sumCos = 0; newRuntimeState.subQgPhaseMatrix.forEach(row => row.forEach(phase => { sumSin += Math.sin(phase); sumCos += Math.cos(phase); }));
    const numCells = subqgSize * subqgSize; const phaseCoherence = Math.sqrt(Math.pow(sumSin / numCells, 2) + Math.pow(sumCos / numCells, 2));
    newRuntimeState.subQgGlobalMetrics = { avgEnergy, stdEnergy, phaseCoherence };

    const { subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration } = agentBaseConfig;
    let currentPeakTracker = newRuntimeState.subQgPeakTracker;
    if (currentPeakTracker === null) {
        if (avgEnergy > subqgJumpMinEnergyAtPeak && phaseCoherence > subqgJumpMinCoherenceAtPeak) {
            currentPeakTracker = { tracking: true, peakEnergy: avgEnergy, peakCoherence: phaseCoherence, stepsSincePeak: 0 };
        }
    } else {
        currentPeakTracker.stepsSincePeak++; let jumpDetected = false; let reason = "";
        if (phaseCoherence < currentPeakTracker.peakCoherence * (1 - subqgJumpCoherenceDropFactor)) { jumpDetected = true; reason = "Coherence Drop"; }
        else if (avgEnergy < currentPeakTracker.peakEnergy * (1 - subqgJumpEnergyDropFactorFromPeak)) { jumpDetected = true; reason = "Energy Drop"; }
        if (jumpDetected) {
            newRuntimeState.subQgJumpInfo = { type: `SubQG Jump (${reason})`, peakEnergyBeforeDecay: currentPeakTracker.peakEnergy, peakCoherenceBeforeDecay: currentPeakTracker.peakCoherence, currentEnergyAtDecayDetection: avgEnergy, currentCoherenceAtDecayDetection: phaseCoherence, reasonForDecayDetection: reason, stepsFromPeakToDecay: currentPeakTracker.stepsSincePeak, timestamp: Date.now() };
            const energyDropRatio = (currentPeakTracker.peakEnergy - avgEnergy) / (currentPeakTracker.peakEnergy || 1); const coherenceDropRatio = (currentPeakTracker.peakCoherence - phaseCoherence) / (currentPeakTracker.peakCoherence || 1);
            let modifier = (energyDropRatio + coherenceDropRatio) * 0.5 * (rng.next() > 0.5 ? 1 : -1); modifier *= (currentPeakTracker.peakEnergy / subqgJumpMinEnergyAtPeak);
            newRuntimeState.activeSubQgJumpModifier = Math.max(-1, Math.min(1, modifier));
            newRuntimeState.subQgJumpModifierActiveStepsRemaining = subqgJumpActiveDuration;
            currentPeakTracker = null;
        } else if (currentPeakTracker.stepsSincePeak > subqgJumpMaxStepsToTrackPeak) {
            currentPeakTracker = null;
        } else {
            currentPeakTracker.peakEnergy = Math.max(currentPeakTracker.peakEnergy, avgEnergy); currentPeakTracker.peakCoherence = Math.max(currentPeakTracker.peakCoherence, phaseCoherence);
        }
    }
    newRuntimeState.subQgPeakTracker = currentPeakTracker;

    if (newRuntimeState.subQgJumpModifierActiveStepsRemaining > 0) {
        newRuntimeState.subQgJumpModifierActiveStepsRemaining -= 1;
        if (newRuntimeState.subQgJumpModifierActiveStepsRemaining === 0) newRuntimeState.activeSubQgJumpModifier = 0;
    }

    const arousal = newRuntimeState.emotionState.arousal;
    const conflictNodeKey = Object.keys(newRuntimeState.nodeStates).find(k => newRuntimeState.nodeStates[k].type === 'conflict');
    const conflictLevel = conflictNodeKey ? newRuntimeState.nodeStates[conflictNodeKey].activation : 0;
    newRuntimeState.stressLevel = Math.max(0, Math.min(1, (Math.abs(arousal) * 0.4) + (avgEnergy * 5) + (conflictLevel * 0.3)));

    if (newRuntimeState.simulationStep % agentBaseConfig.adaptiveFitnessUpdateInterval === 0) {
        const agentSpecificSnapshot = () => ({
            nodes: newRuntimeState.nodeStates,
            emotionState: newRuntimeState.emotionState,
            subQgGlobalMetrics: newRuntimeState.subQgGlobalMetrics,
            processedTextChunksCount: processedTextChunks.length, 
        });
        adaptiveFitnessManager.updateConfig(
            { ...globalConfig, adaptiveFitnessConfig: agentAdaptiveFitnessConfig },
            agentSpecificSnapshot 
        );
        newRuntimeState.adaptiveFitness = adaptiveFitnessManager.calculateMetricsAndFitness();
    }
    
    const newPadRecord: PADRecord = { pleasure: newRuntimeState.emotionState.pleasure, arousal: newRuntimeState.emotionState.arousal, dominance: newRuntimeState.emotionState.dominance, timestamp: Date.now(), dominantAffect: getDominantAffect(newRuntimeState.emotionState, t) };
    newRuntimeState.padHistory = [...newRuntimeState.padHistory, newPadRecord].slice(-globalConfig.maxPadHistorySize);
    newRuntimeState.simulationStep += 1;
    return newRuntimeState;
  }, [processedTextChunks, t]); 

  const simulateNetworkStepMyra = useCallback(() => { 
    setAgentRuntimeStates(prevStates => { 
      const myraRT = prevStates['myra']; 
      if (!myraRT) return prevStates; 
      const myraSysConf = { subqgSize: myraConfig.subqgSize, subqgBaseEnergy: myraConfig.subqgBaseEnergy, subqgCoupling: myraConfig.subqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.subqgPhaseDiffusionFactor, rngType: myraConfig.rngType, subqgSeed: myraConfig.subqgSeed, nodeActivationDecay: myraConfig.nodeActivationDecay, emotionDecay: myraConfig.emotionDecay, adaptiveFitnessUpdateInterval: myraConfig.adaptiveFitnessUpdateInterval }; 
      const nextState = simulateAgentStepInternal('myra', myraSysConf, myraConfig.adaptiveFitnessConfig, myraRT, myraConfig); 
      return { ...prevStates, 'myra': nextState }; 
    }); 
  }, [myraConfig, simulateAgentStepInternal]);

  const simulateNetworkStepCaelum = useCallback(() => { 
    setAgentRuntimeStates(prevStates => { 
      const caelumRT = prevStates['caelum']; 
      if (!caelumRT) return prevStates; 
      const caelumSysConf = { subqgSize: myraConfig.caelumSubqgSize, subqgBaseEnergy: myraConfig.caelumSubqgBaseEnergy, subqgCoupling: myraConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.caelumSubqgPhaseDiffusionFactor, rngType: myraConfig.caelumRngType, subqgSeed: myraConfig.caelumSubqgSeed, nodeActivationDecay: myraConfig.caelumNodeActivationDecay, emotionDecay: myraConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: myraConfig.caelumAdaptiveFitnessUpdateInterval }; 
      // C.A.E.L.U.M. uses the global adaptiveFitnessConfig from MyraConfig
      const nextState = simulateAgentStepInternal('caelum', caelumSysConf, myraConfig.adaptiveFitnessConfig, caelumRT, myraConfig); 
      return { ...prevStates, 'caelum': nextState }; 
    }); 
  }, [myraConfig, simulateAgentStepInternal]);
  
  const getAgentBaseSystemInstruction = useCallback((agentId: string, agentRuntimeState?: AgentRuntimeState): string => { 
    const stateToUse = agentRuntimeState || agentRuntimeStates[agentId];
    const agentConfigEntry = agentId === 'myra' ? { name: myraConfig.myraName } : agentId === 'caelum' ? { name: myraConfig.caelumName } : myraConfig.configurableAgents.find(a => a.id === agentId); 
    if (!stateToUse || !agentConfigEntry) return "Agent state or config not found for instruction."; 
    const af = stateToUse.adaptiveFitness; const metrics = stateToUse.subQgGlobalMetrics; const currentEmotionState = stateToUse.emotionState; 
    const emotionPAD = `P:${currentEmotionState.pleasure.toFixed(2)},A:${currentEmotionState.arousal.toFixed(2)},D:${currentEmotionState.dominance.toFixed(2)}`; 
    const dominantAffect = getDominantAffect(currentEmotionState, t); const agentDisplayName = agentConfigEntry.name || agentId; 
    return t('aiService.currentInternalContextLabel', { speakerName: agentDisplayName }) + `\n- ${t('systemStatusPanel.emotion.title')}: ${dominantAffect} (${emotionPAD})` + `\n- ${t('systemStatusPanel.fitness.title')}: ${af.overallScore.toFixed(3)} (Kn: ${af.dimensions.knowledgeExpansion.toFixed(2)}, Co: ${af.dimensions.internalCoherence.toFixed(2)}, Cr: ${af.dimensions.expressiveCreativity.toFixed(2)}, Fo: ${af.dimensions.goalFocus.toFixed(2)})` + `\n- ${t('systemStatusPanel.subQg.title')}: AvgE=${metrics.avgEnergy.toFixed(4)}, PhCoh=${metrics.phaseCoherence.toFixed(3)}` + (stateToUse.subQgJumpInfo ? `\n- SubQG Event: ${stateToUse.subQgJumpInfo.type}` : ''); 
  }, [agentRuntimeStates, myraConfig, t]);

  const getMyraResolvedPersonaConfig = useCallback((): ResolvedSpeakerPersonaConfig => ({ name: myraConfig.myraName, roleDescription: myraConfig.myraRoleDescription, ethicsPrinciples: myraConfig.myraEthicsPrinciples, responseInstruction: myraConfig.myraResponseInstruction }), [myraConfig]);
  const getCaelumResolvedPersonaConfig = useCallback((): ResolvedSpeakerPersonaConfig => ({ name: myraConfig.caelumName, roleDescription: myraConfig.caelumRoleDescription, ethicsPrinciples: myraConfig.caelumEthicsPrinciples, responseInstruction: myraConfig.caelumResponseInstruction }), [myraConfig]);
  const getConfigurableAgentResolvedPersonaConfig = useCallback((agentId: string): ResolvedSpeakerPersonaConfig | undefined => { const agent = myraConfig.configurableAgents.find(a => a.id === agentId); if (!agent) return undefined; return { name: agent.name, roleDescription: agent.roleDescription, ethicsPrinciples: agent.ethicsPrinciples, responseInstruction: agent.responseInstruction, personalityTrait: agent.personalityTrait }; }, [myraConfig.configurableAgents]);

  const loadAndProcessFile = useCallback(async (file: File) => { setIsLoadingKnowledge(true); try { let textContent = ''; if (file.name.endsWith('.txt') || file.name.endsWith('.md')) { textContent = await file.text(); } else if (file.name.endsWith('.xlsx')) { const rows = await readXlsxFile(file); textContent = rows.map(row => row.join(' ')).join('\n'); } else if (file.name.endsWith('.docx')) { const arrayBuffer = await file.arrayBuffer(); const result = await mammoth.extractRawText({ arrayBuffer }); textContent = result.value; } else { console.warn(t('knowledgePanel.errorFileFormat')); alert(t('knowledgePanel.errorFileFormat')); setIsLoadingKnowledge(false); return; } await clearChunksBySourceFromDB(file.name); const newChunks: TextChunk[] = []; for (let i = 0; i < textContent.length; i += (myraConfig.ragChunkSize - myraConfig.ragChunkOverlap)) { const chunkText = textContent.substring(i, i + myraConfig.ragChunkSize); newChunks.push({ id: uuidv4(), source: file.name, index: Math.floor(i / (myraConfig.ragChunkSize - myraConfig.ragChunkOverlap)), text: chunkText }); } await addChunksToDB(newChunks); const allChunks = await getAllChunksFromDB(); setProcessedTextChunks(allChunks); } catch (error: any) { console.error(t('knowledgePanel.errorProcessingFile', { message: error.message }), error); alert(t('knowledgePanel.errorProcessingFile', { message: error.message })); } finally { setIsLoadingKnowledge(false); } }, [myraConfig.ragChunkSize, myraConfig.ragChunkOverlap, t]);
  const retrieveRelevantChunks = useCallback(async (query: string): Promise<TextChunk[]> => { if (!query.trim()) return []; const allChunks = await getAllChunksFromDB(); const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2); const scoredChunks = allChunks.map(chunk => { let score = 0; const chunkTextLower = chunk.text.toLowerCase(); queryWords.forEach(word => { if (chunkTextLower.includes(word)) score++; }); return { ...chunk, score }; }).filter(chunk => chunk.score > 0); scoredChunks.sort((a, b) => b.score - a.score); return scoredChunks.slice(0, myraConfig.ragMaxChunksToRetrieve); }, [myraConfig.ragMaxChunksToRetrieve]);
  const clearAllKnowledge = useCallback(async () => { setIsLoadingKnowledge(true); try { await clearAllChunksFromDB(); setProcessedTextChunks([]); } catch (error: any) { console.error(t('knowledgePanel.errorClearingDb', { message: error.message }), error); alert(t('knowledgePanel.errorClearingDb', { message: error.message })); } finally { setIsLoadingKnowledge(false); } }, [t]);
  const loadDocumentationKnowledge = useCallback(async () => { setIsLoadingKnowledge(true); const lang = myraConfig.language || 'de'; const pathsToLoad = DOCUMENTATION_BASE_PATHS.map(base => `${base}_${lang}.md`).concat(DOCUMENTATION_BASE_PATHS.map(base => `${base}.md`)); try { for (const path of pathsToLoad) { try { const response = await fetch(path); if (response.ok) { const markdown = await response.text(); await clearChunksBySourceFromDB(path); const newChunks: TextChunk[] = []; for (let i = 0; i < markdown.length; i += (myraConfig.ragChunkSize - myraConfig.ragChunkOverlap)) { const chunkText = markdown.substring(i, i + myraConfig.ragChunkSize); newChunks.push({ id: uuidv4(), source: path, index: Math.floor(i / (myraConfig.ragChunkSize - myraConfig.ragChunkOverlap)), text: chunkText }); } await addChunksToDB(newChunks); } else { console.warn(`Documentation file not found: ${path}`); } } catch (e) { console.warn(`Error fetching or processing documentation file ${path}:`, e); } } const allChunks = await getAllChunksFromDB(); setProcessedTextChunks(allChunks); } catch (error: any) { console.error(t('knowledgePanel.errorProcessingFile', { message: error.message }), error); } finally { setIsLoadingKnowledge(false); } }, [myraConfig.language, myraConfig.ragChunkSize, myraConfig.ragChunkOverlap, t]);
  useEffect(() => { loadDocumentationKnowledge(); getAllChunksFromDB().then(setProcessedTextChunks); }, [loadDocumentationKnowledge]);

  const intervalRefMyra = useRef<NodeJS.Timeout | null>(null); const intervalRefCaelum = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => { if (intervalRefMyra.current) clearInterval(intervalRefMyra.current); intervalRefMyra.current = setInterval(simulateNetworkStepMyra, 500); return () => { if (intervalRefMyra.current) clearInterval(intervalRefMyra.current); }; }, [simulateNetworkStepMyra]);
  useEffect(() => { if (intervalRefCaelum.current) clearInterval(intervalRefCaelum.current); intervalRefCaelum.current = setInterval(simulateNetworkStepCaelum, 700); return () => { if (intervalRefCaelum.current) clearInterval(intervalRefCaelum.current); }; }, [simulateNetworkStepCaelum]);

  const injectSubQgStimulus = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => { setAgentRuntimeStates(prevStates => { const myraRT = prevStates['myra']; if (!myraRT) return prevStates; const newMatrix = myraRT.subQgMatrix.map(row => [...row]); newMatrix[x][y] = Math.max(0, newMatrix[x][y] + energyDelta); const newPhaseMatrix = myraRT.subQgPhaseMatrix.map(row => [...row]); if (phaseValue !== undefined) newPhaseMatrix[x][y] = (phaseValue % (2 * Math.PI) + (2*Math.PI)) % (2*Math.PI); return { ...prevStates, 'myra': { ...myraRT, subQgMatrix: newMatrix, subQgPhaseMatrix: newPhaseMatrix } }; }); }, []);
  const injectSubQgStimulusCaelum = useCallback((x: number, y: number, energyDelta: number, phaseValue?: number) => { setAgentRuntimeStates(prevStates => { const caelumRT = prevStates['caelum']; if (!caelumRT) return prevStates; const newMatrix = caelumRT.subQgMatrix.map(row => [...row]); newMatrix[x][y] = Math.max(0, newMatrix[x][y] + energyDelta); const newPhaseMatrix = caelumRT.subQgPhaseMatrix.map(row => [...row]); if (phaseValue !== undefined) newPhaseMatrix[x][y] = (phaseValue % (2 * Math.PI) + (2*Math.PI)) % (2*Math.PI); return { ...prevStates, 'caelum': { ...caelumRT, subQgMatrix: newMatrix, subQgPhaseMatrix: newPhaseMatrix } }; }); }, []);
  const injectSubQgStimulusForAgent = useCallback((agentId: string, x: number, y: number, energyDelta: number, phaseValue?: number) => {
    setAgentRuntimeStates(prevStates => {
        const agentRT = prevStates[agentId];
        if (!agentRT) return prevStates;
        const newMatrix = agentRT.subQgMatrix.map(row => [...row]);
        if (x >= 0 && x < newMatrix.length && y >= 0 && y < newMatrix[0].length) {
            newMatrix[x][y] = Math.max(0, newMatrix[x][y] + energyDelta);
        }
        const newPhaseMatrix = agentRT.subQgPhaseMatrix.map(row => [...row]);
        if (phaseValue !== undefined && x >= 0 && x < newPhaseMatrix.length && y >= 0 && y < newPhaseMatrix[0].length) {
            newPhaseMatrix[x][y] = (phaseValue % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
        }
        return { ...prevStates, [agentId]: { ...agentRT, subQgMatrix: newMatrix, subQgPhaseMatrix: newPhaseMatrix }};
    });
  }, []);


  const generateActiveAgentChatResponse = useCallback(async (prompt: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { id: uuidv4(), role: 'user', content: prompt, timestamp: Date.now(), speakerName: myraConfig.userName };
    setChatHistory(prev => [...prev, userMessage]);

    const activeAgentId = myraConfig.activeChatAgent === 'caelum' ? 'caelum' : 'myra';
    let currentAgentRuntimeState = agentRuntimeStates[activeAgentId];
    let currentAgentConfig: AgentSystemCoreConfig;
    let currentAIConfig: AIProviderConfig;
    let currentPersonaConfig: ResolvedSpeakerPersonaConfig | undefined;
    let currentAdaptiveFitnessConfig: AdaptiveFitnessConfig;

    if (activeAgentId === 'myra') {
        currentAgentConfig = { subqgSize: myraConfig.subqgSize, subqgBaseEnergy: myraConfig.subqgBaseEnergy, subqgCoupling: myraConfig.subqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.subqgPhaseDiffusionFactor, rngType: myraConfig.rngType, subqgSeed: myraConfig.subqgSeed, nodeActivationDecay: myraConfig.nodeActivationDecay, emotionDecay: myraConfig.emotionDecay, adaptiveFitnessUpdateInterval: myraConfig.adaptiveFitnessUpdateInterval };
        currentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig;
        currentAIConfig = myraConfig.myraAIProviderConfig;
        currentPersonaConfig = getMyraResolvedPersonaConfig();
    } else { // Caelum
        currentAgentConfig = { subqgSize: myraConfig.caelumSubqgSize, subqgBaseEnergy: myraConfig.caelumSubqgBaseEnergy, subqgCoupling: myraConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.caelumSubqgPhaseDiffusionFactor, rngType: myraConfig.caelumRngType, subqgSeed: myraConfig.caelumSubqgSeed, nodeActivationDecay: myraConfig.caelumNodeActivationDecay, emotionDecay: myraConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: myraConfig.caelumAdaptiveFitnessUpdateInterval };
        currentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig; // Caelum uses Myra's AF config structure
        currentAIConfig = myraConfig.caelumAIProviderConfig;
        currentPersonaConfig = getCaelumResolvedPersonaConfig();
    }

    if (!currentAgentRuntimeState) {
        console.error(`Runtime state for ${activeAgentId} not found!`);
        setIsLoading(false);
        return;
    }
    const nextAgentRuntimeState = simulateAgentStepInternal(activeAgentId, currentAgentConfig, currentAdaptiveFitnessConfig, currentAgentRuntimeState, myraConfig);
    setAgentRuntimeStates(prev => ({ ...prev, [activeAgentId]: nextAgentRuntimeState }));
    
    const baseInstruction = getAgentBaseSystemInstruction(activeAgentId, nextAgentRuntimeState);
    const retrievedChunks = await retrieveRelevantChunks(prompt);
    let finalPrompt = prompt;
    if (retrievedChunks.length > 0) {
      const contextText = retrievedChunks.map(c => c.text).join("\n---\n");
      finalPrompt = `${t('aiService.relevantInfoLabel')}\n${contextText}\n${t('aiService.endInfoLabel')}\n\n${prompt}`;
    }
    
    const response = await callAiApi(finalPrompt, myraConfig, currentAIConfig, chatHistory, baseInstruction, currentPersonaConfig, t);
    const aiMessage: ChatMessage = { id: uuidv4(), role: 'assistant', content: response.text, timestamp: Date.now(), speakerName: currentPersonaConfig?.name, retrievedChunks };
    setChatHistory(prev => [...prev, aiMessage]);
    setIsLoading(false);
  }, [myraConfig, agentRuntimeStates, chatHistory, retrieveRelevantChunks, simulateAgentStepInternal, getAgentBaseSystemInstruction, getMyraResolvedPersonaConfig, getCaelumResolvedPersonaConfig, t]);


  const startDualConversation = useCallback(async (initialPrompt: string, rounds: number) => { /* ... unchanged, but ensure it uses getAgentBaseSystemInstruction with the latest state ... */ setIsDualConversationLoading(true); setDualConversationHistory([]); const userMsg: ChatMessage = { id: uuidv4(), role: 'user', content: initialPrompt, timestamp: Date.now(), speakerName: myraConfig.userName }; setDualConversationHistory(prev => [...prev, userMsg]); let currentPrompt = initialPrompt; let lastSpeakerId: 'myra' | 'caelum' = 'caelum'; for (let i = 0; i < rounds * 2; i++) { const currentSpeakerId = lastSpeakerId === 'caelum' ? 'myra' : 'caelum'; let currentAgentRuntimeState = agentRuntimeStates[currentSpeakerId]; let currentAgentConfig: AgentSystemCoreConfig; let currentAIConfig: AIProviderConfig; let currentPersonaConfig: ResolvedSpeakerPersonaConfig | undefined; let currentAdaptiveFitnessConfig: AdaptiveFitnessConfig; if (currentSpeakerId === 'myra') { currentAgentConfig = { subqgSize: myraConfig.subqgSize, subqgBaseEnergy: myraConfig.subqgBaseEnergy, subqgCoupling: myraConfig.subqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.subqgPhaseDiffusionFactor, rngType: myraConfig.rngType, subqgSeed: myraConfig.subqgSeed, nodeActivationDecay: myraConfig.nodeActivationDecay, emotionDecay: myraConfig.emotionDecay, adaptiveFitnessUpdateInterval: myraConfig.adaptiveFitnessUpdateInterval }; currentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig; currentAIConfig = myraConfig.myraAIProviderConfig; currentPersonaConfig = getMyraResolvedPersonaConfig(); } else { currentAgentConfig = { subqgSize: myraConfig.caelumSubqgSize, subqgBaseEnergy: myraConfig.caelumSubqgBaseEnergy, subqgCoupling: myraConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.caelumSubqgPhaseDiffusionFactor, rngType: myraConfig.caelumRngType, subqgSeed: myraConfig.caelumSubqgSeed, nodeActivationDecay: myraConfig.caelumNodeActivationDecay, emotionDecay: myraConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: myraConfig.caelumAdaptiveFitnessUpdateInterval }; currentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig; currentAIConfig = myraConfig.caelumAIProviderConfig; currentPersonaConfig = getCaelumResolvedPersonaConfig(); } if (!currentAgentRuntimeState) { console.error(`Runtime state for ${currentSpeakerId} not found!`); continue; } const nextAgentRuntimeState = simulateAgentStepInternal(currentSpeakerId, currentAgentConfig, currentAdaptiveFitnessConfig, currentAgentRuntimeState, myraConfig); setAgentRuntimeStates(prev => ({ ...prev, [currentSpeakerId]: nextAgentRuntimeState })); const baseInstruction = getAgentBaseSystemInstruction(currentSpeakerId, nextAgentRuntimeState); const retrievedChunks = await retrieveRelevantChunks(currentPrompt); let finalPromptForAI = currentPrompt; if (retrievedChunks.length > 0) { const contextText = retrievedChunks.map(c => c.text).join("\n---\n"); finalPromptForAI = `${t('aiService.relevantInfoLabel')}\n${contextText}\n${t('aiService.endInfoLabel')}\n\n${currentPrompt}`; } const response = await callAiApi(finalPromptForAI, myraConfig, currentAIConfig, dualConversationHistory, baseInstruction, currentPersonaConfig, t); const aiMessage: ChatMessage = { id: uuidv4(), role: 'assistant', content: response.text, timestamp: Date.now(), speakerId: currentSpeakerId, speakerName: currentPersonaConfig?.name, retrievedChunks }; setDualConversationHistory(prev => [...prev, aiMessage]); currentPrompt = response.text; lastSpeakerId = currentSpeakerId; if (i < rounds * 2 - 1) await new Promise(resolve => setTimeout(resolve, 500)); } setIsDualConversationLoading(false); }, [myraConfig, agentRuntimeStates, dualConversationHistory, retrieveRelevantChunks, simulateAgentStepInternal, getAgentBaseSystemInstruction, getMyraResolvedPersonaConfig, getCaelumResolvedPersonaConfig, t]);
  const startMultiAgentConversation = useCallback(async (initialPrompt: string, roundsPerAgent: number, selectedAgentIds: string[]) => {
    if (selectedAgentIds.length === 0) {
        console.warn("No agents selected for multi-agent conversation.");
        return;
    }
    setIsMultiAgentConversationLoading(true);
    setMultiAgentConversationHistory([]);

    const initialUserMsg: ChatMessage = { id: uuidv4(), role: 'user', content: initialPrompt, timestamp: Date.now(), speakerName: myraConfig.userName, speakerId: 'user' };
    setMultiAgentConversationHistory(prev => [...prev, initialUserMsg]);

    let currentTurnPrompt = initialPrompt;
    let conversationHistoryForApi: ChatMessage[] = [initialUserMsg];

    for (let round = 0; round < roundsPerAgent; round++) {
        for (const agentId of selectedAgentIds) {
            let currentAgentRuntimeState = agentRuntimeStates[agentId];
            let agentSystemConfig: AgentSystemCoreConfig;
            let agentAIConfig: AIProviderConfig;
            let agentPersonaConfig: ResolvedSpeakerPersonaConfig | undefined;
            let agentAdaptiveFitnessConfig: AdaptiveFitnessConfig;

            if (agentId === 'myra') {
                agentSystemConfig = { subqgSize: myraConfig.subqgSize, subqgBaseEnergy: myraConfig.subqgBaseEnergy, subqgCoupling: myraConfig.subqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.subqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.subqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.subqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.subqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.subqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.subqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.subqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.subqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.subqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.subqgPhaseDiffusionFactor, rngType: myraConfig.rngType, subqgSeed: myraConfig.subqgSeed, nodeActivationDecay: myraConfig.nodeActivationDecay, emotionDecay: myraConfig.emotionDecay, adaptiveFitnessUpdateInterval: myraConfig.adaptiveFitnessUpdateInterval };
                agentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig;
                agentAIConfig = myraConfig.myraAIProviderConfig;
                agentPersonaConfig = getMyraResolvedPersonaConfig();
            } else if (agentId === 'caelum') {
                agentSystemConfig = { subqgSize: myraConfig.caelumSubqgSize, subqgBaseEnergy: myraConfig.caelumSubqgBaseEnergy, subqgCoupling: myraConfig.caelumSubqgCoupling, subqgInitialEnergyNoiseStd: myraConfig.caelumSubqgInitialEnergyNoiseStd, subqgPhaseEnergyCouplingFactor: myraConfig.caelumSubqgPhaseEnergyCouplingFactor, subqgJumpMinEnergyAtPeak: myraConfig.caelumSubqgJumpMinEnergyAtPeak, subqgJumpMinCoherenceAtPeak: myraConfig.caelumSubqgJumpMinCoherenceAtPeak, subqgJumpCoherenceDropFactor: myraConfig.caelumSubqgJumpCoherenceDropFactor, subqgJumpEnergyDropFactorFromPeak: myraConfig.caelumSubqgJumpEnergyDropFactorFromPeak, subqgJumpMaxStepsToTrackPeak: myraConfig.caelumSubqgJumpMaxStepsToTrackPeak, subqgJumpActiveDuration: myraConfig.caelumSubqgJumpActiveDuration, subqgJumpQnsDirectModifierStrength: myraConfig.caelumSubqgJumpQnsDirectModifierStrength, subqgPhaseDiffusionFactor: myraConfig.caelumSubqgPhaseDiffusionFactor, rngType: myraConfig.caelumRngType, subqgSeed: myraConfig.caelumSubqgSeed, nodeActivationDecay: myraConfig.caelumNodeActivationDecay, emotionDecay: myraConfig.caelumEmotionDecay, adaptiveFitnessUpdateInterval: myraConfig.caelumAdaptiveFitnessUpdateInterval };
                agentAdaptiveFitnessConfig = myraConfig.adaptiveFitnessConfig; // Caelum uses global AF config
                agentAIConfig = myraConfig.caelumAIProviderConfig;
                agentPersonaConfig = getCaelumResolvedPersonaConfig();
            } else {
                const configurableAgent = myraConfig.configurableAgents.find(a => a.id === agentId);
                if (!configurableAgent) {
                    console.warn(`Configurable agent ${agentId} not found. Skipping turn.`);
                    continue;
                }
                agentSystemConfig = configurableAgent.systemConfig;
                agentAdaptiveFitnessConfig = configurableAgent.adaptiveFitnessConfig;
                agentAIConfig = configurableAgent.aiProviderConfig;
                agentPersonaConfig = getConfigurableAgentResolvedPersonaConfig(agentId);
            }
            
            if (!currentAgentRuntimeState) { console.error(`Runtime state for ${agentId} not found!`); continue; }
            
            const nextAgentRuntimeState = simulateAgentStepInternal(agentId, agentSystemConfig, agentAdaptiveFitnessConfig, currentAgentRuntimeState, myraConfig);
            setAgentRuntimeStates(prev => ({ ...prev, [agentId]: nextAgentRuntimeState }));
            
            const baseInstruction = getAgentBaseSystemInstruction(agentId, nextAgentRuntimeState); // Use the directly returned state
            
            const response = await callAiApi(currentTurnPrompt, myraConfig, agentAIConfig, conversationHistoryForApi, baseInstruction, agentPersonaConfig, t);
            const aiMessage: ChatMessage = { id: uuidv4(), role: 'assistant', content: response.text, timestamp: Date.now(), speakerId: agentId, speakerName: agentPersonaConfig?.name };
            
            setMultiAgentConversationHistory(prev => [...prev, aiMessage]);
            conversationHistoryForApi = [...conversationHistoryForApi, aiMessage]; // Add AI's response for next turn's history
            currentTurnPrompt = response.text; // Next agent responds to this

            if (round < roundsPerAgent - 1 || selectedAgentIds.indexOf(agentId) < selectedAgentIds.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500)); 
            }
        }
    }
    setIsMultiAgentConversationLoading(false);
  }, [myraConfig, agentRuntimeStates, simulateAgentStepInternal, getAgentBaseSystemInstruction, getMyraResolvedPersonaConfig, getCaelumResolvedPersonaConfig, getConfigurableAgentResolvedPersonaConfig, t]);


  return {
    myraConfig, t, language, theme,
    chatHistory, isLoading, generateActiveAgentChatResponse,
    emotionState, nodeStates, subQgMatrix, subQgPhaseMatrix, adaptiveFitness, subQgGlobalMetrics, subQgJumpInfo, simulationStep, activeSubQgJumpModifier, subQgJumpModifierActiveStepsRemaining, myraStressLevel, padHistoryMyra,
    emotionStateCaelum, nodeStatesCaelum, subQgMatrixCaelum, subQgPhaseMatrixCaelum, adaptiveFitnessCaelum, subQgGlobalMetricsCaelum, subQgJumpInfoCaelum, simulationStepCaelum, activeSubQgJumpModifierCaelum, subQgJumpModifierActiveStepsRemainingCaelum, caelumStressLevel, padHistoryCaelum,
    injectSubQgStimulus, injectSubQgStimulusCaelum, injectSubQgStimulusForAgent,
    updateMyraConfig,
    processedTextChunks, loadAndProcessFile, clearAllKnowledge, isLoadingKnowledge,
    dualConversationHistory, isDualConversationLoading, startDualConversation,
    multiAgentConversationHistory, isMultiAgentConversationLoading, startMultiAgentConversation,
    agentRuntimeStates, inspectedAgentId, setInspectedAgentId,
  };
};
