# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: Persona & Verhalten

Diese Datei erläutert die Konfigurationsparameter, die die Persönlichkeiten, ethischen Richtlinien, Antwortinstruktionen und Systemverhaltensweisen (wie Zerfallsraten und Temperatureinflüsse) von M.Y.R.A. und C.A.E.L.U.M. steuern. Diese Einstellungen finden Sie im `SettingsPanel` und sind Teil des `MyraConfig`-Objekts.

## M.Y.R.A. Persona

Diese Einstellungen definieren M.Y.R.A.s Charakter und grundlegende Antwortweise. Sie werden über Schlüssel (`myraNameKey`, etc.) referenziert, die dann basierend auf der ausgewählten Sprache in die tatsächlichen Texte übersetzt werden. Die bearbeitbaren Felder im `SettingsPanel` unter "M.Y.R.A. Persona" erlauben es, diese übersetzten Werte direkt anzupassen oder die Schlüssel selbst zu ändern.

### `myraNameKey` (Referenz auf `myraConfig.myraName`)
*   **Bedeutung:** Schlüssel für den Namen, den M.Y.R.A. für sich selbst verwendet.
*   **Standardwert:** `"myra.name"` (übersetzt zu "M.Y.R.A.")

### `myraRoleDescriptionKey` (Referenz auf `myraConfig.myraRoleDescription`)
*   **Bedeutung:** Schlüssel für die detaillierte Beschreibung von M.Y.R.A.s Rolle und Persönlichkeit.
*   **Standardwert:** `"myra.roleDescription"`

### `myraEthicsPrinciplesKey` (Referenz auf `myraConfig.myraEthicsPrinciples`)
*   **Bedeutung:** Schlüssel für M.Y.R.A.s ethische Kernprinzipien.
*   **Standardwert:** `"myra.ethicsPrinciples"`

### `myraResponseInstructionKey` (Referenz auf `myraConfig.myraResponseInstruction`)
*   **Bedeutung:** Schlüssel für spezifische Anweisungen, wie M.Y.R.A. antworten soll.
*   **Standardwert:** `"myra.responseInstruction"`

## C.A.E.L.U.M. Persona

Diese Einstellungen definieren C.A.E.L.U.M.s Charakter und grundlegende Antwortweise, analog zu M.Y.R.A. Die bearbeitbaren Felder im `SettingsPanel` unter "C.A.E.L.U.M. Persona" erlauben direkte Anpassungen.

### `caelumNameKey` (Referenz auf `myraConfig.caelumName`)
*   **Bedeutung:** Schlüssel für den Namen, den C.A.E.L.U.M. für sich selbst verwendet.
*   **Standardwert:** `"caelum.name"` (übersetzt zu "C.A.E.L.U.M.")

### `caelumRoleDescriptionKey` (Referenz auf `myraConfig.caelumRoleDescription`)
*   **Bedeutung:** Schlüssel für die detaillierte Beschreibung von C.A.E.L.U.M.s Rolle.
*   **Standardwert:** `"caelum.roleDescription"`

### `caelumEthicsPrinciplesKey` (Referenz auf `myraConfig.caelumEthicsPrinciples`)
*   **Bedeutung:** Schlüssel für C.A.E.L.U.M.s ethische Kernprinzipien.
*   **Standardwert:** `"caelum.ethicsPrinciples"`

### `caelumResponseInstructionKey` (Referenz auf `myraConfig.caelumResponseInstruction`)
*   **Bedeutung:** Schlüssel für spezifische Anweisungen, wie C.A.E.L.U.M. antworten soll.
*   **Standardwert:** `"caelum.responseInstruction"`

## Gemeinsame / Globale Parameter

### `userNameKey` (Referenz auf `myraConfig.userName`)
*   **Bedeutung:** Schlüssel für den Namen, den beide KIs verwenden, um den Benutzer im Chat anzusprechen.
*   **Standardwert:** `"user.name"` (übersetzt zu "Benutzer")

### `temperatureLimbusInfluence`
*   **Bedeutung:** Faktor, wie stark der `arousal`-Wert der **jeweiligen KI** (M.Y.R.A. oder C.A.E.L.U.M.) die effektive Temperatur für ihre Antwort beeinflusst.
*   **Standardwert:** `0.1`

### `temperatureCreativusInfluence`
*   **Bedeutung:** Faktor, wie stark die Aktivierung des `Creativus` (M.Y.R.A.) bzw. `Pattern Analyzer` (C.A.E.L.U.M.) Knotens der **jeweiligen KI** die effektive Temperatur beeinflusst.
*   **Standardwert:** `0.15`

### `maxHistoryMessagesForPrompt`
*   **Bedeutung:** Maximale Anzahl vorheriger Chat-Nachrichten (Benutzer und Assistenten), die als Kontext für das LLM verwendet werden. Gilt global für alle LLM-Aufrufe.
*   **Standardwert:** `8`

## M.Y.R.A. System-Verhaltensparameter

Diese Parameter finden Sie im `SettingsPanel` unter "M.Y.R.A. System".

### `nodeActivationDecay`
*   **Bedeutung:** Zerfallsfaktor für M.Y.R.A.s Knotena_ktivierungen pro Simulationsschritt.
*   **Standardwert:** `0.95`

### `emotionDecay`
*   **Bedeutung:** Zerfallsfaktor für M.Y.R.A.s Emotionen pro Simulationsschritt.
*   **Standardwert:** `0.95`

## C.A.E.L.U.M. System-Verhaltensparameter

Diese Parameter finden Sie im `SettingsPanel` unter "C.A.E.L.U.M. System".

### `caelumNodeActivationDecay`
*   **Bedeutung:** Zerfallsfaktor für C.A.E.L.U.M.s Knotena_ktivierungen pro Simulationsschritt. Beeinflusst, wie lange wichtige Knotenaktivierungen bestehen bleiben.
*   **Standardwert:** `0.97`

### `caelumEmotionDecay`
*   **Bedeutung:** Zerfallsfaktor für C.A.E.L.U.M.s (oft gedämpfte) Emotionen pro Simulationsschritt. Beeinflusst, wie stabil emotionale Grundstimmungen bleiben.
*   **Standardwert:** `0.98`

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)