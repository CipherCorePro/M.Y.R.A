# M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten: Adaptive Fitness

Diese Datei erläutert die Konfigurationsparameter für das Adaptive Fitness System. Dieses System bewertet die "Gesundheit" und Leistung von M.Y.R.A., C.A.E.L.U.M. und **jedem individuell konfigurierbaren Agenten** anhand verschiedener Metriken und Dimensionen.

*   M.Y.R.A.s Fitness-Update-Intervall ist in `myraConfig.adaptiveFitnessUpdateInterval` definiert. Ihre Fitness-Gewichte sind in `myraConfig.adaptiveFitnessConfig`.
*   C.A.E.L.U.M.s Fitness-Update-Intervall ist in `myraConfig.caelumAdaptiveFitnessUpdateInterval` definiert. C.A.E.L.U.M. verwendet ebenfalls die *globale* `myraConfig.adaptiveFitnessConfig` für seine Gewichtungen, wendet diese aber auf seinen eigenen Zustand an.
*   Für **jeden konfigurierbaren Agenten** ist das Update-Intervall Teil seines `systemConfig.adaptiveFitnessUpdateInterval` und seine spezifischen Fitness-Gewichte sind in `configurableAgents[n].adaptiveFitnessConfig` gespeichert.

Jeder Agent hat eine eigene Instanz des `AdaptiveFitnessManager`, die mit der jeweiligen Konfiguration und dem Zustand des Agenten arbeitet.

## Agentenspezifische Fitness-Parameter

### `adaptiveFitnessUpdateInterval` (Teil von `systemConfig` jedes Agenten)

*   **Bedeutung:** Die Anzahl der Simulationsschritte, nach denen die Fitnesswerte des jeweiligen Agenten neu berechnet werden.
*   **Standardwerte:** M.Y.R.A.: `3`, C.A.E.L.U.M.: `5`. Konfigurierbare Agenten übernehmen M.Y.R.A.s Standard (`3`) bei Erstellung, können aber individuell angepasst werden.
*   **Gruppe im SettingsPanel:** Jeweils im System-Tab des Agenten (für M.Y.R.A., C.A.E.L.U.M.) oder im "Systemkonfiguration"-Unterabschnitt für konfigurierbare Agenten.

## Agentenspezifische Fitness-Gewichtungskonfiguration (`adaptiveFitnessConfig` pro Agent)

Jeder Agent (M.Y.R.A., C.A.E.L.U.M. – wobei C.A.E.L.U.M. M.Y.R.A.s globale Einstellung nutzt – und jeder konfigurierbare Agent) hat sein eigenes `adaptiveFitnessConfig`-Objekt. Dieses Objekt enthält `baseMetricWeights` und `dimensionContribWeights`.

### Basismetriken-Gewichte (`adaptiveFitnessConfig.baseMetricWeights` pro Agent)

Diese Gewichte bestimmen, wie stark jede einzelne berechnete Metrik zum `overallScore` des jeweiligen Agenten beiträgt. Die Standardwerte sind für M.Y.R.A. und als Vorlage für neue konfigurierbare Agenten definiert.

#### `coherenceProxy`
*   **Beschreibung:** Proxy für interne Kohärenz, oft basierend auf dem (inversen) Konfliktniveau des Agenten.
*   **Standardwert:** `0.15`

#### `networkComplexityProxy`
*   **Beschreibung:** Proxy für die Komplexität des Knotennetzwerks des Agenten.
*   **Standardwert:** `0.05`

#### `averageResonatorScore`
*   **Beschreibung:** Durchschnittlicher Resonator-Score über alle Knoten des jeweiligen Agenten.
*   **Standardwert:** `0.15`

#### `goalAchievementProxy`
*   **Beschreibung:** Proxy für die Zielerreichung, beeinflusst durch exekutive Kontrolle, Bewertungsfokus und positive Emotionen des Agenten.
*   **Standardwert:** `0.15`

#### `explorationScore`
*   **Beschreibung:** Proxy für exploratives Verhalten, beeinflusst durch die Aktivierung des Kreativitäts-/Musteranalyse-Knotens und die Lerneffizienz des Agenten.
*   **Standardwert:** `0.15`

#### `focusScore`
*   **Beschreibung:** Proxy für fokussiertes Verhalten, beeinflusst durch die Aktivierung des Kritikknotens und geringe emotionale Erregung des Agenten.
*   **Standardwert:** `0.10`

#### `creativityScore`
*   **Beschreibung:** Proxy für Kreativität, beeinflusst durch die Aktivierung des Kreativitäts-/Musteranalyse-Knotens und die SubQG-Energie des Agenten.
*   **Standardwert:** `0.05`

#### `conflictPenaltyFactor`
*   **Beschreibung:** Malusfaktor für interne Konflikte des Agenten.
*   **Standardwert:** `-0.10`

### Dimensionsbeitrags-Gewichte (`adaptiveFitnessConfig.dimensionContribWeights` pro Agent)

Diese Gewichte definieren, wie stark die Basismetriken zu den vier übergeordneten Fitness-Dimensionen des jeweiligen Agenten beitragen.

#### `knowledgeExpansion` (Wissenserweiterung)
*   **`learningEfficiency` (Gewicht):** Beitrag der Lerneffizienz (z.B. Verarbeitung neuer Wissens-Chunks). Standard: `0.5`
*   **`explorationScore` (Gewicht):** Beitrag des Explorations-Scores. Standard: `0.5`

#### `internalCoherence` (Interne Kohärenz)
*   **`coherenceProxy` (Gewicht):** Beitrag des Kohärenz-Proxys. Standard: `0.6`
*   **`averageResonatorScore` (Gewicht):** Beitrag des mittleren Resonator-Scores. Standard: `0.2`

#### `expressiveCreativity` (Ausdruckskreativität)
*   **`creativityScore` (Gewicht):** Beitrag des Kreativitäts-Scores. Standard: `0.5`
*   **`creativusActivation` (Gewicht):** Beitrag der Aktivierung des Kreativitäts-/Musteranalyse-Knotens. Standard: `0.3`
*   **`explorationScore` (Gewicht):** Beitrag des Explorations-Scores. Standard: `0.2`

#### `goalFocus` (Zielfokus)
*   **`goalAchievementProxy` (Gewicht):** Beitrag des Zielerreichungs-Proxys. Standard: `0.6`
*   **`focusScore` (Gewicht):** Beitrag des Fokus-Scores. Standard: `0.4`

## Interaktionen und Interpretation

*   Die **Basismetriken-Gewichte** sind entscheidend für den `overallScore` jedes Agenten.
*   Die **Dimensionsbeitrags-Gewichte** helfen, die Aspekte der Fitness detaillierter zu verstehen.
*   Da M.Y.R.A. und jeder konfigurierbare Agent ihre eigene `adaptiveFitnessConfig` haben (C.A.E.L.U.M. nutzt die von M.Y.R.A.), können ihre Fitnessbewertungen trotz potenziell ähnlicher interner Zustände unterschiedlich ausfallen, wenn ihre Gewichtungen divergieren. Dies ermöglicht eine feingranulare Steuerung der "Entwicklungsziele" für jeden Agenten.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)
