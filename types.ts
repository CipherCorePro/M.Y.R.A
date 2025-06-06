
import type { RNG, RNGType } from './utils/rng'; // Import RNGType
import { AdaptiveFitnessManager } from './utils/adaptiveFitnessManager';

export { RNGType }; // Re-export RNGType for convenience

export type Language = 'en' | 'de';
export type Theme = 'nebula' | 'biosphere' | 'matrix';

export interface TranslationSet {
  [key: string]: string | TranslationSet;
}

export interface Translations {
  en: TranslationSet;
  de: TranslationSet;
}

export interface InternationalizedPersona {
  name: string;
  roleDescription: string;
  ethicsPrinciples: string;
  responseInstruction: string;
}

export interface AdaptiveFitnessMetricWeights {
  coherenceProxy: number;
  networkComplexityProxy: number;
  averageResonatorScore: number;
  goalAchievementProxy: number;
  explorationScore: number;
  focusScore: number;
  creativityScore: number;
  conflictPenaltyFactor: number;
}

export interface AdaptiveFitnessDimensionWeights {
  knowledgeExpansion: {
    learningEfficiency: number;
    explorationScore: number;
  };
  internalCoherence: {
    coherenceProxy: number;
    averageResonatorScore: number;
  };
  expressiveCreativity: {
    creativityScore: number;
    creativusActivation: number;
    explorationScore: number;
  };
  goalFocus: {
    goalAchievementProxy: number;
    focusScore: number;
  };
}

export interface AdaptiveFitnessConfig {
  baseMetricWeights: AdaptiveFitnessMetricWeights;
  dimensionContribWeights: AdaptiveFitnessDimensionWeights;
}

export interface AIProviderConfig {
  aiProvider: 'gemini' | 'lmstudio';
  geminiModelName: string;
  lmStudioBaseUrl: string;
  lmStudioGenerationModel: string;
  lmStudioEmbeddingModel: string;
  temperatureBase: number;
}

export interface AgentSystemCoreConfig {
  subqgSize: number;
  subqgBaseEnergy: number;
  subqgCoupling: number;
  subqgInitialEnergyNoiseStd: number;
  subqgPhaseEnergyCouplingFactor: number;
  subqgJumpMinEnergyAtPeak: number;
  subqgJumpMinCoherenceAtPeak: number;
  subqgJumpCoherenceDropFactor: number;
  subqgJumpEnergyDropFactorFromPeak: number;
  subqgJumpMaxStepsToTrackPeak: number;
  subqgJumpActiveDuration: number;
  subqgJumpQnsDirectModifierStrength: number;
  subqgPhaseDiffusionFactor: number;
  rngType: RNGType;
  subqgSeed?: number;
  nodeActivationDecay: number;
  emotionDecay: number;
  adaptiveFitnessUpdateInterval: number; 
}

export interface ConfigurableAgentPersona {
  id: string; 
  name: string;
  roleDescription: string;
  ethicsPrinciples: string;
  responseInstruction: string;
  personalityTrait?: 'critical' | 'visionary' | 'conservative' | 'neutral';
  aiProviderConfig: AIProviderConfig;
  systemConfig: AgentSystemCoreConfig; // Each agent has its own full system config
  adaptiveFitnessConfig: AdaptiveFitnessConfig; // Each agent has its own adaptive fitness config
  // Initial node states can be defined per agent if desired, or a default set can be used.
  // initialNodeStates?: NodeState[]; 
}

export interface MyraConfig {
  language: Language;
  theme: Theme;

  myraNameKey: string; 
  userNameKey: string; 
  myraRoleDescriptionKey: string;
  myraEthicsPrinciplesKey: string;
  myraResponseInstructionKey: string;
  
  caelumNameKey: string;
  caelumRoleDescriptionKey: string;
  caelumEthicsPrinciplesKey: string;
  caelumResponseInstructionKey: string;
  
  myraName: string;
  userName: string;
  myraRoleDescription: string;
  myraEthicsPrinciples: string;
  myraResponseInstruction: string;
  
  caelumName: string;
  caelumRoleDescription: string;
  caelumEthicsPrinciples: string;
  caelumResponseInstruction: string;

  myraAIProviderConfig: AIProviderConfig;
  caelumAIProviderConfig: AIProviderConfig;

  configurableAgents: ConfigurableAgentPersona[];

  // M.Y.R.A. System Config (directly mapped from AgentSystemCoreConfig structure)
  subqgSize: number;
  subqgBaseEnergy: number;
  subqgCoupling: number;
  subqgInitialEnergyNoiseStd: number;
  subqgPhaseEnergyCouplingFactor: number;
  subqgJumpMinEnergyAtPeak: number;
  subqgJumpMinCoherenceAtPeak: number;
  subqgJumpCoherenceDropFactor: number;
  subqgJumpEnergyDropFactorFromPeak: number;
  subqgJumpMaxStepsToTrackPeak: number;
  subqgJumpActiveDuration: number;
  subqgJumpQnsDirectModifierStrength: number;
  subqgPhaseDiffusionFactor: number;
  rngType: RNGType;
  subqgSeed?: number;
  nodeActivationDecay: number;
  emotionDecay: number;
  adaptiveFitnessUpdateInterval: number;

  // C.A.E.L.U.M. System Config (directly mapped from AgentSystemCoreConfig structure)
  caelumSubqgSize: number;
  caelumSubqgBaseEnergy: number;
  caelumSubqgCoupling: number;
  caelumSubqgInitialEnergyNoiseStd: number;
  caelumSubqgPhaseEnergyCouplingFactor: number;
  caelumSubqgJumpMinEnergyAtPeak: number;
  caelumSubqgJumpMinCoherenceAtPeak: number;
  caelumSubqgJumpCoherenceDropFactor: number;
  caelumSubqgJumpEnergyDropFactorFromPeak: number;
  caelumSubqgJumpMaxStepsToTrackPeak: number;
  caelumSubqgJumpActiveDuration: number;
  caelumSubqgJumpQnsDirectModifierStrength: number;
  caelumSubqgPhaseDiffusionFactor: number;
  caelumRngType: RNGType;
  caelumSubqgSeed?: number;
  caelumNodeActivationDecay: number;
  caelumEmotionDecay: number;
  caelumAdaptiveFitnessUpdateInterval: number;

  // General System Config
  activeChatAgent: 'myra' | 'caelum';
  maxHistoryMessagesForPrompt: number;
  temperatureLimbusInfluence: number;
  temperatureCreativusInfluence: number;

  ragChunkSize: number;
  ragChunkOverlap: number;
  ragMaxChunksToRetrieve: number;

  adaptiveFitnessConfig: AdaptiveFitnessConfig; // This is M.Y.R.A.'s default if not overridden by agent
  maxPadHistorySize: number; 
}

export interface ResolvedSpeakerPersonaConfig {
  name: string;
  roleDescription: string;
  ethicsPrinciples: string;
  responseInstruction: string;
  personalityTrait?: ConfigurableAgentPersona['personalityTrait'];
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system'; 
  speakerName?: string; 
  speakerId?: 'user' | 'myra' | 'caelum' | string; // string for configurable agent IDs
  content: string;
  timestamp: number;
  retrievedChunks?: { source: string; text: string }[];
}

export interface EmotionState {
  pleasure: number;
  arousal: number;
  dominance: number;
  anger: number;
  disgust: number;
  fear: number;
  greed: number;
}

export interface NodeState {
  id: string;
  label: string; 
  activation: number;
  resonatorScore: number;
  focusScore: number;
  explorationScore: number;
  type: 'semantic' | 'limbus' | 'creativus' | 'criticus' | 'metacognitio' | 'social' | 'valuation' | 'conflict' | 'executive';
  specificState?: any;
}

export interface SubQgGlobalMetrics {
  avgEnergy: number;
  stdEnergy: number;
  phaseCoherence: number;
}

export interface SubQgJumpInfo {
  type: string;
  peakEnergyBeforeDecay?: number;
  peakCoherenceBeforeDecay?: number;
  currentEnergyAtDecayDetection?: number;
  currentCoherenceAtDecayDetection?: number;
  reasonForDecayDetection?: string;
  stepsFromPeakToDecay?: number;
  timestamp: number;
}

export interface AdaptiveFitnessState {
  overallScore: number;
  dimensions: {
    knowledgeExpansion: number;
    internalCoherence: number;
    expressiveCreativity: number;
    goalFocus: number;
  };
  metrics?: Partial<AdaptiveFitnessMetricWeights> & { [key: string]: number };
}

export interface AgentRuntimeState {
  id: string;
  subQgMatrix: number[][];
  subQgPhaseMatrix: number[][];
  nodeStates: Record<string, NodeState>;
  emotionState: EmotionState;
  adaptiveFitness: AdaptiveFitnessState;
  subQgGlobalMetrics: SubQgGlobalMetrics;
  subQgJumpInfo: SubQgJumpInfo | null;
  simulationStep: number;
  activeSubQgJumpModifier: number;
  subQgJumpModifierActiveStepsRemaining: number;
  stressLevel: number;
  padHistory: PADRecord[];
  rng: RNG;
  subQgPeakTracker: { tracking: boolean; peakEnergy: number; peakCoherence: number; stepsSincePeak: number; } | null;
  adaptiveFitnessManager: AdaptiveFitnessManager;
}


export interface GeminiSafetyRating {
  category?: string;
  probability: string;
}

export interface GeminiCandidate {
  content: {
    parts: Array<{text: string}>;
    role: string;
  };
  finishReason?: string;
  safetyRatings?: GeminiSafetyRating[];
  groundingMetadata?: {
    groundingChunks?: Array<{web: {uri: string, title: string}}>;
  };
}

export interface GeminiGenerateContentResponse {
  text: string;
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: GeminiSafetyRating[];
  };
}

export interface LMStudioChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LMStudioResponseChoice {
  index: number;
  message: LMStudioChatMessage;
  finish_reason: string;
}

export interface LMStudioResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: LMStudioResponseChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ApiKeyManager {
  getApiKey: () => string | null;
  setApiKey: (key: string) => void;
  isKeySet: () => boolean;
}

export interface TextChunk {
  id: string;
  source: string;
  index: number;
  text: string;
}

export interface ConfigFieldBase {
  labelKey: string; 
  type: 'text' | 'number' | 'textarea' | 'select' | 'divider';
  options?: { value: string; labelKey: string }[]; 
  step?: number;
  min?: number;
  max?: number;
  rows?: number;
  condition?: (config: MyraConfig, agentConfig?: ConfigurableAgentPersona) => boolean; 
  groupKey: string; 
  placeholderKey?: string;
}

type MyraSpecificSystemConfigKeys = Omit<MyraConfig,
  'language' | 'theme' |
  'adaptiveFitnessConfig' | 
  'myraAIProviderConfig' |
  'caelumAIProviderConfig' |
  'configurableAgents' | 
  'myraNameKey' | 'myraRoleDescriptionKey' | 'myraEthicsPrinciplesKey' | 'myraResponseInstructionKey' | 'userNameKey' |
  'caelumNameKey' | 'caelumRoleDescriptionKey' | 'caelumEthicsPrinciplesKey' | 'caelumResponseInstructionKey' |
  'myraName' | 'myraRoleDescription' | 'myraEthicsPrinciples' | 'myraResponseInstruction' | 'userName' |
  'caelumName' | 'caelumRoleDescription' | 'caelumEthicsPrinciples' | 'caelumResponseInstruction' |
  'caelumSubqgSize' | 'caelumSubqgBaseEnergy' | 'caelumSubqgCoupling' | 'caelumSubqgInitialEnergyNoiseStd' |
  'caelumSubqgPhaseEnergyCouplingFactor' | 'caelumSubqgJumpMinEnergyAtPeak' | 'caelumSubqgJumpMinCoherenceAtPeak' |
  'caelumSubqgJumpCoherenceDropFactor' | 'caelumSubqgJumpEnergyDropFactorFromPeak' | 'caelumSubqgJumpMaxStepsToTrackPeak' |
  'caelumSubqgJumpActiveDuration' | 'caelumSubqgJumpQnsDirectModifierStrength' | 'caelumSubqgPhaseDiffusionFactor' |
  'caelumRngType' | 'caelumSubqgSeed' | 'caelumNodeActivationDecay' | 'caelumEmotionDecay' |
  'caelumAdaptiveFitnessUpdateInterval' |
  'maxPadHistorySize' | 'activeChatAgent' 
>;

export interface MyraSystemConfigField extends ConfigFieldBase {
  key: keyof MyraSpecificSystemConfigKeys;
}

export interface MyraPersonaEditableField extends ConfigFieldBase {
    key: 'myraName' | 'myraRoleDescription' | 'myraEthicsPrinciples' | 'myraResponseInstruction' | 'userName';
}

export interface CaelumPersonaEditableField extends ConfigFieldBase {
    key: 'caelumName' | 'caelumRoleDescription' | 'caelumEthicsPrinciples' | 'caelumResponseInstruction';
}

export interface LocalizationConfigField extends ConfigFieldBase {
    key: 'language' | 'theme';
}

export interface GeneralSystemConfigField extends ConfigFieldBase {
  key: 'maxHistoryMessagesForPrompt' | 'temperatureLimbusInfluence' | 'temperatureCreativusInfluence' |
       'ragChunkSize' | 'ragChunkOverlap' | 'ragMaxChunksToRetrieve' | 'maxPadHistorySize' | 'activeChatAgent';
}

export interface CaelumSystemConfigField extends ConfigFieldBase {
  key: 'caelumSubqgSize' | 'caelumSubqgBaseEnergy' | 'caelumSubqgCoupling' | 'caelumSubqgInitialEnergyNoiseStd' |
       'caelumSubqgPhaseEnergyCouplingFactor' | 'caelumSubqgJumpMinEnergyAtPeak' | 'caelumSubqgJumpMinCoherenceAtPeak' |
       'caelumSubqgJumpCoherenceDropFactor' | 'caelumSubqgJumpEnergyDropFactorFromPeak' | 'caelumSubqgJumpMaxStepsToTrackPeak' |
       'caelumSubqgJumpActiveDuration' | 'caelumSubqgJumpQnsDirectModifierStrength' | 'caelumSubqgPhaseDiffusionFactor' |
       'caelumRngType' | 'caelumSubqgSeed' | 'caelumNodeActivationDecay' | 'caelumEmotionDecay' |
       'caelumAdaptiveFitnessUpdateInterval';
}

export interface MyraAIProviderConfigField extends ConfigFieldBase {
    key: keyof AIProviderConfig;
    parentKey: 'myraAIProviderConfig';
}
export interface CaelumAIProviderConfigField extends ConfigFieldBase {
    key: keyof AIProviderConfig;
    parentKey: 'caelumAIProviderConfig';
}
export interface MyraAdaptiveFitnessBaseWeightsField extends ConfigFieldBase {
  key: keyof AdaptiveFitnessMetricWeights;
  parentKey: 'adaptiveFitnessConfig'; 
  subKey: 'baseMetricWeights';
}
export interface MyraAdaptiveFitnessDimensionSubField extends ConfigFieldBase {
    key: string; 
    originalMetricKey: string; 
    parentKey: 'adaptiveFitnessConfig'; 
    subKey: keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights']; 
    subSubKey: 'dimensionContribWeights'; 
}

export interface AgentSpecificPersonaField extends ConfigFieldBase {
    agentId: string;
    configPath: ['configurableAgents', number, keyof Omit<ConfigurableAgentPersona, 'id' | 'aiProviderConfig' | 'systemConfig' | 'adaptiveFitnessConfig'>];
}
export interface AgentSpecificAIProviderField extends ConfigFieldBase {
    agentId: string;
    configPath: ['configurableAgents', number, 'aiProviderConfig', keyof AIProviderConfig];
}
export interface AgentSpecificSystemConfigField extends ConfigFieldBase {
    agentId: string;
    configPath: ['configurableAgents', number, 'systemConfig', keyof AgentSystemCoreConfig];
}
export interface AgentSpecificAdaptiveFitnessBaseField extends ConfigFieldBase {
    agentId: string;
    configPath: ['configurableAgents', number, 'adaptiveFitnessConfig', 'baseMetricWeights', keyof AdaptiveFitnessMetricWeights];
}
export interface AgentSpecificAdaptiveFitnessDimensionField extends ConfigFieldBase {
    agentId: string;
    originalMetricKey: string; 
    configPath: ['configurableAgents', number, 'adaptiveFitnessConfig', 'dimensionContribWeights', keyof AdaptiveFitnessDimensionWeights, keyof AdaptiveFitnessDimensionWeights[keyof AdaptiveFitnessDimensionWeights]];
}

export type ConfigField =
  | MyraSystemConfigField
  | MyraPersonaEditableField      
  | CaelumPersonaEditableField    
  | CaelumSystemConfigField
  | MyraAIProviderConfigField
  | CaelumAIProviderConfigField
  | MyraAdaptiveFitnessBaseWeightsField
  | MyraAdaptiveFitnessDimensionSubField
  | LocalizationConfigField
  | GeneralSystemConfigField
  | AgentSpecificPersonaField
  | AgentSpecificAIProviderField
  | AgentSpecificSystemConfigField
  | AgentSpecificAdaptiveFitnessBaseField
  | AgentSpecificAdaptiveFitnessDimensionField;

export interface PADRecord {
  pleasure: number;
  arousal: number;
  dominance: number;
  timestamp: number;
  dominantAffect: string;
}

export type ActiveTab =
  | 'statusMyra' | 'nodesMyra' | 'subqgMyra'
  | 'statusCaelum' | 'nodesCaelum' | 'subqgCaelum'
  | 'knowledge' | 'dualAI' | 'settings' | 'emotionTimeline' | 'documentation'
  | 'multiAgentConversation';
  // Consider if an 'agentInspector' tab is needed or if existing tabs become agent-aware.
  // For now, the inspectedAgentId will be a separate state.

export type InspectedAgentID = 'myra' | 'caelum' | string; // string for configurable agent IDs
