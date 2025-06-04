
import {
  MyraConfig,
  AdaptiveFitnessState,
  NodeState,
  EmotionState,
  SubQgGlobalMetrics,
  AdaptiveFitnessMetricWeights,
  // AdaptiveFitnessConfig, // Not strictly needed here, MyraConfig has it
  // TextChunk, // Not directly used in this class's methods
} from '../types';
import { INITIAL_ADAPTIVE_FITNESS_STATE } from '../constants';


interface SystemStateSnapshot {
  nodes: Record<string, NodeState>;
  emotionState: EmotionState;
  subQgGlobalMetrics: SubQgGlobalMetrics;
  processedTextChunksCount: number; 
}

export class AdaptiveFitnessManager {
  private config: MyraConfig;
  private getSystemState: () => SystemStateSnapshot;
  private lastProcessedChunksCount: number = 0; 

  constructor(config: MyraConfig, getSystemState: () => SystemStateSnapshot) {
    this.config = config;
    this.getSystemState = getSystemState;
    // Initialize with current count if available from a potentially pre-loaded state
    const initialState = getSystemState();
    this.lastProcessedChunksCount = initialState.processedTextChunksCount || 0;
  }

  public updateConfig(newConfig: MyraConfig) {
    this.config = newConfig;
  }

  public calculateMetricsAndFitness(): AdaptiveFitnessState {
    const systemState = this.getSystemState();
    const afConfig = this.config.adaptiveFitnessConfig;
    const baseWeights = afConfig.baseMetricWeights;
    const dimWeights = afConfig.dimensionContribWeights;

    const calculatedMetrics: Partial<AdaptiveFitnessMetricWeights> & { [key: string]: number } = {};

    // 1. Calculate Individual Metrics
    const conflictNode = systemState.nodes['ConflictMonitor'];
    const conflictLevel = conflictNode?.specificState?.conflictLevel ?? 0.5; // Default if not found
    calculatedMetrics.coherenceProxy = 1.0 - conflictLevel;

    calculatedMetrics.networkComplexityProxy = Math.tanh(Object.keys(systemState.nodes).length / 50); // Example: normalize by 50 nodes

    const resonatorScores = Object.values(systemState.nodes)
        .map(n => n.resonatorScore)
        .filter(score => typeof score === 'number' && isFinite(score));
    calculatedMetrics.averageResonatorScore = resonatorScores.length > 0 
        ? resonatorScores.reduce((sum, score) => sum + score, 0) / resonatorScores.length 
        : 0.5;

    const execNode = systemState.nodes['ExecutiveControl'];
    const valNode = systemState.nodes['ValuationSystem'];
    const limbus = systemState.emotionState;
    let goalAchievement = (execNode?.specificState?.impulseControlLevel ?? 0.5) * 0.4;
    goalAchievement += (1.0 - (valNode?.specificState?.valuationScore ?? 0.5)) * 0.3; // Higher when valuation is lower (less selfish focus)
    goalAchievement += (limbus.pleasure * 0.2);
    goalAchievement -= ((limbus.greed + limbus.anger + limbus.fear) / 3) * 0.1; // Penalty for negative drivers
    calculatedMetrics.goalAchievementProxy = Math.max(0, Math.min(1, goalAchievement + 0.25)); // Base offset and clip

    const creativusNode = systemState.nodes['Creativus'];
    const chunksProcessedThisCycle = systemState.processedTextChunksCount - this.lastProcessedChunksCount;
    // Simplified learning efficiency proxy: bonus if new chunks were processed
    const learningEfficiencyProxy = chunksProcessedThisCycle > 0 ? 0.75 : 0.25; 
    calculatedMetrics.explorationScore = Math.max(0, Math.min(1, 
      ((creativusNode?.activation ?? 0.5) * 0.6) + (learningEfficiencyProxy * 0.4)
    ));
    
    const criticusNode = systemState.nodes['CortexCriticus'];
    calculatedMetrics.focusScore = Math.max(0, Math.min(1, 
      ((criticusNode?.activation ?? 0.5) * 0.6) + ((1 - Math.abs(limbus.arousal)) * 0.4) // Higher focus with lower arousal
    ));

    calculatedMetrics.creativityScore = Math.max(0, Math.min(1,
      ((creativusNode?.activation ?? 0.5) * 0.7) + (systemState.subQgGlobalMetrics.avgEnergy * 0.3) // High SubQG energy might correlate to novelty
    ));

    this.lastProcessedChunksCount = systemState.processedTextChunksCount; // Update for next cycle

    // 2. Calculate Dimensional Scores
    const dimensions: AdaptiveFitnessState['dimensions'] = {
      knowledgeExpansion: Math.max(0, Math.min(1,
        (learningEfficiencyProxy * dimWeights.knowledgeExpansion.learningEfficiency) +
        (calculatedMetrics.explorationScore * dimWeights.knowledgeExpansion.explorationScore)
      )),
      internalCoherence: Math.max(0, Math.min(1,
        (calculatedMetrics.coherenceProxy * dimWeights.internalCoherence.coherenceProxy) +
        (calculatedMetrics.averageResonatorScore * dimWeights.internalCoherence.averageResonatorScore)
      )),
      expressiveCreativity: Math.max(0, Math.min(1,
        (calculatedMetrics.creativityScore * dimWeights.expressiveCreativity.creativityScore) +
        ((creativusNode?.activation ?? 0.5) * dimWeights.expressiveCreativity.creativusActivation) +
        (calculatedMetrics.explorationScore * dimWeights.expressiveCreativity.explorationScore)
      )),
      goalFocus: Math.max(0, Math.min(1,
        (calculatedMetrics.goalAchievementProxy * dimWeights.goalFocus.goalAchievementProxy) +
        (calculatedMetrics.focusScore * dimWeights.goalFocus.focusScore)
      )),
    };

    // 3. Calculate Overall Fitness Score
    let weightedSum = 0;
    let sumOfAbsoluteWeights = 0;

    for (const key in baseWeights) {
      const metricKey = key as keyof AdaptiveFitnessMetricWeights;
      const weight = baseWeights[metricKey];
      sumOfAbsoluteWeights += Math.abs(weight);

      if (metricKey === 'conflictPenaltyFactor') {
        weightedSum += conflictLevel * weight; // conflictLevel is 0-1, weight is negative
      } else if (calculatedMetrics[metricKey] !== undefined) {
        weightedSum += (calculatedMetrics[metricKey] as number) * weight;
      }
    }
    
    const overallScore = sumOfAbsoluteWeights > 0 ? Math.max(0, Math.min(1, weightedSum / sumOfAbsoluteWeights)) : 0.5;

    return {
      overallScore,
      dimensions,
      metrics: calculatedMetrics,
    };
  }
}
