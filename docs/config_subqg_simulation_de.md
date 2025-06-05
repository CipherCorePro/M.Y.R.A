# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: SubQG Simulation

Diese Datei erläutert die Konfigurationsparameter für das SubQuantenfeld-Grundfeld (SubQG) für M.Y.R.A. und C.A.E.L.U.M. Jede KI besitzt ihr eigenes, unabhängiges SubQG-System, das ihre internen Zustände beeinflusst. Diese Einstellungen finden Sie im `SettingsPanel` unter den Gruppen "M.Y.R.A. System" und "C.A.E.L.U.M. System" und sind Teil des `MyraConfig`-Objekts.

## M.Y.R.A. SubQG-System (Parameter ohne `caelum`-Präfix in `myraConfig`)

### Allgemeine SubQG-Parameter (M.Y.R.A.)

#### `subqgSize`
*   **Bedeutung:** Größe der quadratischen SubQG-Matrix für M.Y.R.A.
*   **Standardwert:** `16`

#### `subqgBaseEnergy`
*   **Bedeutung:** Initiale Basisenergie und minimale Energierückführung für M.Y.R.A.s SubQG-Zellen.
*   **Standardwert:** `0.01`

#### `subqgCoupling`
*   **Bedeutung:** Kopplungsstärke der Energieausbreitung zwischen benachbarten Zellen für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.015`

#### `subqgInitialEnergyNoiseStd`
*   **Bedeutung:** Standardabweichung des initialen Energierauschens für M.Y.R.A.s SubQG.
*   **Standardwert:** `0.001`

#### `subqgPhaseEnergyCouplingFactor`
*   **Bedeutung:** Faktor, wie stark Energieänderungen die Phasen in M.Y.R.A.s SubQG stochastisch beeinflussen.
*   **Standardwert:** `0.1`

#### `subqgPhaseDiffusionFactor`
*   **Bedeutung:** Faktor, wie stark sich Phasenunterschiede zwischen benachbarten Zellen in M.Y.R.A.s SubQG ausgleichen.
*   **Standardwert:** `0.05`

### SubQG Jump Parameter (M.Y.R.A.)

#### `subqgJumpMinEnergyAtPeak`
*   **Bedeutung:** Minimale Durchschnittsenergie im gesamten SubQG, die erreicht sein muss, um die Verfolgung eines potenziellen Jump-Peaks für M.Y.R.A. zu starten.
*   **Standardwert:** `0.03`

#### `subqgJumpMinCoherenceAtPeak`
*   **Bedeutung:** Minimale Phasenkohärenz im gesamten SubQG, die erreicht sein muss, um die Verfolgung eines potenziellen Jump-Peaks für M.Y.R.A. zu starten.
*   **Standardwert:** `0.75`

#### `subqgJumpCoherenceDropFactor`
*   **Bedeutung:** Relativer Abfallfaktor der Phasenkohärenz vom verfolgten Peak-Wert, der einen Jump in M.Y.R.A.s SubQG auslösen kann.
*   **Standardwert:** `0.1` (d.h. 10% Abfall vom Peak)

#### `subqgJumpEnergyDropFactorFromPeak`
*   **Bedeutung:** Relativer Abfallfaktor der Durchschnittsenergie vom verfolgten Peak-Wert, der einen Jump in M.Y.R.A.s SubQG auslösen kann.
*   **Standardwert:** `0.05` (d.h. 5% Abfall vom Peak-Energie)

#### `subqgJumpMaxStepsToTrackPeak`
*   **Bedeutung:** Maximale Anzahl von Simulationsschritten, während derer ein potenzieller Peak in M.Y.R.A.s SubQG verfolgt wird, bevor das Tracking ohne Jump-Detektion zurückgesetzt wird.
*   **Standardwert:** `5`

#### `subqgJumpActiveDuration`
*   **Bedeutung:** Dauer (in Simulationsschritten), für die ein detektierter Jump-Modifikator in M.Y.R.A. aktiv bleibt und ihre Knotendynamik beeinflusst.
*   **Standardwert:** `3`

#### `subqgJumpQnsDirectModifierStrength`
*   **Bedeutung:** Skalierungsfaktor für die Stärke des Jump-Modifikators, der die Aktivierung von M.Y.R.A.s Knoten beeinflusst.
*   **Standardwert:** `0.5`

### RNG (Random Number Generator) Parameter (M.Y.R.A.)

#### `rngType`
*   **Bedeutung:** Typ des Zufallszahlengenerators für M.Y.R.A.s Simulation.
*   **Mögliche Werte:** `'subqg'` (deterministisch, seed-basiert), `'quantum'` (nicht-deterministisch, `Math.random()`).
*   **Standardwert:** `'subqg'`

#### `subqgSeed`
*   **Bedeutung:** Startwert (Seed) für M.Y.R.A.s deterministischen RNG.
*   **Bedingung:** Nur relevant, wenn `rngType` = `'subqg'`.
*   **Standardwert:** `undefined` (führt zu zufälligem Seed bei Start, falls `'subqg'`)

## C.A.E.L.U.M. SubQG-System (Parameter mit `caelum`-Präfix in `myraConfig`)

### Allgemeine SubQG-Parameter (C.A.E.L.U.M.)

#### `caelumSubqgSize`
*   **Bedeutung:** Größe der quadratischen SubQG-Matrix für C.A.E.L.U.M.
*   **Standardwert:** `12`

#### `caelumSubqgBaseEnergy`
*   **Bedeutung:** Initiale Basisenergie und minimale Energierückführung für C.A.E.L.U.M.s SubQG-Zellen.
*   **Standardwert:** `0.005`

#### `caelumSubqgCoupling`
*   **Bedeutung:** Kopplungsstärke der Energieausbreitung zwischen benachbarten Zellen für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.020`

#### `caelumSubqgInitialEnergyNoiseStd`
*   **Bedeutung:** Standardabweichung des initialen Energierauschens für C.A.E.L.U.M.s SubQG.
*   **Standardwert:** `0.0005`

#### `caelumSubqgPhaseEnergyCouplingFactor`
*   **Bedeutung:** Faktor, wie stark Energieänderungen die Phasen in C.A.E.L.U.M.s SubQG stochastisch beeinflussen.
*   **Standardwert:** `0.05`

#### `caelumSubqgPhaseDiffusionFactor`
*   **Bedeutung:** Faktor, wie stark sich Phasenunterschiede zwischen benachbarten Zellen in C.A.E.L.U.M.s SubQG ausgleichen.
*   **Standardwert:** `0.07`

### SubQG Jump Parameter (C.A.E.L.U.M.)

#### `caelumSubqgJumpMinEnergyAtPeak`
*   **Bedeutung:** Minimale Durchschnittsenergie im gesamten SubQG, die erreicht sein muss, um die Verfolgung eines potenziellen Jump-Peaks für C.A.E.L.U.M. zu starten.
*   **Standardwert:** `0.025`

#### `caelumSubqgJumpMinCoherenceAtPeak`
*   **Bedeutung:** Minimale Phasenkohärenz im gesamten SubQG, die erreicht sein muss, um die Verfolgung eines potenziellen Jump-Peaks für C.A.E.L.U.M. zu starten.
*   **Standardwert:** `0.80`

#### `caelumSubqgJumpCoherenceDropFactor`
*   **Bedeutung:** Relativer Abfallfaktor der Phasenkohärenz vom verfolgten Peak-Wert, der einen Jump in C.A.E.L.U.M.s SubQG auslösen kann.
*   **Standardwert:** `0.08`

#### `caelumSubqgJumpEnergyDropFactorFromPeak`
*   **Bedeutung:** Relativer Abfallfaktor der Durchschnittsenergie vom verfolgten Peak-Wert, der einen Jump in C.A.E.L.U.M.s SubQG auslösen kann.
*   **Standardwert:** `0.04`

#### `caelumSubqgJumpMaxStepsToTrackPeak`
*   **Bedeutung:** Maximale Anzahl von Simulationsschritten, während derer ein potenzieller Peak in C.A.E.L.U.M.s SubQG verfolgt wird.
*   **Standardwert:** `4`

#### `caelumSubqgJumpActiveDuration`
*   **Bedeutung:** Dauer (in Simulationsschritten), für die ein detektierter Jump-Modifikator in C.A.E.L.U.M. aktiv bleibt.
*   **Standardwert:** `2`

#### `caelumSubqgJumpQnsDirectModifierStrength`
*   **Bedeutung:** Skalierungsfaktor für die Stärke des Jump-Modifikators, der die Aktivierung von C.A.E.L.U.M.s Knoten beeinflusst.
*   **Standardwert:** `0.3`

### RNG (Random Number Generator) Parameter (C.A.E.L.U.M.)

#### `caelumRngType`
*   **Bedeutung:** Typ des Zufallszahlengenerators für C.A.E.L.U.M.s Simulation.
*   **Mögliche Werte:** `'subqg'`, `'quantum'`.
*   **Standardwert:** `'subqg'`

#### `caelumSubqgSeed`
*   **Bedeutung:** Startwert (Seed) für C.A.E.L.U.M.s deterministischen RNG.
*   **Bedingung:** Nur relevant, wenn `caelumRngType` = `'subqg'`.
*   **Standardwert:** `12345`

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)