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
    *   [3.7 Documentation Panel](#37-documentation-panel)
    *   [3.8 Dual AI Conversation Panel](#38-dual-ai-conversation-panel)
    *   [3.9 Multi-Agent Conversation Panel](#39-multi-agent-conversation-panel)
    *   [3.10 Settings Panel](#310-settings-panel)
    *   [3.11 Chat Interface](#311-chat-interface)
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
        *   [`DocumentationPanel.tsx`](#4102-documentationpaneltsx)
        *   [`DualAiConversationPanel.tsx`](#4103-dualaiconversationpaneltsx)
        *   [`EmotionTimelinePanel.tsx`](#4104-emotiontimelinepaneltsx)
        *   [`IconComponents.tsx`](#4105-iconcomponentstsx)
        *   [`KnowledgePanel.tsx`](#4106-knowledgepaneltsx)
        *   [`MultiAgentConversationPanel.tsx`](#4107-multiagentconversationpaneltsx)
        *   [`NodePanel.tsx`](#4108-nodepaneltsx)
        *   [`SettingsPanel.tsx`](#4109-settingspaneltsx)
        *   [`SubQGDisplay.tsx`](#41010-subqgdisplaytsx)
        *   [`SystemStatusPanel.tsx`](#41011-systemstatuspaneltsx)
    *   [4.11 `services/aiService.ts`](#411-servicesaiservicets)
    *   [4.12 `utils/`](#412-utils)
        *   [`adaptiveFitnessManager.ts`](#4121-adaptivefitnessmanagerts)
        *   [`db.ts`](#4122-dbts)
        *   [`rng.ts`](#4123-rngts)
        *   [`uiHelpers.ts`](#4124-uihelpersts)
5.  [Functional Deep Dive](#5-functional-deep-dive)
    *   [5.1 Simulation Cycles (M.Y.R.A., C.A.E.L.U.M. & Configurable Agents)](#51-simulation-cycles-myra-caelum--configurable-agents)
    *   [5.2 AI Response Generation](#52-ai-response-generation)
    *   [5.3 Knowledge Processing (RAG & Automatic Document Loading)](#53-knowledge-processing-rag--automatic-document-loading)
    *   [5.4 Configuration Management](#54-configuration-management)
    *   [5.5 Emotion Timeline Tracking](#55-emotion-timeline-tracking)
    *   [5.6 Documentation Viewer](#56-documentation-viewer)
    *   [5.7 Multi-Agent Conversations](#57-multi-agent-conversations)
6.  [Detailed Configuration Parameters](#6-detailed-configuration-parameters)
7.  [Setup and Start](#7-setup-and-start)

---

## 1. Introduction

This document describes the M.Y.R.A. (Modular Yearning Reasoning Architecture) web application. The application provides an interactive interface for simulating and interacting with AI entities: **M.Y.R.A.**, **C.A.E.L.U.M.**, and additionally user-**configurable agents**. Each of these entities possesses its own independent, simulated cognitive-affective system, influenced by a SubQuantum Field (SubQG), node networks, emotions, and adaptive fitness. The application uses the Gemini API (or a local LM Studio instance) for intelligent responses and visualizes the internal states of all agents. An integrated documentation viewer allows direct access to this and other relevant documentation.

The core idea is to create AI entities whose behavior is not only based on trained data but is also shaped by dynamic, emergent internal states. This document serves as a guide for users and developers.

---

## 2. Core Concepts & Glossary

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** A primary AI entity based on emotional expression and creative thinking.
*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** A second AI entity specializing in logical analysis and pattern recognition.
*   **Configurable Agents:** AI entities definable by the user in the `SettingsPanel`. Each configurable agent has its own independent persona, AI provider settings, system configuration (SubQG, RNG, decay rates), and adaptive fitness parameters. Their internal states are simulated just like M.Y.R.A.'s and C.A.E.L.U.M.'s.
*   **SubQG (SubQuantum Field):** A simulated field serving as a basis for emergent dynamics. Each AI (M.Y.R.A., C.A.E.L.U.M., and every configurable agent) possesses its own independent SubQG.
*   **Nodes:** Representations of concepts, emotions, or cognitive functions. Each AI has its own independent set of nodes.
*   **Emotion State (PAD Model & Specific Emotions):** The emotional state, individual for each AI.
*   **Emotion Timeline Tracker (PAD Timeline):** Visualizes the temporal progression of PAD values. *Note: Currently, this panel primarily displays M.Y.R.A.'s and C.A.E.L.U.M.'s data; an extension for all agents via an Agent Inspector is planned but not yet fully implemented in the UI.*
*   **Adaptive Fitness:** A system for evaluating "health" and performance, individual for each AI.
*   **AgentRuntimeState:** A data structure holding all dynamic simulation data for a single agent (SubQG matrices, node states, emotions, adaptive fitness instance, RNG instance, etc.).
*   **Agent Inspector (Concept):** A UI mechanism (currently managed by `inspectedAgentId` in the `useMyraState` hook) to select a specific agent (M.Y.R.A., C.A.E.L.U.M., or configurable). The diagnostic panels (`SystemStatusPanel`, `NodePanel`, `SubQGDisplay`, `EmotionTimelinePanel`) are *not yet fully* designed to dynamically display the data of the `inspectedAgentId` and often still access M.Y.R.A./C.A.E.L.U.M.-specific data via dedicated tabs. However, SubQG interaction (`injectSubQgStimulusForAgent`) is already generalized for all agents.
*   **RAG (Retrieval Augmented Generation):** Approach to enrich AI prompts with external knowledge.
*   **Multi-Agent Conversation:** A panel where selected agents (M.Y.R.A., C.A.E.L.U.M., configurable agents) can engage in a joint, turn-based conversation, with each agent being simulated before its turn.

---

## 3. User Interface (UI) Guide

### 3.1 Main Layout

The UI is divided into three main areas: Header, Left Panel (sidebar with tabs), and Right Panel (main chat interface). The sidebar is resizable on desktops and acts as an overlay on mobile. Tabs navigate to different views:

*   **Status (M/C), Nodes (M/C), SubQG (M/C):** Show specific data for M.Y.R.A. (M) or C.A.E.L.U.M. (C). *Full integration of a global Agent Inspector to make these panels dynamic for any agent is still pending on the UI side.*
*   **Emotion Timeline:** Displays emotion histories (currently primarily M.Y.R.A./C.A.E.L.U.M.).
*   **Knowledge:** Knowledge base management.
*   **Documentation:** Integrated documentation viewer.
*   **Dual AI:** Conversations between M.Y.R.A. and C.A.E.L.U.M.
*   **Multi-Agent Conv.:** Conversations with a selection of M.Y.R.A., C.A.E.L.U.M., and configurable agents.
*   **Settings:** Configuration settings.

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Displays the status of the AI selected via the tab (M.Y.R.A. or C.A.E.L.U.M.). Shows emotion status, adaptive fitness, and SubQG metrics. Includes a "Heartbeat Display" based on stress level and a "SubQG Pulse Indicator" for SubQG events.

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Visualizes modulator and a selection of semantic nodes for the AI selected via the tab, including activation and other scores.

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Represents the SubQG field (energy and phase) of the AI selected via the tab. Allows direct injection of energy and setting of phases into individual cells. The backend function `injectSubQgStimulusForAgent` is already generalized for all agents, but the UI for selecting the target agent here is not yet implemented.

### 3.5 Emotion Timeline Panel

Displays the temporal progression of PAD (Pleasure, Arousal, Dominance) values as a line chart. Allows selection between M.Y.R.A.'s and C.A.E.L.U.M.'s timelines.

### 3.6 Knowledge Panel

Allows uploading text, Markdown, Excel (.xlsx), and Word (.docx) files to extend the global knowledge base. Displays loaded sources and allows clearing the entire knowledge base.

### 3.7 Documentation Panel

Displays Markdown-based documentation files directly within the application. Users can switch between different documents (main documentation, configuration details) via a dropdown menu. Documents are loaded language-specifically, with a fallback to English.

### 3.8 Dual AI Conversation Panel

Initiates and displays turn-based conversations between M.Y.R.A. and C.A.E.L.U.M., based on an initial prompt.

### 3.9 Multi-Agent Conversation Panel

Allows selecting any combination of M.Y.R.A., C.A.E.L.U.M., and configured agents for a joint conversation. The user provides an initial prompt and the number of rounds per agent.

### 3.10 Settings Panel

Provides detailed configuration options, grouped into sections:
*   **Localization:** Language (German/English), UI Theme (Nebula, Biosphere, Matrix).
*   **M.Y.R.A. / C.A.E.L.U.M. AI Provider:** Respective AI service, model, URL, temperature.
*   **M.Y.R.A. / C.A.E.L.U.M. Persona:** Name, role description, ethics, response instructions.
*   **M.Y.R.A. / C.A.E.L.U.M. System:** Respective SubQG parameters, RNG, decay rates, fitness interval.
*   **Configurable Agents:** Main section for managing agents.
    *   **Add/Delete Agent:** Buttons to create new or remove existing agents.
    *   **Agent-Specific Configuration:** Each agent has expandable sections for: Persona, AI Provider, System Configuration (SubQG, RNG, etc.), Adaptive Fitness.
*   **General System:** Global chat history length, temperature influences, RAG parameters, maximum emotion timeline length.
*   **Adaptive Fitness (Base Weights/Dimensions):** Global weightings used by M.Y.R.A. and C.A.E.L.U.M. (configurable agents have their own).

### 3.11 Chat Interface

Main chat window for interacting with the primary agent selected in settings (`activeChatAgent` - M.Y.R.A. or C.A.E.L.U.M.). Supports voice input and output.

---

## 4. Technical Architecture & Code Documentation

### 4.1 Project Structure

The project structure includes standard React directories (`src`, `public`) and specific folders for components, hooks, services, utils, and internationalization files (`i18n`). Markdown documentation is located in `public/` and `public/docs/`.

### 4.2 `index.html`

Base HTML, loads Tailwind CSS, Heroicons, and the main JavaScript module (`index.tsx`). Includes an `importmap` for CDN-based dependencies. Initializes theme and language from `localStorage`.

### 4.3 `metadata.json`

Metadata for the hosting platform, including requested permissions (e.g., microphone).

### 4.4 `vite.config.ts`

Vite build configuration. Defines aliases, environment variables (for API keys), and server settings.

### 4.5 `index.tsx`

React entry point, renders the `App` component.

### 4.6 `App.tsx`

Main component, manages layout, active tab navigation, and display of UI panels. Uses `useMyraState` for access to global application state. The functionality for a global "Agent Inspector" (selecting the agent whose data is displayed in diagnostic panels) is prepared in the `useMyraState` hook (`inspectedAgentId`), but the UI elements (e.g., a dropdown in `App.tsx`) and full adaptation of diagnostic panels to use this state are not yet implemented. The panels often still access M.Y.R.A./C.A.E.L.U.M.-specific data directly.

### 4.7 `constants.ts`

Defines initial configurations (`INITIAL_CONFIG`), default emotion states, node sets for M.Y.R.A. and C.A.E.L.U.M., initial fitness values, and the important `createInitialAgentRuntimeState` function for generating the runtime state for any agent type. `INITIAL_CONFIG` now also includes a list of `DEFAULT_CONFIGURABLE_AGENTS` with complete default configurations.

### 4.8 `types.ts`

Contains all TypeScript type definitions. Key types include:
*   `MyraConfig`: Comprehensive global configuration.
*   `ConfigurableAgentPersona`: Defines the structure for configurable agents, including their own `aiProviderConfig`, `systemConfig` (type `AgentSystemCoreConfig`), and `adaptiveFitnessConfig`.
*   `AgentSystemCoreConfig`: Core parameters for an agent's simulation system (SubQG, RNG, decay rates, etc.).
*   `AgentRuntimeState`: Holds all dynamic runtime data for an agent (SubQG matrices, node states, emotions, fitness, RNG instance, AdaptiveFitnessManager instance).
*   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`, `PADRecord`.
*   `ConfigField` and its subtypes for the `SettingsPanel`.
*   `InspectedAgentID`: Type for the ID of the currently inspected agent.

### 4.9 `hooks/useMyraState.ts`

The central hook for all state management and core logic:
*   **`agentRuntimeStates`**: A `Record<string, AgentRuntimeState>` stores the dynamic state of all agents (M.Y.R.A., C.A.E.L.U.M., configurable agents), indexed by their IDs.
*   **Initialization**: Creates `AgentRuntimeState` for all agents on startup, based on their configuration in `myraConfig`. Each agent gets its own instance of its RNG and `AdaptiveFitnessManager`.
*   **`updateMyraConfig`**: Updates `myraConfig`, saves it to `localStorage`, and synchronizes `agentRuntimeStates` (e.g., adding/removing agents, reinitializing SubQG matrices or RNGs upon relevant configuration changes).
*   **`simulateAgentStepInternal`**: A new, generic function that performs a simulation step for *any* agent based on its ID, configuration, and current runtime state.
*   `simulateNetworkStepMyra` / `simulateNetworkStepCaelum`: Wrappers around `simulateAgentStepInternal` for continuous simulation of M.Y.R.A. and C.A.E.L.U.M.
*   **AI Interactions**:
    *   `generateActiveAgentChatResponse`: For the main chat.
    *   `startDualConversation`: For M.Y.R.A.-C.A.E.L.U.M. dialogues.
    *   `startMultiAgentConversation`: For conversations with a selection of agents. Calls `simulateAgentStepInternal` for an agent before its turn and uses the *directly* returned state to generate the system instruction.
*   **`getAgentBaseSystemInstruction`**: Generates system instructions based on the respective agent's dynamic `AgentRuntimeState`.
*   **`injectSubQgStimulusForAgent`**: Generalized function to inject energy/phase into any agent's SubQG.
*   **`inspectedAgentId`, `setInspectedAgentId`**: State and setter for the planned Agent Inspector.

### 4.10 `components/`

Detailed descriptions of individual UI components:

#### 4.10.1 `ChatInterface.tsx`

UI for the main chat with the active agent (`myraConfig.activeChatAgent`). Supports text and speech input (STT) as well as speech output (TTS) for AI messages.

#### 4.10.2 `DocumentationPanel.tsx`

Displays Markdown documents. Allows selection of different documents. Loads language-specific versions with a fallback to English. Uses `react-markdown` and `react-syntax-highlighter`.

#### 4.10.3 `DualAiConversationPanel.tsx`

UI for initiating and displaying conversations between M.Y.R.A. and C.A.E.L.U.M.

#### 4.10.4 `EmotionTimelinePanel.tsx`

Visualizes the PAD emotion timeline for M.Y.R.A. and C.A.E.L.U.M. (selection possible). *Adaptation to display the timeline for any inspected agent is still pending on the UI side.*

#### 4.10.5 `IconComponents.tsx`

Collection of SVG icon components for the UI.

#### 4.10.6 `KnowledgePanel.tsx`

UI for managing the knowledge base: uploading `.txt`, `.md`, `.xlsx`, `.docx` files and clearing the entire base.

#### 4.10.7 `MultiAgentConversationPanel.tsx`

UI for conversations with multiple selected agents (M.Y.R.A., C.A.E.L.U.M., configurable agents). Allows selection of participants, input of a starting prompt, and setting the number of rounds.

#### 4.10.8 `NodePanel.tsx`

Displays modulator and semantic nodes of the selected agent (currently M.Y.R.A. or C.A.E.L.U.M. via tabs). *Adaptation to global Agent Inspector pending.*

#### 4.10.9 `SettingsPanel.tsx`

Comprehensive panel for configuring all global and agent-specific parameters. Allows adding, deleting, and detailed configuration of configurable agents (Persona, AI Provider, System Simulation, Adaptive Fitness).

#### 4.10.10 `SubQGDisplay.tsx`

Visualizes the SubQG field (energy & phase) and allows energy/phase injection for the selected agent (currently M.Y.R.A. or C.A.E.L.U.M. via tabs). *Adaptation to global Agent Inspector for selecting the target agent for injection is pending on the UI side.*

#### 4.10.11 `SystemStatusPanel.tsx`

Displays emotion status, adaptive fitness, and SubQG metrics of the selected agent (currently M.Y.R.A. or C.A.E.L.U.M. via tabs). *Adaptation to global Agent Inspector pending.*

### 4.11 `services/aiService.ts`

Encapsulates logic for API calls to Gemini or LM Studio. `callAiApi` accepts agent-specific configurations and system instructions.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

Class for calculating adaptive fitness. Instantiated per agent. The `updateConfig` method can now optionally accept a new `getSystemState` function to ensure the manager always accesses the most current state of the specific agent.

#### 4.12.2 `db.ts`

Manages IndexedDB for the knowledge base chunks. Includes an index on `source` and functions for adding, retrieving, and deleting chunks.

#### 4.12.3 `rng.ts`

Defines `SubQGRNG` (deterministic) and `QuantumRNG` (non-deterministic).

#### 4.12.4 `uiHelpers.ts`

Helper functions for the UI, e.g., `getDominantAffect` and `interpretPAD` for interpreting emotion states.

---

## 5. Functional Deep Dive

### 5.1 Simulation Cycles (M.Y.R.A., C.A.E.L.U.M. & Configurable Agents)

*   M.Y.R.A. and C.A.E.L.U.M. have dedicated simulation intervals that call `simulateAgentStepInternal`.
*   **Configurable Agents** are also simulated via `simulateAgentStepInternal`, specifically when it's their turn to speak in a `startMultiAgentConversation`, right before their response is generated.

### 5.2 AI Response Generation

For every agent (M.Y.R.A., C.A.E.L.U.M., configurable), its individual simulation step is executed before response generation. The `baseSystemInstruction` for the LLM call is generated from the current, dynamic `AgentRuntimeState` of that agent. The specific `aiProviderConfig` of the respective agent is used.

### 5.3 Knowledge Processing (RAG & Automatic Document Loading)

The RAG system is global. Relevant chunks from the knowledge base (which includes automatically loaded documentation and manually uploaded files) are retrieved and added to the context of the *currently speaking agent*. File processing supports `.txt`, `.md`, `.xlsx` (via `read-excel-file`), and `.docx` (via `mammoth`).

### 5.4 Configuration Management

`MyraConfig` stores all settings. The `SettingsPanel` allows detailed configuration of every aspect of all agents. Changes are saved to `localStorage`.

### 5.5 Emotion Timeline Tracking

PAD values for M.Y.R.A. and C.A.E.L.U.M. are visualized in the `EmotionTimelinePanel`. *Extension to display timelines for all agents is pending on the UI side.*

### 5.6 Documentation Viewer

The `DocumentationPanel` allows viewing various Markdown documentation files directly within the app.

### 5.7 Multi-Agent Conversations

The `MultiAgentConversationPanel` enables conversations between any selection of M.Y.R.A., C.A.E.L.U.M., and configurable agents. Each agent is simulated before its turn.

---

## 6. Detailed Configuration Parameters

The detailed description of all configuration parameters is outsourced to separate files in the `docs/` directory. These should be read according to the new structure (many parameters are now per-configurable agent).

*   [**AI Provider Configuration**](./docs/config_ai_provider_en.md)
*   [**Persona & Behavior**](./docs/config_persona_behavior_en.md)
*   [**SubQG Simulation**](./docs/config_subqg_simulation_en.md)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag_en.md)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness_en.md)

These documents describe how parameters apply to M.Y.R.A., C.A.E.L.U.M., and individually configurable agents.

---

## 7. Setup and Start

1.  **Install dependencies:** `npm install` in the project directory.
2.  **API Key (Optional, for Gemini):** Create a `.env` file in the project root and add your Gemini API Key: `GEMINI_API_KEY=YOUR_API_KEY`.
3.  **Local LLM (Optional, for LM Studio):** Ensure LM Studio is running and a model is loaded if you intend to use this option.
4.  **Start development server:** `npm run dev`.
5.  **Documentation Files:** Place `Dokumentation_en.md` and other `.md` files in the `public/` or `public/docs/` directory to be automatically loaded.

The application will then typically be accessible at `http://localhost:5173` (or another port assigned by Vite).
