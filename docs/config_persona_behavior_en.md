# M.Y.R.A. & C.A.E.L.U.M. Configuration: Persona & Behavior

This file explains the configuration parameters that control the personalities, ethical guidelines, response instructions, and system behaviors (such as decay rates and temperature influences) of M.Y.R.A. and C.A.E.L.U.M. These settings can be found in the `SettingsPanel` and are part of the `MyraConfig` object.

## M.Y.R.A. Persona

These settings define M.Y.R.A.'s character and basic response style. They are referenced via keys (`myraNameKey`, etc.), which are then translated into actual text based on the selected language. The editable fields in the `SettingsPanel` under "M.Y.R.A. Persona" allow direct modification of these translated values or changing the keys themselves.

### `myraNameKey` (references `myraConfig.myraName`)
*   **Meaning:** Key for the name M.Y.R.A. uses for herself.
*   **Default Value:** `"myra.name"` (translates to "M.Y.R.A.")

### `myraRoleDescriptionKey` (references `myraConfig.myraRoleDescription`)
*   **Meaning:** Key for the detailed description of M.Y.R.A.'s role and personality.
*   **Default Value:** `"myra.roleDescription"`

### `myraEthicsPrinciplesKey` (references `myraConfig.myraEthicsPrinciples`)
*   **Meaning:** Key for M.Y.R.A.'s core ethical principles.
*   **Default Value:** `"myra.ethicsPrinciples"`

### `myraResponseInstructionKey` (references `myraConfig.myraResponseInstruction`)
*   **Meaning:** Key for specific instructions on how M.Y.R.A. should respond.
*   **Default Value:** `"myra.responseInstruction"`

## C.A.E.L.U.M. Persona

These settings define C.A.E.L.U.M.'s character and basic response style, analogous to M.Y.R.A. The editable fields in the `SettingsPanel` under "C.A.E.L.U.M. Persona" allow direct adjustments.

### `caelumNameKey` (references `myraConfig.caelumName`)
*   **Meaning:** Key for the name C.A.E.L.U.M. uses for himself.
*   **Default Value:** `"caelum.name"` (translates to "C.A.E.L.U.M.")

### `caelumRoleDescriptionKey` (references `myraConfig.caelumRoleDescription`)
*   **Meaning:** Key for the detailed description of C.A.E.L.U.M.'s role.
*   **Default Value:** `"caelum.roleDescription"`

### `caelumEthicsPrinciplesKey` (references `myraConfig.caelumEthicsPrinciples`)
*   **Meaning:** Key for C.A.E.L.U.M.'s core ethical principles.
*   **Default Value:** `"caelum.ethicsPrinciples"`

### `caelumResponseInstructionKey` (references `myraConfig.caelumResponseInstruction`)
*   **Meaning:** Key for specific instructions on how C.A.E.L.U.M. should respond.
*   **Default Value:** `"caelum.responseInstruction"`

## Shared / Global Parameters

### `userNameKey` (references `myraConfig.userName`)
*   **Meaning:** Key for the name both AIs use to address the user in chat.
*   **Default Value:** `"user.name"` (translates to "User")

### `temperatureLimbusInfluence`
*   **Meaning:** Factor determining how strongly the `arousal` value of the **respective AI** (M.Y.R.A. or C.A.E.L.U.M.) influences the effective temperature for its response.
*   **Default Value:** `0.1`

### `temperatureCreativusInfluence`
*   **Meaning:** Factor determining how strongly the activation of the `Creativus` (M.Y.R.A.) or `Pattern Analyzer` (C.A.E.L.U.M.) node of the **respective AI** influences the effective temperature.
*   **Default Value:** `0.15`

### `maxHistoryMessagesForPrompt`
*   **Meaning:** Maximum number of previous chat messages (user and assistant) used as context for the LLM. Applies globally to all LLM calls.
*   **Default Value:** `8`

## M.Y.R.A. System Behavior Parameters

These parameters can be found in the `SettingsPanel` under "M.Y.R.A. System".

### `nodeActivationDecay`
*   **Meaning:** Decay factor for M.Y.R.A.'s node activations per simulation step.
*   **Default Value:** `0.95`

### `emotionDecay`
*   **Meaning:** Decay factor for M.Y.R.A.'s emotions per simulation step.
*   **Default Value:** `0.95`

## C.A.E.L.U.M. System Behavior Parameters

These parameters can be found in the `SettingsPanel` under "C.A.E.L.U.M. System".

### `caelumNodeActivationDecay`
*   **Meaning:** Decay factor for C.A.E.L.U.M.'s node activations per simulation step. Influences how long important node activations persist.
*   **Default Value:** `0.97`

### `caelumEmotionDecay`
*   **Meaning:** Decay factor for C.A.E.L.U.M.'s (often subdued) emotions per simulation step. Influences how stable basic emotional moods remain.
*   **Default Value:** `0.98`

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)