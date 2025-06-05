
import { MyraConfig, EmotionState, NodeState, AdaptiveFitnessState, SubQgGlobalMetrics, RNGType, AdaptiveFitnessConfig, AIProviderConfig, Language, Theme } from './types';

export const INITIAL_ADAPTIVE_FITNESS_CONFIG: AdaptiveFitnessConfig = {
  baseMetricWeights: {
    coherenceProxy: 0.15,
    networkComplexityProxy: 0.05,
    averageResonatorScore: 0.15,
    goalAchievementProxy: 0.15,
    explorationScore: 0.15,
    focusScore: 0.10,
    creativityScore: 0.05,
    conflictPenaltyFactor: -0.10,
  },
  dimensionContribWeights: {
    knowledgeExpansion: {
      learningEfficiency: 0.5,
      explorationScore: 0.5,
    },
    internalCoherence: {
      coherenceProxy: 0.6,
      averageResonatorScore: 0.2,
    },
    expressiveCreativity: {
      creativityScore: 0.5,
      creativusActivation: 0.3,
      explorationScore: 0.2,
    },
    goalFocus: {
      goalAchievementProxy: 0.6,
      focusScore: 0.4,
    },
  },
};

const DEFAULT_MYRA_AI_CONFIG: AIProviderConfig = {
  aiProvider: 'gemini',
  geminiModelName: 'gemini-2.5-flash-preview-04-17',
  lmStudioBaseUrl: 'http://localhost:1234/v1',
  lmStudioGenerationModel: 'google/gemma-3-1b',
  lmStudioEmbeddingModel: 'text-embedding-nomic-embed-text-v1.5',
  temperatureBase: 0.7,
};

const DEFAULT_CAELUM_AI_CONFIG: AIProviderConfig = {
  aiProvider: 'gemini',
  geminiModelName: 'gemini-2.5-flash-preview-04-17',
  lmStudioBaseUrl: 'http://localhost:1234/v1',
  lmStudioGenerationModel: 'NousResearch/Nous-Hermes-2-Mistral-7B-DPO',
  lmStudioEmbeddingModel: 'text-embedding-nomic-embed-text-v1.5',
  temperatureBase: 0.5,
};


export const INITIAL_CONFIG: MyraConfig = {
  language: 'de' as Language,
  theme: 'nebula' as Theme,

  myraNameKey: "myra.name",
  userNameKey: "user.name", 
  myraRoleDescriptionKey: "myra.roleDescription",
  myraEthicsPrinciplesKey: "myra.ethicsPrinciples",
  myraResponseInstructionKey: "myra.responseInstruction",
  
  caelumNameKey: "caelum.name",
  caelumRoleDescriptionKey: "caelum.roleDescription",
  caelumEthicsPrinciplesKey: "caelum.ethicsPrinciples",
  caelumResponseInstructionKey: "caelum.responseInstruction",

  myraName: "", // Will be populated by populateTranslatedFields
  userName: "", // Will be populated by populateTranslatedFields
  myraRoleDescription: "", // Will be populated by populateTranslatedFields
  myraEthicsPrinciples: "", // Will be populated by populateTranslatedFields
  myraResponseInstruction: "", // Will be populated by populateTranslatedFields
  caelumName: "", // Will be populated by populateTranslatedFields
  caelumRoleDescription: "", // Will be populated by populateTranslatedFields
  caelumEthicsPrinciples: "", // Will be populated by populateTranslatedFields
  caelumResponseInstruction: "", // Will be populated by populateTranslatedFields

  myraAIProviderConfig: DEFAULT_MYRA_AI_CONFIG,
  caelumAIProviderConfig: DEFAULT_CAELUM_AI_CONFIG,

  subqgSize: 16,
  subqgBaseEnergy: 0.01,
  subqgCoupling: 0.015,
  subqgInitialEnergyNoiseStd: 0.001,
  subqgPhaseEnergyCouplingFactor: 0.1,
  subqgJumpMinEnergyAtPeak: 0.03,
  subqgJumpMinCoherenceAtPeak: 0.75,
  subqgJumpCoherenceDropFactor: 0.1,
  subqgJumpEnergyDropFactorFromPeak: 0.05,
  subqgJumpMaxStepsToTrackPeak: 5,
  subqgJumpActiveDuration: 3,
  subqgJumpQnsDirectModifierStrength: 0.5,
  subqgPhaseDiffusionFactor: 0.05,
  rngType: 'subqg' as RNGType,
  subqgSeed: undefined,
  nodeActivationDecay: 0.95,
  emotionDecay: 0.95,
  adaptiveFitnessUpdateInterval: 3,

  caelumSubqgSize: 12,
  caelumSubqgBaseEnergy: 0.005,
  caelumSubqgCoupling: 0.020,
  caelumSubqgInitialEnergyNoiseStd: 0.0005,
  caelumSubqgPhaseEnergyCouplingFactor: 0.05,
  caelumSubqgJumpMinEnergyAtPeak: 0.025,
  caelumSubqgJumpMinCoherenceAtPeak: 0.80,
  caelumSubqgJumpCoherenceDropFactor: 0.08,
  caelumSubqgJumpEnergyDropFactorFromPeak: 0.04,
  caelumSubqgJumpMaxStepsToTrackPeak: 4,
  caelumSubqgJumpActiveDuration: 2,
  caelumSubqgJumpQnsDirectModifierStrength: 0.3,
  caelumSubqgPhaseDiffusionFactor: 0.07,
  caelumRngType: 'subqg' as RNGType,
  caelumSubqgSeed: 12345,
  caelumNodeActivationDecay: 0.97,
  caelumEmotionDecay: 0.98,
  caelumAdaptiveFitnessUpdateInterval: 5,

  activeChatAgent: 'myra' as const, // New field
  maxHistoryMessagesForPrompt: 8,
  temperatureLimbusInfluence: 0.1,
  temperatureCreativusInfluence: 0.15,

  ragChunkSize: 500,
  ragChunkOverlap: 50,
  ragMaxChunksToRetrieve: 3,

  adaptiveFitnessConfig: INITIAL_ADAPTIVE_FITNESS_CONFIG,
  maxPadHistorySize: 200,
};

export const INITIAL_EMOTION_STATE: EmotionState = {
  pleasure: 0.0,
  arousal: 0.0,
  dominance: 0.0,
  anger: 0.0,
  disgust: 0.0,
  fear: 0.0,
  greed: 0.0,
};

export const INITIAL_CAELUM_EMOTION_STATE: EmotionState = {
  pleasure: 0.0,
  arousal: -0.1,
  dominance: 0.1,
  anger: 0.0,
  disgust: 0.0,
  fear: 0.0,
  greed: 0.0,
};

export const INITIAL_NODE_STATES: NodeState[] = [
  { id: 'LimbusAffektus_Myra', label: 'Limbus Affektus (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'limbus', specificState: INITIAL_EMOTION_STATE },
  { id: 'Creativus_Myra', label: 'Creativus (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'creativus' },
  { id: 'CortexCriticus_Myra', label: 'Cortex Criticus (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'criticus' },
  { id: 'MetaCognitio_Myra', label: 'MetaCognitio (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'metacognitio', specificState: { lastTotalJumps: 0 } },
  { id: 'SocialCognitor_Myra', label: 'Social Cognitor (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'social', specificState: { empathyLevel: 0.5 } },
  { id: 'ValuationSystem_Myra', label: 'Valuation System (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'valuation', specificState: { valuationScore: 0.0 } },
  { id: 'ConflictMonitor_Myra', label: 'Conflict Monitor (M)', activation: 0.2, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'conflict', specificState: { conflictLevel: 0.2 } },
  { id: 'ExecutiveControl_Myra', label: 'Executive Control (M)', activation: 0.6, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'executive', specificState: { impulseControlLevel: 0.6 } },
  { id: 'Concept_AI_Myra', label: 'Concept: AI (M)', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
  { id: 'Concept_Ethics_Myra', label: 'Concept: Ethics (M)', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
  { id: 'Concept_Art_Myra', label: 'Concept: Art (M)', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
];

export const INITIAL_CAELUM_NODE_STATES: NodeState[] = [
  { id: 'LimbusAffektus_Caelum', label: 'Limbus Affektus (C)', activation: 0.2, resonatorScore: 0.6, focusScore: 0.1, explorationScore: 0.1, type: 'limbus', specificState: INITIAL_CAELUM_EMOTION_STATE },
  { id: 'Creativus_Caelum', label: 'Pattern Analyzer (C)', activation: 0.3, resonatorScore: 0.4, focusScore: 0.2, explorationScore: 0.2, type: 'creativus' },
  { id: 'CortexCriticus_Caelum', label: 'Logic Verifier (C)', activation: 0.7, resonatorScore: 0.7, focusScore: 0.3, explorationScore: 0.1, type: 'criticus' },
  { id: 'MetaCognitio_Caelum', label: 'System Monitor (C)', activation: 0.6, resonatorScore: 0.5, focusScore: 0.1, explorationScore: 0.1, type: 'metacognitio', specificState: { lastTotalJumps: 0 } },
  { id: 'SocialCognitor_Caelum', label: 'Information Assimilator (C)', activation: 0.3, resonatorScore: 0.4, focusScore: 0.1, explorationScore: 0.2, type: 'social', specificState: { empathyLevel: 0.1 } },
  { id: 'ValuationSystem_Caelum', label: 'Priority Assessor (C)', activation: 0.4, resonatorScore: 0.5, focusScore: 0.2, explorationScore: 0.1, type: 'valuation', specificState: { valuationScore: 0.1 } },
  { id: 'ConflictMonitor_Caelum', label: 'Anomaly Detector (C)', activation: 0.1, resonatorScore: 0.4, focusScore: 0.1, explorationScore: 0.1, type: 'conflict', specificState: { conflictLevel: 0.1 } },
  { id: 'ExecutiveControl_Caelum', label: 'Process Sequencer (C)', activation: 0.7, resonatorScore: 0.6, focusScore: 0.2, explorationScore: 0.1, type: 'executive', specificState: { impulseControlLevel: 0.8 } },
  { id: 'Concept_Logic_Caelum', label: 'Concept: Logic (C)', activation: 0.3, resonatorScore: 0.6, focusScore: 0.2, explorationScore: 0.1, type: 'semantic' },
  { id: 'Concept_Systems_Caelum', label: 'Concept: Systems (C)', activation: 0.3, resonatorScore: 0.6, focusScore: 0.2, explorationScore: 0.1, type: 'semantic' },
  { id: 'Concept_Emergence_Caelum', label: 'Concept: Emergence (C)', activation: 0.2, resonatorScore: 0.5, focusScore: 0.1, explorationScore: 0.1, type: 'semantic' },
];


export const INITIAL_ADAPTIVE_FITNESS_STATE: AdaptiveFitnessState = {
  overallScore: 0.5,
  dimensions: {
    knowledgeExpansion: 0.5,
    internalCoherence: 0.5,
    expressiveCreativity: 0.5,
    goalFocus: 0.5,
  },
  metrics: {},
};

export const INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE: AdaptiveFitnessState = {
  overallScore: 0.6,
  dimensions: {
    knowledgeExpansion: 0.4,
    internalCoherence: 0.7,
    expressiveCreativity: 0.3,
    goalFocus: 0.6,
  },
  metrics: {},
};

export const INITIAL_SUBQG_GLOBAL_METRICS: SubQgGlobalMetrics = {
  avgEnergy: INITIAL_CONFIG.subqgBaseEnergy,
  stdEnergy: 0,
  phaseCoherence: 0,
};

export const INITIAL_CAELUM_SUBQG_GLOBAL_METRICS: SubQgGlobalMetrics = {
  avgEnergy: INITIAL_CONFIG.caelumSubqgBaseEnergy,
  stdEnergy: 0,
  phaseCoherence: 0.1,
};
