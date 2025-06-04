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

Die folgenden Gewichtungen sind in `myraConfig.adaptiveFitnessConfig` definiert und werden **sowohl** für die Fitnessberechnung von M.Y.R.A. als auch für C.A.E.L.U.M. verwendet. Allerdings wendet jede KI diese Gewichte auf ihren **eigenen, unabhängigen internen Zustand** (eigene Knoten, Emotionen, etc.) an.

### Basismetriken-Gewichte (`adaptiveFitnessConfig.baseMetricWeights`)

Diese Gewichte bestimmen, wie stark jede einzelne berechnete Metrik zum `overallFitnessScore` der jeweiligen KI beiträgt.

#### `coherenceProxy`
*   **Standardwert:** `0.15`

#### `networkComplexityProxy`
*   **Standardwert:** `0.05`

#### `averageResonatorScore`
*   **Standardwert:** `0.15`

#### `goalAchievementProxy`
*   **Standardwert:** `0.15`

#### `explorationScore`
*   **Standardwert:** `0.15`

#### `focusScore`
*   **Standardwert:** `0.10`

#### `creativityScore`
*   **Standardwert:** `0.05`

#### `conflictPenaltyFactor`
*   **Standardwert:** `-0.10`

### Dimensionsbeitrags-Gewichte (`adaptiveFitnessConfig.dimensionContribWeights`)

Diese Gewichte definieren, wie stark die Basismetriken zu den vier übergeordneten Fitness-Dimensionen der jeweiligen KI beitragen.

#### `knowledgeExpansion`
*   **`learningEfficiency` (Gewicht):** Standard: `0.5`
*   **`explorationScore` (Gewicht):** Standard: `0.5`

#### `internalCoherence`
*   **`coherenceProxy` (Gewicht):** Standard: `0.6`
*   **`averageResonatorScore` (Gewicht):** Standard: `0.2`

#### `expressiveCreativity`
*   **`creativityScore` (Gewicht):** Standard: `0.5`
*   **`creativusActivation` (Gewicht):** Standard: `0.3` (angewendet auf M.Y.R.A.s Creativus bzw. C.A.E.L.U.M.s Pattern Analyzer Aktivierung)
*   **`explorationScore` (Gewicht):** Standard: `0.2`

#### `goalFocus`
*   **`goalAchievementProxy` (Gewicht):** Standard: `0.6`
*   **`focusScore` (Gewicht):** Standard: `0.4`

## Interaktionen und Interpretation

*   Die **Basismetriken-Gewichte** sind entscheidend für den `overallFitnessScore` jeder KI.
*   Die **Dimensionsbeitrags-Gewichte** helfen, die Aspekte der Fitness detaillierter zu verstehen.
*   Obwohl die Gewichtungsstruktur geteilt ist, führt die Anwendung auf die unterschiedlichen internen Zustände von M.Y.R.A. und C.A.E.L.U.M. zu unabhängigen Fitnessbewertungen für jede KI.
*   Viele Metriken sind aktuell vereinfacht implementiert (Proxies).

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
