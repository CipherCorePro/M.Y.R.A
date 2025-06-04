# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: SubQG Simulation

Diese Datei erläutert die Konfigurationsparameter für das SubQuantenfeld-Grundfeld (SubQG) für M.Y.R.A. und C.A.E.L.U.M. Jede KI besitzt ihr eigenes, unabhängiges SubQG-System, das ihre internen Zustände beeinflusst. Diese Einstellungen finden Sie im `SettingsPanel` unter den Gruppen "M.Y.R.A. System" und "C.A.E.L.U.M. System" und sind Teil des `MyraConfig`-Objekts.

## M.Y.R.A. SubQG-System (`myraConfig.*`)

### Allgemeine SubQG-Parameter (M.Y.R.A.)

#### `subqgSize`
*   **Bedeutung:** Größe der quadratischen SubQG-Matrix für M.Y.R.A.
*   **Standardwert:** `16`

#### `subqgBaseEnergy`
*   **Bedeutung:** Initiale Basisenergie für M.Y.R.A.s SubQG-Zellen.
*   **Standardwert:** `0.01`

#### `subqgCoupling`
*   **Bedeutung:** Kopplungsstärke der Energieausbreitung für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.015`

#### `subqgInitialEnergyNoiseStd`
*   **Bedeutung:** Standardabweichung des Energierauschens für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.001`

#### `subqgPhaseEnergyCouplingFactor`
*   **Bedeutung:** Faktor der Phasenbeeinflussung durch Energieänderung für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.1`

#### `subqgPhaseDiffusionFactor`
*   **Bedeutung:** Faktor der Phasendiffusion für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.05`

### SubQG Jump Parameter (M.Y.R.A.)

#### `subqgJumpMinEnergyAtPeak`
*   **Bedeutung:** Minimale Durchschnittsenergie für einen potenziellen Jump-Peak in M.Y.R.A.s SubQG.
*   **Standardwert:** `0.03`

#### `subqgJumpMinCoherenceAtPeak`
*   **Bedeutung:** Minimale Phasenkohärenz für einen potenziellen Jump-Peak in M.Y.R.A.s SubQG.
*   **Standardwert:** `0.75`

#### `subqgJumpCoherenceDropFactor`
*   **Bedeutung:** Relativer Abfallfaktor der Phasenkohärenz, der einen Jump in M.Y.R.A.s SubQG auslösen kann.
*   **Standardwert:** `0.1`

#### `subqgJumpEnergyDropFactorFromPeak`
*   **Bedeutung:** Relativer Abfallfaktor der Energie, der einen Jump in M.Y.R.A.s SubQG auslösen kann.
*   **Standardwert:** `0.05`

#### `subqgJumpMaxStepsToTrackPeak`
*   **Bedeutung:** Maximale Schritte zur Verfolgung eines potenziellen Peaks in M.Y.R.A.s SubQG.
*   **Standardwert:** `5`

#### `subqgJumpActiveDuration`
*   **Bedeutung:** Dauer (in Schritten), für die ein Jump-Modifikator in M.Y.R.A. aktiv bleibt.
*   **Standardwert:** `3`

#### `subqgJumpQnsDirectModifierStrength`
*   **Bedeutung:** Skalierungsfaktor für die Stärke des Jump-Modifikators in M.Y.R.A.
*   **Standardwert:** `0.5`

### RNG (Random Number Generator) Parameter (M.Y.R.A.)

#### `rngType`
*   **Bedeutung:** Typ des Zufallszahlengenerators für M.Y.R.A.s Simulation.
*   **Mögliche Werte:** `'subqg'` (deterministisch), `'quantum'` (nicht-deterministisch).
*   **Standardwert:** `'subqg'`

#### `subqgSeed`
*   **Bedeutung:** Startwert (Seed) für M.Y.R.A.s deterministischen RNG.
*   **Bedingung:** Nur relevant, wenn `rngType` = `'subqg'`.
*   **Standardwert:** `undefined` (führt zu zufälligem Seed bei Start, falls `'subqg'`)

## C.A.E.L.U.M. SubQG-System (`myraConfig.caelum*`)

### Allgemeine SubQG-Parameter (C.A.E.L.U.M.)

#### `caelumSubqgSize`
*   **Bedeutung:** Größe der quadratischen SubQG-Matrix für C.A.E.L.U.M.
*   **Standardwert:** `12`

#### `caelumSubqgBaseEnergy`
*   **Bedeutung:** Initiale Basisenergie für C.A.E.L.U.M.s SubQG-Zellen.
*   **Standardwert:** `0.005`

#### `caelumSubqgCoupling`
*   **Bedeutung:** Kopplungsstärke der Energieausbreitung für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.020`

#### `caelumSubqgInitialEnergyNoiseStd`
*   **Bedeutung:** Standardabweichung des Energierauschens für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.0005`

#### `caelumSubqgPhaseEnergyCouplingFactor`
*   **Bedeutung:** Faktor der Phasenbeeinflussung durch Energieänderung für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.05`

#### `caelumSubqgPhaseDiffusionFactor`
*   **Bedeutung:** Faktor der Phasendiffusion für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.07`

### SubQG Jump Parameter (C.A.E.L.U.M.)

#### `caelumSubqgJumpMinEnergyAtPeak`
*   **Bedeutung:** Minimale Durchschnittsenergie für einen potenziellen Jump-Peak in C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.025`

#### `caelumSubqgJumpMinCoherenceAtPeak`
*   **Bedeutung:** Minimale Phasenkohärenz für einen potenziellen Jump-Peak in C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.80`

#### `caelumSubqgJumpCoherenceDropFactor`
*   **Bedeutung:** Relativer Abfallfaktor der Phasenkohärenz, der einen Jump in C.A.E.L.U.M.s SubQG auslösen kann.
*   **Standardwert:** `0.08`

#### `caelumSubqgJumpEnergyDropFactorFromPeak`
*   **Bedeutung:** Relativer Abfallfaktor der Energie, der einen Jump in C.A.E.L.U.M.s SubQG auslösen kann.
*   **Standardwert:** `0.04`

#### `caelumSubqgJumpMaxStepsToTrackPeak`
*   **Bedeutung:** Maximale Schritte zur Verfolgung eines potenziellen Peaks in C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `4`

#### `caelumSubqgJumpActiveDuration`
*   **Bedeutung:** Dauer (in Schritten), für die ein Jump-Modifikator in C.A.E.L.U.M. aktiv bleibt.
*   **Standardwert:** `2`

#### `caelumSubqgJumpQnsDirectModifierStrength`
*   **Bedeutung:** Skalierungsfaktor für die Stärke des Jump-Modifikators in C.A.E.L.U.M. Dieser Wert beeinflusst, wie stark SubQG-Jumps die Knotenaktivierungen (insbesondere den "Pattern Analyzer") modulieren.
*   **Standardwert:** `0.3`
*   **Experimentelle Werte:** `0.4`, `0.5`

### RNG (Random Number Generator) Parameter (C.A.E.L.U.M.)

#### `caelumRngType`
*   **Bedeutung:** Typ des Zufallszahlengenerators für C.A.E.L.U.M.s Simulation.
*   **Mögliche Werte:** `'subqg'` (deterministisch), `'quantum'` (nicht-deterministisch).
*   **Standardwert:** `'subqg'`

#### `caelumSubqgSeed`
*   **Bedeutung:** Startwert (Seed) für C.A.E.L.U.M.s deterministischen RNG.
*   **Bedingung:** Nur relevant, wenn `caelumRngType` = `'subqg'`.
*   **Standardwert:** `12345` (ein fester, anderer Seed als M.Y.R.A.s Default, falls M.Y.R.A. keinen festen Seed hat)

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)