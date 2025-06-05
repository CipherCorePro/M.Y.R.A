# M.Y.R.A. & C.A.E.L.U.M. Configuration: Adaptive Fitness

This file explains the configuration parameters for the Adaptive Fitness System. This system evaluates the "health" and performance of M.Y.R.A. and C.A.E.L.U.M. based on various metrics and dimensions. The configuration controls how these evaluations are calculated. You can find these settings in the `SettingsPanel`. The weights (`adaptiveFitnessConfig`) are defined globally in `MyraConfig` but are applied by separate `AdaptiveFitnessManager` instances to the respective states of M.Y.R.A. and C.A.E.L.U.M. The update intervals are specific to each AI.

## AI-Specific Fitness Parameters

### `adaptiveFitnessUpdateInterval` (M.Y.R.A.)

*   **Meaning:** The number of simulation steps (`simulationStep`) after which **M.Y.R.A.'s** fitness values are recalculated and updated.
*   **Value Range:** A positive integer.
*   **Default Value:** `3`
*   **Group in SettingsPanel:** "M.Y.R.A. System"

### `caelumAdaptiveFitnessUpdateInterval` (C.A.E.L.U.M.)

*   **Meaning:** The number of simulation steps (`simulationStepCaelum`) after which **C.A.E.L.U.M.'s** fitness values are recalculated and updated.
*   **Value Range:** A positive integer.
*   **Default Value:** `5`
*   **Group in SettingsPanel:** "C.A.E.L.U.M. System"

## Shared Fitness Weighting Configuration (`adaptiveFitnessConfig`)

The following weights are defined in `myraConfig.adaptiveFitnessConfig` and are used for the fitness calculation of **both** M.Y.R.A. and C.A.E.L.U.M. However, each AI applies these weights to its **own, independent internal state** (own nodes, emotions, SubQG metrics, number of processed text chunks, etc.). Two separate instances of the `AdaptiveFitnessManager` perform these calculations.

### Base Metric Weights (`adaptiveFitnessConfig.baseMetricWeights`)

These weights determine how much each individual calculated metric contributes to the respective AI's `overallScore`.

#### `coherenceProxy`
*   **Description:** Proxy for internal coherence, often based on the (inverse) conflict level.
*   **Default Value:** `0.15`

#### `networkComplexityProxy`
*   **Description:** Proxy for the complexity of the node network.
*   **Default Value:** `0.05`

#### `averageResonatorScore`
*   **Description:** Average resonator score across all nodes of the respective AI.
*   **Default Value:** `0.15`

#### `goalAchievementProxy`
*   **Description:** Proxy for goal achievement, influenced by executive control, valuation focus, and positive emotions.
*   **Default Value:** `0.15`

#### `explorationScore`
*   **Description:** Proxy for exploratory behavior, influenced by Creativus/Pattern Analyzer activation and learning efficiency.
*   **Default Value:** `0.15`

#### `focusScore`
*   **Description:** Proxy for focused behavior, influenced by Criticus/Logic Verifier activation and low emotional arousal.
*   **Default Value:** `0.10`

#### `creativityScore`
*   **Description:** Proxy for creativity, influenced by Creativus/Pattern Analyzer activation and SubQG energy.
*   **Default Value:** `0.05`

#### `conflictPenaltyFactor`
*   **Description:** Penalty factor for internal conflicts.
*   **Default Value:** `-0.10`

### Dimension Contribution Weights (`adaptiveFitnessConfig.dimensionContribWeights`)

These weights define how much the base metrics contribute to the four overarching fitness dimensions of the respective AI.

#### `knowledgeExpansion`
*   **`learningEfficiency` (Weight):** Contribution of learning efficiency (e.g., processing new knowledge chunks). Default: `0.5`
*   **`explorationScore` (Weight):** Contribution of the exploration score. Default: `0.5`

#### `internalCoherence`
*   **`coherenceProxy` (Weight):** Contribution of the coherence proxy. Default: `0.6`
*   **`averageResonatorScore` (Weight):** Contribution of the average resonator score. Default: `0.2`

#### `expressiveCreativity`
*   **`creativityScore` (Weight):** Contribution of the creativity score. Default: `0.5`
*   **`creativusActivation` (Weight):** Contribution of the activation of the Creativus (M.Y.R.A.) or Pattern Analyzer (C.A.E.L.U.M.) node. Default: `0.3`
*   **`explorationScore` (Weight):** Contribution of the exploration score. Default: `0.2`

#### `goalFocus`
*   **`goalAchievementProxy` (Weight):** Contribution of the goal achievement proxy. Default: `0.6`
*   **`focusScore` (Weight):** Contribution of the focus score. Default: `0.4`

## Interactions and Interpretation

*   The **Base Metric Weights** are crucial for each AI's `overallScore`.
*   The **Dimension Contribution Weights** help to understand and visualize aspects of fitness in more detail.
*   Although the weighting structure is shared, applying it to the different internal states of M.Y.R.A. and C.A.E.L.U.M. leads to independent fitness evaluations for each AI.
*   The calculation of individual metrics (e.g., `learningEfficiencyProxy`, `coherenceProxy`) occurs in `AdaptiveFitnessManager.calculateMetricsAndFitness()` and may vary slightly depending on the AI if specific node IDs or states are interpreted differently (though the current implementation is largely generic).

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)