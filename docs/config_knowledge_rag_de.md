# M.Y.R.A. & C.A.E.L.U.M. Konfiguration: Knowledge Base & RAG

Diese Datei erläutert die Konfigurationsparameter für die Wissensbasis und das Retrieval Augmented Generation (RAG) System. Diese Einstellungen steuern, wie externe Textdokumente verarbeitet und für die Anreicherung von KI-Antworten genutzt werden. Sie finden diese Einstellungen im `SettingsPanel` unter der Gruppe "Allgemeines System" (da sie global wirken) und sind Teil des `MyraConfig`-Objekts.

Obwohl diese Einstellungen global in `MyraConfig` definiert sind, wird das RAG-System verwendet, um den Kontext für die Antworten beider KIs zu erweitern:
*   **M.Y.R.A.:** Nutzt RAG im direkten Chat und während ihrer Beiträge in der Dual-AI-Konversation.
*   **C.A.E.L.U.M.:** Nutzt RAG während seiner Beiträge in der Dual-AI-Konversation.

Zusätzlich werden beim Start der Anwendung automatisch `Dokumentation_de.md` (bzw. `_en.md`) und alle `.md`-Dateien aus dem `public/docs/`-Verzeichnis (mit dem entsprechenden Sprachsuffix) in die Wissensbasis geladen.

## Parameter

### `ragChunkSize`

*   **Bedeutung:** Die Zielgröße (in Zeichen) für jeden einzelnen Text-Chunk, der beim Verarbeiten einer hochgeladenen oder automatisch geladenen Textdatei erstellt wird.
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

1.  **Automatische Ladung beim Start (`useMyraState.loadDocumentationKnowledge`):**
    *   `Dokumentation_de.md` (oder `_en.md`) und alle `.md`-Dateien aus `public/docs/` (mit dem passenden Sprachsuffix) werden automatisch abgerufen.
    *   Jede Datei wird in Chunks zerlegt (`ragChunkSize`, `ragChunkOverlap`).
    *   Vorhandene Chunks aus der gleichen Quelle werden gelöscht, um Aktualisierungen zu ermöglichen.
    *   Neue Chunks werden in IndexedDB gespeichert.
2.  **Manuelles Hochladen & Verarbeiten (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   Der Benutzer lädt eine `.txt`- oder `.md`-Datei hoch.
    *   Der Inhalt wird in Chunks zerlegt.
    *   Chunks werden in IndexedDB gespeichert.
3.  **Abrufen relevanter Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Vor der Antwortgenerierung einer KI wird diese Funktion aufgerufen, typischerweise mit dem aktuellen Prompt oder der vorherigen Nachricht als Query.
    *   Keyword-basierte Suche über gespeicherte Chunks (sowohl manuell als auch automatisch geladene).
    *   `ragMaxChunksToRetrieve` relevanteste Chunks werden ausgewählt.
4.  **Anreicherung des KI-Prompts (`useMyraState.generateMyraResponse` / `startDualConversation`):**
    *   Der Text der abgerufenen Chunks wird in die Systeminstruktion der jeweiligen KI (M.Y.R.A. oder C.A.E.L.U.M.) eingefügt.
    *   Die KI verwendet diesen zusätzlichen Kontext, um fundiertere Antworten zu generieren.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)