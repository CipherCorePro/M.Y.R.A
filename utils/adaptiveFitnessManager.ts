import {
  MyraConfig,
  AdaptiveFitnessState,
  NodeState,
  EmotionState,
  SubQgGlobalMetrics,
  AdaptiveFitnessMetricWeights,
  AdaptiveFitnessConfig,
  TextChunk,
} from '../types';

interface SystemStateSnapshot {
  nodes: Record<string, NodeState>;
  emotionState: EmotionState;
  subQgGlobalMetrics: SubQgGlobalMetrics;
  // Add other relevant parts of the system state as needed
  processedTextChunksCount: number; 
  // Consider adding a way to track *newly* processed chunks per cycle if needed for LE
}

export class AdaptiveFitnessManager {
  private config: MyraConfig;
  private getSystemState: () => SystemStateSnapshot;
  private lastProcessedChunksCount: number = 0; // For simple LE proxy

  constructor(config: MyraConfig, getSystemState: () => SystemStateSnapshot) {
    this.config = config;
    this.getSystemState = getSystemState;
  }

  public updateConfig(newConfig: MyraConfig) {
    this.config = newConfig;
  }

  public calculateMetricsAndFitness(): AdaptiveFitnessState {
    const systemState = this.getSystemState();
    const afConfig = this.config.adaptiveFitnessConfig;

    // --- Calculate Individual Metrics ---
    const metrics: Partial<AdaptiveFitnessMetricWeights> & { [key: string]: number } = {};

    // Coherence Proxy (based on inverse of Conflict Monitor activation)
    const conflictNode = systemState.nodes['ConflictMonitor'];
    metrics.coherenceProxy = conflictNode ? 1.0 - (conflictNode.specificState?.conflictLevel || 0.0) : 0.5;

    // Average Resonator Score (from quantum-capable nodes)
    const quantumNodes = Object.values(systemState.nodes).filter(n => n.resonatorScore !== undefined); // Assuming all nodes can have it for now
    metrics.averageResonatorScore = quantumNodes.length > 0
      ? quantumNodes.reduce((sum, node) => sum + node.resonatorScore, 0) / quantumNodes.length
      : 0.5;

    // Goal Achievement Proxy
    const executiveNode = systemState.nodes['ExecutiveControl'];
    const valuationNode = systemState.nodes['ValuationSystem'];
    let goalProxy = 0.0;
    goalProxy += (executiveNode?.specificState?.impulseControlLevel || 0.0) * 0.4;
    goalProxy += (1.0 - (valuationNode?.specificState?.valuationScore || 1.0)) * 0.3; // Higher valuation score might mean less "need" for external goals
    goalProxy += (systemState.emotionState.pleasure * 0.2);
    goalProxy -= ((systemState.emotionState.greed + systemState.emotionState.anger + systemState.emotionState.fear) * 0.1);
    metrics.goalAchievementProxy = Math.max(0, Math.min(1, goalProxy + 0.25)); // Base offset

    // Exploration Score (simplified: Creativus activation + new knowledge)
    const creativusNode = systemState.nodes['Creativus'];
    const newChunksProcessedThisCycle = systemState.processedTextChunksCount - this.lastProcessedChunksCount;
    this.lastProcessedChunksCount = systemState.processedTextChunksCount;
    metrics.explorationScore = Math.max(0, Math.min(1,
      (creativusNode?.activation || 0.0) * 0.6 +
      (newChunksProcessedThisCycle > 0 ? 0.4 : 0.0) // Simple bonus for new knowledge
    ));
    
    // Focus Score (placeholder - can be improved with RAG context later)
    // For now, let's link it to criticus (representing focused thought) and inverse arousal
    const criticusNode = systemState.nodes['CortexCriticus'];
    metrics.focusScore = Math.max(0, Math.min(1,
        (criticusNode?.activation || 0.0) * 0.5 +
        (1.0 - Math.abs(systemState.emotionState.arousal)) * 0.5
    ));


    // Creativity Score (simplified: Creativus + some resonator contribution)
    metrics.creativityScore = Math.max(0, Math.min(1,
      (creativusNode?.activation || 0.0) * 0.7 +
      (metrics.averageResonatorScore - 0.5) * 0.3 // Resonator deviating from avg adds/subtracts
    ));
    
    // Network Complexity Proxy (Simplified)
    metrics.networkComplexityProxy = Math.tanh(Object.keys(systemState.nodes).length / 50); // Example: scales with num nodes

    // Conflict Penalty
    metrics.conflictPenaltyFactor = afConfig.baseMetricWeights.conflictPenaltyFactor; // This is a weight, not a calculated metric

    // --- Calculate Dimensional Fitness Scores ---
    const dimensions = {
      knowledgeExpansion: (
        // (metrics.learningEfficiency || 0) * afConfig.dimensionContribWeights.knowledgeExpansion.learningEfficiency + // When LE is implemented
        (metrics.explorationScore || 0) * afConfig.dimensionContribWeights.knowledgeExpansion.explorationScore
      ),
      internalCoherence: (
        (metrics.coherenceProxy || 0) * afConfig.dimensionContribWeights.internalCoherence.coherenceProxy +
        (metrics.averageResonatorScore || 0) * afConfig.dimensionContribWeights.internalCoherence.averageResonatorScore
      ),
      expressiveCreativity: (
        (metrics.creativityScore || 0) * afConfig.dimensionContribWeights.expressiveCreativity.creativityScore +
        (creativusNode?.activation || 0) * afConfig.dimensionContribWeights.expressiveCreativity.creativusActivation +
        (metrics.explorationScore || 0) * afConfig.dimensionContribWeights.expressiveCreativity.explorationScore
      ),
      goalFocus: (
        (metrics.goalAchievementProxy || 0) * afConfig.dimensionContribWeights.goalFocus.goalAchievementProxy +
        (metrics.focusScore || 0) * afConfig.dimensionContribWeights.goalFocus.focusScore
      ),
    };

    // Normalize dimensions
    Object.keys(dimensions).forEach(key => {
      const k = key as keyof typeof dimensions;
      dimensions[k] = Math.max(0, Math.min(1, dimensions[k]));
    });

    // --- Calculate Overall Fitness Score ---
    let overallScore = 0;
    let totalWeight = 0;

    for (const key in afConfig.baseMetricWeights) {
      const metricKey = key as keyof AdaptiveFitnessMetricWeights;
      const weight = afConfig.baseMetricWeights[metricKey];
      const value = metrics[metricKey] === undefined ? 0.5 : metrics[metricKey]!; // Default to 0.5 if metric not calculated

      if (metricKey === 'conflictPenaltyFactor') { // This is a direct penalty factor for conflict level
        overallScore += (conflictNode?.specificState?.conflictLevel || 0.0) * weight;
      } else {
        overallScore += value * weight;
      }
      totalWeight += Math.abs(weight);
    }
    
    overallScore = totalWeight > 0 ? overallScore / totalWeight : 0.5;
    overallScore = Math.max(0, Math.min(1, overallScore));

    return {
      overallScore,
      dimensions,
      metrics,
    };
  }
}