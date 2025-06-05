# M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten: AI Provider Konfiguration

Diese Datei erläutert die Konfigurationsparameter im Zusammenhang mit der Auswahl und Konfiguration des KI-Providers (Large Language Model). Diese Einstellungen gelten für M.Y.R.A., C.A.E.L.U.M. und **jeden individuell konfigurierbaren Agenten**.

*   Für M.Y.R.A. finden Sie diese Einstellungen im `SettingsPanel` unter "M.Y.R.A. KI Provider" (Pfad in `MyraConfig`: `myraAIProviderConfig`).
*   Für C.A.E.L.U.M. finden Sie diese Einstellungen im `SettingsPanel` unter "C.A.E.L.U.M. KI Provider" (Pfad in `MyraConfig`: `caelumAIProviderConfig`).
*   Für **jeden konfigurierbaren Agenten** finden Sie diese Einstellungen im `SettingsPanel` innerhalb der jeweiligen Agenten-Sektion unter "KI Provider" (Pfad in `MyraConfig`: `configurableAgents[n].aiProviderConfig`).

Jeder Agent kann somit einen eigenen, unabhängigen KI-Provider und dessen spezifische Einstellungen verwenden.

## Allgemeine AI Provider Parameter (gelten pro Agent)

Die folgenden Parameter sind innerhalb des `aiProviderConfig`-Objekts jedes Agenten (M.Y.R.A., C.A.E.L.U.M. oder ein konfigurierbarer Agent) verfügbar:

### `aiProvider`

*   **Bedeutung:** Legt fest, welcher KI-Dienst für den jeweiligen Agenten verwendet wird.
*   **Mögliche Werte:** `'gemini'`, `'lmstudio'`.
*   **Standardwert (für M.Y.R.A. & C.A.E.L.U.M.):** `'gemini'`
*   **Standardwert (für neue konfigurierbare Agenten):** Übernimmt bei Erstellung den Standard von M.Y.R.A. (`'gemini'`).

### `geminiModelName`

*   **Bedeutung:** Gemini-Modellname (z.B. `'gemini-2.5-flash-preview-04-17'`).
*   **Bedingung:** Wenn `aiProvider` = `'gemini'`.
*   **Standardwerte:**
    *   M.Y.R.A.: `'gemini-2.5-flash-preview-04-17'`
    *   C.A.E.L.U.M.: `'gemini-2.5-flash-preview-04-17'`
    *   Konfigurierbare Agenten: Übernehmen M.Y.R.A.s Standard bei Erstellung.

### `lmStudioBaseUrl`

*   **Bedeutung:** Basis-URL des LM Studio API-Endpunkts.
*   **Bedingung:** Wenn `aiProvider` = `'lmstudio'`.
*   **Standardwert (für alle Agenten-Defaults):** `'http://localhost:1234/v1'`

### `lmStudioGenerationModel`

*   **Bedeutung:** LM Studio Modell-Identifikator für die Textgenerierung.
*   **Bedingung:** Wenn `aiProvider` = `'lmstudio'`.
*   **Standardwerte:**
    *   M.Y.R.A.: `'google/gemma-3-1b'`
    *   C.A.E.L.U.M.: `'NousResearch/Nous-Hermes-2-Mistral-7B-DPO'`
    *   Konfigurierbare Agenten: Übernehmen M.Y.R.A.s Standard bei Erstellung.

### `lmStudioEmbeddingModel`

*   **Bedeutung:** LM Studio Modell für Embeddings. Dieses Modell wird aktuell **nicht** aktiv für die Antwortgenerierung verwendet, sondern ist für zukünftige, verfeinerte RAG-Implementierungen (z.B. semantische Suche statt Keyword-Suche) vorgesehen.
*   **Standardwert (für alle Agenten-Defaults):** `'text-embedding-nomic-embed-text-v1.5'` (Beispiel)

### `temperatureBase`

*   **Bedeutung:** Basistemperatur für die KI-Antwortgenerierung des Agenten. Ein höherer Wert führt zu kreativeren, aber potenziell weniger kohärenten Antworten.
*   **Wertebereich:** Typischerweise 0.0 bis 2.0.
*   **Standardwerte:**
    *   M.Y.R.A.: `0.7`
    *   C.A.E.L.U.M.: `0.5` (oft niedriger für präzisere, analytischere Antworten)
    *   Konfigurierbare Agenten: Übernehmen M.Y.R.A.s Standard bei Erstellung.
*   **Interaktionen:** Die effektive Temperatur wird dynamisch durch die globalen `temperatureLimbusInfluence` und `temperatureCreativusInfluence` Parameter (aus `MyraConfig`) modifiziert, basierend auf dem *individuellen internen Zustand (Emotionen, Knotenaktivierungen) des jeweiligen Agenten*.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)
