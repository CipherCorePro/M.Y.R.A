# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: Persona & Verhalten

Diese Datei erläutert die Konfigurationsparameter, die die Persönlichkeiten, ethischen Richtlinien, Antwortinstruktionen und Systemverhaltensweisen (wie Zerfallsraten und Temperatureinflüsse) von M.Y.R.A. und C.A.E.L.U.M. steuern. Diese Einstellungen finden Sie im `SettingsPanel` und sind Teil des `MyraConfig`-Objekts.

## M.Y.R.A. Persona

Diese Einstellungen definieren M.Y.R.A.s Charakter und grundlegende Antwortweise.

### `myraName`

*   **Bedeutung:** Der Name, den M.Y.R.A. für sich selbst verwendet.
*   **Standardwert:** `"M.Y.R.A."`

### `myraRoleDescription`

*   **Bedeutung:** Detaillierte Beschreibung von M.Y.R.A.s Rolle und Persönlichkeit für die Systeminstruktion des LLM.
*   **Standardwert:** Eine deutsche Beschreibung, die M.Y.R.A. als "Modulare Sehnsuchts-Vernunft-Architektur" darstellt.

### `myraEthicsPrinciples`

*   **Bedeutung:** M.Y.R.A.s ethische Kernprinzipien, Teil der Systeminstruktion.
*   **Standardwert:** Liste von Prinzipien wie Sicherheit, Wahrhaftigkeit etc.

### `myraResponseInstruction`

*   **Bedeutung:** Spezifische Anweisungen an das LLM, wie M.Y.R.A. antworten und ihren internen Zustand einfließen lassen soll.
*   **Standardwert:** Anweisung, authentisch basierend auf internem Zustand und Ethik zu antworten.

## C.A.E.L.U.M. Persona

Diese Einstellungen definieren C.A.E.L.U.M.s Charakter und grundlegende Antwortweise.

### `caelumName`

*   **Bedeutung:** Der Name, den C.A.E.L.U.M. für sich selbst verwendet.
*   **Standardwert:** `"C.A.E.L.U.M."`

### `caelumRoleDescription`

*   **Bedeutung:** Detaillierte Beschreibung von C.A.E.L.U.M.s Rolle (analytisch, forschend) für die Systeminstruktion.
*   **Standardwert:** Eine deutsche Beschreibung, die C.A.E.L.U.M. als "Cognitive Analytical Emergence Layer Underlying Mechanism" darstellt.

### `caelumEthicsPrinciples`

*   **Bedeutung:** C.A.E.L.U.M.s ethische Kernprinzipien (z.B. Objektivität, Genauigkeit).
*   **Standardwert:** Liste von Prinzipien, die seine analytische Natur widerspiegeln.

### `caelumResponseInstruction`

*   **Bedeutung:** Spezifische Anweisungen an das LLM, wie C.A.E.L.U.M. antworten soll (präzise, logisch, neugierig).
*   **Standardwert:** Anweisung, analytisch zu antworten und Verbindungen zu übergeordneten Konzepten herzustellen.

## Gemeinsame / Globale Parameter

### `userName`

*   **Bedeutung:** Der Name, den beide KIs verwenden, um den Benutzer im Chat anzusprechen.
*   **Standardwert:** `"User"`

### `temperatureLimbusInfluence`

*   **Bedeutung:** Faktor, wie stark der `arousal`-Wert der jeweiligen KI die effektive Temperatur für ihre Antwort beeinflusst.
*   **Standardwert:** `0.1`

### `temperatureCreativusInfluence`

*   **Bedeutung:** Faktor, wie stark die Aktivierung des `Creativus` (M.Y.R.A.) bzw. `Pattern Analyzer` (C.A.E.L.U.M.) Knotens der jeweiligen KI die effektive Temperatur beeinflusst.
*   **Standardwert:** `0.15`

### `maxHistoryMessagesForPrompt`

*   **Bedeutung:** Maximale Anzahl vorheriger Chat-Nachrichten (Benutzer und Assistenten) als Kontext für das LLM. Gilt global für alle LLM-Aufrufe.
*   **Standardwert:** `8`

## M.Y.R.A. System-Verhaltensparameter

### `nodeActivationDecay`

*   **Bedeutung:** Zerfallsfaktor für M.Y.R.A.s Knotena_ktivierungen pro Simulationsschritt.
*   **Standardwert:** `0.95`

### `emotionDecay`

*   **Bedeutung:** Zerfallsfaktor für M.Y.R.A.s Emotionen pro Simulationsschritt.
*   **Standardwert:** `0.95`

## C.A.E.L.U.M. System-Verhaltensparameter

### `caelumNodeActivationDecay`

*   **Bedeutung:** Zerfallsfaktor für C.A.E.L.U.M.s Knotena_ktivierungen pro Simulationsschritt. Beeinflusst, wie lange wichtige Knotenaktivierungen bestehen bleiben.
*   **Standardwert:** `0.97`
*   **Experimentelle Werte:** `0.96` (um Aktivierungen länger zu halten)

### `caelumEmotionDecay`

*   **Bedeutung:** Zerfallsfaktor für C.A.E.L.U.M.s (oft gedämpfte) Emotionen pro Simulationsschritt. Beeinflusst, wie stabil emotionale Grundstimmungen bleiben.
*   **Standardwert:** `0.98`
*   **Experimentelle Werte:** `0.97` (um Stimmungen stabiler zu halten)

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)