# M.Y.R.A. Konfiguration: Adaptive Fitness

Diese Datei erläutert die Konfigurationsparameter für das Adaptive Fitness System von M.Y.R.A. Dieses System bewertet M.Y.R.A.s "Gesundheit" und Leistung anhand verschiedener Metriken und Dimensionen. Die Konfiguration steuert, wie diese Bewertungen berechnet werden. Die Einstellungen finden Sie im `SettingsPanel` unter der Gruppe "Adaptive Fitness" und sind Teil von `myraConfig.adaptiveFitnessConfig`.

## Allgemeine Fitness-Parameter

### `adaptiveFitnessUpdateInterval`

*   **Bedeutung:** Die Anzahl der Simulationsschritte (`simulationStep`), nach denen die Fitnesswerte von M.Y.R.A. neu berechnet und aktualisiert werden.
*   **Wertebereich:** Eine positive Ganzzahl. Ein kleinerer Wert bedeutet häufigere Updates, kann aber rechenintensiver sein. Ein größerer Wert glättet die Fitness über längere Zeiträume.
*   **Standardwert:** `3` (d.h. alle 3 Simulationsschritte).
*   **Interaktionen:** Beeinflusst, wie schnell das System auf Veränderungen in M.Y.R.A.s Zustand reagiert, was die Anzeige im "System Status Panel" und potenziell zukünftige adaptive Mechanismen betrifft.

## Basismetriken-Gewichte (`adaptiveFitnessConfig.baseMetricWeights`)

Diese Gewichte bestimmen, wie stark jede einzelne berechnete Metrik zum `overallFitnessScore` beiträgt. Ein positiver Wert bedeutet, dass ein höherer Metrikwert die Gesamtfitness erhöht, ein negativer Wert (wie bei `conflictPenaltyFactor`), dass ein höherer Metrikwert die Gesamtfitness senkt. Die Summe der absoluten Werte dieser Gewichte wird zur Normalisierung verwendet.

### `coherenceProxy`

*   **Bedeutung:** Gewicht für die "Kohärenz-Proxy"-Metrik. Diese Metrik ist aktuell als das Inverse des `ConflictMonitor`-Levels implementiert (1 - Konfliktlevel). Hohe Kohärenz (niedriger Konflikt) sollte die Fitness positiv beeinflussen.
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.15`

### `networkComplexityProxy`

*   **Bedeutung:** Gewicht für die "Netzwerkkomplexitäts-Proxy"-Metrik. Aktuell vereinfacht und skaliert mit der Anzahl der Knoten. Die Auswirkung (positiv oder negativ) hängt vom Vorzeichen des Gewichts ab und davon, ob Komplexität als gut oder schlecht für die aktuelle Entwicklungsphase angesehen wird.
*   **Wertebereich:** Typischerweise -0.2 bis 0.2.
*   **Standardwert:** `0.05` (leicht positiv)

### `averageResonatorScore`

*   **Bedeutung:** Gewicht für den durchschnittlichen "Resonator Score" aller (quantenfähigen) Knoten. Ein höherer Durchschnitt könnte auf eine "gesündere" oder aktivere Quantendynamik hinweisen.
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.15`

### `goalAchievementProxy`

*   **Bedeutung:** Gewicht für die "Zielerreichungs-Proxy"-Metrik. Diese Metrik versucht, Aspekte wie Impulskontrolle, Bewertungszustände und positive Emotionen zu kombinieren, um eine Annäherung an zielgerichtetes Verhalten zu simulieren.
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.15`

### `explorationScore`

*   **Bedeutung:** Gewicht für die "Explorations-Score"-Metrik. Diese bewertet, wie stark M.Y.R.A. neue Informationen oder Verhaltensweisen erkundet (z.B. durch `Creativus`-Aktivierung, Verarbeitung neuer Wissens-Chunks).
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.15`

### `focusScore`

*   **Bedeutung:** Gewicht für die "Fokus-Score"-Metrik. Diese bewertet (vereinfacht), wie fokussiert M.Y.R.A.s interne Zustände sind (z.B. durch `CortexCriticus`-Aktivierung und niedrige Arousal).
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.10`

### `creativityScore`

*   **Bedeutung:** Gewicht für die "Kreativitäts-Score"-Metrik. Bewertet Aspekte wie `Creativus`-Aktivierung und möglicherweise die Neuartigkeit von Antworten (vereinfacht).
*   **Wertebereich:** Typischerweise 0.0 bis 1.0.
*   **Standardwert:** `0.05`

### `conflictPenaltyFactor`

*   **Bedeutung:** Ein **negatives** Gewicht, das als StrafFaktor für den aktuellen Konfliktlevel (`ConflictMonitor`-Knoten) dient. Ein höherer Konfliktlevel multipliziert mit diesem Faktor senkt die Gesamtfitness.
*   **Wertebereich:** Typischerweise -1.0 bis 0.0.
*   **Standardwert:** `-0.10` (ein Konfliktlevel von 0.5 würde die Fitness um `0.5 * -0.10 = -0.05` Punkte vor Normalisierung beeinflussen).

## Dimensionsbeitrags-Gewichte (`adaptiveFitnessConfig.dimensionContribWeights`)

Diese Gewichte definieren, wie stark die oben genannten Basismetriken (oder andere abgeleitete Werte) zu den vier übergeordneten Fitness-Dimensionen beitragen. Jede Dimension wird typischerweise als eine Summe von `(Metrikwert * Dimensionsgewicht)` berechnet und dann auf [0,1] normalisiert.

### `knowledgeExpansion` (Wissenserweiterung)

*   **`learningEfficiency` (Gewicht):** Wie stark eine (zukünftig detailliertere) Metrik für Lerneffizienz beiträgt. Aktuell nicht voll implementiert, daher ist dies ein Platzhalter.
    *   Standardwert: `0.5`
*   **`explorationScore` (Gewicht):** Wie stark der berechnete `explorationScore` zu dieser Dimension beiträgt.
    *   Standardwert: `0.5`

### `internalCoherence` (Interne Kohärenz)

*   **`coherenceProxy` (Gewicht):** Wie stark der `coherenceProxy` (basierend auf niedrigem Konflikt) beiträgt.
    *   Standardwert: `0.6`
*   **`averageResonatorScore` (Gewicht):** Wie stark der `averageResonatorScore` zur internen Stimmigkeit beiträgt.
    *   Standardwert: `0.2`

### `expressiveCreativity` (Ausdruckskraft & Kreativität)

*   **`creativityScore` (Gewicht):** Wie stark der berechnete `creativityScore` beiträgt.
    *   Standardwert: `0.5`
*   **`creativusActivation` (Gewicht):** Wie stark die direkte Aktivierung des `Creativus`-Knotens beiträgt.
    *   Standardwert: `0.3`
*   **`explorationScore` (Gewicht):** Wie stark der `explorationScore` auch zur kreativen Ausdrucksfähigkeit beiträgt (neue Pfade finden).
    *   Standardwert: `0.2`

### `goalFocus` (Zielfokus)

*   **`goalAchievementProxy` (Gewicht):** Wie stark der `goalAchievementProxy` beiträgt.
    *   Standardwert: `0.6`
*   **`focusScore` (Gewicht):** Wie stark der berechnete `focusScore` beiträgt.
    *   Standardwert: `0.4`

## Interaktionen und Interpretation

*   Die **Basismetriken-Gewichte** sind entscheidend für den `overallFitnessScore`. Eine sorgfältige Abstimmung ist hier wichtig, um zu definieren, was für M.Y.R.A. als "guter" oder "gesunder" Zustand gilt.
*   Die **Dimensionsbeitrags-Gewichte** helfen, die verschiedenen Aspekte der Fitness detaillierter zu verstehen und im "System Status Panel" anzuzeigen. Sie könnten in zukünftigen Versionen verwendet werden, um spezifischere adaptive Anpassungen vorzunehmen (z.B. wenn `knowledgeExpansion` niedrig ist, könnten Explorationsparameter erhöht werden).
*   Viele Metriken sind aktuell noch **vereinfacht implementiert** (Proxies). Zukünftige Entwicklungen könnten diese Metriken detaillierter aus dem Systemzustand ableiten (z.B. Lerneffizienz aus der Veränderung der Wissensstruktur nach dem Verarbeiten neuer Chunks, Exploration aus der Aktivierung selten genutzter Knoten, Fokus aus der Konzentration der Aktivität auf wenige Knotencluster während einer Aufgabe).

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
