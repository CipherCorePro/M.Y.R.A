# M.Y.R.A. & C.A.E.L.U.M. Configuration: SubQG Simulation

This file explains the configuration parameters for the SubQuantum Field (SubQG) for M.Y.R.A. and C.A.E.L.U.M. Each AI has its own independent SubQG system that influences its internal states. These settings can be found in the `SettingsPanel` under the "M.Y.R.A. System" and "C.A.E.L.U.M. System" groups and are part of the `MyraConfig` object.

## M.Y.R.A. SubQG System (Parameters without `caelum` prefix in `myraConfig`)

### General SubQG Parameters (M.Y.R.A.)

#### `subqgSize`
*   **Meaning:** Size of the square SubQG matrix for M.Y.R.A.
*   **Default Value:** `16`

#### `subqgBaseEnergy`
*   **Meaning:** Initial base energy and minimum energy feedback for M.Y.R.A.'s SubQG cells.
*   **Default Value:** `0.01`

#### `subqgCoupling`
*   **Meaning:** Coupling strength of energy propagation between adjacent cells for M.Y.R.A.'s SubQG.
*   **Default Value:** `0.015`

#### `subqgInitialEnergyNoiseStd`
*   **Meaning:** Standard deviation of the initial energy noise for M.Y.R.A.'s SubQG.
*   **Default Value:** `0.001`

#### `subqgPhaseEnergyCouplingFactor`
*   **Meaning:** Factor determining how strongly energy changes stochastically influence phases in M.Y.R.A.'s SubQG.
*   **Default Value:** `0.1`

#### `subqgPhaseDiffusionFactor`
*   **Meaning:** Factor determining how strongly phase differences between adjacent cells in M.Y.R.A.'s SubQG equalize.
*   **Default Value:** `0.05`

### SubQG Jump Parameters (M.Y.R.A.)

#### `subqgJumpMinEnergyAtPeak`
*   **Meaning:** Minimum average energy in the entire SubQG that must be reached to start tracking a potential jump peak for M.Y.R.A.
*   **Default Value:** `0.03`

#### `subqgJumpMinCoherenceAtPeak`
*   **Meaning:** Minimum phase coherence in the entire SubQG that must be reached to start tracking a potential jump peak for M.Y.R.A.
*   **Default Value:** `0.75`

#### `subqgJumpCoherenceDropFactor`
*   **Meaning:** Relative drop factor of phase coherence from the tracked peak value that can trigger a jump in M.Y.R.A.'s SubQG.
*   **Default Value:** `0.1` (i.e., 10% drop from peak)

#### `subqgJumpEnergyDropFactorFromPeak`
*   **Meaning:** Relative drop factor of average energy from the tracked peak value that can trigger a jump in M.Y.R.A.'s SubQG.
*   **Default Value:** `0.05` (i.e., 5% drop from peak energy)

#### `subqgJumpMaxStepsToTrackPeak`
*   **Meaning:** Maximum number of simulation steps during which a potential peak in M.Y.R.A.'s SubQG is tracked before tracking resets without jump detection.
*   **Default Value:** `5`

#### `subqgJumpActiveDuration`
*   **Meaning:** Duration (in simulation steps) for which a detected jump modifier in M.Y.R.A. remains active and influences its node dynamics.
*   **Default Value:** `3`

#### `subqgJumpQnsDirectModifierStrength`
*   **Meaning:** Scaling factor for the strength of the jump modifier that influences the activation of M.Y.R.A.'s nodes.
*   **Default Value:** `0.5`

### RNG (Random Number Generator) Parameters (M.Y.R.A.)

#### `rngType`
*   **Meaning:** Type of random number generator for M.Y.R.A.'s simulation.
*   **Possible Values:** `'subqg'` (deterministic, seed-based), `'quantum'` (non-deterministic, `Math.random()`).
*   **Default Value:** `'subqg'`

#### `subqgSeed`
*   **Meaning:** Starting value (seed) for M.Y.R.A.'s deterministic RNG.
*   **Condition:** Only relevant if `rngType` = `'subqg'`.
*   **Default Value:** `undefined` (leads to a random seed on startup if `'subqg'`)

## C.A.E.L.U.M. SubQG System (Parameters with `caelum` prefix in `myraConfig`)

### General SubQG Parameters (C.A.E.L.U.M.)

#### `caelumSubqgSize`
*   **Meaning:** Size of the square SubQG matrix for C.A.E.L.U.M.
*   **Default Value:** `12`

#### `caelumSubqgBaseEnergy`
*   **Meaning:** Initial base energy and minimum energy feedback for C.A.E.L.U.M.'s SubQG cells.
*   **Default Value:** `0.005`

#### `caelumSubqgCoupling`
*   **Meaning:** Coupling strength of energy propagation between adjacent cells for C.A.E.L.U.M.'s SubQG.
*   **Default Value:** `0.020`

#### `caelumSubqgInitialEnergyNoiseStd`
*   **Meaning:** Standard deviation of the initial energy noise for C.A.E.L.U.M.'s SubQG.
*   **Default Value:** `0.0005`

#### `caelumSubqgPhaseEnergyCouplingFactor`
*   **Meaning:** Factor determining how strongly energy changes stochastically influence phases in C.A.E.L.U.M.'s SubQG.
*   **Default Value:** `0.05`

#### `caelumSubqgPhaseDiffusionFactor`
*   **Meaning:** Factor determining how strongly phase differences between adjacent cells in C.A.E.L.U.M.'s SubQG equalize.
*   **Default Value:** `0.07`

### SubQG Jump Parameters (C.A.E.L.U.M.)

#### `caelumSubqgJumpMinEnergyAtPeak`
*   **Meaning:** Minimum average energy in the entire SubQG that must be reached to start tracking a potential jump peak for C.A.E.L.U.M.
*   **Default Value:** `0.025`

#### `caelumSubqgJumpMinCoherenceAtPeak`
*   **Meaning:** Minimum phase coherence in the entire SubQG that must be reached to start tracking a potential jump peak for C.A.E.L.U.M.
*   **Default Value:** `0.80`

#### `caelumSubqgJumpCoherenceDropFactor`
*   **Meaning:** Relative drop factor of phase coherence from the tracked peak value that can trigger a jump in C.A.E.L.U.M.'s SubQG.
*   **Default Value:** `0.08`

#### `caelumSubqgJumpEnergyDropFactorFromPeak`
*   **Meaning:** Relative drop factor of average energy from the tracked peak value that can trigger a jump in C.A.E.L.U.M.'s SubQG.
*   **Default Value:** `0.04`

#### `caelumSubqgJumpMaxStepsToTrackPeak`
*   **Meaning:** Maximum number of simulation steps during which a potential peak in C.A.E.L.U.M.'s SubQG is tracked.
*   **Default Value:** `4`

#### `caelumSubqgJumpActiveDuration`
*   **Meaning:** Duration (in simulation steps) for which a detected jump modifier in C.A.E.L.U.M. remains active.
*   **Default Value:** `2`

#### `caelumSubqgJumpQnsDirectModifierStrength`
*   **Meaning:** Scaling factor for the strength of the jump modifier that influences the activation of C.A.E.L.U.M.'s nodes.
*   **Default Value:** `0.3`

### RNG (Random Number Generator) Parameters (C.A.E.L.U.M.)

#### `caelumRngType`
*   **Meaning:** Type of random number generator for C.A.E.L.U.M.'s simulation.
*   **Possible Values:** `'subqg'`, `'quantum'`.
*   **Default Value:** `'subqg'`

#### `caelumSubqgSeed`
*   **Meaning:** Starting value (seed) for C.A.E.L.U.M.'s deterministic RNG.
*   **Condition:** Only relevant if `caelumRngType` = `'subqg'`.
*   **Default Value:** `12345`

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)