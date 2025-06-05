# M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten: Persona & Verhalten

Diese Datei erläutert die Konfigurationsparameter, die die Persönlichkeiten, ethischen Richtlinien, Antwortinstruktionen und Systemverhaltensweisen (wie Zerfallsraten und Temperatureinflüsse) von M.Y.R.A., C.A.E.L.U.M. und **konfigurierbaren Agenten** steuern.

## Agentenspezifische Persona-Einstellungen

Jeder Agent (M.Y.R.A., C.A.E.L.U.M. und jeder konfigurierbare Agent) hat seine eigene, unabhängige Persona, die sein grundlegendes Auftreten und seine Antwortweise definiert.

### Für M.Y.R.A. (konfiguriert über `myraConfig.*` Felder bzw. `myra*Key` für Übersetzungen):
*   **`myraName`**: Name, den M.Y.R.A. für sich selbst verwendet.
*   **`myraRoleDescription`**: Detaillierte Beschreibung von M.Y.R.A.s Rolle und Persönlichkeit.
*   **`myraEthicsPrinciples`**: Ethische Kernprinzipien von M.Y.R.A.
*   **`myraResponseInstruction`**: Spezifische Anweisungen, wie M.Y.R.A. antworten soll.

Diese Werte werden aus den entsprechenden `*Key`-Feldern (z.B. `myraNameKey`) basierend auf der globalen Spracheinstellung übersetzt und können im `SettingsPanel` angepasst werden.

### Für C.A.E.L.U.M. (konfiguriert über `myraConfig.caelum*` Felder bzw. `caelum*Key` für Übersetzungen):
*   **`caelumName`**: Name, den C.A.E.L.U.M. für sich selbst verwendet.
*   **`caelumRoleDescription`**: Detaillierte Beschreibung von C.A.E.L.U.M.s Rolle.
*   **`caelumEthicsPrinciples`**: Ethische Kernprinzipien von C.A.E.L.U.M.
*   **`caelumResponseInstruction`**: Spezifische Anweisungen, wie C.A.E.L.U.M. antworten soll.

Analog zu M.Y.R.A. werden diese Werte aus den `*Key`-Feldern übersetzt und sind im `SettingsPanel` anpassbar.

### Für konfigurierbare Agenten (`myraConfig.configurableAgents[n].*`):
Jeder Agent in der `configurableAgents`-Liste besitzt folgende direkt editierbare Persona-Felder in seinem Konfigurationsobjekt:
*   **`name`**: Name des Agenten.
*   **`roleDescription`**: Rollenbeschreibung des Agenten.
*   **`ethicsPrinciples`**: Ethische Prinzipien des Agenten.
*   **`responseInstruction`**: Antwortinstruktionen für den Agenten.
*   **`personalityTrait`**: Optionales Merkmal ('critical', 'visionary', 'conservative', 'neutral'), das die Antwortweise beeinflussen kann. Dies wird primär durch die Formulierung der `responseInstruction` und die Systeminstruktion für das LLM umgesetzt.

Diese Einstellungen sind im `SettingsPanel` im Bereich des jeweiligen konfigurierbaren Agenten zugänglich.

## Gemeinsame / Globale Parameter

Diese Parameter in `myraConfig` beeinflussen das Verhalten aller Agenten oder das allgemeine System.

### `userNameKey` (Referenz auf `myraConfig.userName`)
*   **Bedeutung:** Schlüssel für den Namen, den alle KIs verwenden, um den Benutzer im Chat anzusprechen.
*   **Standardwert:** `"user.name"` (übersetzt zu "Benutzer")

### `temperatureLimbusInfluence`
*   **Bedeutung:** Faktor, wie stark der `arousal`-Wert des **jeweiligen aktiven Agenten** (M.Y.R.A., C.A.E.L.U.M. oder konfigurierbarer Agent) die effektive Temperatur für seine Antwort beeinflusst.
*   **Standardwert:** `0.1`

### `temperatureCreativusInfluence`
*   **Bedeutung:** Faktor, wie stark die Aktivierung des `Creativus`-Knotens (oder des äquivalenten Knotens für andere Agenten, typischerweise der Kreativitäts-/Musteranalyse-Knoten) des **jeweiligen aktiven Agenten** die effektive Temperatur beeinflusst.
*   **Standardwert:** `0.15`

### `maxHistoryMessagesForPrompt`
*   **Bedeutung:** Maximale Anzahl vorheriger Chat-Nachrichten (Benutzer und Assistenten), die als Kontext für das LLM verwendet werden. Gilt global für alle LLM-Aufrufe aller Agenten.
*   **Standardwert:** `8`

### `maxPadHistorySize`
*   **Bedeutung:** Die maximale Anzahl von PAD-Zuständen (Pleasure, Arousal, Dominance), die für jeden Agenten im Emotionsverlauf gespeichert werden.
*   **Standardwert:** `200`

### `activeChatAgent`
*   **Bedeutung:** Bestimmt, welche der Haupt-KIs (M.Y.R.A. oder C.A.E.L.U.M.) im primären Chat-Interface (`ChatInterface.tsx`) aktiv ist.
*   **Mögliche Werte:** `'myra'`, `'caelum'`.
*   **Standardwert:** `'myra'`

## Agentenspezifische System-Verhaltensparameter

Jeder Agent (M.Y.R.A., C.A.E.L.U.M. und jeder konfigurierbare Agent) hat seine eigenen Zerfallsraten für Knotenaktivierungen und Emotionen. Diese sind Teil des `systemConfig`-Objekts des jeweiligen Agenten.

### `nodeActivationDecay` (Teil von `systemConfig` jedes Agenten)
*   **Bedeutung:** Zerfallsfaktor für die Knotena_ktivierungen des Agenten pro Simulationsschritt. Beeinflusst, wie schnell die Aktivierung eines Knotens ohne weitere Stimulation abnimmt.
*   **Standardwerte:** M.Y.R.A.: `0.95`, C.A.E.L.U.M.: `0.97`. Konfigurierbare Agenten übernehmen M.Y.R.A.s Standard (`0.95`) bei Erstellung, können aber individuell angepasst werden.

### `emotionDecay` (Teil von `systemConfig` jedes Agenten)
*   **Bedeutung:** Zerfallsfaktor für die Intensität der Emotionen des Agenten pro Simulationsschritt. Beeinflusst, wie schnell emotionale Zustände ohne weitere Stimulation abklingen.
*   **Standardwerte:** M.Y.R.A.: `0.95`, C.A.E.L.U.M.: `0.98`. Konfigurierbare Agenten übernehmen M.Y.R.A.s Standard (`0.95`) bei Erstellung, können aber individuell angepasst werden.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)
