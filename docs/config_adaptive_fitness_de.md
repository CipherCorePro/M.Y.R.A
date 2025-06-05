# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: Adaptive Fitness

Diese Datei erläutert die Konfigurationsparameter für das Adaptive Fitness System. Dieses System bewertet die "Gesundheit" und Leistung von M.Y.R.A. und C.A.E.L.U.M. anhand verschiedener Metriken und Dimensionen. Die Konfiguration steuert, wie diese Bewertungen berechnet werden. Die Einstellungen finden Sie im `SettingsPanel`. Die Gewichtungen (`adaptiveFitnessConfig`) sind global in `MyraConfig` definiert, werden aber von separaten `AdaptiveFitnessManager`-Instanzen auf die jeweiligen Zustände von M.Y.R.A. und C.A.E.L.U.M. angewendet. Die Update-Intervalle sind spezifisch für jede KI.

## KI-spezifische Fitness-Parameter

### `adaptiveFitnessUpdateInterval` (M.Y.R.A.)

*   **Bedeutung:** Die Anzahl der Simulationsschritte (`simulationStep`), nach denen die Fitnesswerte von **M.Y.R.A.** neu berechnet und aktualisiert werden.
*   **Wertebereich:** Eine positive Ganzzahl.
*   **Standardwert:** `3`
*   **Gruppe im SettingsPanel:** "M.Y.R.A. System"

### `caelumAdaptiveFitnessUpdateInterval` (C.A.E.L.U.M.)

*   **Bedeutung:** Die Anzahl der Simulationsschritte (`simulationStepCaelum`), nach denen die Fitnesswerte von **C.A.E.L.U.M.** neu berechnet und aktualisiert werden.
*   **Wertebereich:** Eine positive Ganzzahl.
*   **Standardwert:** `5`
*   **Gruppe im SettingsPanel:** "C.A.E.L.U.M. System"

## Geteilte Fitness-Gewichtungskonfiguration (`adaptiveFitnessConfig`)

Die folgenden Gewichtungen sind in `myraConfig.adaptiveFitnessConfig` definiert und werden **sowohl** für die Fitnessberechnung von M.Y.R.A. als auch für C.A.E.L.U.M. verwendet. Allerdings wendet jede KI diese Gewichte auf ihren **eigenen, unabhängigen internen Zustand** (eigene Knoten, Emotionen, SubQG-Metriken, Anzahl verarbeiteter Text-Chunks etc.) an. Zwei separate Instanzen des `AdaptiveFitnessManager` führen diese Berechnungen durch.

### Basismetriken-Gewichte (`adaptiveFitnessConfig.baseMetricWeights`)

Diese Gewichte bestimmen, wie stark jede einzelne berechnete Metrik zum `overallScore` der jeweiligen KI beiträgt.

#### `coherenceProxy`
*   **Beschreibung:** Proxy für interne Kohärenz, oft basierend auf dem (inversen) Konfliktniveau.
*   **Standardwert:** `0.15`

#### `networkComplexityProxy`
*   **Beschreibung:** Proxy für die Komplexität des Knotennetzwerks.
*   **Standardwert:** `0.05`

#### `averageResonatorScore`
*   **Beschreibung:** Durchschnittlicher Resonator-Score über alle Knoten der jeweiligen KI.
*   **Standardwert:** `0.15`

#### `goalAchievementProxy`
*   **Beschreibung:** Proxy für die Zielerreichung, beeinflusst durch exekutive Kontrolle, Bewertungsfokus und positive Emotionen.
*   **Standardwert:** `0.15`

#### `explorationScore`
*   **Beschreibung:** Proxy für exploratives Verhalten, beeinflusst durch Creativus/Pattern Analyzer Aktivierung und Lerneffizienz.
*   **Standardwert:** `0.15`

#### `focusScore`
*   **Beschreibung:** Proxy für fokussiertes Verhalten, beeinflusst durch Criticus/Logic Verifier Aktivierung und geringe emotionale Erregung.
*   **Standardwert:** `0.10`

#### `creativityScore`
*   **Beschreibung:** Proxy für Kreativität, beeinflusst durch Creativus/Pattern Analyzer Aktivierung und SubQG-Energie.
*   **Standardwert:** `0.05`

#### `conflictPenaltyFactor`
*   **Beschreibung:** Malusfaktor für interne Konflikte.
*   **Standardwert:** `-0.10`

### Dimensionsbeitrags-Gewichte (`adaptiveFitnessConfig.dimensionContribWeights`)

Diese Gewichte definieren, wie stark die Basismetriken zu den vier übergeordneten Fitness-Dimensionen der jeweiligen KI beitragen.

#### `knowledgeExpansion`
*   **`learningEfficiency` (Gewicht):** Beitrag der Lerneffizienz (z.B. Verarbeitung neuer Wissens-Chunks). Standard: `0.5`
*   **`explorationScore` (Gewicht):** Beitrag des Explorations-Scores. Standard: `0.5`

#### `internalCoherence`
*   **`coherenceProxy` (Gewicht):** Beitrag des Kohärenz-Proxys. Standard: `0.6`
*   **`averageResonatorScore` (Gewicht):** Beitrag des mittleren Resonator-Scores. Standard: `0.2`

#### `expressiveCreativity`
*   **`creativityScore` (Gewicht):** Beitrag des Kreativitäts-Scores. Standard: `0.5`
*   **`creativusActivation` (Gewicht):** Beitrag der Aktivierung des Creativus (M.Y.R.A.) bzw. Pattern Analyzer (C.A.E.L.U.M.) Knotens. Standard: `0.3`
*   **`explorationScore` (Gewicht):** Beitrag des Explorations-Scores. Standard: `0.2`

#### `goalFocus`
*   **`goalAchievementProxy` (Gewicht):** Beitrag des Zielerreichungs-Proxys. Standard: `0.6`
*   **`focusScore` (Gewicht):** Beitrag des Fokus-Scores. Standard: `0.4`

## Interaktionen und Interpretation

*   Die **Basismetriken-Gewichte** sind entscheidend für den `overallScore` jeder KI.
*   Die **Dimensionsbeitrags-Gewichte** helfen, die Aspekte der Fitness detaillierter zu verstehen und zu visualisieren.
*   Obwohl die Gewichtungsstruktur geteilt ist, führt die Anwendung auf die unterschiedlichen internen Zustände von M.Y.R.A. und C.A.E.L.U.M. zu unabhängigen Fitnessbewertungen für jede KI.
*   Die Berechnung der einzelnen Metriken (z.B. `learningEfficiencyProxy`, `coherenceProxy`) erfolgt in `AdaptiveFitnessManager.calculateMetricsAndFitness()` und kann je nach KI leicht variieren, falls spezifische Knoten-IDs oder Zustände unterschiedlich interpretiert werden (obwohl die aktuelle Implementierung weitgehend generisch ist).

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)