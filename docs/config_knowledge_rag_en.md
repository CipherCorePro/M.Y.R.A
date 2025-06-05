# M.Y.R.A. & C.A.E.L.U.M. Configuration: Knowledge Base & RAG

This file explains the configuration parameters for the knowledge base and the Retrieval Augmented Generation (RAG) system. These settings control how external text documents are processed and used to enrich AI responses. You can find these settings in the `SettingsPanel` under the "General System" group (as they have a global effect) and are part of the `MyraConfig` object.

Although these settings are defined globally in `MyraConfig`, the RAG system is used to expand the context for the responses of both AIs:
*   **M.Y.R.A.:** Uses RAG in direct chat and during its contributions in the Dual AI conversation.
*   **C.A.E.L.U.M.:** Uses RAG during its contributions in the Dual AI conversation.

Additionally, on application startup, `Dokumentation_en.md` (or `_de.md`) and all `.md` files from the `public/docs/` directory (with the appropriate language suffix) are automatically loaded into the knowledge base. `.xlsx` files are processed using the `read-excel-file` library, and `.docx` files with `mammoth`.

## Parameters

### `ragChunkSize`

*   **Meaning:** The target size (in characters) for each individual text chunk created when processing an uploaded or automatically loaded text file.
*   **Value Range:** A positive integer, e.g., 200 to 2000.
*   **Default Value:** `500`
*   **Interactions:** Influences the granularity of the knowledge base along with `ragChunkOverlap`.

### `ragChunkOverlap`

*   **Meaning:** The number of characters by which two consecutive chunks overlap.
*   **Value Range:** A non-negative integer, smaller than `ragChunkSize`.
*   **Default Value:** `50`
*   **Interactions:** Larger overlap can increase redundancy but may improve coherence.

### `ragMaxChunksToRetrieve`

*   **Meaning:** The maximum number of most relevant text chunks retrieved by the RAG system for a given user prompt (or the other AI's previous message in Dual conversations) and then provided to the current AI as additional context.
*   **Value Range:** A positive integer, e.g., 1 to 10.
*   **Default Value:** `3`
*   **Interactions:** More chunks can provide more context but may also lengthen the prompt and potentially distract.

## How It Works

1.  **Automatic Loading on Startup (`useMyraState.loadDocumentationKnowledge`):**
    *   `Dokumentation_en.md` (or `_de.md`) and all `.md` files from `public/docs/` (with the matching language suffix) are automatically fetched.
    *   Each file is split into chunks (`ragChunkSize`, `ragChunkOverlap`).
    *   Existing chunks from the same source are deleted to allow for updates.
    *   New chunks are stored in IndexedDB.
2.  **Manual Upload & Processing (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   The user uploads a `.txt`, `.md`, `.xlsx`, or `.docx` file.
    *   The text content is extracted (using `read-excel-file` for `.xlsx`, `mammoth` for `.docx`), and then split into chunks.
    *   Chunks are stored in IndexedDB.
3.  **Retrieving Relevant Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Before an AI generates a response, this function is called, typically with the current prompt or the previous message as the query.
    *   Keyword-based search across stored chunks.
    *   `ragMaxChunksToRetrieve` most relevant chunks are selected.
4.  **Enriching the AI Prompt (`useMyraState.generateActiveAgentChatResponse` / `startDualConversation`):**
    *   The text of the retrieved chunks is inserted into the system instruction of the respective AI (M.Y.R.A. or C.A.E.L.U.M.).
    *   The AI uses this additional context to generate more informed responses.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)