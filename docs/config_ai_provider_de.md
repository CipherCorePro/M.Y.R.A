# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: AI Provider

Diese Datei erläutert die Konfigurationsparameter im Zusammenhang mit der Auswahl und Konfiguration des KI-Providers (Large Language Model), der von M.Y.R.A. und C.A.E.L.U.M. für die Generierung von Antworten verwendet wird. Diese Einstellungen finden Sie im `SettingsPanel` unter den Gruppen "M.Y.R.A. KI Provider" und "C.A.E.L.U.M. KI Provider" und sind Teil des `MyraConfig`-Objekts unter `myraAIProviderConfig` bzw. `caelumAIProviderConfig`.

## M.Y.R.A. AI Provider (`myraAIProviderConfig`)

### `myraAIProviderConfig.aiProvider`

*   **Bedeutung:** Legt fest, welcher KI-Dienst für M.Y.R.A. verwendet wird.
*   **Mögliche Werte:** `'gemini'`, `'lmstudio'`.
*   **Standardwert:** `'gemini'`

### `myraAIProviderConfig.geminiModelName`

*   **Bedeutung:** Gemini-Modellname für M.Y.R.A. (z.B. `'gemini-2.5-flash-preview-04-17'`).
*   **Bedingung:** Wenn `myraAIProviderConfig.aiProvider` = `'gemini'`.
*   **Standardwert:** `'gemini-2.5-flash-preview-04-17'`

### `myraAIProviderConfig.lmStudioBaseUrl`

*   **Bedeutung:** Basis-URL des LM Studio API-Endpunkts für M.Y.R.A.
*   **Bedingung:** Wenn `myraAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Standardwert:** `'http://localhost:1234/v1'`

### `myraAIProviderConfig.lmStudioGenerationModel`

*   **Bedeutung:** LM Studio Modell-Identifikator für M.Y.R.A.
*   **Bedingung:** Wenn `myraAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Standardwert:** `'google/gemma-3-1b'`

### `myraAIProviderConfig.lmStudioEmbeddingModel`

*   **Bedeutung:** LM Studio Modell für Embeddings (aktuell nicht aktiv für Antwortgenerierung genutzt, aber für zukünftige RAG-Verbesserungen relevant).
*   **Standardwert:** `'text-embedding-nomic-embed-text-v1.5'`

### `myraAIProviderConfig.temperatureBase`

*   **Bedeutung:** Basistemperatur für M.Y.R.A.s KI-Antwortgenerierung.
*   **Wertebereich:** Typischerweise 0.0 bis 2.0.
*   **Standardwert:** `0.7`
*   **Interaktionen:** Wird dynamisch durch `temperatureLimbusInfluence` und `temperatureCreativusInfluence` basierend auf M.Y.R.A.s internem Zustand modifiziert.

## C.A.E.L.U.M. AI Provider (`caelumAIProviderConfig`)

### `caelumAIProviderConfig.aiProvider`

*   **Bedeutung:** Legt fest, welcher KI-Dienst für C.A.E.L.U.M. verwendet wird.
*   **Mögliche Werte:** `'gemini'`, `'lmstudio'`.
*   **Standardwert:** `'gemini'`

### `caelumAIProviderConfig.geminiModelName`

*   **Bedeutung:** Gemini-Modellname für C.A.E.L.U.M.
*   **Bedingung:** Wenn `caelumAIProviderConfig.aiProvider` = `'gemini'`.
*   **Standardwert:** `'gemini-2.5-flash-preview-04-17'`

### `caelumAIProviderConfig.lmStudioBaseUrl`

*   **Bedeutung:** Basis-URL des LM Studio API-Endpunkts für C.A.E.L.U.M.
*   **Bedingung:** Wenn `caelumAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Standardwert:** `'http://localhost:1234/v1'`

### `caelumAIProviderConfig.lmStudioGenerationModel`

*   **Bedeutung:** LM Studio Modell-Identifikator für C.A.E.L.U.M.
*   **Bedingung:** Wenn `caelumAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Standardwert:** `'NousResearch/Nous-Hermes-2-Mistral-7B-DPO'`

### `caelumAIProviderConfig.lmStudioEmbeddingModel`

*   **Bedeutung:** LM Studio Modell für Embeddings (aktuell nicht aktiv für Antwortgenerierung genutzt).
*   **Standardwert:** `'text-embedding-nomic-embed-text-v1.5'`

### `caelumAIProviderConfig.temperatureBase`

*   **Bedeutung:** Basistemperatur für C.A.E.L.U.M.s KI-Antwortgenerierung.
*   **Wertebereich:** Typischerweise 0.0 bis 2.0.
*   **Standardwert:** `0.5`
*   **Interaktionen:** Wird dynamisch durch `temperatureLimbusInfluence` und `temperatureCreativusInfluence` basierend auf C.A.E.L.U.M.s internem Zustand modifiziert.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)