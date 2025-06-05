# M.Y.R.A., C.A.E.L.U.M. & Configurable Agents: Persona & Behavior

This file explains the configuration parameters that control the personalities, ethical guidelines, response instructions, and system behaviors (such as decay rates and temperature influences) of M.Y.R.A., C.A.E.L.U.M., and **configurable agents**.

## Agent-Specific Persona Settings

Each agent (M.Y.R.A., C.A.E.L.U.M., and each configurable agent) has its own independent persona, defining its fundamental demeanor and response style.

### For M.Y.R.A. (configured via `myraConfig.*` fields or `myra*Key` for translations):
*   **`myraName`**: Name M.Y.R.A. uses for herself.
*   **`myraRoleDescription`**: Detailed description of M.Y.R.A.'s role and personality.
*   **`myraEthicsPrinciples`**: M.Y.R.A.'s core ethical principles.
*   **`myraResponseInstruction`**: Specific instructions on how M.Y.R.A. should respond.

These values are translated from the corresponding `*Key` fields (e.g., `myraNameKey`) based on the global language setting and can be adjusted in the `SettingsPanel`.

### For C.A.E.L.U.M. (configured via `myraConfig.caelum*` fields or `caelum*Key` for translations):
*   **`caelumName`**: Name C.A.E.L.U.M. uses for himself.
*   **`caelumRoleDescription`**: Detailed description of C.A.E.L.U.M.'s role.
*   **`caelumEthicsPrinciples`**: C.A.E.L.U.M.'s core ethical principles.
*   **`caelumResponseInstruction`**: Specific instructions on how C.A.E.L.U.M. should respond.

Similar to M.Y.R.A., these values are translated from the `*Key` fields and are adjustable in the `SettingsPanel`.

### For Configurable Agents (`myraConfig.configurableAgents[n].*`):
Each agent in the `configurableAgents` list possesses the following directly editable persona fields in its configuration object:
*   **`name`**: Agent's name.
*   **`roleDescription`**: Agent's role description.
*   **`ethicsPrinciples`**: Agent's ethical principles.
*   **`responseInstruction`**: Response instructions for the agent.
*   **`personalityTrait`**: Optional trait ('critical', 'visionary', 'conservative', 'neutral') that can influence response style. This is primarily implemented through the wording of the `responseInstruction` and the system instruction for the LLM.

These settings are accessible in the `SettingsPanel` within the respective configurable agent's section.

## Shared / Global Parameters

These parameters in `myraConfig` influence the behavior of all agents or the general system.

### `userNameKey` (references `myraConfig.userName`)
*   **Meaning:** Key for the name all AIs use to address the user in chat.
*   **Default Value:** `"user.name"` (translates to "User")

### `temperatureLimbusInfluence`
*   **Meaning:** Factor determining how strongly the `arousal` value of the **respective active agent** (M.Y.R.A., C.A.E.L.U.M., or configurable agent) influences the effective temperature for its response.
*   **Default Value:** `0.1`

### `temperatureCreativusInfluence`
*   **Meaning:** Factor determining how strongly the activation of the `Creativus` node (or equivalent node for other agents, typically the creativity/pattern analyzer node) of the **respective active agent** influences the effective temperature.
*   **Default Value:** `0.15`

### `maxHistoryMessagesForPrompt`
*   **Meaning:** Maximum number of previous chat messages (user and assistant) used as context for the LLM. Applies globally to all LLM calls for all agents.
*   **Default Value:** `8`

### `maxPadHistorySize`
*   **Meaning:** The maximum number of PAD states (Pleasure, Arousal, Dominance) stored for each agent in their emotion timeline.
*   **Default Value:** `200`

### `activeChatAgent`
*   **Meaning:** Determines which of the main AIs (M.Y.R.A. or C.A.E.L.U.M.) is active in the primary chat interface (`ChatInterface.tsx`).
*   **Possible Values:** `'myra'`, `'caelum'`.
*   **Default Value:** `'myra'`

## Agent-Specific System Behavior Parameters

Each agent (M.Y.R.A., C.A.E.L.U.M., and each configurable agent) has its own decay rates for node activations and emotions. These are part of the `systemConfig` object of the respective agent.

### `nodeActivationDecay` (Part of each agent's `systemConfig`)
*   **Meaning:** Decay factor for the agent's node activations per simulation step. Influences how quickly a node's activation diminishes without further stimulation.
*   **Default Values:** M.Y.R.A.: `0.95`, C.A.E.L.U.M.: `0.97`. Configurable agents inherit M.Y.R.A.'s default (`0.95`) upon creation but can be individually adjusted.

### `emotionDecay` (Part of each agent's `systemConfig`)
*   **Meaning:** Decay factor for the intensity of the agent's emotions per simulation step. Influences how quickly emotional states fade without further stimulation.
*   **Default Values:** M.Y.R.A.: `0.95`, C.A.E.L.U.M.: `0.98`. Configurable agents inherit M.Y.R.A.'s default (`0.95`) upon creation but can be individually adjusted.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)
