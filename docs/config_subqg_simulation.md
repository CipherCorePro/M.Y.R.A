# M.Y.R.A. Konfiguration: SubQG Simulation

Diese Datei erläutert die Konfigurationsparameter für das SubQuantenfeld-Grundfeld (SubQG), ein simuliertes Feld, das M.Y.R.A.s interne Zustände beeinflusst. Diese Einstellungen finden Sie im `SettingsPanel` unter der Gruppe "SubQG Simulation" und sind Teil des `MyraConfig`-Objekts.

## Allgemeine SubQG-Parameter

### `subqgSize`

*   **Bedeutung:** Die Größe der quadratischen SubQG-Matrix (z.B. 16 bedeutet eine 16x16 Matrix).
*   **Wertebereich:** Eine positive Ganzzahl, typischerweise zwischen 8 und 32. Größere Matrizen sind rechenintensiver.
*   **Standardwert:** `16`
*   **Interaktionen:** Eine Änderung dieses Wertes initialisiert die SubQG-Energie- und Phasenmatrizen neu.

### `subqgBaseEnergy`

*   **Bedeutung:** Die initiale Basisenergie, mit der jede Zelle in der SubQG-Matrix initialisiert wird.
*   **Wertebereich:** Kleine Fließkommazahl, typischerweise nahe 0, z.B. 0.0 bis 0.1.
*   **Standardwert:** `0.01`
*   **Interaktionen:** Beeinflusst das Grundrauschen und die allgemeine Aktivität im SubQG.

### `subqgCoupling`

*   **Bedeutung:** Die Stärke der Kopplung zwischen benachbarten Zellen bei der Energieausbreitung (Diffusion). Ein höherer Wert führt zu schnellerer Energieverteilung.
*   **Wertebereich:** Kleine Fließkommazahl, z.B. 0.001 bis 0.1.
*   **Standardwert:** `0.015`

### `subqgInitialEnergyNoiseStd`

*   **Bedeutung:** Die Standardabweichung des Rauschens, das der Energie jeder Zelle in jedem Simulationsschritt hinzugefügt wird. Dies sorgt für kontinuierliche kleine Fluktuationen. Auch als "SubQG Noise Level" in der UI bezeichnet.
*   **Wertebereich:** Sehr kleine Fließkommazahl, z.B. 0.0 bis 0.01.
*   **Standardwert:** `0.001`

### `subqgPhaseEnergyCouplingFactor`

*   **Bedeutung:** Faktor, der bestimmt, wie stark eine Änderung der Energie einer Zelle deren Phase beeinflusst.
*   **Wertebereich:** Kleine Fließkommazahl, z.B. 0.0 bis 0.5.
*   **Standardwert:** `0.1`

### `subqgPhaseDiffusionFactor`

*   **Bedeutung:** Faktor, der die Diffusion (Ausbreitung/Angleichung) von Phasenwerten zwischen benachbarten Zellen steuert. Ein höherer Wert führt zu schnellerer Synchronisation der Phasen.
*   **Wertebereich:** Kleine Fließkommazahl, z.B. 0.0 bis 0.2.
*   **Standardwert:** `0.05`
*   **Interaktionen:** Beeinflusst maßgeblich die Phasenkohärenz im System.

## SubQG Jump Parameter

Diese Parameter steuern die Erkennung und Auswirkung von "SubQG Jumps" – signifikanten, plötzlichen Fluktuationen im Feld.

### `subqgJumpMinEnergyAtPeak`

*   **Bedeutung:** Die minimale Durchschnittsenergie, die das SubQG erreichen muss, damit ein potenzieller "Peak" für einen Jump in Betracht gezogen wird.
*   **Wertebereich:** Fließkommazahl, typischerweise etwas höher als die `subqgBaseEnergy`, z.B. 0.02 bis 0.1.
*   **Standardwert:** `0.03`

### `subqgJumpMinCoherenceAtPeak`

*   **Bedeutung:** Die minimale Phasenkohärenz, die das SubQG erreichen muss, damit ein potenzieller "Peak" für einen Jump in Betracht gezogen wird.
*   **Wertebereich:** Fließkommazahl zwischen 0 und 1 (z.B. 0.6 bis 0.9).
*   **Standardwert:** `0.75`

### `subqgJumpCoherenceDropFactor`

*   **Bedeutung:** Der relative Abfallfaktor der Phasenkohärenz (von ihrem Peak-Wert), der einen Jump auslösen kann, nachdem ein Peak-Zustand erreicht wurde. Z.B. ein Wert von 0.1 bedeutet, dass ein Jump ausgelöst wird, wenn die Kohärenz um 10% ihres Peak-Wertes fällt.
*   **Wertebereich:** Fließkommazahl zwischen 0 und 1 (z.B. 0.05 bis 0.2).
*   **Standardwert:** `0.1`

### `subqgJumpEnergyDropFactorFromPeak`

*   **Bedeutung:** Der relative Abfallfaktor der Durchschnittsenergie (von ihrem Peak-Wert), der einen Jump auslösen kann, nachdem ein Peak-Zustand erreicht wurde.
*   **Wertebereich:** Fließkommazahl zwischen 0 und 1 (z.B. 0.03 bis 0.15).
*   **Standardwert:** `0.05`

### `subqgJumpMaxStepsToTrackPeak`

*   **Bedeutung:** Die maximale Anzahl an Simulationsschritten, die ein potenzieller Peak-Zustand (hohe Energie und Kohärenz) verfolgt wird. Wenn innerhalb dieser Schritte kein signifikanter Abfall (gemäß den Drop-Faktoren) erfolgt, wird die Jump-Erkennung für diesen Peak zurückgesetzt.
*   **Wertebereich:** Positive Ganzzahl, z.B. 3 bis 10.
*   **Standardwert:** `5`

### `subqgJumpActiveDuration`

*   **Bedeutung:** Die Anzahl der Simulationsschritte, für die der `activeSubQgJumpModifier` (der die internen Zustände von M.Y.R.A. beeinflusst) nach einem erkannten Jump aktiv bleibt.
*   **Wertebereich:** Positive Ganzzahl, z.B. 1 bis 10.
*   **Standardwert:** `3`

### `subqgJumpQnsDirectModifierStrength`

*   **Bedeutung:** Ein Skalierungsfaktor, der die Stärke des `activeSubQgJumpModifier` bestimmt. Dieser Modifikator wird aus der normalisierten Energie und Kohärenz des Jumps berechnet und dann mit diesem Faktor multipliziert.
*   **Wertebereich:** Fließkommazahl, z.B. 0.1 bis 2.0.
*   **Standardwert:** `0.5`
*   **Interaktionen:** Beeinflusst direkt, wie stark ein SubQG-Jump die Aktivierungen der Knoten und andere interne Zustände von M.Y.R.A. verändert.

## RNG (Random Number Generator) Parameter

### `rngType`

*   **Bedeutung:** Wählt den Typ des Zufallszahlengenerators, der für verschiedene stochastische Prozesse im SubQG (z.B. initiales Phasenrauschen, Energierauschen pro Schritt) und potenziell in anderen Teilen der Simulation verwendet wird.
*   **Mögliche Werte:**
    *   `'subqg'`: Verwendet einen deterministischen Linearen Kongruenzgenerator (LCG). Bei gleichem `subqgSeed` wird dieselbe Sequenz von Zufallszahlen erzeugt, was die Simulation reproduzierbar macht.
    *   `'quantum'`: Verwendet `Math.random()`, was zu nicht-deterministischen, pseudo-zufälligen Zahlen führt.
*   **Standardwert:** `'subqg'`

### `subqgSeed`

*   **Bedeutung:** Der Startwert (Seed) für den deterministischen `'subqg'` RNG.
*   **Bedingung:** Nur relevant, wenn `rngType` auf `'subqg'` gesetzt ist.
*   **Wertebereich:** Eine Ganzzahl. Wenn leer oder `undefined` gelassen, wird ein zufälliger Seed für den deterministischen RNG beim Start gewählt.
*   **Standardwert:** `undefined`
*   **Interaktionen:** Ein fester Seed ermöglicht reproduzierbare Simulationsläufe, solange andere Parameter konstant bleiben und der `rngType` auf `'subqg'` steht.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
