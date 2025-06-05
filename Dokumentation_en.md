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
5.  [Functional Deep Dives](#5-functional-deep-dives)
    *   [5.1 Simulation Cycles (M.Y.R.A. & C.A.E.L.U.M.)](#51-simulation-cycles-myra--caelum)
    *   [5.2 AI Response Generation](#52-ai-response-generation)
    *   [5.3 Knowledge Processing (RAG & Automatic Document Loading)](#53-knowledge-processing-rag--automatic-document-loading)
    *   [5.4 Configuration Management](#54-configuration-management)
    *   [5.5 Emotion History Tracking](#55-emotion-history-tracking)
    *   [5.6 Documentation Display](#56-documentation-display)
6.  [Detailed Configuration Parameters](#6-detailed-configuration-parameters)
7.  [Setup and Startup](#7-setup-and-startup)

---

## 1. Introduction

This document describes the M.Y.R.A. (Modular Yearning Reasoning Architecture) web application with SubQG integration. The application provides an interactive interface for simulating and interacting with two AI entities, **M.Y.R.A.** and **C.A.E.L.U.M.**, whose cognitive-affective processes are each influenced by their own independent, simulated SubQuantum Ground Field (SubQG). It utilizes the Gemini API (or a local LM Studio instance) for intelligent responses and visualizes internal states such as SubQG metrics, node states, emotions (including a timeline tracker), and adaptive fitness for both systems. An integrated documentation viewer allows direct access to this and other relevant documentation within the app.

The core idea is to create AI entities whose behavior is not only based on trained data but is also shaped by dynamic, emergent internal states influenced by their respective complex subsystems (SubQGs). This document serves as a guide for users and developers.

---

## 2. Core Concepts & Glossary

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** The primary AI entity, based on emotional expression and creative thinking.
*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** A second, independent AI entity running parallel to M.Y.R.A. C.A.E.L.U.M. specializes in logical analysis, pattern recognition, and understanding emergent phenomena, and possesses its own simulation system (SubQG, nodes, emotions).
*   **SubQG (SubQuantum Ground Field):** A simulated field that serves as the basis for emergent dynamics. Each AI (M.Y.R.A. and C.A.E.L.U.M.) has its own independent SubQG. It consists of a matrix of energy values and phases that evolve over time and interact with each other. "SubQG Jumps" are significant fluctuations in this field that can influence the state of the respective AI.
*   **Nodes:** Representations of concepts, emotions, or cognitive functions. Both M.Y.R.A. and C.A.E.L.U.M. have their own independent sets of nodes, which can be configured and named differently (e.g., M.Y.R.A.'s "Creativus" vs. C.A.E.L.U.M.'s "Pattern Analyzer").
    *   **Semantic Nodes:** Represent specific concepts.
    *   **Limbus Affectus:** A special node that models the overall emotional state.
    *   **Creativus / Pattern Analyzer:** Influences creativity/pattern analysis.
    *   **Cortex Criticus / Logic Verifier:** Controls critical evaluation/logical verification.
    *   **MetaCognitio / System Monitor:** Monitors the overall state of the respective network.
    *   **Behavioral Modulators (Social, Valuation, Conflict, Executive):** Nodes for specific cognitive functions.
*   **Emotion State (PAD Model & Specific Emotions):** The emotional state is represented by Pleasure, Arousal, and Dominance (PAD), as well as more specific emotions. Each AI has its own emotional state.
*   **Emotion History Tracker (PAD Timeline):** A UI panel that visualizes the temporal progression of PAD values for M.Y.R.A. and C.A.E.L.U.M.
*   **Adaptive Fitness:** A system for evaluating "health" and performance. Each AI has its own adaptive fitness based on its respective internal state.
*   **RAG (Retrieval Augmented Generation):** An approach where relevant information is retrieved from a knowledge base before response generation. Used by M.Y.R.A. in direct chat and by both AIs in the Dual AI conversation.
*   **Text Chunk:** A segment of text from an external document, stored in the knowledge base.
*   **SubQG Jump:** A significant, sudden change in an AI's respective SubQG.
*   **Phase Coherence:** A measure of the synchronicity of phases in the SubQG.
*   **IndexedDB:** Client-side database for storing text chunks.
*   **LM Studio / Gemini API:** External AI services for response generation.
*   **RNG (Random Number Generator):** Used for stochastic processes in the simulations. Each AI can have its own RNG type and seed.
*   **Resizable Sidebar:** The sidebar in desktop views can be manually adjusted in width.
*   **Documentation Viewer:** A UI panel for displaying Markdown-based documentation files directly within the application, with language selection.

---

## 3. User Interface (UI) Guide

### 3.1 Main Layout

The user interface of the **M.Y.R.A. & C.A.E.L.U.M. System Interface** is designed for intuitive operation and clear information display. It is divided into three primary areas:

*   **Header:**
    At the top of the application. Displays the title of the current view (e.g., *M.Y.R.A. System Interface* or *C.A.E.L.U.M. System Interface*, depending on which AI or global tab is active). On the right side of the header, the current **Simulation Step (SimStep)** and the **Overall Fitness (Fitness)** of the AI currently in focus are dynamically displayed. On mobile devices (not shown), the header also includes a hamburger button to show/hide the sidebar.

*   **Left Panel (Aside / Sidebar):**
    On the left side is the navigation and information panel.
    *   **Navigation Tabs:** A list of clickable tabs allows switching between different views and modules of the system. These include specific views for M.Y.R.A. (**Status (M)**, **Nodes (M)**, **SubQG (M)**), for C.A.E.L.U.M. (**Status (C)**, **Nodes (C)**, **SubQG (C)**), as well as global panels (**Emotion Timeline**, **Knowledge**, **Documentation**, **Dual AI**, **Settings**).
    *   **Status Dashboard:** Below the navigation tabs, as shown in the figures, the sections "**Emotion Status**", "**Adaptive Fitness**", and "**SubQG Metrics**" for the selected AI (M.Y.R.A. or C.A.E.L.U.M.) are displayed depending on the context.
    *   **Adjustable Width:** In desktop views, the width of this panel can be manually adjusted by dragging the **Resize Handle** (visible as a vertical bar between the left panel and the main content area) (see `[Figure 3.1-2]`).

*   **Right Panel (Main / Main Content Area):**
    The largest area on the right side of the application.
    *   **Chat Interface (M.Y.R.A.):** This area is primarily dedicated to the direct chat interface with M.Y.R.A., as indicated by the placeholder "**Message to M.Y.R.A....**" in the input field at the bottom.
    *   **Dynamic Content:** When a navigation tab in the left panel is selected (e.g., **Nodes (M)**, **Emotion Timeline**, etc.), the content of this right panel is updated accordingly to display the respective information or interaction options. In the figures shown, this area above the chat interface is empty, as no specific navigation tab for the main content is active.

> **`[Figure 3.1-1: Main Layout with focus on M.Y.R.A. (MYRA_System_Interface.png)]`**
> *Figure 3.1-1* shows the main layout, where the status information displayed in the header and the left panel pertains to **M.Y.R.A.** The title is "**M.Y.R.A. System Interface**", and the simulation data (**SimStep (M): 310**, **Fitness (M): 0.462**) as well as the metrics in the left panel reflect M.Y.R.A.'s state.

> **`[Figure 3.1-2: Main Layout with focus on C.A.E.L.U.M. (CAELUM_System_Interface.png)]`**
> *Figure 3.1-2* illustrates the same main layout, but with focus on **C.A.E.L.U.M.** The title changes to "**C.A.E.L.U.M. System Interface**", and the displayed simulation data (**SimStep (C): 3**, **Fitness (C): 0.600**) as well as the dashboard metrics in the left panel now pertain to C.A.E.L.U.M. The green vertical **Resize Handle** for adjusting the sidebar width is clearly visible here. The chat interface at the bottom of the right panel remains designated for interaction with M.Y.R.A.

---

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

The **Status Panel** is an integral part of the left sidebar and provides a quick overview of the most important internal states of the respective AI. It is typically displayed when the application's focus is on the general state of an AI or when the "**Status (M)**" or "**Status (C)**" tabs are active (*although in the shown screenshots, the dashboard sections are visible even without explicit tab activation, which might represent the default or initial state*).

The panel is divided into three main sections:

*   **Emotion State & Vitals:**
    *   **Heartbeat Display:** An indicator (e.g., "**67 SpM**" in `[Figure 3.1-1]`) and a "**Stress Level**" visualize a kind of "heart rate" or vital parameter of the AI. A heart icon marks this section.
    *   **PAD Values:** The current values for **Pleasure**, **Arousal**, and **Dominance** according to the PAD emotion model.
    *   **Dominant Affect:** The currently prevailing specific emotion with its intensity value (e.g., "**Anger (0.04)**" for M.Y.R.A. in `[Figure 3.1-1]`).

*   **Adaptive Fitness:**
    *   **Overall Score:** The AI's overall fitness score, which is also displayed in the header.
    *   **Dimension Scores:** A breakdown of fitness into four dimensions: **Knowledge Expansion**, **Internal Coherence**, **Expressive Creativity**, and **Goal Focus**. A bar chart icon marks this section.

*   **SubQG Metrics:**
    *   **SubQG Pulse Indicator/Status:** An indicator (**SubQG Stable** in the figures) visualizes the general state or significant events (jumps) of the SubQuantum Ground Field. A gear/process icon marks this section.
    *   **Avg. Energy:** The average energy in the SubQG.
    *   **Std. Energy:** The standard deviation of energy in the SubQG.
    *   **Phase Coherence:** A measure of the synchronicity of phases in the SubQG.
    *   **Jump Modifier Active:** (*Not active in the screenshots, but part of the specification*) Indicates if a SubQG jump modifier is active and for how long.

**Example M.Y.R.A. Status Panel** (see `[Figure 3.1-1]`):
*   **Emotion Status:** SpM: 67, Stress Level: 0.08, Pleasure: -0.076, Arousal: 0.070, Dominance: -0.009, Dominant Affect: Anger (0.04).
*   **Adaptive Fitness:** Overall Score: 0.462, Knowledge Expansion: 0.447, Internal Coherence: 0.510, Expressive Creativity: 0.720, Goal Focus: 0.615.
*   **SubQG Metrics:** Avg. Energy: 0.008, Std. Energy: 0.002, Phase Coherence: 0.999.

**Example C.A.E.L.U.M. Status Panel** (see `[Figure 3.1-2]`):
*   **Emotion Status:** SpM: 69, Stress Level: 0.10, Pleasure: 0.013, Arousal: -0.125, Dominance: 0.101, Dominant Affect: Disgust (0.00).
*   **Adaptive Fitness:** Overall Score: 0.600, Knowledge Expansion: 0.400, Internal Coherence: 0.700, Expressive Creativity: 0.300, Goal Focus: 0.600.
*   **SubQG Metrics:** Avg. Energy: 0.005, Std. Energy: 0.000, Phase Coherence: 0.228.

---

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

The **Nodes Panel**, accessible via the "**Nodes (M)**" tab for M.Y.R.A. and "**Nodes (C)**" for C.A.E.L.U.M. in the left sidebar, visualizes the internal node structures of the respective AI entity. When one of these tabs is activated (*identifiable by the white border around the active tab*), the content of the Nodes Panel replaces the default status dashboards in the left sidebar. The main content area on the right defaults to the chat interface with M.Y.R.A.

The panel is typically divided into two main categories of nodes:

*   **Modulator Nodes:** Displays special nodes that control higher-level cognitive or affective functions of the AI. These include nodes like `Limbus Affectus`, `Creativus` (for M.Y.R.A.) / `Pattern Analyzer` (for C.A.E.L.U.M.), `Cortex Criticus` (M.Y.R.A.) / `Logic Verifier` (C.A.E.L.U.M.), `MetaCognitio` (M.Y.R.A.) / `System Monitor` (C.A.E.L.U.M.), as well as other behavioral modulators.
*   **Semantic Nodes (Example):** Presents a selection of nodes representing specific concepts or units of knowledge.

Each node is displayed as a "**Node Card**" containing the following information:
*   **Node Label and AI Identifier:** The name of the node (e.g., "**Limbus Affectus (M)**").
*   **Activation (Act):** The current activation value of the node (typically between 0 and 1), both numerically and as a visual progress bar (*magenta/red in the screenshots*).
*   **Additional Values:**
    *   **Res:** Resonator Score
    *   **Foc:** Focus Score
    *   **Exp:** Exploration Score
*   **Specific State Information:** Depending on the node type, additional information may be displayed, such as P,A,D values for `Limbus Affectus` or Jump Count for `MetaCognitio`/`System Monitor`.

> **`[Figure 3.3-1: Nodes Panel - M.Y.R.A. (Nodes_MYRA.png)]`**
> *Figure 3.3-1* shows the Nodes Panel for **M.Y.R.A.**, activated by the "**Nodes (M)**" tab. The application header displays "**M.Y.R.A. System Interface**" along with M.Y.R.A.'s current **SimStep: 112** and **Fitness (M): 0.486**.
> *   **Modulator Nodes (M.Y.R.A.):**
>     *   `Limbus Affectus (M)`: Act: 0.09 (Details: Res: 0.10, Foc: 0.01, Exp: 0.02, P:0.0 A:0.0 D:0.0)
>     *   `Creativus (M)`: Act: 0.95 (Details: Res: 0.07, Foc: 0.00, Exp: 1.00)
>     *   `Cortex Criticus (M)`: Act: 0.08 (Details: Res: 0.05, Foc: 0.07, Exp: 0.01)
>     *   `MetaCognitio (M)`: Act: 0.03 (Details: Res: 0.15, Foc: 0.00, Exp: 0.02, Jumps: 0)
>     *   `Social Cognitor (M)`: Act: 0.14 (Details: Res: 0.00, Foc: 0.01, Exp: 0.01)
>     *   `Valuation System (M)`: Act: 0.07 (Details: Res: 0.11, Foc: 0.01, Exp: 0.01)
>     *   `Conflict Monitor (M)`: Act: 0.06 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00)
>     *   `Executive Control (M)`: Act: 0.08 (Details: Res: 0.18, Foc: 0.02, Exp: 0.00)
> *   **Semantic Nodes (Example) (M.Y.R.A.):**
>     *   `Concept: AI (M)`: Act: 0.05 (Details: Res: 0.03, Foc: 0.01, Exp: 0.02)
>     *   `Concept: Ethics (M)`: Act: 0.02 (Details: Res: 0.07, Foc: 0.00, Exp: 0.02)
>     *   `Concept: Art (M)`: Act: 0.08 (Details: Res: 0.12, Foc: 0.01, Exp: 0.00)

> **`[Figure 3.3-2: Nodes Panel - C.A.E.L.U.M. (Nodes_CAELUM.png)]`**
> *Figure 3.3-2* shows the Nodes Panel for **C.A.E.L.U.M.**, activated by the "**Nodes (C)**" tab. The application header displays "**C.A.E.L.U.M. System Interface**" along with C.A.E.L.U.M.'s current **SimStep (C): 103** and **Fitness (C): 0.496**.
> *   **Modulator Nodes (C.A.E.L.U.M.):**
>     *   `Limbus Affectus (C)`: Act: 0.07 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00, P:0.0 A:-0.1 D:0.0)
>     *   `Pattern Analyzer (C)`: Act: 0.88 (Details: Res: 0.88, Foc: 0.01, Exp: 1.00)
>     *   `Logic Verifier (C)`: Act: 0.03 (Details: Res: 0.02, Foc: 0.05, Exp: 0.02)
>     *   `System Monitor (C)`: Act: 0.03 (Details: Res: 0.03, Foc: 0.00, Exp: 0.00, Jumps: 0)
>     *   `Information Assimilator (C)`: Act: 0.05 (Details: Res: 0.04, Foc: 0.00, Exp: 0.00)
>     *   `Priority Assessor (C)`: Act: 0.11 (Details: Res: 0.09, Foc: 0.00, Exp: 0.01)
>     *   `Anomaly Detector (C)`: Act: 0.00 (Details: Res: 0.04, Foc: 0.01, Exp: 0.00)
>     *   `Process Sequencer (C)`: Act: 0.11 (Details: Res: 0.13, Foc: 0.00, Exp: 0.00)
> *   **Semantic Nodes (Example) (C.A.E.L.U.M.):**
>     *   `Concept: Logic (C)`: Act: 0.00 (Details: Res: 0.02, Foc: 0.00, Exp: 0.02)
>     *   `Concept: Systems (C)`: Act: 0.00 (Details: Res: 0.00, Foc: 0.00, Exp: 0.01)
>     *   `Concept: Emergence (C)`: Act: 0.01 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00)

These views provide detailed insight into the activation dynamics and internal states of the cognitive architecture of both AIs. Note the different node labels and activation values, reflecting the specific characteristics and current state of M.Y.R.A. and C.A.E.L.U.M., respectively.

---

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

The **SubQG Panel** offers a visualization and interaction capabilities with the **SubQuantum Ground Field (SubQG)** of the respective AI. It is accessed by activating the "**SubQG (M)**" tab for M.Y.R.A. or "**SubQG (C)**" for C.A.E.L.U.M. in the left sidebar. Similar to the Nodes Panel, this panel also replaces the default status dashboards in the sidebar when activated. The main content area on the right remains the chat interface with M.Y.R.A.

The panel primarily includes:

*   **Matrix Visualization:** A grid (matrix) represents the SubQG of the selected AI. Each cell in this grid represents a point in the field. The color of the cells (*various shades of green in the figures*) typically visualizes the energy and/or phase of the respective cell. Hovering over a cell with the mouse would display a tooltip with more precise values for energy and phase (*as per the documentation description, not directly visible in the static image*).
*   **Interaction Options:** Below the matrix are input fields that allow the user to directly influence the SubQG:
    *   **Energy Injection:** An input field to set the energy value that is injected into a cell when clicked.
    *   **Set Phase (Opt.):** An optional input field to set a specific phase value (typically in radians, e.g., 0 to ~6.28) that is set along with the energy when a cell is clicked.
    *   An instruction like *"Click on a cell to inject energy/phase"* explains the operation.
*   **SubQG Jump Info:** (*As described in the documentation overview for this panel, but not populated with data or visible in the current screenshots*) This area would display details about recently detected "SubQG Jumps" (significant fluctuations) in the selected AI's SubQG, such as the type of jump and its peak values.

> **`[Figure 3.4-1: SubQG Panel - M.Y.R.A. (SubQG_MYRA.png)]`**
> *Figure 3.4-1* shows the SubQG Panel for **M.Y.R.A.**, activated by the "**SubQG (M)**" tab. The application header displays "**M.Y.R.A. System Interface**" along with M.Y.R.A.'s **SimStep (M): 155** and **Fitness (M): 0.472**.
> *   **Panel Title:** "**SubQG Field [16x16]**", corresponding to the configured size (`subqgSize`) for M.Y.R.A.'s SubQG.
> *   **Matrix Visualization:** A 16x16 matrix of square cells is displayed. The cells show various shades of green, indicating the distribution of energy/phase in the field.
> *   **Interaction Options:**
>     *   Energy Injection: The field shows the value "**0.1**".
>     *   Set Phase (Opt.): The field shows the placeholder/hint "**0 to 6.28 (radians)**".

> **`[Figure 3.4-2: SubQG Panel - C.A.E.L.U.M. (SubQG_CAELUM.png)]`**
> *Figure 3.4-2* shows the SubQG Panel for **C.A.E.L.U.M.**, activated by the "**SubQG (C)**" tab. The application header displays "**C.A.E.L.U.M. System Interface**" along with C.A.E.L.U.M.'s **SimStep (C): 146** and **Fitness (C): 0.503**.
> *   **Panel Title:** "**SubQG Field [12x12]**", corresponding to the configured size (`caelumSubqgSize`) for C.A.E.L.U.M.'s SubQG.
> *   **Matrix Visualization:** A 12x12 matrix is displayed, also with cells in various shades of green.
> *   **Interaction Options:**
>     *   Energy Injection: The field shows the value "**0.1**".
>     *   Set Phase (Opt.): The field shows the placeholder/hint "**0 to 6.28 (radians)**".

This panel is crucial for observing and directly influencing the fundamental simulated fields that co-determine the dynamics of M.Y.R.A. and C.A.E.L.U.M.

---

### 3.5 Emotion Timeline Panel

The **Emotion Timeline Panel**, accessible via the global navigation tab "**Emotion Timeline**" (or "**Emotionen Zeitverlauf**" as named in the screenshot menu item) in the left sidebar, visualizes the temporal progression of the emotional states of M.Y.R.A. and C.A.E.L.U.M. When this tab is selected, the main content in the right panel is replaced by this panel (*unlike the previous M/C-specific panels that appeared in the sidebar*). The title in the application header changes accordingly to "**Emotion Timeline Interface**" or similar.

The panel consists of the following main elements:

*   **Agent Selection:**
    *   At the top of the panel are buttons or toggles to select whose emotion history is displayed: "**M.Y.R.A.**" or "**C.A.E.L.U.M.**". In the shown screenshot, "**M.Y.R.A.**" is selected.
*   **PAD Timeline Chart:**
    *   A line chart displays the evolution of the three core emotions of the PAD model (**Pleasure, Arousal, Dominance**) over time.
    *   **Title:** Indicates for which AI the history is displayed (e.g., "**PAD Timeline for M.Y.R.A.**").
    *   **Legend:** Clarifies the color coding of the lines: Green for **Pleasure**, Orange for **Arousal**, and Blue for **Dominance**.
    *   **Y-axis:** Represents the value of the respective emotion, typically in the range of -1 to +1.
    *   **X-axis:** Represents time or simulation steps. In the screenshot, timestamps (e.g., "**05:31:24**") are visible on the X-axis.
    *   **Tooltips:** (*Not visible in the static image, but typical for such charts*) Hovering over data points with the mouse would display tooltips with the exact PAD values and the dominant affect at that specific time point.
*   **Interpretation of Current State:**
    *   Below the chart is a text area providing an interpretive summary of the most recent emotional state of the selected AI. In the screenshot for M.Y.R.A., this reads: "**Neutral or complex emotional state. (Dominant Affect: Neutral)**".

> **`[Figure 3.5-1: Emotion Timeline Panel - View for M.Y.R.A. (Emotion_Timeline_MYRA.png)]`**
> *Figure 3.5-1* shows the Emotion Timeline Panel, with the emotion history for **M.Y.R.A.** being displayed.
> *   **Header:** The title is "**Emotion Timeline Interface**". The simulation data at the top right pertains to M.Y.R.A. (**SimStep (M): 204**, **Fitness (M): 0.464**).
> *   **Agent Selection:** "**M.Y.R.A.**" is selected as active.
> *   **Chart:** Shows the trajectories of Pleasure (green), Arousal (orange), and Dominance (blue) for M.Y.R.A. over a series of time points.
> *   **Interpretation:** For the last data point, M.Y.R.A.'s state is described as "**Neutral or complex emotional state. (Dominant Affect: Neutral)**".
> *   The chat interface for M.Y.R.A. remains visible in the footer of the main content area.

This panel is an important tool for analyzing and understanding the emotional dynamics and development of the AI entities over extended periods.

---

### 3.6 Knowledge Panel

The **Knowledge Panel** is used to manage the knowledge base utilized by M.Y.R.A. and C.A.E.L.U.M. for **Retrieval Augmented Generation (RAG)**. It is accessible via the global navigation tab "**Knowledge**" in the left sidebar. When this tab is activated (*indicated by purple highlighting in the screenshot*), the content of the Knowledge Panel replaces the default status dashboards in the sidebar. The main content area on the right remains the chat interface with M.Y.R.A.

The panel is structured as follows:

*   **Title:** "**Knowledge Base Management**", marked with a book icon.
*   **Upload Section:**
    *   **File Selection:** A "**Select File**" button (purple) allows the user to choose local text files (with `.txt` or `.md` extensions) for upload. Next to it, the name of the selected file or "**No file selected**" is displayed.
    *   **Processing Button:** A "**Load & Process File**" button (dark green) initiates the process of breaking down the selected file into chunks and adding them to the knowledge database (IndexedDB).
*   **Loaded Sources:**
    *   **List of Sources:** A scrollable list displays all source files that have already been loaded into the knowledge base. For each source, the file name and the number of text chunks generated from it are shown (e.g., "**config\_adaptive\_fitness\_de.md - 13 Chunks**").
    *   **Total Count:** At the end of the list, the total number of chunks in the database is displayed (e.g., "**Total: 436 Chunks in DB.**").
    *   **Clear All Button:** A red "**Clear All**" button with a trash can icon allows emptying the entire knowledge database.
*   **Automatic Loading:** As described in Section 5.3, certain documentation files are automatically loaded into the knowledge base when the application starts.

> **`[Figure 3.6-1: Knowledge Panel - Overview of loaded sources (Knowledge_Panel.png)]`**
> *Figure 3.6-1* shows the Knowledge Panel in action.
> *   **Header:** The title is "**M.Y.R.A. System Interface**". The simulation data at the top right pertains to M.Y.R.A. (**SimStep (M): 220**, **Fitness (M): 0.470**).
> *   **Active Tab:** The "**Knowledge**" tab is highlighted in purple.
> *   **Upload Section:** "**No file selected**".
> *   **Loaded Sources:** The list shows several automatically loaded configuration files. The total number of chunks in the database is 436.

This panel is central to expanding the AIs' knowledge horizon.

---

### 3.7 Dual AI Conversation Panel

The **Dual AI Conversation Panel** allows the user to initiate and observe a conversation between the two AI entities, **M.Y.R.A.** and **C.A.E.L.U.M.** It is accessible via the global navigation tab "**Dual AI**" in the left sidebar. When this tab is activated (*indicated by purple highlighting in the screenshot*), the content of the Dual AI Panel replaces the default status dashboards in the sidebar.

The panel, as shown in the screenshot before a conversation starts, includes the following elements:

*   **Start Prompt Input Field:**
    *   A multi-line text field labeled "**Start prompt for M.Y.R.A. & C.A.E.L.U.M.:**".
    *   Placeholder text: "**Enter the topic or starting question here...**".
*   **Rounds Input:**
    *   An input field labeled "**Rounds:**". In the screenshot, the value "**3**" is preset.
*   **Start Button:**
    *   A button labeled "**Start Dual Conversation**" (dark green).
*   **Instructional Text:**
    *   Below: "**Start a new dual conversation to observe the exchange between the AIs.**"

> **`[Figure 3.7-1: Dual AI Conversation Panel - Initial view (Dual_AI_Panel_Initial.png)]`**
> *Figure 3.7-1* shows the initial view of the Dual AI Conversation Panel.
> *   **Header:** The title is "**M.Y.R.A. System Interface**". M.Y.R.A.'s data: **SimStep (M): 280**, **Fitness (M): 0.467**.
> *   **Active Tab:** "**Dual AI**" is highlighted in purple.
> *   **Input Area:** Shows fields for the start prompt and number of rounds (preset to 3).
> *   **Main Content Area:** The right main area is empty. The chat input line for M.Y.R.A. remains visible at the bottom.

Once the conversation is started, the main content area would display the dialogue history. This panel offers a unique way to study the interaction of the two AI personalities.

---

### 3.8 Documentation Panel

The **Documentation Panel** provides direct access to the integrated application documentation. It is accessed via the global navigation tab "**Documentation**" in the left sidebar. When this tab is activated (*indicated by purple highlighting in the screenshot*), its content replaces the default status dashboards. The title in the header changes to "**Documentation Interface**".

The panel is structured as follows:

*   **Panel Title and Icon:** At the top of the panel is "**Documentation**".
*   **Document Selection (Dropdown Menu):**
    *   A dropdown menu on the right side of the panel header allows selecting the topic.
    *   In the screenshot, "**Main Documentation**" is selected.
    *   Options include:
        *   `Main Documentation`
        *   `Config: Adaptive Fitness`
        *   `Config: AI Provider`
        *   `Config: Knowledge Base & RAG`
        *   `Config: Persona & Behavior`
        *   `Config: SubQG Simulation`
*   **Content Display:**
    *   Shows the content of the selected Markdown file.
    *   The correct language version (German/English) is loaded automatically. The screenshot shows the German version of the "**M.Y.R.A. SubQG Integration - Documentation**".
    *   Markdown is converted to HTML (headings, lists, links, etc.).

> **`[Figure 3.8-1: Documentation Panel - Display of Main Documentation with selection menu (Documentation_Panel.png)]`**
> *Figure 3.8-1* shows the Documentation Panel.
> *   **Header:** Title "**Documentation Interface**". M.Y.R.A.'s data: **SimStep (M): 263**, **Fitness (M): 0.457**.
> *   **Active Tab:** "**Documentation**" is highlighted in purple.
> *   **Document Selection:** Dropdown is open, "**Main Documentation**" selected.
> *   **Content Display:** The beginning of the German main documentation is visible.

This panel allows direct access to information within the application.

---

### 3.9 Settings Panel

The **Settings Panel** provides a comprehensive interface for detailed configuration of various aspects of the application, including parameters for M.Y.R.A., C.A.E.L.U.M., and global system settings. It is accessible via the global navigation tab "**Settings**" in the left sidebar. When this tab is activated (*indicated by purple highlighting in the screenshots*), the content of the Settings Panel replaces the default status dashboards in the sidebar. The main content area on the right remains the chat interface with M.Y.R.A.

The panel is divided into two main sections:

*   **Left Navigation Bar for Configuration Groups:**
    *   A vertical list of tabs or buttons allows selection of the specific configuration group to be edited in the right section of the panel. The groups include:
        *   `Localization` (with a globe icon)
        *   `M.Y.R.A. AI Provider`
        *   `C.A.E.L.U.M. AI Provider`
        *   `M.Y.R.A. Persona`
        *   `C.A.E.L.U.M. Persona`
        *   `M.Y.R.A. System`
        *   `C.A.E.L.U.M. System`
        *   `General System`
        *   `Adaptive Fitness (Base Weights)`
        *   `Adaptive Fitness (Dimensions)`
    *   The currently selected group is highlighted (e.g., by a different background color).
*   **Right Settings Area:**
    *   This area displays the specific configuration fields for the group selected in the left navigation bar.
    *   **Global Action Buttons:** At the top of this area are buttons that apply to all settings:
        *   `Reset All` (red): Resets all configurations in all groups to their default values.
        *   `Save Changes` (green): Applies and saves all changes made.
    *   **Group-Specific Reset Button:** Next to the title of the currently selected configuration group, there is often a `Reset Group` button (red) to reset only the settings of that specific group to their default values.
    *   **Input Fields:** For each setting, there are corresponding input fields (text fields, dropdowns, number fields, etc.) with labels explaining the parameter.

The contents of the individual configuration groups are illustrated below using the provided screenshots:

> **`[Figure 3.9-1: Settings Panel - 'Localization' group (Settings_Localization.png)]`**
> *   Shows the "**Localization**" group.
> *   **Header:** The application title is "**M.Y.R.A. System Interface**". M.Y.R.A.'s **SimStep (M): 282**, **Fitness (M): 0.485**.
> *   **Active Tab:** "**Settings**" in the main navigation and "**Localization**" in the group navigation are active.
> *   **Fields:**
>     *   **Language:** Dropdown, currently "**German**" selected.
>     *   **Design Theme:** Dropdown, currently "**Matrix (Contrast)**" selected.

> **`[Figure 3.9-2: Settings Panel - 'M.Y.R.A. AI Provider' group (Settings_MYRA_AI_Provider.png)]`**
> *   Shows the "**M.Y.R.A. AI Provider**" group.
> *   **Fields:**
>     *   **M.Y.R.A. AI Provider:** Dropdown, currently "**Gemini API**" selected.
>     *   **M.Y.R.A. Gemini Model:** Text field, value "**gemini-2.5-flash-preview-04-17**".
>     *   **M.Y.R.A. Base Temperature:** Number field, value "**0.7**".

> **`[Figure 3.9-3: Settings Panel - 'C.A.E.L.U.M. AI Provider' group (Settings_CAELUM_AI_Provider.png)]`**
> *   Shows the "**C.A.E.L.U.M. AI Provider**" group.
> *   **Fields:**
>     *   **C.A.E.L.U.M. AI Provider:** Dropdown, currently "**Gemini API**" selected.
>     *   **C.A.E.L.U.M. Gemini Model:** Text field, value "**gemini-2.5-flash-preview-05-20**".
>     *   **C.A.E.L.U.M. Base Temperature:** Number field, value "**0.5**".

> **`[Figure 3.9-4: Settings Panel - 'M.Y.R.A. Persona' group (Settings_MYRA_Persona.png)]`**
> *   Shows the "**M.Y.R.A. Persona**" group.
> *   **Fields:**
>     *   **M.Y.R.A. Name:** Text field, value "**M.Y.R.A.**".
>     *   **User Name:** Text field, value "**Raff**".
>     *   **M.Y.R.A. Role Description:** Multi-line text field with a detailed description (text visible in screenshot).
>     *   **M.Y.R.A. Ethics:** Multi-line text field with ethical principles (text visible in screenshot).
>     *   **M.Y.R.A. Response Instruction:** Multi-line text field with instructions for response behavior (text visible in screenshot).

> **`[Figure 3.9-5: Settings Panel - 'C.A.E.L.U.M. Persona' group (Settings_CAELUM_Persona.png)]`**
> *   Shows the "**C.A.E.L.U.M. Persona**" group.
> *   **Fields:**
>     *   **C.A.E.L.U.M. Name:** Text field, value "**C.A.E.L.U.M.**".
>     *   **C.A.E.L.U.M. Role Description:** Multi-line text field (text visible in screenshot).
>     *   **C.A.E.L.U.M. Ethics:** Multi-line text field (text visible in screenshot).
>     *   **C.A.E.L.U.M. Response Instruction:** Multi-line text field (text visible in screenshot).

> **`[Figure 3.9-6: Settings Panel - 'M.Y.R.A. System' group (Settings_MYRA_System.png)]`**
> *   Shows the "**M.Y.R.A. System**" group.
> *   **Fields:**
>     *   **M.Y.R.A. SubQG Size:** Value "**16**".
>     *   **M.Y.R.A. SubQG Base Energy:** Value "**0.01**".
>     *   **M.Y.R.A. SubQG Coupling:** Value "**0.015**".
>     *   **M.Y.R.A. SubQG Init. Energy Noise StdDev:** Value "**0.001**".
>     *   **M.Y.R.A. RNG Type:** Dropdown, "**Deterministic (Seed)**" selected.
>     *   **M.Y.R.A. SubQG Seed (optional):** Placeholder "**Empty for random**".
>     *   **M.Y.R.A. Node Activation Decay:** Value "**0.95**".
>     *   **M.Y.R.A. Emotion Decay:** Value "**0.95**".
>     *   **M.Y.R.A. Fitness Update Interval (Steps):** Value "**3**".

> **`[Figure 3.9-7: Settings Panel - 'C.A.E.L.U.M. System' group (Settings_CAELUM_System.png)]`**
> *   Shows the "**C.A.E.L.U.M. System**" group.
> *   **Fields:**
>     *   **C.A.E.L.U.M. SubQG Size:** Value "**12**".
>     *   **C.A.E.L.U.M. SubQG Base Energy:** Value "**0.005**".
>     *   **C.A.E.L.U.M. RNG Type:** Dropdown, "**Deterministic (Seed)**" selected.
>     *   **C.A.E.L.U.M. SubQG Seed (optional):** Value "**12345**".
>     *   **C.A.E.L.U.M. Node Activation Decay:** Value "**0.97**".
>     *   **C.A.E.L.U.M. Emotion Decay:** Value "**0.98**".
>     *   **C.A.E.L.U.M. Fitness Update Interval (Steps):** Value "**5**".

> **`[Figure 3.9-8: Settings Panel - 'General System' group (Settings_General_System.png)]`**
> *   Shows the "**General System**" group.
> *   **Fields:**
>     *   **Active Chat AI:** Dropdown, "**M.Y.R.A.**" selected.
>     *   **Max. Chat History for Prompt:** Value "**8**".
>     *   **Temperature: Limbus Influence:** Value "**0.1**".
>     *   **Temperature: Creativus Influence:** Value "**0.15**".
>     *   **RAG Chunk Size:** Value "**500**".
>     *   **RAG Chunk Overlap:** Value "**50**".
>     *   **RAG Max. Chunks Retrieval:** Value "**3**".
>     *   **Max. Entries Emotion History:** Value "**200**".

> **`[Figure 3.9-9: Settings Panel - 'Adaptive Fitness (Base Weights)' group (Settings_Adaptive_Fitness_Base.png)]`**
> *   Shows the "**Adaptive Fitness (Base Weights)**" group.
> *   **Fields:**
>     *   **Weight: Coherence Proxy:** Value "**0.15**".
>     *   **Weight: Network Complexity Proxy:** Value "**0.05**".
>     *   **Weight: Avg. Resonator Score:** Value "**0.15**".
>     *   **Weight: Goal Achievement Proxy:** Value "**0.15**".
>     *   **Weight: Exploration Score:** Value "**0.15**".
>     *   **Weight: Focus Score:** Value "**0.1**".
>     *   **Weight: Creativity Score:** Value "**0.05**".
>     *   **Weight: Conflict Penalty Factor:** Value "**-0.1**".

> **`[Figure 3.9-10: Settings Panel - 'Adaptive Fitness (Dimensions)' group (Settings_Adaptive_Fitness_Dimensions.png)]`**
> *   Shows the "**Adaptive Fitness (Dimensions)**" group.
> *   **Fields:**
>     *   **Dim: Knowledge Exp. -> Learning Efficiency:** Value "**0.5**".
>     *   **Dim: Knowledge Exp. -> Exploration:** Value "**0.5**".
>     *   **Dim: Int. Coherence -> Coherence:** Value "**0.6**".
>     *   **Dim: Int. Coherence -> Resonance:** Value "**0.2**".
>     *   **Dim: Expr. Creat. -> Creativity:** Value "**0.5**".
>     *   **Dim: Expr. Creat. -> Creativus Act.:** Value "**0.3**".
>     *   **Dim: Expr. Creat. -> Exploration:** Value "**0.2**".
>     *   **Dim: Goal Focus -> Goal Achievement:** Value "**0.6**".
>     *   **Dim: Goal Focus -> Focus:** Value "**0.4**".

The Settings Panel is thus the central hub for fine-tuning and customizing nearly all aspects of the M.Y.R.A. & C.A.E.L.U.M. system, allowing for high flexibility for experiments and specific use cases.

---

### 3.10 Chat Interface (M.Y.R.A.)

The main area on the right side remains the primary chat interface for direct conversations with M.Y.R.A.

*   **Message Display:** Shows the conversation history between the user and M.Y.R.A.
*   **Input Field:** Text field for entering messages to M.Y.R.A.
*   **Send Button:** Submits the entered message.

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
    *   ... (other configuration files like `tsconfig.json`, `package.json` etc.)

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
    *   Implements logic for the **adjustable desktop sidebar** (drag-to-resize), saves the width in `localStorage`.
    *   Renders the sidebar with navigation tabs for M.Y.R.A.-specific views (Status (M), Nodes (M), SubQG (M)), C.A.E.L.U.M.-specific views (Status (C), Nodes (C), SubQG (C)), and global views (Emotion Timeline, Knowledge, Documentation, Dual AI, Settings).
    *   Conditionally renders panels based on `activeTab` and passes appropriate state data and callbacks.
    *   The header displays information (simulation step, fitness) of the AI corresponding to the active tab, or a generic title for global tabs.
    *   The right main panel is dedicated to the `ChatInterface` for direct interaction with M.Y.R.A.

### 4.7 `constants.ts`

*   **Purpose:** Defines global constants and initial states.
*   **Content:**
    *   `INITIAL_CONFIG`: Contains the default configuration for `MyraConfig`, including all parameters for M.Y.R.A. and C.A.E.L.U.M. (persona, AI provider, SubQG systems, adaptive fitness, emotion history length, etc.).
    *   `INITIAL_EMOTION_STATE`, `INITIAL_NODE_STATES`, `INITIAL_ADAPTIVE_FITNESS_STATE`, `INITIAL_SUBQG_GLOBAL_METRICS`: Default values for M.Y.R.A.'s core states.
    *   `INITIAL_CAELUM_EMOTION_STATE`, `INITIAL_CAELUM_NODE_STATES`, `INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE`, `INITIAL_CAELUM_SUBQG_GLOBAL_METRICS`: Default values for C.A.E.L.U.M.'s core states.

### 4.8 `types.ts`

*   **Purpose:** Defines all important TypeScript types and interfaces for the application.
*   **Key Types:**
    *   `MyraConfig`: Comprehensive configuration containing separate sections for M.Y.R.A.'s and C.A.E.L.U.M.'s system parameters, persona settings, and AI provider configurations. Also includes `maxPadHistorySize`.
    *   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`: Core state types.
    *   `PADRecord`: Type for entries in the emotion history (Pleasure, Arousal, Dominance, Timestamp, DominantAffect).
    *   `ConfigField` and its subtypes: For dynamically creating the SettingsPanel, extended with `CaelumPersonaEditableField`, `CaelumSystemConfigField`, `GeneralSystemConfigField`.
    *   `ActiveTab`: Defines possible active tabs, including `'documentation'`.

### 4.9 `hooks/useMyraState.ts`

*   **Purpose:** The central hook for state management and core application logic.
*   **Core Functions:**
    *   **State Management:** Manages the state for M.Y.R.A. and C.A.E.L.U.M. in parallel. This includes:
        *   Emotions (`emotionState`, `emotionStateCaelum`) and their histories (`padHistoryMyra`, `padHistoryCaelum`).
        *   Node states (`nodeStates`, `nodeStatesCaelum`)
        *   Adaptive fitness (`adaptiveFitness`, `adaptiveFitnessCaelum`)
        *   SubQG matrices & metrics (`subQgMatrix`, `subQgMatrixCaelum`, etc.)
        *   RNG instances (`rngRef`, `rngRefCaelum`)
        *   Simulation steps (`simulationStep`, `simulationStepCaelum`)
        *   Stress levels (`myraStressLevel`, `caelumStressLevel`)
    *   **Configuration Management (`myraConfig`, `updateMyraConfig`):** Loads/saves configuration, adjusts SubQG matrices and RNGs upon changes. Sanitizes `maxPadHistorySize` on load.
    *   **Simulation Loops:**
        *   `simulateNetworkStepMyra`: Executes a simulation step for M.Y.R.A. Adds an entry to `padHistoryMyra` after emotion update.
        *   `simulateNetworkStepCaelum`: Executes a parallel, independent simulation step for C.A.E.L.U.M. Adds an entry to `padHistoryCaelum` after emotion update.
    *   **AI Interaction:**
        *   `generateMyraResponse`: Generates a response from M.Y.R.A. in the main chat.
        *   `startDualConversation`: Initiates and manages a conversation between M.Y.R.A. and C.A.E.L.U.M.
    *   **System Instructions:**
        *   `getMyraBaseSystemInstruction`, `getCaelumBaseSystemInstruction`: Create system instructions based on the respective current state.
    *   **Knowledge Base (RAG):**
        *   `loadDocumentationKnowledge`: Automatically loads documentation files (e.g., `Documentation_en.md`, `docs/config_ai_provider_en.md`) at startup based on the current language setting.
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
*   **Functionality:** Loads and renders selected `.md` files (e.g., `Dokumentation_en.md`, `docs/config_ai_provider_en.md`) based on the app's current language setting. Uses `react-markdown` and `react-syntax-highlighter`.

#### 4.10.5 `IconComponents.tsx`

Contains SVG icons, including `DocumentTextIcon` for the documentation tab.

#### 4.10.6 `KnowledgePanel.tsx`

Manages the knowledge base (RAG).

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

## 5. Functional Deep Dives

### 5.1 Simulation Cycles (M.Y.R.A. & C.A.E.L.U.M.)

The application runs two independent, parallel simulation loops:

*   **`simulateNetworkStepMyra()`:** Called at regular intervals. Updates M.Y.R.A.'s SubQG, emotions (incl. entry in `padHistoryMyra`), nodes, stress, and fitness.
*   **`simulateNetworkStepCaelum()`:** Also called at regular intervals. Updates C.A.E.L.U.M.'s SubQG, emotions (incl. entry in `padHistoryCaelum`), nodes, stress, and fitness.

This separation ensures that M.Y.R.A. and C.A.E.L.U.M. operate as distinct entities.

### 5.2 AI Response Generation

*   **Direct Chat (M.Y.R.A.):** `generateMyraResponse` in `useMyraState` calls `callAiApi` with M.Y.R.A.'s specific configuration and state.
*   **Dual AI Conversation (`startDualConversation`):** Orchestrates the dialogue by iteratively calling `callAiApi` for M.Y.R.A. and then for C.A.E.L.U.M., each with their specific configurations and current system states as context. Both use RAG.

### 5.3 Knowledge Processing (RAG & Automatic Document Loading)

*   **Automatic Loading:** At application startup, `loadDocumentationKnowledge` in `useMyraState` loads the content of documentation files like `Documentation_en.md` (or `_de.md`) and all `.md` files in the `public/docs/` directory (with the appropriate language suffix), splits them into chunks, and stores them in IndexedDB. Existing chunks from these sources are deleted beforehand to allow for updates.
*   **Manual Upload:** Via the `KnowledgePanel`.
*   **Processing & Retrieval:** Relevant chunks are retrieved as needed and provided to the AI as context.

### 5.4 Configuration Management

`MyraConfig` in `useMyraState` stores all settings. Changes in the `SettingsPanel` are processed via `updateMyraConfig` and persisted in `localStorage`.

### 5.5 Emotion History Tracking

*   In `useMyraState.ts`, PAD values (Pleasure, Arousal, Dominance) along with a timestamp and the dominant affect are stored in arrays for M.Y.R.A. (`padHistoryMyra`) and C.A.E.L.U.M. (`padHistoryCaelum`) after each simulation step.
*   The length of these arrays is limited by `myraConfig.maxPadHistorySize`.
*   `EmotionTimelinePanel.tsx` visualizes this data using `react-chartjs-2`.

### 5.6 Documentation Display

*   `DocumentationPanel.tsx` is responsible for displaying the in-app documentation.
*   It uses a dropdown to select a documentation topic.
*   Based on the selection and the global language setting (`myraConfig.language`), the corresponding Markdown file (e.g., `/Dokumentation_en.md` or `/docs/config_ai_provider_en.md`) is loaded from the `public` directory.
*   `react-markdown` with `remark-gfm` and `react-syntax-highlighter` renders the Markdown content to HTML.

---

## 6. Detailed Configuration Parameters

The detailed description of all configuration parameters is outsourced to separate files in the `docs/` directory (available in German and English):

*   [**AI Provider Configuration**](./docs/config_ai_provider_en.md)
*   [**Persona & Behavior**](./docs/config_persona_behavior_en.md)
*   [**SubQG Simulation**](./docs/config_subqg_simulation_en.md)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag_en.md)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness_en.md)

---

## 7. Setup and Startup

1.  **Install dependencies:** `npm install` (or `yarn install`).
2.  **API Key:** Create a `.env` file in the project root and add your Gemini API Key:
    `GEMINI_API_KEY=YOUR_API_KEY_HERE`
3.  **Start development server:** `npm run dev` (or `yarn dev`).
4.  **Documentation files:** Place your Markdown documentation files (each as `*_de.md` and `*_en.md`) in the `public` directory.
    *   Main documentation: `public/Dokumentation_en.md` and `public/Dokumentation_de.md`.
    *   Detailed configurations: `public/docs/config_DESCRIPTION_en.md` and `public/docs/config_DESCRIPTION_de.md`.
    These are automatically loaded at startup for the RAG function and the Documentation Viewer.
5.  **Access:** Open the displayed local URL (e.g., `http://localhost:5173`) or network URL in your browser.

