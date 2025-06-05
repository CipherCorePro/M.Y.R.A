# M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten: Knowledge Base & RAG

Diese Datei erläutert die Konfigurationsparameter für die Wissensbasis und das Retrieval Augmented Generation (RAG) System. Diese Einstellungen steuern, wie externe Textdokumente verarbeitet und für die Anreicherung von KI-Antworten genutzt werden. Sie finden diese Einstellungen im `SettingsPanel` unter der Gruppe "Allgemeines System" (da sie global wirken) und sind Teil des `MyraConfig`-Objekts.

Obwohl diese Einstellungen global in `MyraConfig` definiert sind, wird das RAG-System verwendet, um den Kontext für die Antworten **aller Agententypen** zu erweitern:
*   **M.Y.R.A.:** Nutzt RAG im direkten Chat und während ihrer Beiträge in Multi-Agenten- oder Dual-AI-Konversationen.
*   **C.A.E.L.U.M.:** Nutzt RAG während seiner Beiträge in Multi-Agenten- oder Dual-AI-Konversationen.
*   **Konfigurierbare Agenten:** Nutzen RAG während ihrer Beiträge in Multi-Agenten-Konversationen.

Zusätzlich werden beim Start der Anwendung automatisch `Dokumentation_de.md` (bzw. `_en.md` je nach gewählter Sprache) und alle `.md`-Dateien aus dem `public/docs/`-Verzeichnis (mit entsprechendem Sprachsuffix, falls vorhanden, sonst generisch) in die Wissensbasis geladen. Hochgeladene `.xlsx`-Dateien werden mit der Bibliothek `read-excel-file` verarbeitet, `.docx`-Dateien mit `mammoth`.

## Parameter

### `ragChunkSize`

*   **Bedeutung:** Die Zielgröße (in Zeichen) für jeden einzelnen Text-Chunk, der beim Verarbeiten einer hochgeladenen oder automatisch geladenen Textdatei erstellt wird.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 200 bis 2000.
*   **Standardwert:** `500`
*   **Interaktionen:** Beeinflusst zusammen mit `ragChunkOverlap` die Granularität der Wissensbasis. Kleinere Chunks können präziser sein, aber möglicherweise den Gesamtkontext verlieren.

### `ragChunkOverlap`

*   **Bedeutung:** Die Anzahl der Zeichen, um die sich zwei aufeinanderfolgende Chunks überlappen. Dies hilft, den Kontext über Chunk-Grenzen hinweg zu erhalten.
*   **Wertebereich:** Eine nicht-negative Ganzzahl, kleiner als `ragChunkSize`.
*   **Standardwert:** `50`
*   **Interaktionen:** Größere Überlappung kann Redundanz erhöhen, aber die Kohärenz der abgerufenen Informationen verbessern.

### `ragMaxChunksToRetrieve`

*   **Bedeutung:** Die maximale Anzahl der relevantesten Text-Chunks, die vom RAG-System für einen gegebenen Benutzer-Prompt (oder die vorherige Nachricht der anderen KI in Dialogen) abgerufen und dann der aktuellen KI als zusätzlicher Kontext bereitgestellt werden.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 1 bis 10.
*   **Standardwert:** `3`
*   **Interaktionen:** Mehr Chunks können mehr Kontext liefern, aber auch den Prompt für das LLM verlängern und potenziell von der Kernfrage ablenken.

## Funktionsweise

1.  **Automatische Ladung beim Start (`useMyraState.loadDocumentationKnowledge`):**
    *   Die Hauptdokumentationsdatei (`Dokumentation_{lang}.md` oder `Dokumentation.md`) und alle `.md`-Dateien aus dem `public/docs/`-Verzeichnis (ebenfalls mit Sprachsuffix-Präferenz) werden beim Start der Anwendung automatisch abgerufen.
    *   Jede Datei wird in Chunks zerlegt, gemäß `ragChunkSize` und `ragChunkOverlap`.
    *   Vor dem Hinzufügen neuer Chunks aus einer Quelle werden eventuell bereits vorhandene Chunks aus derselben Quelle (identifiziert durch den Dateipfad) aus der IndexedDB gelöscht, um sicherzustellen, dass die Wissensbasis aktuell ist.
    *   Die neuen Chunks werden in der IndexedDB gespeichert.
2.  **Manuelles Hochladen & Verarbeiten (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   Benutzer können `.txt`, `.md`, `.xlsx` (verarbeitet mit `read-excel-file`) oder `.docx` (verarbeitet mit `mammoth`) Dateien über das `KnowledgePanel` hochladen.
    *   Der extrahierte Textinhalt wird in Chunks zerlegt und in der IndexedDB gespeichert, wobei auch hier alte Chunks derselben Quelle zuvor entfernt werden.
3.  **Abrufen relevanter Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Vor der Antwortgenerierung einer KI wird diese Funktion aufgerufen, typischerweise mit dem aktuellen Prompt oder der vorherigen Nachricht als Suchanfrage (Query).
    *   Die Funktion führt eine einfache Keyword-basierte Suche über alle gespeicherten Chunks durch. Wörter aus der Query werden mit dem Inhalt der Chunks verglichen, um einen Relevanz-Score zu ermitteln.
    *   Die Chunks mit den höchsten Scores, bis zur `ragMaxChunksToRetrieve`-Grenze, werden ausgewählt.
4.  **Anreicherung des KI-Prompts (in `generateActiveAgentChatResponse`, `startDualConversation`, `startMultiAgentConversation`):**
    *   Der Text der abgerufenen Chunks wird formatiert und in die Systeminstruktion oder den Benutzer-Prompt des jeweiligen Agenten eingefügt, bevor dieser an das LLM gesendet wird.
    *   Die KI verwendet diesen zusätzlichen Kontext, um fundiertere und kontextbezogenere Antworten zu generieren.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation_de.md#6-detaillierte-konfigurationsparameter)
