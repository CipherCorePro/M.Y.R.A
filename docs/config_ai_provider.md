# M.Y.R.A. Konfiguration: AI Provider

Diese Datei erläutert die Konfigurationsparameter im Zusammenhang mit der Auswahl und Konfiguration des KI-Providers (Large Language Model), der von M.Y.R.A. für die Generierung von Antworten verwendet wird. Diese Einstellungen finden Sie im `SettingsPanel` unter der Gruppe "AI Configuration" und sind Teil des `MyraConfig`-Objekts.

## Parameter

### `aiProvider`

*   **Bedeutung:** Legt fest, welcher KI-Dienst für die Generierung von Antworten verwendet wird.
*   **Mögliche Werte:**
    *   `'gemini'`: Verwendet die Google Gemini API. Erfordert einen gültigen Gemini API-Schlüssel.
    *   `'lmstudio'`: Verwendet eine lokal laufende Instanz von [LM Studio](https://lmstudio.ai/). Erfordert, dass LM Studio korrekt eingerichtet ist und ein Modell bedient.
*   **Standardwert:** `'gemini'`
*   **Interaktionen:** Die Auswahl hier bestimmt, welche der folgenden Parameter relevant sind.

### `geminiModelName`

*   **Bedeutung:** Der spezifische Modellname, der für Anfragen an die Gemini API verwendet werden soll (z.B. `'gemini-2.5-flash-preview-04-17'`, `'gemini-1.5-pro-latest'`).
*   **Bedingung:** Nur relevant, wenn `aiProvider` auf `'gemini'` gesetzt ist.
*   **Wertebereich:** Ein gültiger Modellname, wie in der Gemini API Dokumentation spezifiziert.
*   **Standardwert:** `'gemini-2.5-flash-preview-04-17'`
*   **Interaktionen:** Die Wahl des Modells kann die Qualität, Geschwindigkeit und Kosten der Antworten beeinflussen. Verschiedene Modelle haben unterschiedliche Stärken und Token-Limits.

### `lmStudioBaseUrl`

*   **Bedeutung:** Die Basis-URL des LM Studio API-Endpunkts. Standardmäßig läuft LM Studio unter `http://localhost:1234/v1`.
*   **Bedingung:** Nur relevant, wenn `aiProvider` auf `'lmstudio'` gesetzt ist.
*   **Wertebereich:** Eine gültige URL.
*   **Standardwert:** `'http://localhost:1234/v1'`
*   **Interaktionen:** Muss mit der Adresse und dem Port übereinstimmen, unter dem Ihr LM Studio Server erreichbar ist.

### `lmStudioGenerationModel`

*   **Bedeutung:** Der Modell-Identifikator (wie in LM Studio angezeigt, z.B. `Publisher/Repository/ModellDatei` oder ein einfacher Name, wenn von LM Studio so bereitgestellt), der für die Textgenerierung verwendet werden soll.
*   **Bedingung:** Nur relevant, wenn `aiProvider` auf `'lmstudio'` gesetzt ist.
*   **Wertebereich:** Ein auf Ihrem LM Studio Server geladenes und verfügbares Modell.
*   **Standardwert:** `'google/gemma-3-1b'` (Beispiel, Sie müssen ein Modell in LM Studio geladen haben)
*   **Interaktionen:** Das gewählte Modell bestimmt die Fähigkeiten und den Stil der von LM Studio generierten Antworten.

### `lmStudioEmbeddingModel`

*   **Bedeutung:** Der Modell-Identifikator für Embedding-Aufgaben in LM Studio. **Hinweis:** Die aktuelle Implementierung in `aiService.ts` verwendet diesen Parameter noch nicht aktiv für Embedding-Aufgaben, wenn LM Studio als Provider gewählt ist. Embeddings sind typischerweise für RAG-Systeme relevant, die auf semantischer Ähnlichkeitssuche basieren, was hier noch nicht vollumfänglich für LM Studio implementiert ist.
*   **Bedingung:** Potenziell relevant, wenn `aiProvider` auf `'lmstudio'` gesetzt ist und erweiterte RAG-Funktionen mit lokalen Embeddings implementiert würden.
*   **Wertebereich:** Ein auf Ihrem LM Studio Server geladenes und für Embeddings geeignetes Modell.
*   **Standardwert:** `'text-embedding-nomic-embed-text-v1.5'` (Beispiel)

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
