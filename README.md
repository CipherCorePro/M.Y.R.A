
# Project M.Y.R.A. - Simulating Dynamic Cognitive-Affective AI Entities

Project M.Y.R.A. (Modular Yearning Reasoning Architecture) is a web-based platform for simulating and interacting with multiple advanced Artificial Intelligence agents. These agents (M.Y.R.A., C.A.E.L.U.M., and user-configurable agents) operate with independent, simulated internal systems, including SubQuantum Fields (SubQGs), node networks, emotion engines, and adaptive fitness mechanisms, which dynamically influence their behavior and interactions.

This application allows users to configure these agents, observe their internal states, and engage them in various conversational scenarios, from direct chats to multi-agent discussions.

## Key Features

*   **Multiple Independent AI Agents:**
    *   **M.Y.R.A.:** Focused on emotional expression and creative reasoning.
    *   **C.A.E.L.U.M.:** Specializes in logical analysis and pattern recognition.
    *   **Configurable Agents:** Users can define additional agents with unique personas, AI provider settings, simulation parameters, and adaptive fitness configurations.
*   **Dynamic Internal State Simulation:** Each agent possesses:
    *   A **SubQuantum Field (SubQG):** A simulated energy/phase matrix driving emergent dynamics.
    *   **Node Networks:** Representing concepts and cognitive/affective functions.
    *   **Emotion Engine:** Based on the PAD (Pleasure-Arousal-Dominance) model.
    *   **Adaptive Fitness System:** Evaluates agent "health" and performance.
*   **Interactive Visualizations:**
    *   Real-time display of agent status (emotions, fitness, SubQG metrics).
    *   Visualization of node activations and SubQG energy/phase matrices.
    *   Direct interaction with SubQGs (energy/phase injection).
    *   Emotion timeline tracking.
*   **Conversational Interfaces:**
    *   Direct chat with a primary selected agent.
    *   Dual AI conversations between M.Y.R.A. and C.A.E.L.U.M.
    *   Multi-agent conversations involving any combination of defined agents.
*   **Knowledge Integration (RAG):**
    *   Upload `.txt`, `.md`, `.xlsx`, and `.docx` files to a shared knowledge base.
    *   Automatic loading of internal documentation.
    *   Retrieval Augmented Generation enhances AI responses with context from the knowledge base.
*   **Extensive Configuration:**
    *   Granular control over global settings and individual agent parameters (persona, AI provider, simulation, fitness).
*   **Speech Interaction:** Supports Speech-to-Text (STT) and Text-to-Speech (TTS).
*   **Localization:** UI available in English and German.
*   **Theming:** Multiple UI themes (Nebula, Biosphere, Matrix).

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Charting:** Chart.js, react-chartjs-2
*   **Markdown:** react-markdown, remark-gfm, react-syntax-highlighter
*   **Document Processing:** read-excel-file (for .xlsx), mammoth (for .docx)
*   **State Management:** React Hooks (primarily `useContext` and `useState` within `useMyraState`)
*   **AI Backend:**
    *   Google Gemini API
    *   LM Studio (for locally hosted models)
*   **Client-Side Storage:**
    *   `localStorage` for application configuration.
    *   `IndexedDB` for the knowledge base.

## Setup and Installation

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure API Keys & Local LLM (Optional but Recommended)

#### a. Google Gemini API Key (Optional)

If you want to use the Google Gemini models for AI responses:

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2.  Create a `.env` file in the root of the project directory.
3.  Add your API key to the `.env` file:

    ```env
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key.

    *Note: The application can run without a Gemini API key if you only use LM Studio or if the `process.env.API_KEY` is provided through other means by the hosting environment.*

#### b. LM Studio (Optional)

If you want to use locally hosted language models:

1.  Download and install [LM Studio](https://lmstudio.ai/).
2.  Launch LM Studio, download a model (e.g., from Hugging Face), and start the local inference server (usually on `http://localhost:1234`).
3.  In the M.Y.R.A. application's "Settings" panel, select "LM Studio" as the AI provider for the desired agent(s) and ensure the "LM Studio URL" and "LM Studio Gen Model" (matching the model identifier in LM Studio) are correctly configured.

### 4. Place Documentation Files (Optional)

If you wish to use the integrated documentation viewer with custom or updated markdown files:
*   The main documentation file (e.g., `Dokumentation_en.md` or `Dokumentation_de.md`) should be in the `public/` directory.
*   Supporting documentation files (e.g., `config_ai_provider_en.md`) should be in the `public/docs/` directory.
The application will attempt to load these files automatically on startup.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:5173` (or another port assigned by Vite).

## Usage Guide

1.  **Initial Setup:**
    *   Upon first launch, default configurations are loaded.
    *   Navigate to the **Settings** panel (cog icon) to customize:
        *   **Localization:** Choose your preferred language and UI theme.
        *   **AI Providers:** Configure API keys/URLs and models for M.Y.R.A., C.A.E.L.U.M., and any custom agents. *If you haven't set up `GEMINI_API_KEY` in `.env` and intend to use Gemini, you'll encounter errors. Ensure it's set or switch to LM Studio.*
        *   **Personas:** Define the names, roles, ethics, and response styles.
        *   **System Parameters:** Adjust SubQG settings, decay rates, etc.
        *   **Configurable Agents:** Add, remove, or modify custom AI agents.
    *   Click "Save Changes" in the Settings panel to apply your configurations.

2.  **Interacting with Agents:**
    *   **Main Chat:** Select the active agent (M.Y.R.A. or C.A.E.L.U.M.) in Settings under "General System" -> "Active Main Chat AI". Use the main chat interface on the right to converse.
    *   **Dual AI Conversation:** Go to the "Dual AI" tab, set an initial prompt and number of rounds, then start the conversation between M.Y.R.A. and C.A.E.L.U.M.
    *   **Multi-Agent Conversation:** Go to the "Multi-Agent Conv." tab. Select participating agents, set an initial prompt and rounds per agent, then start the group discussion.

3.  **Exploring Internal States:**
    *   Use the tabs on the left sidebar (Status, Nodes, SubQG, Emotion Timeline) to view the internal states of M.Y.R.A. and C.A.E.L.U.M. (as per current UI; full Agent Inspector for any agent is a planned feature).
    *   In the SubQG panels, click on cells to inject energy or set phases.

4.  **Managing Knowledge:**
    *   Go to the **Knowledge** panel to upload `.txt`, `.md`, `.xlsx`, or `.docx` files. These will be processed and added to the knowledge base used by RAG.
    *   You can clear all loaded knowledge from this panel.

5.  **Reading Documentation:**
    *   Go to the **Documentation** panel to read the project's whitepapers and configuration guides directly within the app.

## Project Structure Overview

*   `public/`: Static assets, including documentation files and images.
*   `src/`: Source code for the React application.
    *   `components/`: UI components.
    *   `hooks/`: Custom React hooks (e.g., `useMyraState.ts` for global state).
    *   `services/`: Modules for external API interactions (e.g., `aiService.ts`).
    *   `utils/`: Utility functions (RNG, IndexedDB, UI helpers).
    *   `i18n/`: Translation files (JSON format).
    *   `App.tsx`: Main application component.
    *   `index.tsx`: React entry point.
    *   `constants.ts`: Initial configurations and constants.
    *   `types.ts`: TypeScript type definitions.
*   `vite.config.ts`: Vite build and development server configuration.
*   `.env`: For environment variables (like `GEMINI_API_KEY`). **Untracked by Git.**
*   `README.md`: This file.
*   `Whitepaper_en.md`, `Whitepaper_de.md`: Detailed project whitepapers.



## German
![image](https://github.com/user-attachments/assets/f6035f6d-e8fa-4c95-8d5a-adf41afb7cac)
## English 
![image](https://github.com/user-attachments/assets/0b549275-760e-438a-89bd-05e318f46bf3)

