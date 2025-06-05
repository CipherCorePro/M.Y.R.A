# M.Y.R.A., C.A.E.L.U.M. & Configurable Agents: SubQG Simulation

This file explains the configuration parameters for the SubQuantum Field (SubQG). Each AI entity (M.Y.R.A., C.A.E.L.U.M., and **each individually configurable agent**) possesses its own independent SubQG system that influences its internal states.

*   M.Y.R.A.'s SubQG parameters are defined directly in `myraConfig` as top-level properties (e.g., `myraConfig.subqgSize`).
*   C.A.E.L.U.M.'s SubQG parameters are in `myraConfig` prefixed with `caelum*` (e.g., `myraConfig.caelumSubqgSize`).
*   For **each configurable agent**, these parameters are part of its `systemConfig` object, found under `myraConfig.configurableAgents[n].systemConfig`.

All parameters described below thus exist for each of these entities (with the appropriate prefixes or paths) and can be configured individually in the `SettingsPanel`.

## General SubQG Parameters (apply per agent)

### `subqgSize`
*   **Meaning:** Size of the square SubQG matrix (e.g., 16x16).
*   **Default Values:** M.Y.R.A.: `16`, C.A.E.L.U.M.: `12`. Configurable agents inherit M.Y.R.A.'s default (`16`) upon creation but can be individually adjusted.

### `subqgBaseEnergy`
*   **Meaning:** Initial base energy and minimum energy feedback for the SubQG cells. Influences the baseline noise and stability.
*   **Default Values:** M.Y.R.A.: `0.01`, C.A.E.L.U.M.: `0.005`.

### `subqgCoupling`
*   **Meaning:** Coupling strength of energy propagation between adjacent cells in the SubQG. Higher values lead to faster energy distribution.
*   **Default Values:** M.Y.R.A.: `0.015`, C.A.E.L.U.M.: `0.020`.

### `subqgInitialEnergyNoiseStd`
*   **Meaning:** Standard deviation of the initial energy noise added to each cell during initialization to create variance.
*   **Default Values:** M.Y.R.A.: `0.001`, C.A.E.L.U.M.: `0.0005`.

### `subqgPhaseEnergyCouplingFactor`
*   **Meaning:** Factor determining how strongly energy changes in a cell stochastically influence the phase of that cell.
*   **Default Values:** M.Y.R.A.: `0.1`, C.A.E.L.U.M.: `0.05`.

### `subqgPhaseDiffusionFactor`
*   **Meaning:** Factor determining how strongly phase differences between adjacent cells in the SubQG equalize, contributing to coherence formation.
*   **Default Values:** M.Y.R.A.: `0.05`, C.A.E.L.U.M.: `0.07`.

## SubQG Jump Parameters (apply per agent)

"SubQG Jumps" are significant, abrupt changes in the SubQG that can be interpreted as internal "events" and influence the agent's cognitive-affective processes.

### `subqgJumpMinEnergyAtPeak`
*   **Meaning:** Minimum average energy that must be reached in the entire SubQG for the system to start tracking a potential energy peak for a jump.
*   **Default Values:** M.Y.R.A.: `0.03`, C.A.E.L.U.M.: `0.025`.

### `subqgJumpMinCoherenceAtPeak`
*   **Meaning:** Minimum phase coherence that must be reached in the entire SubQG for the system to start tracking a potential coherence peak for a jump.
*   **Default Values:** M.Y.R.A.: `0.75`, C.A.E.L.U.M.: `0.80`.

### `subqgJumpCoherenceDropFactor`
*   **Meaning:** Relative drop factor of phase coherence from the previously tracked peak value. If the current coherence falls below this value (Peak * (1 - Factor)), it can trigger a jump.
*   **Default Values:** M.Y.R.A.: `0.1` (i.e., 10% drop from peak), C.A.E.L.U.M.: `0.08`.

### `subqgJumpEnergyDropFactorFromPeak`
*   **Meaning:** Relative drop factor of average energy from the previously tracked peak value. If the current energy falls below this value, it can trigger a jump.
*   **Default Values:** M.Y.R.A.: `0.05` (i.e., 5% drop from peak), C.A.E.L.U.M.: `0.04`.

### `subqgJumpMaxStepsToTrackPeak`
*   **Meaning:** Maximum number of simulation steps during which a potential peak (based on `subqgJumpMinEnergyAtPeak` and `subqgJumpMinCoherenceAtPeak`) is tracked. If no jump is detected via drop factors within this time, peak tracking is reset.
*   **Default Values:** M.Y.R.A.: `5`, C.A.E.L.U.M.: `4`.

### `subqgJumpActiveDuration`
*   **Meaning:** Duration (in simulation steps) for which a detected jump modifier remains active and influences the agent's node dynamics.
*   **Default Values:** M.Y.R.A.: `3`, C.A.E.L.U.M.: `2`.

### `subqgJumpQnsDirectModifierStrength`
*   **Meaning:** Scaling factor for the strength of the jump modifier that affects the activation of the agent's nodes. A positive value can increase activation, a negative value can decrease it.
*   **Default Values:** M.Y.R.A.: `0.5`, C.A.E.L.U.M.: `0.3`.

## RNG (Random Number Generator) Parameters (apply per agent)

### `rngType`
*   **Meaning:** Type of random number generator used for stochastic processes in the agent's simulation.
*   **Possible Values:**
    *   `'subqg'`: A deterministic Linear Congruential Generator (LCG) that produces reproducible results with the same seed.
    *   `'quantum'`: Uses `Math.random()`, leading to non-deterministic behavior.
*   **Default Value (for all agent defaults):** `'subqg'`.

### `subqgSeed`
*   **Meaning:** Starting value (seed) for the deterministic RNG (`'subqg'`). If `undefined` or empty, a random seed is generated at startup.
*   **Condition:** Only relevant if `rngType` = `'subqg'`.
*   **Default Values:** M.Y.R.A.: `undefined`, C.A.E.L.U.M.: `12345`. Configurable agents can have individual seeds or `undefined` for a random starting seed if their `rngType` is `'subqg'`.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)
