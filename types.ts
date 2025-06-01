

import type { RNGType } from './utils/rng'; // Import RNGType

export { RNGType }; // Re-export RNGType for convenience

export interface AdaptiveFitnessMetricWeights {
  coherenceProxy: number;
  // learningEfficiency: number; // For future more detailed implementation
  networkComplexityProxy: number; // Simplified for now
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
    // inverseNetworkComplexity: number; // For future
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
  dimensionContribWeights: AdaptiveFitnessDimensionWeights; // How much each metric contributes to a dimension
  // adaptiveFitnessUpdateInterval: number; // Already in MyraConfig
  // Thresholds and adaptation factors can be added later
}


export interface MyraConfig {
  myraName: string;
  userName: string;
  myraRoleDescription: string;
  myraEthicsPrinciples: string;
  myraResponseInstruction: string;
  subqgSize: number;
  subqgBaseEnergy: number;
  subqgCoupling: number;
  subqgInitialEnergyNoiseStd: number; // This is the "Noise Level"
  subqgPhaseEnergyCouplingFactor: number;
  subqgJumpMinEnergyAtPeak: number;
  subqgJumpMinCoherenceAtPeak: number;
  subqgJumpCoherenceDropFactor: number;
  subqgJumpEnergyDropFactorFromPeak: number;
  subqgJumpMaxStepsToTrackPeak: number;
  subqgJumpActiveDuration: number;
  subqgJumpQnsDirectModifierStrength: number;
  // subqgEnergyDiffusionFactor: number; // Not currently implemented in simulateSubQgStep
  subqgPhaseDiffusionFactor: number; // Added this missing parameter
  
  rngType: RNGType;
  subqgSeed?: number; 

  aiProvider: 'gemini' | 'lmstudio';
  geminiModelName: string;
  
  lmStudioBaseUrl: string;
  lmStudioGenerationModel: string;
  lmStudioEmbeddingModel: string;

  maxHistoryMessagesForPrompt: number;
  nodeActivationDecay: number;
  emotionDecay: number;
  adaptiveFitnessUpdateInterval: number;
  temperatureBase: number;
  temperatureLimbusInfluence: number; 
  temperatureCreativusInfluence: number;

  // RAG and Knowledge Settings
  ragChunkSize: number;
  ragChunkOverlap: number;
  ragMaxChunksToRetrieve: number;

  // Adaptive Fitness Configuration
  adaptiveFitnessConfig: AdaptiveFitnessConfig;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
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
  // Optionally, store individual metrics if needed for display
  metrics?: Partial<AdaptiveFitnessMetricWeights> & { [key: string]: number };
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
  source: string; // Filename or source identifier
  index: number;  // Index of the chunk within its source
  text: string;
  // Future extensions:
  // activatedNodeLabels?: string[]; 
  // embedding?: number[];
}

// Types for SettingsPanel config fields
export interface ConfigFieldBase {
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  step?: number;
  min?: number;
  max?: number;
  rows?: number;
  condition?: (config: MyraConfig) => boolean;
  group: string;
  placeholder?: string;
}

export interface MyraConfigField extends ConfigFieldBase {
  key: keyof MyraConfig;
}

export interface AdaptiveFitnessBaseWeightsField extends ConfigFieldBase {
  key: keyof AdaptiveFitnessMetricWeights;
  parentKey: 'adaptiveFitnessConfig';
  subKey: 'baseMetricWeights';
}
export interface AdaptiveFitnessDimensionSubField extends ConfigFieldBase {
    key: string; 
    parentKey: 'adaptiveFitnessConfig';
    subKey: keyof MyraConfig['adaptiveFitnessConfig']['dimensionContribWeights']; 
    subSubKey: 'dimensionContribWeights'; 
}