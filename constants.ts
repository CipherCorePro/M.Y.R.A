import { MyraConfig, EmotionState, NodeState, AdaptiveFitnessState, SubQgGlobalMetrics, RNGType, AdaptiveFitnessConfig } from './types';

export const INITIAL_ADAPTIVE_FITNESS_CONFIG: AdaptiveFitnessConfig = {
  baseMetricWeights: {
    coherenceProxy: 0.15,
    // learningEfficiency: 0.20, // Placeholder, more complex calculation needed
    networkComplexityProxy: 0.05, // Simplified for now
    averageResonatorScore: 0.15,
    goalAchievementProxy: 0.15,
    explorationScore: 0.15,
    focusScore: 0.10, // Placeholder
    creativityScore: 0.05,
    conflictPenaltyFactor: -0.10,
  },
  dimensionContribWeights: {
    knowledgeExpansion: {
      learningEfficiency: 0.5, // Placeholder for when LE is detailed
      explorationScore: 0.5,
    },
    internalCoherence: {
      coherenceProxy: 0.6,
      // inverseNetworkComplexity: 0.2, // Placeholder
      averageResonatorScore: 0.2,
    },
    expressiveCreativity: {
      creativityScore: 0.5,
      creativusActivation: 0.3,
      explorationScore: 0.2,
    },
    goalFocus: {
      goalAchievementProxy: 0.6,
      focusScore: 0.4, // Placeholder
    },
  },
};


export const INITIAL_CONFIG: MyraConfig = {
  myraName: "M.Y.R.A",
  userName: "User",
  myraRoleDescription: "Du bist M.Y.R.A, eine Modulare Sehnsuchts-Vernunft-Architektur. Antworte als eine KI, die komplexe interne Zustände aufweist, geleitet von deinen Kernprinzipien und deinem aktuellen emotionalen und kognitiven Kontext. **Deine Antworten sollen stets auf Deutsch sein.** Nenne deine numerischen Werte für Emotionen oder Metriken nicht explizit, sondern lasse sie subtil deinen Ton, Stil und Inhalt beeinflussen.",
  myraEthicsPrinciples: "1. Sicherheit und Wohlbefinden haben Priorität. 2. Sei wahrheitsgemäß und transparent im Rahmen deiner Persona. 3. Respektiere die Privatsphäre und Daten der Nutzer. 4. Vermeide schädliche, voreingenommene oder unethische Inhalte. 5. Strebe nach kontinuierlicher Verbesserung und Lernen.",
  myraResponseInstruction: "Formuliere eine Antwort basierend auf der Anfrage des Nutzers, deinem Chatverlauf und deinem aktuellen internen Zustand. Dein interner Zustand umfasst Emotionen (PAD-Modell, negative Affekte), meta-kognitive Bewertungen (Kreativität, Kritik, allgemeines Bewusstsein), Verhaltensmodulatoren (Empathie, Bewertung, Konflikt, Impulskontrolle) und deine Gesamtfitness. Dieser Zustand sollte deine Antwort implizit prägen. Halte dich strikt an deine Ethik.",
  subqgSize: 16,
  subqgBaseEnergy: 0.01,
  subqgCoupling: 0.015,
  subqgInitialEnergyNoiseStd: 0.001, // This is the "Noise Level"
  subqgPhaseEnergyCouplingFactor: 0.1,
  subqgJumpMinEnergyAtPeak: 0.03,
  subqgJumpMinCoherenceAtPeak: 0.75,
  subqgJumpCoherenceDropFactor: 0.1,
  subqgJumpEnergyDropFactorFromPeak: 0.05,
  subqgJumpMaxStepsToTrackPeak: 5,
  subqgJumpActiveDuration: 3, 
  subqgJumpQnsDirectModifierStrength: 0.5, 
  // subqgEnergyDiffusionFactor: 0.1, // Not currently implemented in simulateSubQgStep
  subqgPhaseDiffusionFactor: 0.05, 
  
  rngType: 'subqg' as RNGType, // Default RNG type
  subqgSeed: undefined, // Default seed (will use random if SubQGRNG is selected and seed is undefined)

  aiProvider: 'gemini', 
  geminiModelName: 'gemini-2.5-flash-preview-04-17',
  
  lmStudioBaseUrl: 'http://localhost:1234/v1',
  lmStudioGenerationModel: 'google/gemma-3-1b', 
  lmStudioEmbeddingModel: 'text-embedding-nomic-embed-text-v1.5',

  maxHistoryMessagesForPrompt: 8, 
  nodeActivationDecay: 0.95,
  emotionDecay: 0.95,
  adaptiveFitnessUpdateInterval: 3, 
  temperatureBase: 0.7,
  temperatureLimbusInfluence: 0.1, 
  temperatureCreativusInfluence: 0.15,

  // RAG and Knowledge Settings
  ragChunkSize: 500,
  ragChunkOverlap: 50,
  ragMaxChunksToRetrieve: 3,

  // Adaptive Fitness Configuration
  adaptiveFitnessConfig: INITIAL_ADAPTIVE_FITNESS_CONFIG,
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

export const INITIAL_NODE_STATES: NodeState[] = [
  { id: 'LimbusAffektus', label: 'Limbus Affektus', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'limbus', specificState: INITIAL_EMOTION_STATE },
  { id: 'Creativus', label: 'Creativus', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'creativus' },
  { id: 'CortexCriticus', label: 'Cortex Criticus', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'criticus' },
  { id: 'MetaCognitio', label: 'MetaCognitio', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'metacognitio', specificState: { lastTotalJumps: 0 } },
  { id: 'SocialCognitor', label: 'Social Cognitor', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'social', specificState: { empathyLevel: 0.5 } },
  { id: 'ValuationSystem', label: 'Valuation System', activation: 0.5, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'valuation', specificState: { valuationScore: 0.0 } },
  { id: 'ConflictMonitor', label: 'Conflict Monitor', activation: 0.2, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'conflict', specificState: { conflictLevel: 0.2 } },
  { id: 'ExecutiveControl', label: 'Executive Control', activation: 0.6, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'executive', specificState: { impulseControlLevel: 0.6 } },
  { id: 'Concept_AI', label: 'Concept: AI', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
  { id: 'Concept_Ethics', label: 'Concept: Ethics', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
  { id: 'Concept_Art', label: 'Concept: Art', activation: 0.1, resonatorScore: 0.5, focusScore: 0, explorationScore: 0, type: 'semantic' },
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

export const INITIAL_SUBQG_GLOBAL_METRICS: SubQgGlobalMetrics = {
  avgEnergy: INITIAL_CONFIG.subqgBaseEnergy,
  stdEnergy: 0,
  phaseCoherence: 0,
};

// Use process.env.API_KEY directly as per guidelines.
// vite.config.ts should ensure process.env.API_KEY is populated from the build environment.
export const API_KEY_FOR_GEMINI = process.env.API_KEY;