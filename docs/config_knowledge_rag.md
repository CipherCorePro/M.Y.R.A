# M.Y.R.A. Konfiguration: Knowledge Base & RAG

Diese Datei erläutert die Konfigurationsparameter für die Wissensbasis und das Retrieval Augmented Generation (RAG) System. Diese Einstellungen steuern, wie externe Textdokumente verarbeitet und für die Anreicherung von KI-Antworten genutzt werden. Sie finden diese Einstellungen im `SettingsPanel` unter der Gruppe "General System" (da sie global wirken) und sind Teil des `MyraConfig`-Objekts.

Obwohl diese Einstellungen global in `MyraConfig` definiert sind, wird das RAG-System verwendet, um den Kontext für die Antworten beider KIs zu erweitern:
*   **M.Y.R.A.:** Nutzt RAG im direkten Chat und während ihrer Beiträge in der Dual-AI-Konversation.
*   **C.A.E.L.U.M.:** Nutzt RAG während seiner Beiträge in der Dual-AI-Konversation.

## Parameter

### `ragChunkSize`

*   **Bedeutung:** Die Zielgröße (in Zeichen) für jeden einzelnen Text-Chunk, der beim Verarbeiten einer hochgeladenen Textdatei erstellt wird.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 200 bis 2000.
*   **Standardwert:** `500`
*   **Interaktionen:** Beeinflusst zusammen mit `ragChunkOverlap` die Granularität der Wissensbasis.

### `ragChunkOverlap`

*   **Bedeutung:** Die Anzahl der Zeichen, um die sich zwei aufeinanderfolgende Chunks überlappen.
*   **Wertebereich:** Eine nicht-negative Ganzzahl, kleiner als `ragChunkSize`.
*   **Standardwert:** `50`
*   **Interaktionen:** Größere Überlappung kann Redundanz erhöhen, aber Kohärenz verbessern.

### `ragMaxChunksToRetrieve`

*   **Bedeutung:** Die maximale Anzahl der relevantesten Text-Chunks, die vom RAG-System für einen gegebenen Benutzer-Prompt (oder die vorherige Nachricht der anderen KI in Dual-Konversationen) abgerufen und dann der aktuellen KI als zusätzlicher Kontext bereitgestellt werden.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 1 bis 10.
*   **Standardwert:** `3`
*   **Interaktionen:** Mehr Chunks können mehr Kontext liefern, aber auch den Prompt verlängern und potenziell ablenken.

## Funktionsweise

1.  **Hochladen & Verarbeiten (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   Der Benutzer lädt eine `.txt`-Datei hoch.
    *   Der Inhalt wird in Chunks zerlegt (`ragChunkSize`, `ragChunkOverlap`).
    *   Chunks werden in IndexedDB gespeichert.
2.  **Abrufen relevanter Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Vor der Antwortgenerierung einer KI wird diese Funktion aufgerufen, typischerweise mit dem aktuellen Prompt oder der vorherigen Nachricht als Query.
    *   Keyword-basierte Suche über gespeicherte Chunks.
    *   `ragMaxChunksToRetrieve` relevanteste Chunks werden ausgewählt.
3.  **Anreicherung des KI-Prompts (`useMyraState.generateMyraResponse` / `startDualConversation`):**
    *   Der Text der abgerufenen Chunks wird in die Systeminstruktion der jeweiligen KI (M.Y.R.A. oder C.A.E.L.U.M.) eingefügt.
    *   Die KI verwendet diesen zusätzlichen Kontext, um fundiertere Antworten zu generieren.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)