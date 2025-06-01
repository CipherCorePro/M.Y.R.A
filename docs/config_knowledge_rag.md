# M.Y.R.A. Konfiguration: Knowledge Base & RAG

Diese Datei erläutert die Konfigurationsparameter für M.Y.R.A.s Wissensbasis und das Retrieval Augmented Generation (RAG) System. Diese Einstellungen steuern, wie externe Textdokumente verarbeitet und für die Anreicherung von KI-Antworten genutzt werden. Sie finden diese Einstellungen im `SettingsPanel` unter der Gruppe "Knowledge & RAG" und sind Teil des `MyraConfig`-Objekts.

## Parameter

### `ragChunkSize`

*   **Bedeutung:** Die Zielgröße (in Zeichen) für jeden einzelnen Text-Chunk, der beim Verarbeiten einer hochgeladenen Textdatei erstellt wird. Größere Chunks können mehr Kontext enthalten, sind aber möglicherweise weniger spezifisch und verbrauchen mehr Platz im Prompt der KI.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 200 bis 2000.
*   **Standardwert:** `500`
*   **Interaktionen:** Beeinflusst zusammen mit `ragChunkOverlap` die Granularität der Wissensbasis.

### `ragChunkOverlap`

*   **Bedeutung:** Die Anzahl der Zeichen, um die sich zwei aufeinanderfolgende Chunks überlappen. Eine Überlappung hilft, den Kontextverlust an den Chunk-Grenzen zu minimieren, sodass Sätze oder Gedanken, die über eine Chunk-Grenze hinausgehen, besser erfasst werden können.
*   **Wertebereich:** Eine nicht-negative Ganzzahl, die kleiner als `ragChunkSize` sein sollte. Typische Werte sind 10% bis 20% der `ragChunkSize`.
*   **Standardwert:** `50`
*   **Interaktionen:** Größere Überlappung kann die Redundanz erhöhen, aber auch die Kohärenz zwischen Chunks verbessern.

### `ragMaxChunksToRetrieve`

*   **Bedeutung:** Die maximale Anzahl der relevantesten Text-Chunks, die vom RAG-System für einen gegebenen Benutzer-Prompt abgerufen und dann der KI als zusätzlicher Kontext für die Antwortgenerierung bereitgestellt werden.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 1 bis 10.
*   **Standardwert:** `3`
*   **Interaktionen:**
    *   Mehr Chunks können der KI potenziell mehr relevanten Kontext liefern, erhöhen aber auch die Länge des Prompts, was die Kosten (bei kommerziellen APIs) und die Verarbeitungszeit beeinflussen kann.
    *   Zu viele Chunks könnten die KI auch mit Informationen überladen oder von der ursprünglichen Anfrage ablenken.
    *   Die Effektivität hängt stark von der Qualität des Retrieval-Mechanismus ab (aktuell eine einfache Keyword-Suche).

## Funktionsweise

1.  **Hochladen & Verarbeiten (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   Der Benutzer lädt eine `.txt`-Datei hoch.
    *   Der Inhalt der Datei wird in Chunks zerlegt, wobei `ragChunkSize` und `ragChunkOverlap` verwendet werden.
    *   Jeder Chunk wird mit einer eindeutigen ID, dem Quelldateinamen und seinem Index in der Quelle versehen.
    *   Diese Chunks werden persistent in der IndexedDB des Browsers gespeichert.
2.  **Abrufen relevanter Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Wenn der Benutzer einen Prompt eingibt, wird diese Funktion aufgerufen.
    *   Sie führt eine einfache Keyword-basierte Suche über alle gespeicherten Chunks durch, um die relevantesten zu finden.
    *   Die `ragMaxChunksToRetrieve` relevantesten Chunks werden ausgewählt.
3.  **Anreicherung des KI-Prompts (`useMyraState.generateMyraResponse`):**
    *   Der Text der abgerufenen Chunks wird in die Systeminstruktion für die KI eingefügt.
    *   Die KI verwendet diesen zusätzlichen Kontext, um fundiertere und relevantere Antworten zu generieren.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
