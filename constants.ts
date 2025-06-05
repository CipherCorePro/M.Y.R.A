
import { 
    MyraConfig, EmotionState, NodeState, AdaptiveFitnessState, SubQgGlobalMetrics, RNGType, 
    AdaptiveFitnessConfig, AIProviderConfig, Language, Theme, ConfigurableAgentPersona, 
    AgentSystemCoreConfig, AgentRuntimeState, PADRecord 
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { RNG, SubQGRNG, QuantumRNG } from './utils/rng';
import { AdaptiveFitnessManager } from './utils/adaptiveFitnessManager'; // Ensure this is imported

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

const DEFAULT_MYRA_SYSTEM_CORE_CONFIG: AgentSystemCoreConfig = {
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
};

const DEFAULT_CAELUM_SYSTEM_CORE_CONFIG: AgentSystemCoreConfig = {
  subqgSize: 12,
  subqgBaseEnergy: 0.005,
  subqgCoupling: 0.020,
  subqgInitialEnergyNoiseStd: 0.0005,
  subqgPhaseEnergyCouplingFactor: 0.05,
  subqgJumpMinEnergyAtPeak: 0.025,
  subqgJumpMinCoherenceAtPeak: 0.80,
  subqgJumpCoherenceDropFactor: 0.08,
  subqgJumpEnergyDropFactorFromPeak: 0.04,
  subqgJumpMaxStepsToTrackPeak: 4,
  subqgJumpActiveDuration: 2,
  subqgJumpQnsDirectModifierStrength: 0.3,
  subqgPhaseDiffusionFactor: 0.07,
  rngType: 'subqg' as RNGType,
  subqgSeed: 12345, 
  nodeActivationDecay: 0.97,
  emotionDecay: 0.98,
  adaptiveFitnessUpdateInterval: 5,
};

export const INITIAL_EMOTION_STATE: EmotionState = {
  pleasure: 0.0, arousal: 0.0, dominance: 0.0,
  anger: 0.0, disgust: 0.0, fear: 0.0, greed: 0.0,
};

export const INITIAL_CAELUM_EMOTION_STATE: EmotionState = {
  pleasure: 0.0, arousal: -0.1, dominance: 0.1,
  anger: 0.0, disgust: 0.0, fear: 0.0, greed: 0.0,
};

export const INITIAL_NODE_STATES: NodeState[] = [
  { id: 'LimbusAffektus_Myra', label: 'Limbus Affektus (M)', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'limbus', specificState: { ...INITIAL_EMOTION_STATE } },
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
  { id: 'LimbusAffektus_Caelum', label: 'Limbus Affektus (C)', activation: 0.2, resonatorScore: 0.6, focusScore: 0.1, explorationScore: 0.1, type: 'limbus', specificState: { ...INITIAL_CAELUM_EMOTION_STATE } },
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
  dimensions: { knowledgeExpansion: 0.5, internalCoherence: 0.5, expressiveCreativity: 0.5, goalFocus: 0.5 },
  metrics: {},
};

export const INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE: AdaptiveFitnessState = {
  overallScore: 0.6,
  dimensions: { knowledgeExpansion: 0.4, internalCoherence: 0.7, expressiveCreativity: 0.3, goalFocus: 0.6 },
  metrics: {},
};

export const INITIAL_SUBQG_GLOBAL_METRICS: SubQgGlobalMetrics = {
  avgEnergy: DEFAULT_MYRA_SYSTEM_CORE_CONFIG.subqgBaseEnergy, stdEnergy: 0, phaseCoherence: 0,
};

export const INITIAL_CAELUM_SUBQG_GLOBAL_METRICS: SubQgGlobalMetrics = {
  avgEnergy: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgBaseEnergy, stdEnergy: 0, phaseCoherence: 0.1,
};


// Helper to create initial runtime state for any agent
export const createInitialAgentRuntimeState = (
    agentId: string,
    systemConfig: AgentSystemCoreConfig,
    adaptiveFitnessConfig: AdaptiveFitnessConfig, // For the manager
    initialEmotionState: EmotionState = INITIAL_EMOTION_STATE,
    initialNodeStatesArray: NodeState[] = INITIAL_NODE_STATES, // Defaulting to M.Y.R.A.'s node structure
    globalMyraConfigForManager: MyraConfig // The full config for the manager
): AgentRuntimeState => {
    const nodeStatesRecord: Record<string, NodeState> = initialNodeStatesArray.reduce((acc, node) => {
        // Adapt node IDs to be unique for this agent if they are not already
        const newId = node.id.includes(agentId) ? node.id : `${node.id}_${agentId}`;
        acc[newId] = { ...node, id: newId, label: `${node.label.split(' (')[0]} (${agentId.substring(0,1).toUpperCase()})` }; // Short agent ID in label
        return acc;
    }, {} as Record<string, NodeState>);

    const getSystemStateSnapshot = () => ({
        nodes: nodeStatesRecord, // This will be updated by the simulation step later
        emotionState: initialEmotionState, // This will be updated
        subQgGlobalMetrics: { // Initial values
            avgEnergy: systemConfig.subqgBaseEnergy,
            stdEnergy: 0,
            phaseCoherence: 0,
        },
        processedTextChunksCount: 0, // Or fetch from a shared source if applicable
    });


    return {
        id: agentId,
        subQgMatrix: Array(systemConfig.subqgSize).fill(0).map(() => Array(systemConfig.subqgSize).fill(systemConfig.subqgBaseEnergy)),
        subQgPhaseMatrix: Array(systemConfig.subqgSize).fill(0).map(() => Array(systemConfig.subqgSize).fill(0).map(() => Math.random() * 2 * Math.PI)),
        nodeStates: nodeStatesRecord,
        emotionState: JSON.parse(JSON.stringify(initialEmotionState)),
        adaptiveFitness: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_STATE)),
        subQgGlobalMetrics: { avgEnergy: systemConfig.subqgBaseEnergy, stdEnergy: 0, phaseCoherence: 0 },
        subQgJumpInfo: null,
        simulationStep: 0,
        activeSubQgJumpModifier: 0,
        subQgJumpModifierActiveStepsRemaining: 0,
        stressLevel: 0,
        padHistory: [],
        rng: systemConfig.rngType === 'subqg' ? new SubQGRNG(systemConfig.subqgSeed) : new QuantumRNG(),
        subQgPeakTracker: null,
        adaptiveFitnessManager: new AdaptiveFitnessManager(
            // The manager needs the global config to access weights, but operates on agent-specific state via getSystemState
            { ...globalMyraConfigForManager, adaptiveFitnessConfig }, // Pass this agent's specific AF config
            getSystemStateSnapshot // Provide a way to get *this* agent's current state
        ),
    };
};


const DEFAULT_CONFIGURABLE_AGENTS: ConfigurableAgentPersona[] = [
  {
    id: uuidv4(),
    name: "Dr. Aris Thorne (Kritiker)",
    roleDescription: "Ein scharfsinniger Kritiker und Analyst...",
    ethicsPrinciples: "Objektivität, Strenge, Skepsis...",
    responseInstruction: "Analysiere die vorherigen Beiträge kritisch...",
    personalityTrait: "critical",
    aiProviderConfig: { ...DEFAULT_MYRA_AI_CONFIG, temperatureBase: 0.4 },
    systemConfig: { ...DEFAULT_MYRA_SYSTEM_CORE_CONFIG, subqgSize: 10, adaptiveFitnessUpdateInterval: 4, subqgSeed: 11111 },
    adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
  },
  {
    id: uuidv4(),
    name: "Lyra Meadowlight (Visionärin)",
    roleDescription: "Eine kreative Visionärin und Ideengeberin...",
    ethicsPrinciples: "Innovation, Fortschritt, positive Zukunftsgestaltung...",
    responseInstruction: "Entwickle basierend auf den vorherigen Beiträgen neue, visionäre Ideen...",
    personalityTrait: "visionary",
    aiProviderConfig: { ...DEFAULT_CAELUM_AI_CONFIG, temperatureBase: 0.9 },
    systemConfig: { ...DEFAULT_CAELUM_SYSTEM_CORE_CONFIG, subqgSize: 14, subqgCoupling: 0.025, adaptiveFitnessUpdateInterval: 3, subqgSeed: 22222 },
    adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
  },
  {
    id: uuidv4(),
    name: "Marcus Sterling (Konservativer)",
    roleDescription: "Ein pragmatischer und erfahrener Denker...",
    ethicsPrinciples: "Vorsicht, Verantwortung, Respekt vor Tradition...",
    responseInstruction: "Bewerte die Diskussion aus einer konservativen und pragmatischen Perspektive...",
    personalityTrait: "conservative",
    aiProviderConfig: { ...DEFAULT_MYRA_AI_CONFIG, temperatureBase: 0.5 },
    systemConfig: { ...DEFAULT_MYRA_SYSTEM_CORE_CONFIG, subqgJumpQnsDirectModifierStrength: 0.2, adaptiveFitnessUpdateInterval: 5, subqgSeed: 33333 },
    adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
  }
];


export const INITIAL_CONFIG: MyraConfig = {
  language: 'de' as Language,
  theme: 'nebula' as Theme,

  myraNameKey: "myra.name", userNameKey: "user.name", myraRoleDescriptionKey: "myra.roleDescription",
  myraEthicsPrinciplesKey: "myra.ethicsPrinciples", myraResponseInstructionKey: "myra.responseInstruction",
  caelumNameKey: "caelum.name", caelumRoleDescriptionKey: "caelum.roleDescription",
  caelumEthicsPrinciplesKey: "caelum.ethicsPrinciples", caelumResponseInstructionKey: "caelum.responseInstruction",

  myraName: "", userName: "", myraRoleDescription: "", myraEthicsPrinciples: "", myraResponseInstruction: "", 
  caelumName: "", caelumRoleDescription: "", caelumEthicsPrinciples: "", caelumResponseInstruction: "", 

  myraAIProviderConfig: DEFAULT_MYRA_AI_CONFIG,
  caelumAIProviderConfig: DEFAULT_CAELUM_AI_CONFIG,
  configurableAgents: DEFAULT_CONFIGURABLE_AGENTS,

  ...DEFAULT_MYRA_SYSTEM_CORE_CONFIG, // M.Y.R.A.'s system config

  caelumSubqgSize: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgSize,
  caelumSubqgBaseEnergy: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgBaseEnergy,
  caelumSubqgCoupling: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgCoupling,
  caelumSubqgInitialEnergyNoiseStd: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgInitialEnergyNoiseStd,
  caelumSubqgPhaseEnergyCouplingFactor: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgPhaseEnergyCouplingFactor,
  caelumSubqgJumpMinEnergyAtPeak: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpMinEnergyAtPeak,
  caelumSubqgJumpMinCoherenceAtPeak: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpMinCoherenceAtPeak,
  caelumSubqgJumpCoherenceDropFactor: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpCoherenceDropFactor,
  caelumSubqgJumpEnergyDropFactorFromPeak: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpEnergyDropFactorFromPeak,
  caelumSubqgJumpMaxStepsToTrackPeak: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpMaxStepsToTrackPeak,
  caelumSubqgJumpActiveDuration: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpActiveDuration,
  caelumSubqgJumpQnsDirectModifierStrength: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgJumpQnsDirectModifierStrength,
  caelumSubqgPhaseDiffusionFactor: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgPhaseDiffusionFactor,
  caelumRngType: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.rngType,
  caelumSubqgSeed: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.subqgSeed,
  caelumNodeActivationDecay: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.nodeActivationDecay,
  caelumEmotionDecay: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.emotionDecay,
  caelumAdaptiveFitnessUpdateInterval: DEFAULT_CAELUM_SYSTEM_CORE_CONFIG.adaptiveFitnessUpdateInterval,
  
  activeChatAgent: 'myra' as const,
  maxHistoryMessagesForPrompt: 8,
  temperatureLimbusInfluence: 0.1,
  temperatureCreativusInfluence: 0.15,
  ragChunkSize: 500, ragChunkOverlap: 50, ragMaxChunksToRetrieve: 3,
  adaptiveFitnessConfig: JSON.parse(JSON.stringify(INITIAL_ADAPTIVE_FITNESS_CONFIG)),
  maxPadHistorySize: 200,
};
