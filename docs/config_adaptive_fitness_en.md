# M.Y.R.A., C.A.E.L.U.M. & Configurable Agents: Adaptive Fitness

This file explains the configuration parameters for the Adaptive Fitness System. This system evaluates the "health" and performance of M.Y.R.A., C.A.E.L.U.M., and **each individually configurable agent** based on various metrics and dimensions.

*   M.Y.R.A.'s fitness update interval is defined in `myraConfig.adaptiveFitnessUpdateInterval`. Her fitness weights are in `myraConfig.adaptiveFitnessConfig`.
*   C.A.E.L.U.M.'s fitness update interval is defined in `myraConfig.caelumAdaptiveFitnessUpdateInterval`. C.A.E.L.U.M. also uses the *global* `myraConfig.adaptiveFitnessConfig` for its weightings but applies them to its own state.
*   For **each configurable agent**, the update interval is part of its `systemConfig.adaptiveFitnessUpdateInterval`, and its specific fitness weights are stored in `configurableAgents[n].adaptiveFitnessConfig`.

Each agent has its own instance of `AdaptiveFitnessManager` that works with the respective agent's configuration and state.

## Agent-Specific Fitness Parameters

### `adaptiveFitnessUpdateInterval` (Part of each agent's `systemConfig`)

*   **Meaning:** The number of simulation steps after which the respective agent's fitness values are recalculated.
*   **Default Values:** M.Y.R.A.: `3`, C.A.E.L.U.M.: `5`. Configurable agents inherit M.Y.R.A.'s default (`3`) upon creation but can be individually adjusted.
*   **Group in SettingsPanel:** In the System tab of the respective agent (for M.Y.R.A., C.A.E.L.U.M.) or in the "System Configuration" subsection for configurable agents.

## Agent-Specific Fitness Weighting Configuration (`adaptiveFitnessConfig` per agent)

Each agent (M.Y.R.A., C.A.E.L.U.M. - though C.A.E.L.U.M. uses M.Y.R.A.'s global setting - and each configurable agent) has its own `adaptiveFitnessConfig` object. This object contains `baseMetricWeights` and `dimensionContribWeights`.

### Base Metric Weights (`adaptiveFitnessConfig.baseMetricWeights` per agent)

These weights determine how much each individual calculated metric contributes to the respective agent's `overallScore`. The default values are defined for M.Y.R.A. and as a template for new configurable agents.

#### `coherenceProxy`
*   **Description:** Proxy for internal coherence, often based on the agent's (inverse) conflict level.
*   **Default Value:** `0.15`

#### `networkComplexityProxy`
*   **Description:** Proxy for the complexity of the agent's node network.
*   **Default Value:** `0.05`

#### `averageResonatorScore`
*   **Description:** Average resonator score across all nodes of the respective agent.
*   **Default Value:** `0.15`

#### `goalAchievementProxy`
*   **Description:** Proxy for goal achievement, influenced by executive control, valuation focus, and positive emotions of the agent.
*   **Default Value:** `0.15`

#### `explorationScore`
*   **Description:** Proxy for exploratory behavior, influenced by the activation of the creativity/pattern analyzer node and the agent's learning efficiency.
*   **Default Value:** `0.15`

#### `focusScore`
*   **Description:** Proxy for focused behavior, influenced by the activation of the critic node and low emotional arousal of the agent.
*   **Default Value:** `0.10`

#### `creativityScore`
*   **Description:** Proxy for creativity, influenced by the activation of the creativity/pattern analyzer node and the agent's SubQG energy.
*   **Default Value:** `0.05`

#### `conflictPenaltyFactor`
*   **Description:** Penalty factor for the agent's internal conflicts.
*   **Default Value:** `-0.10`

### Dimension Contribution Weights (`adaptiveFitnessConfig.dimensionContribWeights` per agent)

These weights define how much the base metrics contribute to the four overarching fitness dimensions of the respective agent.

#### `knowledgeExpansion`
*   **`learningEfficiency` (Weight):** Contribution of learning efficiency (e.g., processing new knowledge chunks). Default: `0.5`
*   **`explorationScore` (Weight):** Contribution of the exploration score. Default: `0.5`

#### `internalCoherence`
*   **`coherenceProxy` (Weight):** Contribution of the coherence proxy. Default: `0.6`
*   **`averageResonatorScore` (Weight):** Contribution of the average resonator score. Default: `0.2`

#### `expressiveCreativity`
*   **`creativityScore` (Weight):** Contribution of the creativity score. Default: `0.5`
*   **`creativusActivation` (Weight):** Contribution of the activation of the creativity/pattern analyzer node. Default: `0.3`
*   **`explorationScore` (Weight):** Contribution of the exploration score. Default: `0.2`

#### `goalFocus`
*   **`goalAchievementProxy` (Weight):** Contribution of the goal achievement proxy. Default: `0.6`
*   **`focusScore` (Weight):** Contribution of the focus score. Default: `0.4`

## Interactions and Interpretation

*   The **Base Metric Weights** are crucial for each agent's `overallScore`.
*   The **Dimension Contribution Weights** help to understand and visualize aspects of fitness in more detail.
*   Since M.Y.R.A. and each configurable agent have their own `adaptiveFitnessConfig` (C.A.E.L.U.M. uses M.Y.R.A.'s), their fitness evaluations can differ even with potentially similar internal states if their weightings diverge. This allows for fine-grained control over the "developmental goals" for each agent.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)
