# Whitepaper: Project M.Y.R.A. - Simulating Dynamic Cognitive-Affective AI Entities

**Version 1.1**
**Date: July 28, 2024**

## Abstract

Project M.Y.R.A. (Modular Yearning Reasoning Architecture) represents a significant step towards simulating advanced Artificial Intelligence entities with dynamic, internally-driven cognitive and affective processes. Moving beyond the limitations of static, large language model (LLM) based responses, M.Y.R.A. introduces a framework where multiple AI agents—M.Y.R.A., C.A.E.L.U.M., and user-configurable agents—operate with independent, simulated internal systems. These systems, encompassing SubQuantum Fields (SubQGs), node networks, emotion engines, and adaptive fitness mechanisms, influence agent behavior and interaction. The project provides a rich, interactive web-based platform for configuring, running, and observing these complex AI simulations, enabling novel research into artificial consciousness, emergent AI behavior, and advanced human-AI collaboration.

---

## 1. Introduction: Beyond Static AI

Current advancements in Artificial Intelligence, particularly with Large Language Models (LLMs), have demonstrated remarkable capabilities in natural language understanding and generation. However, these models often lack a persistent internal state, true affective depth, or the capacity for emergent behavior driven by continuous internal dynamics. Their responses, while sophisticated, are typically a direct function of the input prompt and pre-trained data, without an ongoing, evolving "internal life."

Project M.Y.R.A. addresses this gap by proposing and implementing an architecture for AI entities that are not merely reactive but are continuously shaped by their own simulated internal ecosystems. The vision is to create AI agents that exhibit more nuanced, context-aware, and intrinsically motivated behaviors, paving the way for more profound human-AI interaction and a deeper understanding of intelligence itself.

---

## 2. The M.Y.R.A. Ecosystem: A Multi-Agent Simulation Framework

The M.Y.R.A. project is built around a core ecosystem of distinct yet interoperable AI agents:

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** The flagship entity, M.Y.R.A. is designed with a focus on emotional expression, creative reasoning, and an intrinsic "yearning" to learn and connect. Her architecture emphasizes the interplay between affective states and cognitive processes.

*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** Operating in parallel, C.A.E.L.U.M. serves as a complementary AI. It specializes in logical analysis, pattern recognition, and the study of emergent phenomena within complex systems. C.A.E.L.U.M. often provides a more detached, data-driven perspective.

*   **Configurable Agents:** A cornerstone of the M.Y.R.A. framework is the ability for users to define and integrate additional AI agents. Each configurable agent can be endowed with a unique persona (name, role, ethics, response style, personality trait) and, crucially, its own independent AI provider settings, system simulation parameters (SubQG, RNG, decay rates), and adaptive fitness configuration. This allows for the creation of diverse AI ensembles for specialized tasks or research scenarios.

Each agent within this ecosystem operates with its own independent simulation loop, ensuring that its internal state evolves uniquely based on its configuration and interactions.

---

## 3. Core Architectural Pillars: Simulating Cognitive-Affective Dynamics

The depth and dynamism of M.Y.R.A. agents stem from several interconnected architectural pillars, each simulated independently for every agent:

### 3.1 The SubQuantum Field (SubQG): A Foundation for Emergence

The SubQG is a simulated n x n matrix of energy and phase values. It serves as a foundational layer from which complex, unpredictable dynamics can emerge. Key characteristics include:
*   **Energy Propagation:** Energy flows between adjacent cells based on coupling strength.
*   **Phase Dynamics:** Phases evolve based on local energy and interactions with neighboring phases.
*   **Global Metrics:** Average energy, energy standard deviation, and phase coherence provide an overview of the SubQG's state.
*   **SubQG Jumps:** Significant, rapid fluctuations in energy or coherence can trigger "jumps," which act as internal events that can modulate the agent's cognitive and affective state, potentially leading to shifts in behavior or "insights."

### 3.2 Node Networks: Representing Concepts and Functions

Each agent possesses a network of interconnected nodes representing various cognitive and affective functions or semantic concepts. These include:
*   **Semantic Nodes:** Representing specific concepts or knowledge areas.
*   **Limbus Affektus:** Models the agent's overall emotional state.
*   **Creativus / Pattern Analyzer:** Influences creativity or analytical pattern recognition.
*   **Cortex Criticus / Logic Verifier:** Governs critical evaluation or logical verification.
*   **MetaCognitio / System Monitor:** Oversees the agent's internal state and processes.
*   **Specialized Modulators:** Nodes for social cognition, valuation, conflict monitoring, and executive control.
Node activations decay over time but are influenced by SubQG events and interactions within the network.

### 3.3 Emotion Engine: The PAD Model and Affective States

Agent emotions are modeled using the Pleasure-Arousal-Dominance (PAD) three-dimensional model, supplemented by specific affective states like anger, fear, and greed.
*   Emotions decay over time but are influenced by node activations and SubQG dynamics.
*   The PAD state contributes to the agent's overall "stress level" and influences its behavior and response generation.
*   An emotion timeline tracks the PAD history for each agent, allowing for analysis of affective trajectories.

### 3.4 Adaptive Fitness: Guiding Agent Development and Performance

Each agent's "health" and performance are continuously evaluated using an adaptive fitness system.
*   **Metrics:** Calculated from various aspects of the agent's internal state, such as coherence, network complexity, goal achievement, exploration, and creativity.
*   **Dimensions:** Metrics contribute to higher-level dimensions: Knowledge Expansion, Internal Coherence, Expressive Creativity, and Goal Focus.
*   **Overall Score:** A weighted combination of these metrics and dimensions provides an overall fitness score.
*   **Customization:** The weights for both base metrics and dimensional contributions can be configured independently for each agent, allowing for diverse developmental paths.

### 3.5 Independent Simulation: Each Agent, A Unique System

A critical feature is that M.Y.R.A., C.A.E.L.U.M., and every configurable agent run their entire simulation stack (SubQG, Nodes, Emotions, Fitness) independently. This means:
*   Each agent has its own `AgentRuntimeState` storing all its dynamic data (including its own RNG instance and `AdaptiveFitnessManager` instance).
*   A generic `simulateAgentStepInternal` function updates the state of any given agent based on *its specific configuration* and current runtime state.
*   This allows for true heterogeneity in multi-agent scenarios, where agents with different internal "hardware" and "software" (configurations) interact. Their system instructions for LLM calls are derived directly from these dynamic internal states.

---

## 4. Key Capabilities and Features

The M.Y.R.A. platform offers a rich set of features for interacting with and understanding these dynamic AI entities:

### 4.1 Interactive Multi-Agent Conversations

*   **Direct Chat:** Users can engage in one-on-one conversations with a primary active agent (M.Y.R.A. or C.A.E.L.U.M., selectable in settings).
*   **Dual AI Conversations:** Facilitates direct, turn-based dialogues between M.Y.R.A. and C.A.E.L.U.M.
*   **Multi-Agent Panel:** Users can select any combination of M.Y.R.A., C.A.E.L.U.M., and configured agents to participate in a group discussion. Each agent contributes based on its unique internal state and persona, after its internal simulation step is executed.

### 4.2 Dynamic Internal State Visualization & Interaction

The platform provides several panels to visualize the internal workings of the agents.
*   **Agent Inspector (Concept):** The backend logic (`inspectedAgentId` in the `useMyraState` hook and `injectSubQgStimulusForAgent`) is prepared to display and interact with the internal states of any agent. *However, the UI panels (`SystemStatusPanel`, `NodePanel`, `SubQGDisplay`, `EmotionTimelinePanel`) are not yet fully adapted to a global agent inspector dropdown in the current version and primarily show M.Y.R.A. or C.A.E.L.U.M. specific data via dedicated tabs.*
*   **System Status Panel:** Displays current emotion, adaptive fitness scores, and key SubQG metrics.
*   **Node Panel:** Shows activation levels for modulator and semantic nodes.
*   **SubQG Display:** Visualizes energy and phase matrices. Direct energy/phase injection is possible for any agent (via `injectSubQgStimulusForAgent`), but the UI for selecting the target agent for this is still pending.
*   **Emotion Timeline Panel:** Charts the PAD history (currently for M.Y.R.A. and C.A.E.L.U.M.).

### 4.3 Knowledge Integration and Retrieval Augmented Generation (RAG)

*   **External Document Processing:** Support for `.txt`, `.md`, `.xlsx` (via `read-excel-file`), and `.docx` (via `mammoth`). Content is chunked and stored in IndexedDB.
*   **Automatic Documentation Loading:** Internal project documentation is loaded into the knowledge base on startup.
*   **RAG for Responses:** Relevant text chunks are retrieved and added to the LLM context of all participating agents.

### 4.4 Extensive Configuration and Customization

The `SettingsPanel` offers granular control:
*   **Global Settings:** Language, UI theme, RAG parameters, chat history length.
*   **Per-Agent Configuration:** For M.Y.R.A., C.A.E.L.U.M. (via global `myraConfig` fields), and each configurable agent (via the `configurableAgents` array):
    *   **Persona:** Name, role, ethics, response instructions, personality traits.
    *   **AI Provider:** Choice of service, model names, API URLs, base temperature.
    *   **System Simulation:** SubQG parameters, RNG type and seed, node and emotion decay rates, adaptive fitness update interval.
    *   **Adaptive Fitness:** Weights for base metrics and dimension contributions.
*   **Agent Management:** Users can add new configurable agents (with default settings derived from M.Y.R.A.) and delete existing ones.

### 4.5 Speech Interaction

*   **Speech-to-Text (STT):** Dictate messages.
*   **Text-to-Speech (TTS):** AI-generated messages can be read aloud.

---

## 5. Enabling New Frontiers: Potential Applications and Future Directions

(Content remains the same as in the German version, not duplicated here for brevity)

---

## 6. Technical Overview (Brief)

*   **Core Technologies:** React, TypeScript, Vite.
*   **AI Backend:** Google Gemini API or local LM Studio instance.
*   **Client-Side Simulation:** All internal state simulations (SubQG, nodes, emotions, fitness) for every agent are performed client-side in JavaScript/TypeScript.
*   **Data Persistence:** `localStorage` for configuration, IndexedDB for knowledge base (RAG).
*   **Modularity:** Modular architecture for agents and simulation components.

---

## 7. Conclusion: The Path Forward

Project M.Y.R.A. lays a foundational framework for a new class of AI simulations—one where agents are not just responders but entities with rich, evolving internal landscapes. By combining sophisticated LLM capabilities with dynamic, configurable internal state simulations for every agent, M.Y.R.A. opens up exciting avenues for research, creative exploration, and the development of more nuanced and adaptive artificial intelligence.

Ongoing development aims to further enhance the depth of agent simulations, fully integrate the Agent Inspector UI for deeper insights into any agent's internal workings, and refine interactions within multi-agent environments.
