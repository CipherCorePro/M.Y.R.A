# M.Y.R.A., C.A.E.L.U.M. & Configurable Agents: AI Provider Configuration

This file explains the configuration parameters related to the selection and configuration of the AI provider (Large Language Model). These settings apply to M.Y.R.A., C.A.E.L.U.M., and **each individually configurable agent**.

*   For M.Y.R.A., these settings are found in the `SettingsPanel` under "M.Y.R.A. AI Provider" (path in `MyraConfig`: `myraAIProviderConfig`).
*   For C.A.E.L.U.M., these settings are found in the `SettingsPanel` under "C.A.E.L.U.M. AI Provider" (path in `MyraConfig`: `caelumAIProviderConfig`).
*   For **each configurable agent**, these settings are found in the `SettingsPanel` within the respective agent's section under "AI Provider" (path in `MyraConfig`: `configurableAgents[n].aiProviderConfig`).

Each agent can thus use its own independent AI provider and its specific settings.

## General AI Provider Parameters (apply per agent)

The following parameters are available within the `aiProviderConfig` object of each agent (M.Y.R.A., C.A.E.L.U.M., or a configurable agent):

### `aiProvider`

*   **Meaning:** Specifies which AI service is used for the respective agent.
*   **Possible Values:** `'gemini'`, `'lmstudio'`.
*   **Default Value (for M.Y.R.A. & C.A.E.L.U.M.):** `'gemini'`
*   **Default Value (for new configurable agents):** Inherits M.Y.R.A.'s default (`'gemini'`) upon creation.

### `geminiModelName`

*   **Meaning:** Gemini model name (e.g., `'gemini-2.5-flash-preview-04-17'`).
*   **Condition:** If `aiProvider` = `'gemini'`.
*   **Default Values:**
    *   M.Y.R.A.: `'gemini-2.5-flash-preview-04-17'`
    *   C.A.E.L.U.M.: `'gemini-2.5-flash-preview-04-17'`
    *   Configurable Agents: Inherit M.Y.R.A.'s default upon creation.

### `lmStudioBaseUrl`

*   **Meaning:** Base URL of the LM Studio API endpoint.
*   **Condition:** If `aiProvider` = `'lmstudio'`.
*   **Default Value (for all agent defaults):** `'http://localhost:1234/v1'`

### `lmStudioGenerationModel`

*   **Meaning:** LM Studio model identifier for text generation.
*   **Condition:** If `aiProvider` = `'lmstudio'`.
*   **Default Values:**
    *   M.Y.R.A.: `'google/gemma-3-1b'`
    *   C.A.E.L.U.M.: `'NousResearch/Nous-Hermes-2-Mistral-7B-DPO'`
    *   Configurable Agents: Inherit M.Y.R.A.'s default upon creation.

### `lmStudioEmbeddingModel`

*   **Meaning:** LM Studio model for embeddings. This model is currently **not** actively used for response generation but is intended for future, more refined RAG implementations (e.g., semantic search instead of keyword search).
*   **Default Value (for all agent defaults):** `'text-embedding-nomic-embed-text-v1.5'` (example)

### `temperatureBase`

*   **Meaning:** Base temperature for the agent's AI response generation. A higher value leads to more creative but potentially less coherent responses.
*   **Value Range:** Typically 0.0 to 2.0.
*   **Default Values:**
    *   M.Y.R.A.: `0.7`
    *   C.A.E.L.U.M.: `0.5` (often lower for more precise, analytical responses)
    *   Configurable Agents: Inherit M.Y.R.A.'s default upon creation.
*   **Interactions:** The effective temperature is dynamically modified by the global `temperatureLimbusInfluence` and `temperatureCreativusInfluence` parameters (from `MyraConfig`), based on the *individual internal state (emotions, node activations) of the respective agent*.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)
