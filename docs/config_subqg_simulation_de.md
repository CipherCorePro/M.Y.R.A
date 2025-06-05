# M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten: SubQG Simulation

Diese Datei erläutert die Konfigurationsparameter für das SubQuantenfeld-Grundfeld (SubQG). Jede KI-Entität (M.Y.R.A., C.A.E.L.U.M. und **jeder individuell konfigurierbare Agent**) besitzt ihr eigenes, unabhängiges SubQG-System, das ihre internen Zustände beeinflusst.

*   M.Y.R.A.s SubQG-Parameter sind direkt in `myraConfig` als Top-Level-Eigenschaften definiert (z.B. `myraConfig.subqgSize`).
*   C.A.E.L.U.M.s SubQG-Parameter sind in `myraConfig` mit dem Präfix `caelum*` versehen (z.B. `myraConfig.caelumSubqgSize`).
*   Für **jeden konfigurierbaren Agenten** sind diese Parameter Teil seines `systemConfig`-Objekts, das unter `myraConfig.configurableAgents[n].systemConfig` zu finden ist.

Alle im Folgenden beschriebenen Parameter existieren somit für jede dieser Entitäten (mit den entsprechenden Präfixen bzw. Pfaden) und können individuell im `SettingsPanel` konfiguriert werden.

## Allgemeine SubQG-Parameter (gelten pro Agent)

### `subqgSize`
*   **Bedeutung:** Größe der quadratischen SubQG-Matrix (z.B. 16x16).
*   **Standardwerte:** M.Y.R.A.: `16`, C.A.E.L.U.M.: `12`. Konfigurierbare Agenten übernehmen M.Y.R.A.s Standard (`16`) bei Erstellung, können aber individuell angepasst werden.

### `subqgBaseEnergy`
*   **Bedeutung:** Initiale Basisenergie und minimale Energierückführung für die Zellen des SubQG. Beeinflusst das Grundrauschen und die Stabilität.
*   **Standardwerte:** M.Y.R.A.: `0.01`, C.A.E.L.U.M.: `0.005`.

### `subqgCoupling`
*   **Bedeutung:** Kopplungsstärke der Energieausbreitung zwischen benachbarten Zellen im SubQG. Höhere Werte führen zu schnellerer Energieverteilung.
*   **Standardwerte:** M.Y.R.A.: `0.015`, C.A.E.L.U.M.: `0.020`.

### `subqgInitialEnergyNoiseStd`
*   **Bedeutung:** Standardabweichung des initialen Energierauschens, das bei der Initialisierung jeder Zelle hinzugefügt wird, um Varianz zu erzeugen.
*   **Standardwerte:** M.Y.R.A.: `0.001`, C.A.E.L.U.M.: `0.0005`.

### `subqgPhaseEnergyCouplingFactor`
*   **Bedeutung:** Faktor, wie stark Energieänderungen in einer Zelle die Phase dieser Zelle stochastisch beeinflussen.
*   **Standardwerte:** M.Y.R.A.: `0.1`, C.A.E.L.U.M.: `0.05`.

### `subqgPhaseDiffusionFactor`
*   **Bedeutung:** Faktor, wie stark sich Phasenunterschiede zwischen benachbarten Zellen im SubQG ausgleichen und zur Kohärenzbildung beitragen.
*   **Standardwerte:** M.Y.R.A.: `0.05`, C.A.E.L.U.M.: `0.07`.

## SubQG Jump Parameter (gelten pro Agent)

"SubQG Jumps" sind signifikante, abrupte Veränderungen im SubQG, die als interne "Ereignisse" interpretiert werden können und die kognitiv-affektiven Prozesse des Agenten beeinflussen.

### `subqgJumpMinEnergyAtPeak`
*   **Bedeutung:** Minimale Durchschnittsenergie, die im gesamten SubQG erreicht sein muss, damit das System beginnt, nach einem potenziellen Energie-Peak für einen Jump Ausschau zu halten.
*   **Standardwerte:** M.Y.R.A.: `0.03`, C.A.E.L.U.M.: `0.025`.

### `subqgJumpMinCoherenceAtPeak`
*   **Bedeutung:** Minimale Phasenkohärenz, die im gesamten SubQG erreicht sein muss, damit das System beginnt, nach einem potenziellen Kohärenz-Peak für einen Jump Ausschau zu halten.
*   **Standardwerte:** M.Y.R.A.: `0.75`, C.A.E.L.U.M.: `0.80`.

### `subqgJumpCoherenceDropFactor`
*   **Bedeutung:** Relativer Abfallfaktor der Phasenkohärenz vom zuvor verfolgten Peak-Wert. Unterschreitet die aktuelle Kohärenz diesen Wert (Peak * (1 - Faktor)), kann dies einen Jump auslösen.
*   **Standardwerte:** M.Y.R.A.: `0.1` (d.h. 10% Abfall vom Peak), C.A.E.L.U.M.: `0.08`.

### `subqgJumpEnergyDropFactorFromPeak`
*   **Bedeutung:** Relativer Abfallfaktor der Durchschnittsenergie vom zuvor verfolgten Peak-Wert. Unterschreitet die aktuelle Energie diesen Wert, kann dies einen Jump auslösen.
*   **Standardwerte:** M.Y.R.A.: `0.05` (d.h. 5% Abfall vom Peak), C.A.E.L.U.M.: `0.04`.

### `subqgJumpMaxStepsToTrackPeak`
*   **Bedeutung:** Maximale Anzahl von Simulationsschritten, während derer ein potenzieller Peak (basierend auf `subqgJumpMinEnergyAtPeak` und `subqgJumpMinCoherenceAtPeak`) verfolgt wird. Wird in dieser Zeit kein Jump durch Abfallfaktoren detektiert, wird das Peak-Tracking zurückgesetzt.
*   **Standardwerte:** M.Y.R.A.: `5`, C.A.E.L.U.M.: `4`.

### `subqgJumpActiveDuration`
*   **Bedeutung:** Dauer (in Simulationsschritten), für die ein detektierter Jump-Modifikator aktiv bleibt und die Knotendynamik des Agenten beeinflusst.
*   **Standardwerte:** M.Y.R.A.: `3`, C.A.E.L.U.M.: `2`.

### `subqgJumpQnsDirectModifierStrength`
*   **Bedeutung:** Skalierungsfaktor für die Stärke des Jump-Modifikators, der die Aktivierung der Knoten des Agenten beeinflusst. Ein positiver Wert kann die Aktivierung erhöhen, ein negativer verringern.
*   **Standardwerte:** M.Y.R.A.: `0.5`, C.A.E.L.U.M.: `0.3`.

## RNG (Random Number Generator) Parameter (gelten pro Agent)

### `rngType`
*   **Bedeutung:** Typ des Zufallszahlengenerators, der für stochastische Prozesse in der Simulation des Agenten verwendet wird.
*   **Mögliche Werte:**
    *   `'subqg'`: Ein deterministischer Linear Congruential Generator (LCG), der bei gleichem Seed reproduzierbare Ergebnisse liefert.
    *   `'quantum'`: Verwendet `Math.random()`, was zu nicht-deterministischem Verhalten führt.
*   **Standardwert (für alle Agenten-Defaults):** `'subqg'`.

### `subqgSeed`
*   **Bedeutung:** Startwert (Seed) für den deterministischen RNG (`'subqg'`). Wenn `undefined` oder leer, wird ein zufälliger Seed beim Start generiert.
*   **Bedingung:** Nur relevant, wenn `rngType` = `'subqg'`.
*   **Standardwerte:** M.Y.R.A.: `undefined`, C.A.E.L.U.M.: `12345`. Konfigurierbare Agenten können individuelle Seeds haben oder `undefined` für einen zufälligen Start-Seed, falls ihr `rngType` `'subqg'` ist.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)
