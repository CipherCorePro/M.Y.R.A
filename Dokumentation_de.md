# M.Y.R.A. SubQG Integration - Dokumentation

## Inhaltsverzeichnis

1.  [Einleitung](#1-einleitung)
2.  [Core Konzepte & Glossar](#2-core-konzepte--glossar)
3.  [Benutzeroberfläche (UI) Guide](#3-benutzeroberfläche-ui-guide)
    *   [3.1 Hauptlayout](#31-hauptlayout)
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
4.  [Technische Architektur & Code Dokumentation](#4-technische-architektur--code-dokumentation)
    *   [4.1 Projektstruktur](#41-projektstruktur)
    *   [4.2 `index.html`](#42-indexhtml)
    *   [4.3 `metadata.json`](#43-metadatenjson)
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
5.  [Funktionale Tieftauche](#5-funktionale-tieftauche)
    *   [5.1 Simulationszyklen (M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten)](#51-simulationszyklen-myra-caelum--konfigurierbare-agenten)
    *   [5.2 KI-Antwortgenerierung](#52-ki-antwortgenerierung)
    *   [5.3 Wissensverarbeitung (RAG & Automatische Dokumentenladung)](#53-wissensverarbeitung-rag--automatische-dokumentenladung)
    *   [5.4 Konfigurationsmanagement](#54-konfigurationsmanagement)
    *   [5.5 Emotionsverlauf-Tracking](#55-emotionsverlauf-tracking)
    *   [5.6 Dokumentationsanzeige](#56-dokumentationsanzeige)
    *   [5.7 Multi-Agenten Konversationen](#57-multi-agenten-konversationen)
6.  [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter)
7.  [Einrichtung und Start](#7-einrichtung-und-start)

---

## 1. Einleitung

Dieses Dokument beschreibt die M.Y.R.A. (Modular Yearning Reasoning Architecture) Web-Anwendung. Die Anwendung bietet eine interaktive Oberfläche zur Simulation und Interaktion mit KI-Entitäten: **M.Y.R.A.**, **C.A.E.L.U.M.** und zusätzlich vom Benutzer **konfigurierbaren Agenten**. Jede dieser Entitäten besitzt ein eigenes, unabhängiges, simuliertes kognitiv-affektives System, das durch ein SubQuantenfeld-Grundfeld (SubQG), Knotennetzwerke, Emotionen und adaptive Fitness beeinflusst wird. Die Anwendung nutzt die Gemini API (oder eine lokale LM Studio Instanz) für intelligente Antworten und visualisiert die internen Zustände aller Agenten. Ein integrierter Dokumentationsviewer ermöglicht den direkten Zugriff auf diese und andere relevante Dokumentationen.

Die Kernidee ist es, KI-Entitäten zu schaffen, deren Verhalten nicht nur auf trainierten Daten basiert, sondern auch durch dynamische, emergente interne Zustände geprägt wird. Dieses Dokument dient als Leitfaden für Benutzer und Entwickler.

---

## 2. Core Konzepte & Glossar

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** Eine primäre KI-Entität, die auf emotionalem Ausdruck und kreativem Denken basiert.
*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** Eine zweite KI-Entität, die auf logische Analyse und Mustererkennung spezialisiert ist.
*   **Konfigurierbare Agenten:** Vom Benutzer im `SettingsPanel` definierbare KI-Entitäten. Jeder konfigurierbare Agent besitzt eine eigene, unabhängige Persona, KI-Provider-Einstellungen, Systemkonfiguration (SubQG, RNG, Zerfallsraten) und adaptive Fitness-Parameter. Ihre internen Zustände werden ebenso simuliert wie die von M.Y.R.A. und C.A.E.L.U.M.
*   **SubQG (SubQuantenfeld-Grundfeld):** Ein simuliertes Feld, das als Basis für emergente Dynamiken dient. Jede KI (M.Y.R.A., C.A.E.L.U.M. und jeder konfigurierbare Agent) besitzt ihr eigenes, unabhängiges SubQG.
*   **Knoten (Nodes):** Repräsentationen von Konzepten, Emotionen oder kognitiven Funktionen. Jede KI hat ihren eigenen, unabhängigen Satz von Knoten.
*   **Emotion State (PAD-Modell & spezifische Emotionen):** Der emotionale Zustand, individuell für jede KI.
*   **Emotionsverlauf-Tracker (PAD-Timeline):** Visualisiert den zeitlichen Verlauf der PAD-Werte. *Hinweis: Aktuell zeigt dieses Panel primär M.Y.R.A.s und C.A.E.L.U.M.s Daten; eine Erweiterung für alle Agenten mittels Agenten-Inspektor ist geplant, aber UI-seitig noch nicht vollumfänglich umgesetzt.*
*   **Adaptive Fitness:** Ein System zur Bewertung der "Gesundheit" und Leistung, individuell für jede KI.
*   **AgentRuntimeState:** Eine Datenstruktur, die alle dynamischen Simulationsdaten für einen einzelnen Agenten enthält (SubQG-Matrizen, Knotenzustände, Emotionen, adaptive Fitness Instanz, RNG Instanz etc.).
*   **Agenten-Inspektor (Konzept):** Ein UI-Mechanismus (aktuell verwaltet durch `inspectedAgentId` im `useMyraState`-Hook), um einen spezifischen Agenten (M.Y.R.A., C.A.E.L.U.M. oder konfigurierbar) auszuwählen. Die Diagnose-Panels (`SystemStatusPanel`, `NodePanel`, `SubQGDisplay`, `EmotionTimelinePanel`) sind *noch nicht vollständig* darauf ausgelegt, die Daten des `inspectedAgentId` dynamisch anzuzeigen und greifen oft noch auf M.Y.R.A./C.A.E.L.U.M.-spezifische Daten über dedizierte Tabs zu. Die SubQG-Interaktion (`injectSubQgStimulusForAgent`) ist jedoch bereits für alle Agenten generalisiert.
*   **RAG (Retrieval Augmented Generation):** Ansatz zur Anreicherung von KI-Prompts mit externem Wissen.
*   **Multi-Agenten Konversation:** Ein Panel, in dem ausgewählte Agenten (M.Y.R.A., C.A.E.L.U.M., konfigurierbare Agenten) eine gemeinsame, rundenbasierte Konversation führen können, wobei jeder Agent vor seiner Antwort simuliert wird.

---

## 3. Benutzeroberfläche (UI) Guide

### 3.1 Hauptlayout

Die Benutzeroberfläche ist in drei Hauptbereiche unterteilt: Header, linkes Panel (Seitenleiste mit Tabs) und rechtes Panel (Haupt-Chat-Interface). Die Seitenleiste ist auf Desktops in der Breite anpassbar und auf Mobilgeräten als Overlay realisiert. Die Tabs navigieren zu verschiedenen Ansichten:

*   **Status (M/C), Nodes (M/C), SubQG (M/C):** Zeigen spezifische Daten für M.Y.R.A. (M) oder C.A.E.L.U.M. (C). *Die vollständige Integration eines globalen Agenten-Inspektors, um diese Panels für jeden Agenten dynamisch zu machen, ist UI-seitig noch ausstehend.*
*   **Emotion Timeline:** Zeigt Emotionsverläufe (aktuell primär M.Y.R.A./C.A.E.L.U.M.).
*   **Knowledge:** Verwaltung der Wissensbasis.
*   **Documentation:** Integrierter Dokumentations-Viewer.
*   **Dual AI:** Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M.
*   **Multi-Agent Conv.:** Konversationen mit einer Auswahl von M.Y.R.A., C.A.E.L.U.M. und konfigurierbaren Agenten.
*   **Settings:** Konfigurationseinstellungen.

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zeigt Emotionsstatus, adaptive Fitness und SubQG-Metriken für die über den Tab ausgewählte KI (M.Y.R.A. oder C.A.E.L.U.M.). Enthält ein "Heartbeat Display" basierend auf dem Stresslevel und einen "SubQG Pulse Indicator" für SubQG-Events.

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Visualisiert Modulator- und eine Auswahl semantischer Knoten für die über den Tab ausgewählte KI, inklusive Aktivierung und weiterer Scores.

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Stellt das SubQG-Feld (Energie und Phase) der über den Tab ausgewählten KI dar. Erlaubt direkte Injektion von Energie und Setzen von Phasen in einzelne Zellen. Die Backend-Funktion `injectSubQgStimulusForAgent` ist bereits für alle Agenten generalisiert, die UI zur Auswahl des Zielagenten hierfür ist aber noch nicht implementiert.

### 3.5 Emotion Timeline Panel

Zeigt den zeitlichen Verlauf der PAD-Werte (Pleasure, Arousal, Dominance) als Liniendiagramm. Ermöglicht die Auswahl zwischen M.Y.R.A.s und C.A.E.L.U.M.s Verläufen.

### 3.6 Knowledge Panel

Ermöglicht das Hochladen von Text-, Markdown-, Excel- (.xlsx) und Word- (.docx) Dateien zur Erweiterung der globalen Wissensbasis. Zeigt geladene Quellen und erlaubt das Löschen der gesamten Wissensbasis.

### 3.7 Documentation Panel

Zeigt Markdown-basierte Dokumentationsdateien direkt in der Anwendung an. Benutzer können über ein Dropdown-Menü zwischen verschiedenen Dokumenten (Hauptdokumentation, Konfigurationsdetails) wechseln. Die Dokumente werden sprachspezifisch geladen, mit einem Fallback auf Englisch.

### 3.8 Dual AI Conversation Panel

Initiiert und zeigt rundenbasierte Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M., basierend auf einem initialen Prompt.

### 3.9 Multi-Agent Conversation Panel

Ermöglicht die Auswahl einer beliebigen Kombination von M.Y.R.A., C.A.E.L.U.M. und den definierten konfigurierbaren Agenten für eine gemeinsame Konversation. Der Benutzer gibt einen initialen Prompt und die Anzahl der Runden pro Agent vor.

### 3.10 Settings Panel

Bietet detaillierte Konfigurationsmöglichkeiten, gruppiert in Sektionen:
*   **Lokalisierung:** Sprache (Deutsch/Englisch), UI-Theme (Nebula, Biosphere, Matrix).
*   **M.Y.R.A. / C.A.E.L.U.M. AI Provider:** Jeweils KI-Dienst, Modell, URL, Temperatur.
*   **M.Y.R.A. / C.A.E.L.U.M. Persona:** Name, Rollenbeschreibung, Ethik, Antwortinstruktionen.
*   **M.Y.R.A. / C.A.E.L.U.M. System:** Jeweils SubQG-Parameter, RNG, Zerfallsraten, Fitness-Intervall.
*   **Konfigurierbare Agenten:** Hauptsektion zur Verwaltung von Agenten.
    *   **Agent Hinzufügen/Löschen:** Buttons zum Erstellen neuer oder Entfernen bestehender Agenten.
    *   **Agenten-spezifische Konfiguration:** Jeder Agent hat ausklappbare Sektionen für: Persona, AI Provider, Systemkonfiguration (SubQG, RNG, etc.), Adaptive Fitness.
*   **Allgemeines System:** Globale Chat-History-Länge, Temperatureinflüsse, RAG-Parameter, maximale Länge des Emotionsverlaufs.
*   **Adaptive Fitness (Basisgew./Dimensionen):** Globale Gewichtungen, die M.Y.R.A. und C.A.E.L.U.M. nutzen (konfigurierbare Agenten haben ihre eigenen).

### 3.11 Chat Interface

Haupt-Chatfenster für die Interaktion mit dem in den Einstellungen (`activeChatAgent`) ausgewählten primären Agenten (M.Y.R.A. oder C.A.E.L.U.M.). Unterstützt Spracheingabe und -ausgabe.

---

## 4. Technische Architektur & Code Dokumentation

### 4.1 Projektstruktur

Die Projektstruktur umfasst Standard-React-Verzeichnisse (`src`, `public`) sowie spezifische Ordner für Komponenten, Hooks, Services, Utils und Internationalisierungsdateien (`i18n`). Markdown-Dokumentationen befinden sich in `public/` und `public/docs/`.

### 4.2 `index.html`

Basis-HTML, lädt Tailwind CSS, Heroicons, und das Haupt-JavaScript-Modul (`index.tsx`). Enthält eine `importmap` für CDN-basierte Abhängigkeiten. Initialisiert Theme und Sprache aus `localStorage`.

### 4.3 `metadata.json`

Metadaten für die Hosting-Plattform, inklusive angeforderter Berechtigungen (z.B. Mikrofon).

### 4.4 `vite.config.ts`

Vite-Build-Konfiguration. Definiert Aliase, Umgebungsvariablen (für API-Keys) und serverseitige Einstellungen.

### 4.5 `index.tsx`

React-Einstiegspunkt, rendert die `App`-Komponente.

### 4.6 `App.tsx`

Hauptkomponente, verwaltet das Layout, die aktive Tab-Navigation und die Darstellung der verschiedenen UI-Panels. Verwendet `useMyraState` für den Zugriff auf den globalen Anwendungszustand. Die Funktionalität für einen globalen "Agenten-Inspektor" (Auswahl des Agenten, dessen Daten in den Diagnose-Panels angezeigt werden) ist im `useMyraState`-Hook (`inspectedAgentId`) vorbereitet, aber die UI-Elemente (z.B. ein Dropdown in `App.tsx`) und die vollständige Anpassung der Diagnose-Panels zur Nutzung dieses Zustands sind noch nicht implementiert. Die Panels greifen oft noch direkt auf M.Y.R.A./C.A.E.L.U.M.-spezifische Daten zu.

### 4.7 `constants.ts`

Definiert initiale Konfigurationen (`INITIAL_CONFIG`), Standard-Emotionszustände, Knotensätze für M.Y.R.A. und C.A.E.L.U.M., initiale Fitness-Werte und die wichtige Funktion `createInitialAgentRuntimeState` zur Erzeugung des Laufzeitzustands für jeden Agententyp. `INITIAL_CONFIG` enthält jetzt auch eine Liste von `DEFAULT_CONFIGURABLE_AGENTS` mit vollständigen Standardkonfigurationen.

### 4.8 `types.ts`

Enthält alle TypeScript-Typdefinitionen. Wichtige Typen sind:
*   `MyraConfig`: Umfassende globale Konfiguration.
*   `ConfigurableAgentPersona`: Definiert die Struktur für konfigurierbare Agenten, inklusive eigener `aiProviderConfig`, `systemConfig` (Typ `AgentSystemCoreConfig`), und `adaptiveFitnessConfig`.
*   `AgentSystemCoreConfig`: Kernparameter für das Simulationssystem eines Agenten (SubQG, RNG, Zerfallsraten etc.).
*   `AgentRuntimeState`: Hält alle dynamischen Laufzeitdaten eines Agenten (SubQG-Matrizen, Knotenzustände, Emotionen, Fitness, RNG-Instanz, AdaptiveFitnessManager-Instanz).
*   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`, `PADRecord`.
*   `ConfigField` und seine Subtypen für das `SettingsPanel`.
*   `InspectedAgentID`: Typ für die ID des aktuell zu inspizierenden Agenten.

### 4.9 `hooks/useMyraState.ts`

Der zentrale Hook für das gesamte State Management und die Kernlogik:
*   **`agentRuntimeStates`**: Ein `Record<string, AgentRuntimeState>` speichert den dynamischen Zustand aller Agenten (M.Y.R.A., C.A.E.L.U.M., konfigurierbare Agenten).
*   **Initialisierung**: Erstellt `AgentRuntimeState` für alle Agenten beim Start, basierend auf ihrer Konfiguration in `myraConfig`. Jeder Agent erhält eine eigene Instanz seines RNGs und `AdaptiveFitnessManager`.
*   **`updateMyraConfig`**: Aktualisiert `myraConfig`, speichert sie in `localStorage` und synchronisiert die `agentRuntimeStates` (z.B. Hinzufügen/Entfernen von Agenten, Reinitialisierung von SubQG-Matrizen oder RNGs bei relevanten Konfigurationsänderungen).
*   **`simulateAgentStepInternal`**: Eine generische Funktion, die einen Simulationsschritt für einen *beliebigen* Agenten anhand seiner ID, Konfiguration und seines aktuellen Laufzeitzustands durchführt.
*   `simulateNetworkStepMyra` / `simulateNetworkStepCaelum`: Wrapper um `simulateAgentStepInternal` für die kontinuierliche Simulation von M.Y.R.A. und C.A.E.L.U.M.
*   **KI-Interaktionen**:
    *   `generateActiveAgentChatResponse`: Für den Hauptchat.
    *   `startDualConversation`: Für M.Y.R.A.-C.A.E.L.U.M.-Dialoge.
    *   `startMultiAgentConversation`: Für Konversationen mit einer Auswahl von Agenten. Ruft vor dem Zug eines Agenten dessen `simulateAgentStepInternal` auf und verwendet den *direkt* zurückgegebenen Zustand für die Generierung der Systeminstruktion.
*   **`getAgentBaseSystemInstruction`**: Erstellt Systeminstruktionen basierend auf dem dynamischen `AgentRuntimeState` des jeweiligen Agenten.
*   **`injectSubQgStimulusForAgent`**: Generalisierte Funktion zur Energie-/Phaseninjektion in das SubQG eines beliebigen Agenten.
*   **`inspectedAgentId`, `setInspectedAgentId`**: Zustand und Setter für den geplanten Agenten-Inspektor.

### 4.10 `components/`

Detaillierte Beschreibungen der einzelnen UI-Komponenten:

#### 4.10.1 `ChatInterface.tsx`

UI für den Haupt-Chat mit dem aktiven Agenten (`myraConfig.activeChatAgent`). Unterstützt Text- und Spracheingabe (STT) sowie Sprachausgabe (TTS) für KI-Nachrichten.

#### 4.10.2 `DocumentationPanel.tsx`

Zeigt Markdown-Dokumente an. Erlaubt Auswahl verschiedener Dokumente. Lädt sprachspezifische Versionen mit Fallback auf Englisch. Nutzt `react-markdown` und `react-syntax-highlighter`.

#### 4.10.3 `DualAiConversationPanel.tsx`

UI zur Initiierung und Anzeige von Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M.

#### 4.10.4 `EmotionTimelinePanel.tsx`

Visualisiert den PAD-Emotionsverlauf für M.Y.R.A. und C.A.E.L.U.M. (Auswahl möglich). *Die Anpassung zur Anzeige des Verlaufs für jeden inspizierten Agenten ist noch ausstehend.*

#### 4.10.5 `IconComponents.tsx`

Sammlung von SVG-Icon-Komponenten für die UI.

#### 4.10.6 `KnowledgePanel.tsx`

UI zur Verwaltung der Wissensbasis: Hochladen von `.txt`, `.md`, `.xlsx`, `.docx` Dateien und Löschen der gesamten Basis.

#### 4.10.7 `MultiAgentConversationPanel.tsx`

UI für Konversationen mit mehreren ausgewählten Agenten (M.Y.R.A., C.A.E.L.U.M., konfigurierbare Agenten). Erlaubt Auswahl der Teilnehmer, Eingabe eines Start-Prompts und Festlegung der Rundenanzahl.

#### 4.10.8 `NodePanel.tsx`

Zeigt Modulator- und semantische Knoten des ausgewählten Agenten (aktuell M.Y.R.A. oder C.A.E.L.U.M. über Tabs). *Anpassung an globalen Agenten-Inspektor ausstehend.*

#### 4.10.9 `SettingsPanel.tsx`

Umfangreiches Panel zur Konfiguration aller globalen und agentenspezifischen Parameter. Ermöglicht das Hinzufügen, Löschen und detaillierte Konfigurieren von konfigurierbaren Agenten (Persona, AI Provider, System Simulation, Adaptive Fitness).

#### 4.10.10 `SubQGDisplay.tsx`

Visualisiert das SubQG-Feld (Energie & Phase) und erlaubt Energie-/Phaseninjektion für den ausgewählten Agenten (aktuell M.Y.R.A. oder C.A.E.L.U.M. über Tabs). *Anpassung an globalen Agenten-Inspektor für die Auswahl des Zielagenten der Injektion ausstehend.*

#### 4.10.11 `SystemStatusPanel.tsx`

Zeigt Emotionsstatus, adaptive Fitness und SubQG-Metriken des ausgewählten Agenten (aktuell M.Y.R.A. oder C.A.E.L.U.M. über Tabs). *Anpassung an globalen Agenten-Inspektor ausstehend.*

### 4.11 `services/aiService.ts`

Kapselt die Logik für API-Aufrufe an Gemini oder LM Studio. `callAiApi` nimmt agentenspezifische Konfigurationen und Systeminstruktionen entgegen.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

Klasse zur Berechnung der adaptiven Fitness. Wird pro Agent instanziiert. Die `updateConfig`-Methode kann eine neue `getSystemState`-Funktion annehmen, um sicherzustellen, dass der Manager immer auf den aktuellsten Zustand des spezifischen Agenten zugreift.

#### 4.12.2 `db.ts`

Verwaltet die IndexedDB für die Wissensbasis-Chunks. Enthält einen Index auf `source` und Funktionen zum Hinzufügen, Abrufen und Löschen von Chunks.

#### 4.12.3 `rng.ts`

Definiert `SubQGRNG` (deterministisch) und `QuantumRNG` (nicht-deterministisch).

#### 4.12.4 `uiHelpers.ts`

Hilfsfunktionen für die UI, z.B. `getDominantAffect` und `interpretPAD` zur Interpretation von Emotionszuständen.

---

## 5. Funktionale Tieftauche

### 5.1 Simulationszyklen (M.Y.R.A., C.A.E.L.U.M. & Konfigurierbare Agenten)

*   M.Y.R.A. und C.A.E.L.U.M. haben dedizierte Simulationsintervalle, die `simulateAgentStepInternal` aufrufen.
*   **Konfigurierbare Agenten** werden ebenfalls über `simulateAgentStepInternal` simuliert, und zwar immer dann, wenn sie in einer `startMultiAgentConversation` an der Reihe sind zu sprechen, direkt bevor ihre Antwort generiert wird.

### 5.2 KI-Antwortgenerierung

Für jeden Agenten (M.Y.R.A., C.A.E.L.U.M., konfigurierbar) wird vor der Antwortgenerierung dessen individueller Simulationsschritt ausgeführt. Die `baseSystemInstruction` für den LLM-Aufruf wird aus dem aktuellen, dynamischen `AgentRuntimeState` dieses Agenten generiert. Es wird die spezifische `aiProviderConfig` des jeweiligen Agenten verwendet.

### 5.3 Wissensverarbeitung (RAG & Automatische Dokumentenladung)

Das RAG-System ist global. Relevante Chunks aus der Wissensbasis (die automatisch geladene Dokumentation und manuell hochgeladene Dateien enthält) werden abgerufen und dem Kontext des *aktuell sprechenden Agenten* hinzugefügt. Dateiverarbeitung unterstützt `.txt`, `.md`, `.xlsx` (mittels `read-excel-file`) und `.docx` (mittels `mammoth`).

### 5.4 Konfigurationsmanagement

`MyraConfig` speichert alle Einstellungen. Das `SettingsPanel` erlaubt die detaillierte Konfiguration jedes Aspekts aller Agenten. Änderungen werden in `localStorage` gespeichert.

### 5.5 Emotionsverlauf-Tracking

PAD-Werte werden für M.Y.R.A. und C.A.E.L.U.M. im `EmotionTimelinePanel` visualisiert. *Die Erweiterung zur Anzeige der Verläufe aller Agenten ist UI-seitig noch nicht implementiert.*

### 5.6 Dokumentationsanzeige

Das `DocumentationPanel` ermöglicht die Anzeige verschiedener Markdown-Dokumentationsdateien direkt in der App.

### 5.7 Multi-Agenten Konversationen

Das `MultiAgentConversationPanel` ermöglicht Konversationen zwischen einer beliebigen Auswahl von M.Y.R.A., C.A.E.L.U.M. und konfigurierbaren Agenten. Jeder Agent wird vor seinem Zug simuliert.

---

## 6. Detaillierte Konfigurationsparameter

Die detaillierte Beschreibung aller Konfigurationsparameter ist in separate Dateien im `docs/` Verzeichnis ausgelagert:

*   [**AI Provider Configuration**](./docs/config_ai_provider_de.md)
*   [**Persona & Behavior**](./docs/config_persona_behavior_de.md)
*   [**SubQG Simulation**](./docs/config_subqg_simulation_de.md)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag_de.md)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness_de.md)

Diese Dokumente beschreiben, wie die Parameter für M.Y.R.A., C.A.E.L.U.M. und die individuell konfigurierbaren Agenten gelten.

---

## 7. Einrichtung und Start

1.  **Abhängigkeiten installieren:** `npm install` im Projektverzeichnis.
2.  **API Key (Optional, für Gemini):** Erstellen Sie eine `.env`-Datei im Projekt-Root und fügen Sie Ihren Gemini API Key hinzu: `GEMINI_API_KEY=DEIN_API_KEY`.
3.  **Lokales LLM (Optional, für LM Studio):** Stellen Sie sicher, dass LM Studio läuft und ein Modell geladen ist, falls Sie diese Option nutzen möchten.
4.  **Entwicklungsserver starten:** `npm run dev`.
5.  **Dokumentationsdateien:** Platzieren Sie `Dokumentation_de.md` und andere `.md`-Dateien im `public/` bzw. `public/docs/` Verzeichnis, damit sie automatisch geladen werden.

Die Anwendung ist dann standardmäßig unter `http://localhost:5173` (oder einem anderen von Vite zugewiesenen Port) erreichbar.
