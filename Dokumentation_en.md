# M.Y.R.A. SubQG Integration - Documentation

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Core Concepts & Glossary](#2-core-concepts--glossary)
3.  [User Interface (UI) Guide](#3-user-interface-ui-guide)
    *   [3.1 Main Layout](#31-main-layout)
    *   [3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)](#32-status-panel-myra--caelum)
    *   [3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)](#33-nodes-panel-myra--caelum)
    *   [3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)](#34-subqg-panel-myra--caelum)
    *   [3.5 Emotion Timeline Panel](#35-emotion-timeline-panel)
    *   [3.6 Knowledge Panel](#36-knowledge-panel)
    *   [3.7 Dual AI Conversation Panel](#37-dual-ai-conversation-panel)
    *   [3.8 Documentation Panel](#38-documentation-panel)
    *   [3.9 Settings Panel](#39-settings-panel)
    *   [3.10 Chat Interface (M.Y.R.A.)](#310-chat-interface-myra)
4.  [Technical Architecture & Code Documentation](#4-technical-architecture--code-documentation)
    *   [4.1 Project Structure](#41-project-structure)
    *   [4.2 `index.html`](#42-indexhtml)
    *   [4.3 `metadata.json`](#43-metadatajson)
    *   [4.4 `vite.config.ts`](#44-viteconfigts)
    *   [4.5 `index.tsx`](#45-indextsx)
    *   [4.6 `App.tsx`](#46-apptsx)
    *   [4.7 `constants.ts`](#47-constantsts)
    *   [4.8 `types.ts`](#48-typests)
    *   [4.9 `hooks/useMyraState.ts`](#49-hooksusemyrastatets)
    *   [4.10 `components/`](#410-components)
        *   [`ChatInterface.tsx`](#4101-chatinterfacetsx)
        *   [`DualAiConversationPanel.tsx`](#4102-dualaiconversationpaneltsx)
        *   [`EmotionTimelinePanel.tsx`](#4103-emotiontimelinepaneltsx)
        *   [`DocumentationPanel.tsx`](#4104-documentationpaneltsx)
        *   [`IconComponents.tsx`](#4105-iconcomponentstsx)
        *   [`KnowledgePanel.tsx`](#4106-knowledgepaneltsx)
        *   [`NodePanel.tsx`](#4107-nodepaneltsx)
        *   [`SettingsPanel.tsx`](#4108-settingspaneltsx)
        *   [`SubQGDisplay.tsx`](#4109-subqgdisplaytsx)
        *   [`SystemStatusPanel.tsx`](#41010-systemstatuspaneltsx)
    *   [4.11 `services/aiService.ts`](#411-servicesaiservicets)
    *   [4.12 `utils/`](#412-utils)
        *   [`adaptiveFitnessManager.ts`](#4121-adaptivefitnessmanagerts)
        *   [`db.ts`](#4122-dbts)
        *   [`rng.ts`](#4123-rngts)
        *   [`uiHelpers.ts`](#4124-uihelpersts)
5.  [Functional Deep Dive](#5-functional-deep-dive)
    *   [5.1 Simulation Cycles (M.Y.R.A. & C.A.E.L.U.M.)](#51-simulation-cycles-myra--caelum)
    *   [5.2 AI Response Generation](#52-ai-response-generation)
    *   [5.3 Knowledge Processing (RAG & Automatic Document Loading)](#53-knowledge-processing-rag--automatic-document-loading)
    *   [5.4 Configuration Management](#54-configuration-management)
    *   [5.5 Emotion Timeline Tracking](#55-emotion-timeline-tracking)
    *   [5.6 Documentation Viewer](#56-documentation-viewer)
6.  [Detailed Configuration Parameters](#6-detailed-configuration-parameters)
7.  [Setup and Start](#7-setup-and-start)

---

## 1. Introduction

This document describes the M.Y.R.A. (Modular Yearning Reasoning Architecture) web application with SubQG integration. The application provides an interactive interface for simulating and interacting with two AI entities, **M.Y.R.A.** and **C.A.E.L.U.M.**, whose cognitive-affective processes are each influenced by their own independent, simulated SubQuantum Field (SubQG). It uses the Gemini API (or a local LM Studio instance) for intelligent responses and visualizes internal states such as SubQG metrics, node states, emotions (including a timeline tracker), and adaptive fitness for both systems. An integrated documentation viewer allows direct access to this and other relevant documentation within the app.

The core idea is to create AI entities whose behavior is not only based on trained data but is also shaped by dynamic, emergent internal states influenced by their respective complex subsystems (SubQGs). This document serves as a guide for users and developers.

---

## 2. Core Concepts & Glossary

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** The primary AI entity, based on emotional expression and creative thinking.
*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** A second, independent AI entity running in parallel with M.Y.R.A. C.A.E.L.U.M. specializes in logical analysis, pattern recognition, and understanding emergent phenomena, possessing its own simulation system (SubQG, nodes, emotions).
*   **SubQG (SubQuantum Field):** A simulated field serving as a basis for emergent dynamics. Each AI (M.Y.R.A. and C.A.E.L.U.M.) has its own independent SubQG. It consists of a matrix of energy values and phases that evolve over time and interact. "SubQG Jumps" are significant fluctuations in this field that can affect the respective AI's state.
*   **Nodes:** Representations of concepts, emotions, or cognitive functions. Both M.Y.R.A. and C.A.E.L.U.M. have their own independent sets of nodes, which can be configured and named differently (e.g., M.Y.R.A.'s "Creativus" vs. C.A.E.L.U.M.'s "Pattern Analyzer").
    *   **Semantic Nodes:** Represent specific concepts.
    *   **Limbus Affektus:** A special node modeling the overall emotional state.
    *   **Creativus / Pattern Analyzer:** Influences creativity/pattern analysis.
    *   **Cortex Criticus / Logic Verifier:** Controls critical evaluation/logical verification.
    *   **MetaCognitio / System Monitor:** Monitors the overall state of the respective network.
    *   **Behavioral Modulators (Social, Valuation, Conflict, Executive):** Nodes for specific cognitive functions.
*   **Emotion State (PAD Model & Specific Emotions):** The emotional state is represented by Pleasure, Arousal, and Dominance, as well as more specific emotions. Each AI has its own emotional state.
*   **Emotion Timeline Tracker (PAD Timeline):** A UI panel visualizing the temporal progression of PAD values for M.Y.R.A. and C.A.E.L.U.M.
*   **Adaptive Fitness:** A system for evaluating "health" and performance. Each AI has its own adaptive fitness based on its respective internal state.
*   **RAG (Retrieval Augmented Generation):** An approach where relevant information is retrieved from a knowledge base before response generation. Used by M.Y.R.A. in direct chat and by both AIs in the Dual AI conversation.
*   **Text Chunk:** A segment of text from an external document, stored in the knowledge base.
*   **SubQG Jump:** A significant, sudden change in an AI's respective SubQG.
*   **Phase Coherence:** Measure of phase synchronization in the SubQG.
*   **IndexedDB:** Client-side database for storing text chunks.
*   **LM Studio / Gemini API:** External AI services for response generation.
*   **RNG (Random Number Generator):** Used for stochastic processes in simulations. Each AI can have its own RNG type and seed.
*   **Resizable Sidebar:** The sidebar in desktop views can be manually adjusted in width.
*   **Documentation Viewer:** A UI panel for viewing Markdown-based documentation files directly within the application, with language selection.

---

## 3. User Interface (UI) Guide

### 3.1 Main Layout

The user interface is divided into three main areas:

*   **Header:** Displays the title (e.g., `M.Y.R.A. System Interface` or `C.A.E.L.U.M. System Interface` depending on the active tab), the current simulation step (`Sim Step`), and the overall fitness (`Fitness`) of the AI currently in focus. On mobile devices, the header includes a hamburger button to open/close the sidebar.
*   **Left Panel (Aside):** Contains tabs for navigation. The width of this panel is manually adjustable in desktop views.
    *   **Status (M):** Status overview for M.Y.R.A.
    *   **Status (C):** Status overview for C.A.E.L.U.M.
    *   **Nodes (M):** Node visualization for M.Y.R.A.
    *   **Nodes (C):** Node visualization for C.A.E.L.U.M.
    *   **SubQG (M):** SubQG visualization and interaction for M.Y.R.A.
    *   **SubQG (C):** SubQG visualization and interaction for C.A.E.L.U.M.
    *   **Emotion Timeline:** Displays the temporal progression of PAD values (Pleasure, Arousal, Dominance) for M.Y.R.A. and C.A.E.L.U.M.
    *   **Knowledge:** Management of the knowledge base.
    *   **Documentation:** Displays the integrated application documentation.
    *   **Dual AI:** Start and display conversations between M.Y.R.A. and C.A.E.L.U.M.
    *   **Settings:** Global and AI-specific configuration settings.
*   **Right Panel (Main):** Displays the Chat Interface for direct interaction with M.Y.R.A.

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Accessible via the "Status (M)" and "Status (C)" tabs. This panel provides an overview of the most important internal states of the respective AI (M.Y.R.A. or C.A.E.L.U.M.).

*   **Emotion State & Vitals:**
    *   **Heartbeat Display:** Visualizes a "heart rate" based on the selected AI's stress level.
    *   Pleasure, Arousal, Dominance (PAD values).
    *   Dominant Affect: The prevailing specific affect (e.g., joy, fear).
*   **Adaptive Fitness:**
    *   Overall Score: The total fitness value.
    *   Dimension Scores: Breakdown of fitness into dimensions: Knowledge Expansion, Internal Coherence, Expressive Creativity, and Goal Focus.
*   **SubQG Metrics:**
    *   **SubQG Pulse Indicator:** Visualizes significant SubQG events (Jumps).
    *   Avg. Energy: Average energy in the SubQG.
    *   Std. Energy: Standard deviation of energy in the SubQG.
    *   Phase Coherence: Measure of phase synchronization in the SubQG.
    *   Jump Modifier Active: Indicates if a SubQG jump modifier is active and for how long.

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Accessible via the "Nodes (M)" and "Nodes (C)" tabs. Visualizes the internal nodes of the respective AI.

*   **Modulator Nodes:** Shows special nodes like Limbus Affektus, Creativus/Pattern Analyzer, Cortex Criticus/Logic Verifier, MetaCognitio/System Monitor, and other behavioral modulators of the selected AI.
*   **Semantic Nodes (Sample):** Shows a selection of the semantic nodes (concepts) of the selected AI.
*   **Node Card Details:** Each node card displays:
    *   Node label and type icon.
    *   Activation (Act): Current activation value (0-1).
    *   Visual activation bar.
    *   Resonator Score (Res), Focus Score (Foc), Exploration Score (Exp).
    *   Specific state information (e.g., PAD for Limbus, Jump Count for MetaCognitio).

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Accessible via the "SubQG (M)" and "SubQG (C)" tabs. Visualizes the SubQG of the respective AI and allows interactions.

*   **Matrix Visualization:** A grid represents the SubQG. Each cell displays its energy and phase in color. A tooltip on hover shows exact values.
*   **Interaction Options:**
    *   **Inject Energy:** Value for the energy injected when a cell is clicked.
    *   **Set Phase (Opt.):** Optional phase value (0 to ~6.28 radians) set on click.
    *   Clicking a cell injects the defined energy and optionally the phase.
*   **SubQG Jump Info:** Shows details of recently detected jumps in the selected AI's SubQG (type, peak values).

### 3.5 Emotion Timeline Panel

Accessible via the "Emotion Timeline" tab.

*   **Agent Selection:** Buttons to switch between displaying M.Y.R.A.'s and C.A.E.L.U.M.'s emotion timeline.
*   **PAD Timeline Chart:** A line chart shows the evolution of Pleasure, Arousal, and Dominance over time for the selected AI. The X-axis is time, the Y-axis is the value (-1 to 1). Tooltips show exact values and the dominant affect at that time.
*   **Interpretation of Current State:** A textual interpretation of the most recent PAD state of the selected AI.

### 3.6 Knowledge Panel

Accessible via the "Knowledge" tab. Here, the knowledge base can be expanded with external documents. The functionality is global and used by both AIs.

*   **Upload Text File (.txt, .md):** Button and file selection for uploading text or Markdown files.
*   **Load & Process File Button:** Processes the selected file and adds it to the knowledge base.
*   **Loaded Sources:** List of uploaded source files with the number of chunks generated from them.
*   **Clear All Button:** Deletes the entire knowledge base.
*   **Automatic Loading:** On application startup, `Dokumentation_de.md`/`_en.md` and all `.md` files from the `docs` directory (with the appropriate language suffix) are automatically loaded.

### 3.7 Dual AI Conversation Panel

Accessible via the "Dual AI" tab. Allows initiating and observing a conversation between M.Y.R.A. and C.A.E.L.U.M.

*   **Initial Prompt:** A text field to set the starting topic for the conversation.
*   **Conversation Rounds:** A number input to set how many response rounds the AIs will exchange (1 round = each AI responds once).
*   **Start Dual Conversation Button:** Starts the dialog. M.Y.R.A. usually begins.
*   **Message Display:** Shows the conversation history. Messages from the user, M.Y.R.A., and C.A.E.L.U.M. are displayed differently. Each message includes the speaker's name, content, and a timestamp.

### 3.8 Documentation Panel

Accessible via the "Documentation" tab.

*   **Document Selection:** A dropdown menu allows selecting the documentation topic to display (e.g., Main Documentation, Configurations).
*   **Content Display:** The content of the selected Markdown file is rendered and displayed. The correct language version (German or English) is loaded based on the app's global language setting.
*   **Formatting:** Markdown is converted to HTML, including support for tables, code blocks with syntax highlighting, etc.

### 3.9 Settings Panel

Accessible via the "Settings" tab. Allows detailed configuration. It is divided into groups that can be selected via side navigation.

*   **Localization:** Language and UI theme.
*   **M.Y.R.A. AI Provider:** AI provider, model, URL, temperature for M.Y.R.A.
*   **C.A.E.L.U.M. AI Provider:** AI provider, model, URL, temperature for C.A.E.L.U.M.
*   **M.Y.R.A. Persona:** Name, role description, etc., for M.Y.R.A. (edits the directly translated/customized values).
*   **C.A.E.L.U.M. Persona:** Name, role description, etc., for C.A.E.L.U.M.
*   **M.Y.R.A. System:** SubQG parameters, RNG, decay rates, fitness interval for M.Y.R.A.
*   **C.A.E.L.U.M. System:** SubQG parameters, RNG, decay rates, fitness interval for C.A.E.L.U.M.
*   **General System:** Global settings like chat history length for LLM prompts, RAG chunk parameters, maximum length of the emotion timeline.
*   **Adaptive Fitness - Base Weights:** Weighting of base metrics for fitness calculation (applies to both AIs, but on their respective states).
*   **Adaptive Fitness - Dimension Contributions:** Weighting of how base metrics contribute to fitness dimensions (applies to both AIs).
*   **Apply Settings Button:** Saves all changes and applies them.
*   **Reset Group / Reset All Buttons:** Allow resetting configuration groups or all settings to default values.

### 3.10 Chat Interface (M.Y.R.A.)

The main area on the right side remains the primary chat interface for direct conversations with M.Y.R.A.

*   **Message Display:** Shows the conversation history between the user and M.Y.R.A.
*   **Input Field:** Text field for entering messages to M.Y.R.A.
*   **Send Button:** Sends the entered message.

---

## 4. Technical Architecture & Code Documentation

### 4.1 Project Structure

*   **`public/`**
    *   `Dokumentation_de.md` (This file in German)
    *   `Dokumentation_en.md` (This file in English)
    *   `docs/` (contains all `config_*.md` files, each in `_de.md` and `_en.md` versions)
        *   `config_adaptive_fitness_de.md` / `config_adaptive_fitness_en.md`
        *   `config_ai_provider_de.md` / `config_ai_provider_en.md`
        *   `config_knowledge_rag_de.md` / `config_knowledge_rag_en.md`
        *   `config_persona_behavior_de.md` / `config_persona_behavior_en.md`
        *   `config_subqg_simulation_de.md` / `config_subqg_simulation_en.md`
    *   `styles/index.css`
*   **`src/` (or project root for `.ts`, `.tsx` files in this structure)**
    *   `App.tsx`
    *   `index.html`
    *   `index.tsx`
    *   `constants.ts`
    *   `types.ts`
    *   `vite.config.ts`
    *   `metadata.json`
    *   `components/`
        *   `ChatInterface.tsx`
        *   `DocumentationPanel.tsx`
        *   `DualAiConversationPanel.tsx`
        *   `EmotionTimelinePanel.tsx`
        *   `IconComponents.tsx`
        *   `KnowledgePanel.tsx`
        *   `NodePanel.tsx`
        *   `SettingsPanel.tsx`
        *   `SubQGDisplay.tsx`
        *   `SystemStatusPanel.tsx`
    *   `hooks/`
        *   `useMyraState.ts`
    *   `services/`
        *   `aiService.ts`
    *   `utils/`
        *   `adaptiveFitnessManager.ts`
        *   `db.ts`
        *   `rng.ts`
        *   `uiHelpers.ts`
    *   `i18n/`
        *   `de.json`
        *   `en.json`
    *   ... (other configuration files like `tsconfig.json`, `package.json`, etc.)

### 4.2 `index.html`

Contains the basic structure of the HTML page. Includes Tailwind CSS, Heroicons, and JavaScript modules. Defines an `importmap` for external libraries like React, ReactDOM, `@google/genai`, `uuid`, `chart.js`, `react-chartjs-2`, `react-markdown`, `remark-gfm`, and `react-syntax-highlighter`. Sets initial theme and language from `localStorage`.

### 4.3 `metadata.json`

Application metadata, name, description, requested permissions (e.g., camera, microphone - currently not used).

### 4.4 `vite.config.ts`

Configures Vite. Defines aliases (e.g., `@` for the project root), sets environment variables (like `GEMINI_API_KEY` from `.env`), and configures the development server to be accessible on the network (`server: { host: true }`).

### 4.5 `index.tsx`

Entry point of the React application. Renders the `App` component into the `div#root` element in `index.html`.

### 4.6 `App.tsx`

*   **Purpose:** The main component of the React application. Manages the active tab, visibility of the mobile sidebar, width of the desktop sidebar, and renders the corresponding UI panels.
*   **Logic:**
    *   Uses the `useMyraState` hook to access the entire application state (M.Y.R.A. and C.A.E.L.U.M.) and update functions.
    *   Manages the `activeTab` state to determine which view is displayed.
    *   Implements logic for the mobile overlay sidebar (open/close, click outside).
    *   Implements logic for the **resizable desktop sidebar** (drag-to-resize), stores the width in `localStorage`.
    *   Renders the sidebar with navigation tabs for M.Y.R.A.-specific views (Status (M), Nodes (M), SubQG (M)), C.A.E.L.U.M.-specific views (Status (C), Nodes (C), SubQG (C)), and global views (Emotion Timeline, Knowledge, Documentation, Dual AI, Settings).
    *   Conditionally renders panels based on `activeTab` and passes the corresponding state data and callbacks.
    *   The header displays information (simulation step, fitness) of the AI corresponding to the active tab, or a generic title for global tabs.
    *   The right main panel is dedicated to the `ChatInterface` for direct interaction with M.Y.R.A.

### 4.7 `constants.ts`

*   **Purpose:** Defines global constants and initial states.
*   **Content:**
    *   `INITIAL_CONFIG`: Contains the default configuration for `MyraConfig`, including all parameters for M.Y.R.A. and C.A.E.L.U.M. (persona, AI provider, SubQG systems, adaptive fitness, emotion timeline length, etc.).
    *   `INITIAL_EMOTION_STATE`, `INITIAL_NODE_STATES`, `INITIAL_ADAPTIVE_FITNESS_STATE`, `INITIAL_SUBQG_GLOBAL_METRICS`: Default values for M.Y.R.A.'s core states.
    *   `INITIAL_CAELUM_EMOTION_STATE`, `INITIAL_CAELUM_NODE_STATES`, `INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE`, `INITIAL_CAELUM_SUBQG_GLOBAL_METRICS`: Default values for C.A.E.L.U.M.'s core states.

### 4.8 `types.ts`

*   **Purpose:** Defines all important TypeScript types and interfaces for the application.
*   **Important Types:**
    *   `MyraConfig`: Comprehensive configuration containing separate sections for M.Y.R.A.'s and C.A.E.L.U.M.'s system parameters, persona settings, and AI provider configurations. Also includes `maxPadHistorySize`.
    *   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`: Core state types.
    *   `PADRecord`: Type for entries in the emotion timeline (Pleasure, Arousal, Dominance, Timestamp, DominantAffect).
    *   `ConfigField` and its subtypes: For dynamic creation of the SettingsPanel, extended with `CaelumPersonaEditableField`, `CaelumSystemConfigField`, `GeneralSystemConfigField`.
    *   `ActiveTab`: Defines the possible active tabs, including `'documentation'`.

### 4.9 `hooks/useMyraState.ts`

*   **Purpose:** The central hook for state management and core application logic.
*   **Core Functions:**
    *   **State Management:** Manages the state for M.Y.R.A. and C.A.E.L.U.M. in parallel. This includes:
        *   Emotions (`emotionState`, `emotionStateCaelum`) and their timelines (`padHistoryMyra`, `padHistoryCaelum`).
        *   Node states (`nodeStates`, `nodeStatesCaelum`)
        *   Adaptive fitness (`adaptiveFitness`, `adaptiveFitnessCaelum`)
        *   SubQG matrices & metrics (`subQgMatrix`, `subQgMatrixCaelum`, etc.)
        *   RNG instances (`rngRef`, `rngRefCaelum`)
        *   Simulation steps (`simulationStep`, `simulationStepCaelum`)
        *   Stress levels (`myraStressLevel`, `caelumStressLevel`)
    *   **Configuration Management (`myraConfig`, `updateMyraConfig`):** Loads/saves configuration, adjusts SubQG matrices and RNGs on changes. Sanitizes `maxPadHistorySize` on load.
    *   **Simulation Loops:**
        *   `simulateNetworkStepMyra`: Executes a simulation step for M.Y.R.A. Adds an entry to `padHistoryMyra` after emotion update.
        *   `simulateNetworkStepCaelum`: Executes a parallel, independent simulation step for C.A.E.L.U.M. Adds an entry to `padHistoryCaelum` after emotion update.
    *   **AI Interaction:**
        *   `generateMyraResponse`: Generates a response from M.Y.R.A. in the main chat.
        *   `startDualConversation`: Initiates and manages a conversation between M.Y.R.A. and C.A.E.L.U.M.
    *   **System Instructions:**
        *   `getMyraBaseSystemInstruction`, `getCaelumBaseSystemInstruction`: Create system instructions based on the respective current state.
    *   **Knowledge Base (RAG):**
        *   `loadDocumentationKnowledge`: Automatically loads documentation files (e.g., `Dokumentation_en.md`, `docs/config_ai_provider_de.md`) on startup based on the current language setting.
        *   `loadAndProcessFile`, `clearAllKnowledge`, `retrieveRelevantChunks`.
    *   **SubQG Interaction:** `injectSubQgStimulus` (for M.Y.R.A.) and `injectSubQgStimulusCaelum` (for C.A.E.L.U.M.).
    *   **Adaptive Fitness:** Initializes and uses two `AdaptiveFitnessManager` instances.
    *   **Internationalization (`t` function):** Provides translations.

### 4.10 `components/`

#### 4.10.1 `ChatInterface.tsx`

For direct interaction with M.Y.R.A.

#### 4.10.2 `DualAiConversationPanel.tsx`

Enables conversations between M.Y.R.A. and C.A.E.L.U.M.

#### 4.10.3 `EmotionTimelinePanel.tsx`

Displays the temporal progression of PAD values for M.Y.R.A. and C.A.E.L.U.M.

#### 4.10.4 `DocumentationPanel.tsx`

*   **Purpose:** Displays Markdown-based documentation files.
*   **Functionality:** Loads and renders selected `.md` files (e.g., `Dokumentation_en.md`, `docs/config_ai_provider_de.md`) based on the app's current language setting. Uses `react-markdown` and `react-syntax-highlighter`.

#### 4.10.5 `IconComponents.tsx`

Contains SVG icons, including `DocumentTextIcon` for the documentation tab.

#### 4.10.6 `KnowledgePanel.tsx`

Management of the knowledge base (RAG).

#### 4.10.7 `NodePanel.tsx`

Visualizes the nodes of M.Y.R.A. or C.A.E.L.U.M.

#### 4.10.8 `SettingsPanel.tsx`

UI for configuring all parameters in `MyraConfig`.

#### 4.10.9 `SubQGDisplay.tsx`

Visualizes the SubQG of M.Y.R.A. or C.A.E.L.U.M.

#### 4.10.10 `SystemStatusPanel.tsx`

Displays the status (emotions, fitness, SubQG) of M.Y.R.A. or C.A.E.L.U.M.

### 4.11 `services/aiService.ts`

Encapsulates logic for communication with AI APIs.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

Class for calculating adaptive fitness.

#### 4.12.2 `db.ts`

Encapsulates interactions with IndexedDB.

#### 4.12.3 `rng.ts`

Defines RNG implementations.

#### 4.12.4 `uiHelpers.ts`

Helper functions for the UI, e.g., `getDominantAffect` and `interpretPAD`.

---

## 5. Functional Deep Dive

### 5.1 Simulation Cycles (M.Y.R.A. & C.A.E.L.U.M.)

The application runs two independent, parallel simulation loops:

*   **`simulateNetworkStepMyra()`:** Called at regular intervals. Updates M.Y.R.A.'s SubQG, emotions (including entry in `padHistoryMyra`), nodes, stress, and fitness.
*   **`simulateNetworkStepCaelum()`:** Also called at regular intervals. Updates C.A.E.L.U.M.'s SubQG, emotions (including entry in `padHistoryCaelum`), nodes, stress, and fitness.

This separation ensures M.Y.R.A. and C.A.E.L.U.M. operate as distinct entities.

### 5.2 AI Response Generation

*   **Direct Chat (M.Y.R.A.):** `generateMyraResponse` in `useMyraState` calls `callAiApi` with M.Y.R.A.'s specific configuration and state.
*   **Dual AI Conversation (`startDualConversation`):** Orchestrates the dialog by iteratively calling `callAiApi` for M.Y.R.A. and then for C.A.E.L.U.M., each with their specific configurations and current system states as context. Both use RAG.

### 5.3 Knowledge Processing (RAG & Automatic Document Loading)

*   **Automatic Loading:** On application startup, `loadDocumentationKnowledge` in `useMyraState` loads the content of documentation files like `Dokumentation_en.md` (or `_de.md`) and all `.md` files in the `public/docs/` directory (with the appropriate language suffix), splits them into chunks, and stores them in IndexedDB. Existing chunks from these sources are cleared beforehand to allow for updates.
*   **Manual Upload:** Via the `KnowledgePanel`.
*   **Processing & Retrieval:** Relevant chunks are retrieved as needed and provided to the AI as context.

### 5.4 Configuration Management

`MyraConfig` in `useMyraState` stores all settings. Changes in `SettingsPanel` are processed via `updateMyraConfig` and persisted in `localStorage`.

### 5.5 Emotion Timeline Tracking

*   In `useMyraState.ts`, PAD values (Pleasure, Arousal, Dominance), along with a timestamp and dominant affect, are stored in arrays after each simulation step for M.Y.R.A. (`padHistoryMyra`) and C.A.E.L.U.M. (`padHistoryCaelum`).
*   The length of these arrays is limited by `myraConfig.maxPadHistorySize`.
*   `EmotionTimelinePanel.tsx` visualizes this data using `react-chartjs-2`.

### 5.6 Documentation Viewer

*   `DocumentationPanel.tsx` is responsible for displaying the in-app documentation.
*   It uses a dropdown to select a documentation topic.
*   Based on the selection and the global language setting (`myraConfig.language`), the corresponding Markdown file (e.g., `/Dokumentation_en.md` or `/docs/config_ai_provider_de.md`) is loaded from the `public` directory.
*   `react-markdown` with `remark-gfm` and `react-syntax-highlighter` renders the Markdown content to HTML.

---

## 6. Detailed Configuration Parameters

The detailed description of all configuration parameters is outsourced to separate files in the `docs/` directory (available in both German and English):

*   [**AI Provider Configuration**](./docs/config_ai_provider_en.md)
*   [**Persona & Behavior**](./docs/config_persona_behavior_en.md)
*   [**SubQG Simulation**](./docs/config_subqg_simulation_en.md)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag_en.md)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness_en.md)

---

## 7. Setup and Start

1.  **Install dependencies:** `npm install` (or `yarn install`).
2.  **API Key:** Create a `.env` file in the project root and add your Gemini API Key:
    `GEMINI_API_KEY=YOUR_API_KEY_HERE`
3.  **Start development server:** `npm run dev` (or `yarn dev`).
4.  **Documentation Files:** Place your Markdown documentation files (each as `*_de.md` and `*_en.md`) in the `public` directory.
    *   Main documentation: `public/Dokumentation_de.md` and `public/Dokumentation_en.md`.
    *   Detailed configurations: `public/docs/config_NAME_de.md` and `public/docs/config_NAME_en.md`.
    These will be automatically loaded on startup for the RAG function and the Documentation Viewer.
5.  **Access:** Open the displayed local URL (e.g., `http://localhost:5173`) or network URL in your browser.
```