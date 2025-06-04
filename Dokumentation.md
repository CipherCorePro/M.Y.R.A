# M.Y.R.A. SubQG Integration - Dokumentation

## Inhaltsverzeichnis

1.  [Einleitung](#1-einleitung)
2.  [Core Konzepte & Glossar](#2-core-konzepte--glossar)
3.  [Benutzeroberfläche (UI) Guide](#3-benutzeroberfläche-ui-guide)
    *   [3.1 Hauptlayout](#31-hauptlayout)
    *   [3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)](#32-status-panel-myra--caelum)
    *   [3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)](#33-nodes-panel-myra--caelum)
    *   [3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)](#34-subqg-panel-myra--caelum)
    *   [3.5 Knowledge Panel](#35-knowledge-panel)
    *   [3.6 Dual AI Conversation Panel](#36-dual-ai-conversation-panel)
    *   [3.7 Settings Panel](#37-settings-panel)
    *   [3.8 Chat Interface (M.Y.R.A.)](#38-chat-interface-myra)
4.  [Technische Architektur & Code Dokumentation](#4-technische-architektur--code-dokumentation)
    *   [4.1 Projektstruktur](#41-projektstruktur)
    *   [4.2 `index.html`](#42-indexhtml)
    *   [4.3 `metadata.json`](#43-metajson)
    *   [4.4 `vite.config.ts`](#44-viteconfigts)
    *   [4.5 `index.tsx`](#45-indextsx)
    *   [4.6 `App.tsx`](#46-apptsx)
    *   [4.7 `constants.ts`](#47-constantsts)
    *   [4.8 `types.ts`](#48-typests)
    *   [4.9 `hooks/useMyraState.ts`](#49-hooksusemyrastatets)
    *   [4.10 `components/`](#410-components)
        *   [`ChatInterface.tsx`](#4101-chatinterfacetsx)
        *   [`DualAiConversationPanel.tsx`](#4102-dualconversationpaneltsx)
        *   [`IconComponents.tsx`](#4103-iconcomponentstsx)
        *   [`KnowledgePanel.tsx`](#4104-knowledgepaneltsx)
        *   [`NodePanel.tsx`](#4105-nodepaneltsx)
        *   [`SettingsPanel.tsx`](#4106-settingspaneltsx)
        *   [`SubQGDisplay.tsx`](#4107-subqgdisplaytsx)
        *   [`SystemStatusPanel.tsx`](#4108-systemstatuspaneltsx)
    *   [4.11 `services/aiService.ts`](#411-servicesaiservicets)
    *   [4.12 `utils/`](#412-utils)
        *   [`adaptiveFitnessManager.ts`](#4121-adaptivefitnessmanagerts)
        *   [`db.ts`](#4122-dbts)
        *   [`rng.ts`](#4123-rngts)
5.  [Funktionale Tieftauche](#5-funktionale-tieftauche)
    *   [5.1 Simulationszyklen (M.Y.R.A. & C.A.E.L.U.M.)](#51-simulationszyklen-myra--caelum)
    *   [5.2 KI-Antwortgenerierung](#52-ki-antwortgenerierung)
    *   [5.3 Wissensverarbeitung (`loadAndProcessFile`, RAG)](#53-wissensverarbeitung-loadandprocessfile-rag)
    *   [5.4 Konfigurationsmanagement](#54-konfigurationsmanagement)
6.  [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter)
7.  [Einrichtung und Start](#7-einrichtung-und-start)


---

## 1. Einleitung

Dieses Dokument beschreibt die M.Y.R.A. (Modular Yearning Reasoning Architecture) Web-Anwendung mit SubQG-Integration. Die Anwendung bietet eine interaktive Oberfläche zur Simulation und Interaktion mit zwei KI-Entitäten, M.Y.R.A. und C.A.E.L.U.M., deren kognitiv-affektive Prozesse jeweils durch ein eigenes, unabhängiges simuliertes SubQuantenfeld-Grundfeld (SubQG) beeinflusst werden. Sie nutzt die Gemini API (oder eine lokale LM Studio Instanz) für intelligente Antworten und visualisiert interne Zustände wie SubQG-Metriken, Knotenzustände, Emotionen und adaptive Fitness für beide Systeme.

Die Kernidee ist es, KI-Entitäten zu schaffen, deren Verhalten nicht nur auf trainierten Daten basiert, sondern auch durch dynamische, emergente interne Zustände geprägt wird, die von ihren jeweiligen komplexen Subsystemen (SubQGs) beeinflusst werden. Dieses Dokument dient als Leitfaden für Benutzer und Entwickler.

---

## 2. Core Konzepte & Glossar

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** Die primäre KI-Entität, die auf emotionalem Ausdruck und kreativem Denken basiert.
*   **C.A.E.L.U.M. (Cognitive Analytical Emergence Layer Underlying Mechanism):** Eine zweite, unabhängige KI-Entität, die parallel zu M.Y.R.A. läuft. C.A.E.L.U.M. ist auf logische Analyse, Mustererkennung und das Verständnis emergenter Phänomene spezialisiert und besitzt ein eigenes Simulationssystem (SubQG, Knoten, Emotionen).
*   **SubQG (SubQuantenfeld-Grundfeld):** Ein simuliertes Feld, das als Basis für emergente Dynamiken dient. Jede KI (M.Y.R.A. und C.A.E.L.U.M.) besitzt ihr eigenes, unabhängiges SubQG. Es besteht aus einer Matrix von Energiewerten und Phasen, die sich über Zeit entwickeln und miteinander interagieren. "SubQG Jumps" sind signifikante Fluktuationen in diesem Feld, die den Zustand der jeweiligen KI beeinflussen können.
*   **Knoten (Nodes):** Repräsentationen von Konzepten, Emotionen oder kognitiven Funktionen. Sowohl M.Y.R.A. als auch C.A.E.L.U.M. haben ihre eigenen, unabhängigen Sätze von Knoten, die unterschiedlich konfiguriert und benannt sein können (z.B. M.Y.R.A.s "Creativus" vs. C.A.E.L.U.M.s "Pattern Analyzer").
    *   **Semantische Knoten:** Repräsentieren spezifische Konzepte.
    *   **Limbus Affektus:** Ein spezieller Knoten, der den emotionalen Gesamtzustand modelliert.
    *   **Creativus / Pattern Analyzer:** Beeinflusst Kreativität/Musteranalyse.
    *   **Cortex Criticus / Logic Verifier:** Steuert kritische Bewertung/logische Verifikation.
    *   **MetaCognitio / System Monitor:** Überwacht den Gesamtzustand des jeweiligen Netzwerks.
    *   **Verhaltensmodulatoren (Social, Valuation, Conflict, Executive):** Knoten für spezifische kognitive Funktionen.
*   **Emotion State (PAD-Modell & spezifische Emotionen):** Der emotionale Zustand wird durch Pleasure (Vergnügen), Arousal (Erregung) und Dominance (Dominanz) sowie spezifischere Emotionen repräsentiert. Jede KI hat ihren eigenen emotionalen Zustand.
*   **Adaptive Fitness:** Ein System zur Bewertung der "Gesundheit" und Leistung. Jede KI hat ihre eigene adaptive Fitness, die auf ihrem jeweiligen internen Zustand basiert, auch wenn die Konfiguration der Fitnessberechnung (Gewichtungen) derzeit geteilt wird.
*   **RAG (Retrieval Augmented Generation):** Ein Ansatz, bei dem vor der Antwortgenerierung relevante Informationen aus einer Wissensdatenbank abgerufen werden. Wird von M.Y.R.A. im direkten Chat und von beiden KIs in der Dual-AI-Konversation verwendet.
*   **Text Chunk:** Ein Textabschnitt aus einem externen Dokument, gespeichert in der Wissensdatenbank.
*   **SubQG Jump:** Eine signifikante, plötzliche Veränderung im jeweiligen SubQG einer KI.
*   **Phasenkohärenz (Phase Coherence):** Maß für die Synchronität der Phasen im SubQG.
*   **IndexedDB:** Clientseitige Datenbank zur Speicherung von Text-Chunks.
*   **LM Studio / Gemini API:** Externe KI-Dienste für Antwortgenerierung.
*   **RNG (Random Number Generator):** Wird für stochastische Prozesse in den Simulationen verwendet. Jede KI kann ihren eigenen RNG-Typ und Seed haben.

---

## 3. Benutzeroberfläche (UI) Guide

### 3.1 Hauptlayout

Die Benutzeroberfläche ist in drei Hauptbereiche unterteilt:

*   **Header:** Zeigt den Titel (`M.Y.R.A Interface` oder `C.A.E.L.U.M System` je nach aktivem Tab), den aktuellen Simulationsschritt (`Sim Step`) und die Gesamt-Fitness (`Fitness`) der aktuell im Fokus stehenden KI (M.Y.R.A. oder C.A.E.L.U.M.) an.
*   **Linkes Panel (Aside):** Enthält Tabs zur Navigation:
    *   **Status (M):** Statusübersicht für M.Y.R.A.
    *   **Status (C):** Statusübersicht für C.A.E.L.U.M.
    *   **Nodes (M):** Knotenvisualisierung für M.Y.R.A.
    *   **Nodes (C):** Knotenvisualisierung für C.A.E.L.U.M.
    *   **SubQG (M):** SubQG-Visualisierung und Interaktion für M.Y.R.A.
    *   **SubQG (C):** SubQG-Visualisierung und Interaktion für C.A.E.L.U.M.
    *   **Knowledge:** Verwaltung der Wissensbasis.
    *   **Dual AI:** Start und Anzeige von Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M.
    *   **Settings:** Globale und KI-spezifische Konfigurationseinstellungen.
*   **Rechtes Panel (Main):** Zeigt das Chat Interface für die direkte Interaktion mit M.Y.R.A.

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "Status (M)" und "Status (C)" Tabs. Dieses Panel gibt einen Überblick über die wichtigsten internen Zustände der jeweiligen KI.

*   **Emotion State & Vitals:** (Details wie zuvor, aber spezifisch für die ausgewählte KI)
    *   **Heartbeat Display:** Visualisiert eine "Herzfrequenz" basierend auf dem Stresslevel der KI.
    *   Pleasure, Arousal, Dominance.
    *   Dominant Affect.
*   **Adaptive Fitness:** (Details wie zuvor, spezifisch für die ausgewählte KI)
    *   Overall Score und Dimensionen.
*   **SubQG Metrics:** (Details wie zuvor, spezifisch für die ausgewählte KI)
    *   **SubQG Pulse Indicator:** Visualisiert signifikante SubQG-Events.
    *   Avg. Energy, Std. Energy, Phase Coherence.
    *   Jump Modifier Active (falls zutreffend).

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "Nodes (M)" und "Nodes (C)" Tabs. Visualisiert die internen Knoten der jeweiligen KI.

*   **Modulator Nodes:** Zeigt spezielle Knoten der ausgewählten KI.
*   **Semantic Nodes (Sample):** Zeigt eine Auswahl der semantischen Knoten der ausgewählten KI.
*   **Node Card Details:** (Details wie zuvor, spezifisch für die Knoten der ausgewählten KI).

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "SubQG (M)" und "SubQG (C)" Tabs. Visualisiert das SubQG der jeweiligen KI und erlaubt Interaktionen.

*   **Matrix-Visualisierung:** Zeigt das Gitter der ausgewählten KI. Farbe und Tooltip-Informationen wie zuvor.
*   **Interaktionsmöglichkeiten:** `Inject Energy`, `Set Phase (Opt)` wirken auf das SubQG der ausgewählten KI.
*   **SubQG Jump Info:** Zeigt Details zu Jumps im SubQG der ausgewählten KI.

### 3.5 Knowledge Panel

Zugänglich über den "Knowledge"-Tab. Hier kann die Wissensbasis durch externe Dokumente erweitert werden. Die Funktionalität ist global und wird von beiden KIs in der Dual-AI-Konversation genutzt.

*   **Upload Text File (.txt):** Wie zuvor beschrieben.
*   **Loaded Sources:** Wie zuvor beschrieben.

### 3.6 Dual AI Conversation Panel

Zugänglich über den "Dual AI"-Tab. Ermöglicht es, eine Konversation zwischen M.Y.R.A. und C.A.E.L.U.M. zu initiieren und zu beobachten.

*   **Initial Prompt:** Ein Textfeld, um das Startthema für die Konversation festzulegen.
*   **Conversation Rounds:** Eine Zahleneingabe, um festzulegen, wie viele Antwortrunden die KIs austauschen sollen (1 Runde = jede KI antwortet einmal).
*   **Start Dual Conversation Button:** Startet den Dialog. M.Y.R.A. beginnt in der Regel.
*   **Nachrichtenanzeige:** Zeigt den Gesprächsverlauf. M.Y.R.A.s Nachrichten erscheinen links, C.A.E.L.U.M.s rechts, die initiale Benutzereingabe zentriert. Jede Nachricht enthält den Sprechernamen, den Inhalt und einen Zeitstempel.

### 3.7 Settings Panel

Zugänglich über den "Settings"-Tab. Ermöglicht die detaillierte Konfiguration. Enthält jetzt separate Gruppen für M.Y.R.A.-Systemparameter und C.A.E.L.U.M.-Systemparameter sowie deren jeweilige KI-Provider- und Persona-Einstellungen.

*   **M.Y.R.A. AI Configuration**
*   **C.A.E.L.U.M. AI Configuration**
*   **M.Y.R.A. Persona**
*   **C.A.E.L.U.M. Persona**
*   **M.Y.R.A. System** (SubQG, RNG, Decay etc. für M.Y.R.A.)
*   **C.A.E.L.U.M. System** (SubQG, RNG, Decay etc. für C.A.E.L.U.M.)
*   **General System** (Globale Einstellungen wie Chat-History-Länge, RAG)
*   **Adaptive Fitness - Base Weights** (Geteilte Konfiguration, aber separat angewendet)
*   **Adaptive Fitness - Dimension Contributions** (Geteilte Konfiguration, aber separat angewendet)
*   **Apply Settings Button:** Speichert alle Änderungen.

### 3.8 Chat Interface (M.Y.R.A.)

Der Hauptbereich auf der rechten Seite bleibt das primäre Chat-Interface für direkte Konversationen mit M.Y.R.A.

*   **Nachrichtenanzeige:** Zeigt den Gesprächsverlauf zwischen dem Benutzer und M.Y.R.A.
*   **Eingabefeld:** Textfeld zum Eingeben von Nachrichten an M.Y.R.A.
*   **Senden-Button:** Schickt die eingegebene Nachricht ab.

---

## 4. Technische Architektur & Code Dokumentation

### 4.1 Projektstruktur

(Struktur bleibt wie zuvor beschrieben)

### 4.2 `index.html`

(Beschreibung bleibt wie zuvor)

### 4.3 `metadata.json`

(Beschreibung bleibt wie zuvor)

### 4.4 `vite.config.ts`

(Beschreibung bleibt wie zuvor)

### 4.5 `index.tsx`

(Beschreibung bleibt wie zuvor)

### 4.6 `App.tsx`

*   **Zweck:** Die Hauptkomponente der React-Anwendung. Verwaltet den aktiven Tab und rendert die entsprechenden UI-Panels.
*   **Logik:**
    *   Verwendet den `useMyraState` Hook, um Zugriff auf den gesamten Anwendungszustand (M.Y.R.A. und C.A.E.L.U.M.) und die Update-Funktionen zu erhalten.
    *   Verwaltet den `activeTab` Zustand, um zu bestimmen, welche Ansicht (M.Y.R.A.-spezifisch, C.A.E.L.U.M.-spezifisch oder global) angezeigt wird.
    *   Rendert die Sidebar mit Navigations-Tabs für M.Y.R.A.-spezifische Ansichten (Status (M), Nodes (M), SubQG (M)), C.A.E.L.U.M.-spezifische Ansichten (Status (C), Nodes (C), SubQG (C)) und globale Ansichten (Knowledge, Dual AI, Settings).
    *   Rendert bedingt die Panels (`SystemStatusPanel`, `NodePanel`, `SubQGDisplay`, `KnowledgePanel`, `DualAiConversationPanel`, `SettingsPanel`) basierend auf dem `activeTab` und übergibt die entsprechenden Zustandsdaten (entweder von M.Y.R.A. oder C.A.E.L.U.M.) und Callbacks.
    *   Der Header zeigt Informationen (Simulationsschritt, Fitness) der KI an, die dem aktiven Tab entspricht.
    *   Das rechte Hauptpanel ist dem `ChatInterface` für die direkte Interaktion mit M.Y.R.A. gewidmet.

### 4.7 `constants.ts`

*   **Zweck:** Definiert globale Konstanten und initiale Zustände.
*   **Inhalt:**
    *   `INITIAL_CONFIG`: Enthält die Standardkonfiguration für `MyraConfig`, einschließlich aller Parameter für M.Y.R.A. und C.A.E.L.U.M. (Persona, KI-Provider, SubQG-Systeme, etc.).
    *   `INITIAL_EMOTION_STATE`, `INITIAL_NODE_STATES`, `INITIAL_ADAPTIVE_FITNESS_STATE`, `INITIAL_SUBQG_GLOBAL_METRICS`: Standardwerte für M.Y.R.A.s Kernzustände.
    *   `INITIAL_CAELUM_EMOTION_STATE`, `INITIAL_CAELUM_NODE_STATES`, `INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE`, `INITIAL_CAELUM_SUBQG_GLOBAL_METRICS`: Standardwerte für C.A.E.L.U.M.s Kernzustände.

### 4.8 `types.ts`

*   **Zweck:** Definiert alle wichtigen TypeScript-Typen und Interfaces für die Anwendung.
*   **Wichtige Typen:**
    *   `MyraConfig`: Umfassende Konfiguration, die jetzt separate Sektionen für M.Y.R.A.s und C.A.E.L.U.M.s Systemparameter (`caelumSubqgSize`, etc.) und Persona-Einstellungen enthält.
    *   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`: Kernzustandstypen, die jetzt sowohl für M.Y.R.A. als auch für C.A.E.L.U.M. verwendet werden (instanziiert als separate Zustandsvariablen).
    *   `ConfigField` und seine Subtypen: Für die dynamische Erstellung des SettingsPanel, jetzt erweitert um `CaelumPersonaConfigField` und `CaelumSystemConfigField`.

### 4.9 `hooks/useMyraState.ts`

*   **Zweck:** Der zentrale Hook für das State Management und die Kernlogik der Anwendung.
*   **Kernfunktionen:**
    *   **Zustandsverwaltung:** Verwaltet den Zustand für M.Y.R.A. und C.A.E.L.U.M. parallel. Dies beinhaltet:
        *   Emotionen (`emotionState`, `emotionStateCaelum`)
        *   Knotenzustände (`nodeStates`, `nodeStatesCaelum`)
        *   Adaptive Fitness (`adaptiveFitness`, `adaptiveFitnessCaelum`)
        *   SubQG Matrizen & Metriken (`subQgMatrix`, `subQgMatrixCaelum`, etc.)
        *   RNG Instanzen (`rngRef`, `rngRefCaelum`)
        *   Simulationsschritte (`simulationStep`, `simulationStepCaelum`)
        *   Stresslevel (`myraStressLevel`, `caelumStressLevel`)
    *   **Konfigurationsmanagement (`myraConfig`, `updateMyraConfig`):** Lädt die Konfiguration aus `localStorage` oder `INITIAL_CONFIG`. Speichert Änderungen. Passt SubQG-Matrizen bei Größenänderung an (sowohl für M.Y.R.A. als auch C.A.E.L.U.M.).
    *   **Simulationsschleifen:**
        *   `simulateNetworkStepMyra`: Führt einen Simulationsschritt für M.Y.R.A.s System durch (SubQG-Update, Emotionen, Knoten, Stress, Fitness).
        *   `simulateNetworkStepCaelum`: Führt einen parallelen, unabhängigen Simulationsschritt für C.A.E.L.U.M.s System durch.
        *   Beide werden in separaten `useEffect`-Intervallen aufgerufen.
    *   **KI-Interaktion:**
        *   `generateMyraResponse`: Generiert eine Antwort von M.Y.R.A. im Hauptchat. Verwendet `getBaseSystemInstructionMyra` und M.Y.R.A.s spezifische KI-Konfiguration.
        *   `startDualConversation`: Initiiert und verwaltet eine Konversation zwischen M.Y.R.A. und C.A.E.L.U.M. Ruft iterativ `callAiApi` für beide KIs auf, wobei `getBaseSystemInstructionMyra` bzw. `getBaseSystemInstructionCaelum` und die jeweiligen KI-Konfigurationen verwendet werden. Verwendet jetzt auch RAG für beide KIs.
    *   **Systeminstruktionen:**
        *   `getBaseSystemInstructionMyra`: Erstellt die Systeminstruktion für M.Y.R.A. basierend auf ihrem aktuellen Zustand.
        *   `getBaseSystemInstructionCaelum`: Erstellt die Systeminstruktion für C.A.E.L.U.M. basierend auf dessen aktuellem Zustand.
    *   **Wissensbasis (RAG):** `loadAndProcessFile`, `clearAllKnowledge`, `retrieveRelevantChunks`. Die RAG-Chunks werden jetzt auch für C.A.E.L.U.M. in `startDualConversation` abgerufen und verwendet.
    *   **SubQG-Interaktion:** `injectSubQgStimulus` (für M.Y.R.A.) und `injectSubQgStimulusCaelum` (für C.A.E.L.U.M.).
    *   **Adaptive Fitness:** Initialisiert und verwendet zwei `AdaptiveFitnessManager`-Instanzen, eine für M.Y.R.A. und eine für C.A.E.L.U.M., die mit der geteilten `adaptiveFitnessConfig` aber den jeweiligen Systemzuständen arbeiten.

### 4.10 `components/`

#### 4.10.1 `ChatInterface.tsx`

*   **Zweck:** Stellt die Benutzeroberfläche für den direkten Chat mit M.Y.R.A. bereit.
*   **Funktionalität:** Zeigt Chatverlauf an, nimmt Benutzereingaben entgegen, behandelt das Senden von Nachrichten und zeigt Ladezustände an.

#### 4.10.2 `DualAiConversationPanel.tsx`

*   **Zweck:** Stellt die Benutzeroberfläche für die Konversation zwischen M.Y.R.A. und C.A.E.L.U.M. bereit.
*   **Funktionalität:**
    *   Eingabefelder für den initialen Prompt und die Anzahl der Runden.
    *   Button zum Starten der Konversation.
    *   Anzeige des Gesprächsverlaufs, wobei die Nachrichten von M.Y.R.A., C.A.E.L.U.M. und dem initialen Benutzer-Prompt unterschiedlich dargestellt werden.
    *   Zeigt Ladezustände während der Konversation an.

#### 4.10.3 `IconComponents.tsx`

*   **Zweck:** Enthält Definitionen für verschiedene SVG-Icons, die in der Anwendung verwendet werden.
*   `IconProps` erlaubt nun ein optionales `style` Attribut.

#### 4.10.4 `KnowledgePanel.tsx`

*   **Zweck:** UI zur Verwaltung der Wissensbasis (Textdateien hochladen, Quellen anzeigen, alles löschen).

#### 4.10.5 `NodePanel.tsx`

*   **Zweck:** Visualisiert die Knoten (Modulator und Semantik) der ausgewählten KI (M.Y.R.A. oder C.A.E.L.U.M.).
*   **Funktionalität:** Nimmt `nodeStates` (entweder von M.Y.R.A. oder C.A.E.L.U.M.) als Prop und rendert Karten für jeden Knoten mit Aktivierung, Scores und spezifischen Zuständen.

#### 4.10.6 `SettingsPanel.tsx`

*   **Zweck:** UI zur Konfiguration aller Parameter in `MyraConfig`.
*   **Funktionalität:** Stellt Eingabefelder für alle konfigurierbaren Werte bereit, gruppiert nach Funktionalität (z.B. "M.Y.R.A. System", "C.A.E.L.U.M. System", "M.Y.R.A. AI Configuration", "C.A.E.L.U.M. AI Configuration", etc.). Ermöglicht das Speichern und Zurücksetzen von Einstellungen.

#### 4.10.7 `SubQGDisplay.tsx`

*   **Zweck:** Visualisiert die SubQG-Energie- und Phasenmatrix der ausgewählten KI und erlaubt Energie-/Phaseninjektionen.
*   **Funktionalität:** Nimmt `matrix`, `phaseMatrix`, `size`, `onInject` Callback und `jumpInfo` (alles spezifisch für die ausgewählte KI) als Props.

#### 4.10.8 `SystemStatusPanel.tsx`

*   **Zweck:** Zeigt eine Zusammenfassung des Systemzustands der ausgewählten KI an (Emotionen, Fitness, SubQG-Metriken).
*   **Funktionalität:** Nimmt die relevanten Zustandsvariablen der ausgewählten KI als Props. Enthält `HeartbeatDisplay` und `SubQGPulseIndicator`.

### 4.11 `services/aiService.ts`

*   **Zweck:** Kapselt die Logik für die Kommunikation mit den KI-APIs (Gemini und LM Studio).
*   **`callAiApi` Funktion:**
    *   Nimmt jetzt eine `speakerAIConfig` (spezifisch für den aktuellen Sprecher, M.Y.R.A. oder C.A.E.L.U.M.) und eine `speakerPersonaConfig` entgegen.
    *   Baut die Systeminstruktion und den Chatverlauf basierend auf der aktuellen KI und deren spezifischer Persona und Konfiguration auf.
    *   Leitet Anfragen entweder an die Gemini API oder an `callLmStudioApi`.
    *   Transformiert die Antwort in das `GeminiGenerateContentResponse`-Format.
*   **`callLmStudioApi` Funktion:** Spezifische Logik für Anfragen an eine LM Studio Instanz.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

*   **Zweck:** Klasse zur Berechnung der adaptiven Fitness.
*   **Funktionalität:** Nimmt die globale `MyraConfig` (die die Fitness-Gewichtungen enthält) und eine Funktion zum Abrufen des aktuellen Systemzustands entgegen. Wird in `useMyraState` zweimal instanziiert: einmal für M.Y.R.A.s Zustand und einmal für C.A.E.L.U.M.s Zustand, wobei beide Instanzen dieselben Gewichtungsregeln aus der `adaptiveFitnessConfig` anwenden.

#### 4.12.2 `db.ts`

*   **Zweck:** Kapselt die Interaktionen mit IndexedDB für das Speichern und Abrufen von Text-Chunks.

#### 4.12.3 `rng.ts`

*   **Zweck:** Definiert RNG-Typen und Implementierungen (`SubQGRNG` für deterministische, `QuantumRNG` für `Math.random()`-basierte Zufallszahlen).

---

## 5. Funktionale Tieftauche

### 5.1 Simulationszyklen (M.Y.R.A. & C.A.E.L.U.M.)

Die Anwendung führt zwei unabhängige, parallele Simulationsschleifen durch:

*   **`simulateNetworkStepMyra()`:** Wird in regelmäßigen Abständen aufgerufen (z.B. alle 2 Sekunden).
    1.  Erhöht `simulationStep`.
    2.  Ruft `simulateSubQgStepMyra()` auf, um M.Y.R.A.s SubQG-Energie- und Phasenmatrizen zu aktualisieren, globale Metriken zu berechnen und nach Jumps zu suchen.
    3.  Ruft `updateEmotionStateMyra()` auf, um M.Y.R.A.s Emotionen basierend auf Verfall und Zufallsfluktuationen anzupassen.
    4.  Ruft `updateNodeActivationsMyra()` auf, um M.Y.R.A.s Knotenzustände basierend auf Verfall, Zufallsfluktuationen und aktuellen Systemereignissen (z.B. SubQG-Jump-Modifikator) zu aktualisieren.
    5.  Ruft `calculateMyraStress()` auf, um M.Y.R.A.s Stresslevel zu berechnen.
    6.  Aktualisiert den `activeSubQgJumpModifier` und dessen verbleibende Dauer.
    7.  Wenn das `adaptiveFitnessUpdateInterval` erreicht ist, wird M.Y.R.A.s adaptive Fitness neu berechnet.

*   **`simulateNetworkStepCaelum()`:** Wird in regelmäßigen Abständen aufgerufen (z.B. alle 2.1 Sekunden, leicht versetzt zu M.Y.R.A.).
    1.  Erhöht `simulationStepCaelum`.
    2.  Ruft `simulateSubQgStepCaelum()` auf (analog zu M.Y.R.A., aber mit C.A.E.L.U.M.s Parametern und Zuständen).
    3.  Ruft `updateEmotionStateCaelum()` auf.
    4.  Ruft `updateNodeActivationsCaelum()` auf.
    5.  Ruft `calculateCaelumStress()` auf.
    6.  Aktualisiert `activeSubQgJumpModifierCaelum`.
    7.  Wenn das `caelumAdaptiveFitnessUpdateInterval` erreicht ist, wird C.A.E.L.U.M.s adaptive Fitness neu berechnet.

Diese Trennung gewährleistet, dass M.Y.R.A. und C.A.E.L.U.M. als eigenständige Entitäten mit eigenen internen Dynamiken operieren.

### 5.2 KI-Antwortgenerierung

Die Antwortgenerierung erfolgt über die `callAiApi` Funktion im `aiService.ts`.

*   **Direkter Chat (M.Y.R.A.):**
    *   Die `generateMyraResponse` Funktion in `useMyraState` wird aufgerufen.
    *   Die Systeminstruktion für M.Y.R.A. wird mit `getBaseSystemInstructionMyra()` erstellt, angereichert mit RAG-Chunks.
    *   Die Temperatur wird basierend auf M.Y.R.A.s `emotionState` und `Creativus`-Knoten angepasst.
    *   `callAiApi` wird mit M.Y.R.A.s spezifischer Persona (`myraPersonaConfig`) und KI-Provider-Konfiguration (`myraAIProviderConfig`) aufgerufen.
    *   Nach Erhalt der Antwort wird M.Y.R.A.s Simulationsschritt `simulateNetworkStepMyra()` einmal explizit ausgeführt, um ihren Zustand basierend auf der Interaktion zu aktualisieren.

*   **Dual AI Conversation (`startDualConversation`):**
    *   Diese Funktion in `useMyraState` orchestriert den Dialog.
    *   Iterativ wird für jede Runde:
        1.  **M.Y.R.A.s Zug:**
            *   Systeminstruktion mit `getBaseSystemInstructionMyra()`, angereichert mit RAG-Chunks basierend auf der vorherigen Nachricht (von C.A.E.L.U.M. oder initialer Prompt).
            *   Temperatur basierend auf M.Y.R.A.s Zustand.
            *   `callAiApi` mit M.Y.R.A.s Persona und KI-Config.
            *   Antwort wird dem `dualConversationHistory` hinzugefügt.
            *   `simulateNetworkStepMyra()` wird ausgeführt.
        2.  **C.A.E.L.U.M.s Zug:**
            *   Systeminstruktion mit `getBaseSystemInstructionCaelum()`, angereichert mit RAG-Chunks basierend auf M.Y.R.A.s vorheriger Nachricht.
            *   Temperatur basierend auf C.A.E.L.U.M.s Zustand.
            *   `callAiApi` mit C.A.E.L.U.M.s Persona (`caelumPersonaConfig`) und KI-Config (`caelumAIProviderConfig`).
            *   Antwort wird dem `dualConversationHistory` hinzugefügt.
            *   `simulateNetworkStepCaelum()` wird ausgeführt.

### 5.3 Wissensverarbeitung (`loadAndProcessFile`, RAG)

*   **Hochladen:** Der Benutzer lädt eine Textdatei hoch (`KnowledgePanel`).
*   **Verarbeitung (`loadAndProcessFile`):**
    *   Die Datei wird in Chunks zerlegt (`ragChunkSize`, `ragChunkOverlap`).
    *   Chunks werden in IndexedDB gespeichert (`addChunksToDB`).
*   **Abruf (`retrieveRelevantChunks`):**
    *   Vor der Antwortgenerierung (sowohl für M.Y.R.A. im direkten Chat als auch für beide KIs in der Dual-Konversation) wird der aktuelle Prompt/die vorherige Nachricht analysiert.
    *   Die relevantesten Chunks werden per Keyword-Suche geholt (bis `ragMaxChunksToRetrieve`).
*   **Nutzung:** Die abgerufenen Chunks werden der Systeminstruktion der jeweiligen KI hinzugefügt, um kontextreichere Antworten zu ermöglichen.

### 5.4 Konfigurationsmanagement

*   Die gesamte Konfiguration wird im `myraConfig`-Objekt gehalten (`useMyraState`).
*   Beim Start wird die Konfiguration aus `localStorage` geladen; falls nicht vorhanden, wird `INITIAL_CONFIG` verwendet. Ein Deep-Merge-Mechanismus stellt sicher, dass neue Felder aus `INITIAL_CONFIG` übernommen werden, während vorhandene Benutzereinstellungen erhalten bleiben.
*   Das `SettingsPanel` ermöglicht die Bearbeitung aller Felder in `MyraConfig`.
*   Beim Klick auf "Apply Settings" wird `updateMyraConfig` aufgerufen:
    *   Der `myraConfig`-Zustand wird aktualisiert.
    *   Die aktualisierte Konfiguration wird in `localStorage` gespeichert.
    *   Wenn sich `subqgSize` oder `caelumSubqgSize` ändern, werden die entsprechenden SubQG-Matrizen neu initialisiert.
    *   Die `AdaptiveFitnessManager`-Instanzen werden mit der neuen Konfiguration aktualisiert.

---

## 6. Detaillierte Konfigurationsparameter

Die detaillierte Beschreibung aller Konfigurationsparameter ist in separate Dateien im `docs/` Verzeichnis ausgelagert, um die Übersichtlichkeit zu wahren:

*   [**AI Provider Configuration (`myraAIProviderConfig`, `caelumAIProviderConfig`)**](./docs/config_ai_provider.md)
*   [**Persona & Behavior (M.Y.R.A. & C.A.E.L.U.M., globale Einstellungen)**](./docs/config_persona_behavior.md)
*   [**SubQG Simulation (M.Y.R.A. & C.A.E.L.U.M. Systeme)**](./docs/config_subqg_simulation.md)
*   [**Knowledge Base & RAG (Globale Einstellungen)**](./docs/config_knowledge_rag.md)
*   [**Adaptive Fitness (Geteilte Konfiguration, separate Anwendung)**](./docs/config_adaptive_fitness.md)

---

## 7. Einrichtung und Start

1.  **API Schlüssel:**
    *   Für die Nutzung der Gemini API: Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts.
    *   Fügen Sie Ihren Gemini API-Schlüssel hinzu: `GEMINI_API_KEY=DEIN_API_SCHLUESSEL_HIER`.
    *   Dieser Schlüssel wird von Vite automatisch in `process.env.API_KEY` für die Anwendung verfügbar gemacht.
    *   Für LM Studio ist kein API-Schlüssel erforderlich, aber LM Studio muss lokal laufen und konfiguriert sein.
2.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    # oder
    yarn install
    ```
3.  **Entwicklungsserver starten:**
    ```bash
    npm run dev
    # oder
    yarn dev
    ```
4.  Öffnen Sie die im Terminal angezeigte lokale Adresse (meist `http://localhost:5173` oder ähnlich, je nach Vite-Konfiguration) in Ihrem Browser.

