# M.Y.R.A., C.A.E.L.U.M. & Configurable Agents: Knowledge Base & RAG

This file explains the configuration parameters for the knowledge base and the Retrieval Augmented Generation (RAG) system. These settings control how external text documents are processed and used to enrich AI responses. You can find these settings in the `SettingsPanel` under the "General System" group (as they have a global effect) and are part of the `MyraConfig` object.

Although these settings are defined globally in `MyraConfig`, the RAG system is used to expand the context for the responses of **all agent types**:
*   **M.Y.R.A.:** Uses RAG in direct chat and during its contributions in multi-agent or Dual AI conversations.
*   **C.A.E.L.U.M.:** Uses RAG during its contributions in multi-agent or Dual AI conversations.
*   **Configurable Agents:** Use RAG during their contributions in multi-agent conversations.

Additionally, on application startup, `Dokumentation_en.md` (or `_de.md` depending on the selected language) and all `.md` files from the `public/docs/` directory (with the appropriate language suffix if present, otherwise generic) are automatically loaded into the knowledge base. Uploaded `.xlsx` files are processed using the `read-excel-file` library, and `.docx` files with `mammoth`.

## Parameters

### `ragChunkSize`

*   **Meaning:** The target size (in characters) for each individual text chunk created when processing an uploaded or automatically loaded text file.
*   **Value Range:** A positive integer, e.g., 200 to 2000.
*   **Default Value:** `500`
*   **Interactions:** Influences, along with `ragChunkOverlap`, the granularity of the knowledge base. Smaller chunks can be more precise but may lose overall context.

### `ragChunkOverlap`

*   **Meaning:** The number of characters by which two consecutive chunks overlap. This helps maintain context across chunk boundaries.
*   **Value Range:** A non-negative integer, smaller than `ragChunkSize`.
*   **Default Value:** `50`
*   **Interactions:** Greater overlap can increase redundancy but may improve the coherence of retrieved information.

### `ragMaxChunksToRetrieve`

*   **Meaning:** The maximum number of most relevant text chunks retrieved by the RAG system for a given user prompt (or the previous message from another AI in dialogues) and then provided to the current AI as additional context.
*   **Value Range:** A positive integer, e.g., 1 to 10.
*   **Default Value:** `3`
*   **Interactions:** More chunks can provide more context but may also lengthen the prompt for the LLM and potentially distract from the core query.

## How It Works

1.  **Automatic Loading on Startup (`useMyraState.loadDocumentationKnowledge`):**
    *   The main documentation file (`Dokumentation_{lang}.md` or `Dokumentation.md`) and all `.md` files from the `public/docs/` directory (also with language suffix preference) are automatically fetched at application startup.
    *   Each file is divided into chunks according to `ragChunkSize` and `ragChunkOverlap`.
    *   Before adding new chunks from a source, any existing chunks from the same source (identified by file path) are deleted from IndexedDB to ensure the knowledge base is up-to-date.
    *   The new chunks are stored in IndexedDB.
2.  **Manual Upload & Processing (`KnowledgePanel`, `useMyraState.loadAndProcessFile`):**
    *   Users can upload `.txt`, `.md`, `.xlsx` (processed with `read-excel-file`), or `.docx` (processed with `mammoth`) files via the `KnowledgePanel`.
    *   The extracted text content is chunked and stored in IndexedDB, also removing old chunks from the same source first.
3.  **Retrieving Relevant Chunks (`useMyraState.retrieveRelevantChunks`):**
    *   Before an AI generates a response, this function is called, typically with the current prompt or the previous message as the search query.
    *   The function performs a simple keyword-based search across all stored chunks. Words from the query are compared against the content of the chunks to determine a relevance score.
    *   Chunks with the highest scores, up to the `ragMaxChunksToRetrieve` limit, are selected.
4.  **Enriching the AI Prompt (in `generateActiveAgentChatResponse`, `startDualConversation`, `startMultiAgentConversation`):**
    *   The text of the retrieved chunks is formatted and inserted into the system instruction or user prompt of the respective agent before it's sent to the LLM.
    *   The AI uses this additional context to generate more informed and contextually relevant responses.

---

[Back to Main Documentation](../Dokumentation_en.md#6-detailed-configuration-parameters)
