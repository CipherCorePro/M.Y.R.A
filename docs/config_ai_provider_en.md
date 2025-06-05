# M.Y.R.A. & C.A.E.L.U.M. Configuration: AI Provider

This file explains the configuration parameters related to the selection and configuration of the AI provider (Large Language Model) used by M.Y.R.A. and C.A.E.L.U.M. for generating responses. These settings can be found in the `SettingsPanel` under the "M.Y.R.A. AI Provider" and "C.A.E.L.U.M. AI Provider" groups and are part of the `MyraConfig` object under `myraAIProviderConfig` and `caelumAIProviderConfig` respectively.

## M.Y.R.A. AI Provider (`myraAIProviderConfig`)

### `myraAIProviderConfig.aiProvider`

*   **Meaning:** Specifies which AI service is used for M.Y.R.A.
*   **Possible Values:** `'gemini'`, `'lmstudio'`.
*   **Default Value:** `'gemini'`

### `myraAIProviderConfig.geminiModelName`

*   **Meaning:** Gemini model name for M.Y.R.A. (e.g., `'gemini-2.5-flash-preview-04-17'`).
*   **Condition:** If `myraAIProviderConfig.aiProvider` = `'gemini'`.
*   **Default Value:** `'gemini-2.5-flash-preview-04-17'`

### `myraAIProviderConfig.lmStudioBaseUrl`

*   **Meaning:** Base URL of the LM Studio API endpoint for M.Y.R.A.
*   **Condition:** If `myraAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Default Value:** `'http://localhost:1234/v1'`

### `myraAIProviderConfig.lmStudioGenerationModel`

*   **Meaning:** LM Studio model identifier for M.Y.R.A.
*   **Condition:** If `myraAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Default Value:** `'google/gemma-3-1b'`

### `myraAIProviderConfig.lmStudioEmbeddingModel`

*   **Meaning:** LM Studio model for embeddings (currently not actively used for response generation, but relevant for future RAG improvements).
*   **Default Value:** `'text-embedding-nomic-embed-text-v1.5'`

### `myraAIProviderConfig.temperatureBase`

*   **Meaning:** Base temperature for M.Y.R.A.'s AI response generation.
*   **Value Range:** Typically 0.0 to 2.0.
*   **Default Value:** `0.7`
*   **Interactions:** Dynamically modified by `temperatureLimbusInfluence` and `temperatureCreativusInfluence` based on M.Y.R.A.'s internal state.

## C.A.E.L.U.M. AI Provider (`caelumAIProviderConfig`)

### `caelumAIProviderConfig.aiProvider`

*   **Meaning:** Specifies which AI service is used for C.A.E.L.U.M.
*   **Possible Values:** `'gemini'`, `'lmstudio'`.
*   **Default Value:** `'gemini'`

### `caelumAIProviderConfig.geminiModelName`

*   **Meaning:** Gemini model name for C.A.E.L.U.M.
*   **Condition:** If `caelumAIProviderConfig.aiProvider` = `'gemini'`.
*   **Default Value:** `'gemini-2.5-flash-preview-04-17'`

### `caelumAIProviderConfig.lmStudioBaseUrl`

*   **Meaning:** Base URL of the LM Studio API endpoint for C.A.E.L.U.M.
*   **Condition:** If `caelumAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Default Value:** `'http://localhost:1234/v1'`

### `caelumAIProviderConfig.lmStudioGenerationModel`

*   **Meaning:** LM Studio model identifier for C.A.E.L.U.M.
*   **Condition:** If `caelumAIProviderConfig.aiProvider` = `'lmstudio'`.
*   **Default Value:** `'NousResearch/Nous-Hermes-2-Mistral-7B-DPO'`

### `caelumAIProviderConfig.lmStudioEmbeddingModel`

*   **Meaning:** LM Studio model for embeddings (currently not actively used for response generation).
*   **Default Value:** `'text-embedding-nomic-embed-text-v1.5'`

### `caelumAIProviderConfig.temperatureBase`

*   **Meaning:** Base temperature for C.A.E.L.U.M.'s AI response generation.
*   **Value Range:** Typically 0.0 to 2.0.
*   **Default Value:** `0.5`
*   **Interactions:** Dynamically modified by `temperatureLimbusInfluence` and `temperatureCreativusInfluence` based on C.A.E.L.U.M.'s internal state.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)