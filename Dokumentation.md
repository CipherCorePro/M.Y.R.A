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
    *   [3.7 Dual AI Conversation Panel](#37-dual-ai-conversation-panel)
    *   [3.8 Settings Panel](#38-settings-panel)
    *   [3.9 Chat Interface (M.Y.R.A.)](#39-chat-interface-myra)
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
        *   [`DualAiConversationPanel.tsx`](#4102-dualaiconversationpaneltsx)
        *   [`EmotionTimelinePanel.tsx`](#4103-emotiontimelinepaneltsx)
        *   [`IconComponents.tsx`](#4104-iconcomponentstsx)
        *   [`KnowledgePanel.tsx`](#4105-knowledgepaneltsx)
        *   [`NodePanel.tsx`](#4106-nodepaneltsx)
        *   [`SettingsPanel.tsx`](#4107-settingspaneltsx)
        *   [`SubQGDisplay.tsx`](#4108-subqgdisplaytsx)
        *   [`SystemStatusPanel.tsx`](#4109-systemstatuspaneltsx)
    *   [4.11 `services/aiService.ts`](#411-servicesaiservicets)
    *   [4.12 `utils/`](#412-utils)
        *   [`adaptiveFitnessManager.ts`](#4121-adaptivefitnessmanagerts)
        *   [`db.ts`](#4122-dbts)
        *   [`rng.ts`](#4123-rngts)
        *   [`uiHelpers.ts`](#4124-uihelpersts)
5.  [Funktionale Tieftauche](#5-funktionale-tieftauche)
    *   [5.1 Simulationszyklen (M.Y.R.A. & C.A.E.L.U.M.)](#51-simulationszyklen-myra--caelum)
    *   [5.2 KI-Antwortgenerierung](#52-ki-antwortgenerierung)
    *   [5.3 Wissensverarbeitung (RAG & Automatische Dokumentenladung)](#53-wissensverarbeitung-rag--automatische-dokumentenladung)
    *   [5.4 Konfigurationsmanagement](#54-konfigurationsmanagement)
    *   [5.5 Emotionsverlauf-Tracking](#55-emotionsverlauf-tracking)
6.  [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter)
7.  [Einrichtung und Start](#7-einrichtung-und-start)


---

## 1. Einleitung

Dieses Dokument beschreibt die M.Y.R.A. (Modular Yearning Reasoning Architecture) Web-Anwendung mit SubQG-Integration. Die Anwendung bietet eine interaktive Oberfläche zur Simulation und Interaktion mit zwei KI-Entitäten, **M.Y.R.A.** und **C.A.E.L.U.M.**, deren kognitiv-affektive Prozesse jeweils durch ein eigenes, unabhängiges simuliertes SubQuantenfeld-Grundfeld (SubQG) beeinflusst werden. Sie nutzt die Gemini API (oder eine lokale LM Studio Instanz) für intelligente Antworten und visualisiert interne Zustände wie SubQG-Metriken, Knotenzustände, Emotionen (inklusive eines Zeitverlaufs-Trackers) und adaptive Fitness für beide Systeme.

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
*   **Emotionsverlauf-Tracker (PAD-Timeline):** Ein UI-Panel, das den zeitlichen Verlauf der PAD-Werte für M.Y.R.A. und C.A.E.L.U.M. visualisiert.
*   **Adaptive Fitness:** Ein System zur Bewertung der "Gesundheit" und Leistung. Jede KI hat ihre eigene adaptive Fitness, die auf ihrem jeweiligen internen Zustand basiert.
*   **RAG (Retrieval Augmented Generation):** Ein Ansatz, bei dem vor der Antwortgenerierung relevante Informationen aus einer Wissensdatenbank abgerufen werden. Wird von M.Y.R.A. im direkten Chat und von beiden KIs in der Dual-AI-Konversation verwendet.
*   **Text Chunk:** Ein Textabschnitt aus einem externen Dokument, gespeichert in der Wissensdatenbank.
*   **SubQG Jump:** Eine signifikante, plötzliche Veränderung im jeweiligen SubQG einer KI.
*   **Phasenkohärenz (Phase Coherence):** Maß für die Synchronität der Phasen im SubQG.
*   **IndexedDB:** Clientseitige Datenbank zur Speicherung von Text-Chunks.
*   **LM Studio / Gemini API:** Externe KI-Dienste für Antwortgenerierung.
*   **RNG (Random Number Generator):** Wird für stochastische Prozesse in den Simulationen verwendet. Jede KI kann ihren eigenen RNG-Typ und Seed haben.
*   **Resizable Sidebar:** Die Seitenleiste auf Desktop-Ansichten kann in ihrer Breite manuell angepasst werden.

---

## 3. Benutzeroberfläche (UI) Guide

### 3.1 Hauptlayout

Die Benutzeroberfläche ist in drei Hauptbereiche unterteilt:

*   **Header:** Zeigt den Titel (z.B. `M.Y.R.A. System Interface` oder `C.A.E.L.U.M. System Interface` je nach aktivem Tab), den aktuellen Simulationsschritt (`Sim Step`) und die Gesamt-Fitness (`Fitness`) der aktuell im Fokus stehenden KI an. Auf mobilen Geräten enthält der Header einen Hamburger-Button zum Öffnen/Schließen der Seitenleiste.
*   **Linkes Panel (Aside):** Enthält Tabs zur Navigation. Die Breite dieses Panels ist auf Desktop-Ansichten manuell verstellbar.
    *   **Status (M):** Statusübersicht für M.Y.R.A.
    *   **Status (C):** Statusübersicht für C.A.E.L.U.M.
    *   **Nodes (M):** Knotenvisualisierung für M.Y.R.A.
    *   **Nodes (C):** Knotenvisualisierung für C.A.E.L.U.M.
    *   **SubQG (M):** SubQG-Visualisierung und Interaktion für M.Y.R.A.
    *   **SubQG (C):** SubQG-Visualisierung und Interaktion für C.A.E.L.U.M.
    *   **Emotion Timeline:** Zeigt den zeitlichen Verlauf der PAD-Werte (Pleasure, Arousal, Dominance) für M.Y.R.A. und C.A.E.L.U.M. an.
    *   **Knowledge:** Verwaltung der Wissensbasis.
    *   **Dual AI:** Start und Anzeige von Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M.
    *   **Settings:** Globale und KI-spezifische Konfigurationseinstellungen.
*   **Rechtes Panel (Main):** Zeigt das Chat Interface für die direkte Interaktion mit M.Y.R.A.

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "Status (M)" und "Status (C)" Tabs. Dieses Panel gibt einen Überblick über die wichtigsten internen Zustände der jeweiligen KI (M.Y.R.A. oder C.A.E.L.U.M.).

*   **Emotion State & Vitals:**
    *   **Heartbeat Display:** Visualisiert eine "Herzfrequenz" basierend auf dem Stresslevel der ausgewählten KI.
    *   Pleasure, Arousal, Dominance (PAD-Werte).
    *   Dominant Affect: Der vorherrschende spezifische Affekt (z.B. Freude, Angst).
*   **Adaptive Fitness:**
    *   Overall Score: Der Gesamtfitnesswert.
    *   Dimension Scores: Aufschlüsselung der Fitness in die Dimensionen Knowledge Expansion, Internal Coherence, Expressive Creativity und Goal Focus.
*   **SubQG Metrics:**
    *   **SubQG Pulse Indicator:** Visualisiert signifikante SubQG-Events (Jumps).
    *   Avg. Energy: Durchschnittliche Energie im SubQG.
    *   Std. Energy: Standardabweichung der Energie im SubQG.
    *   Phase Coherence: Maß für die Synchronität der Phasen im SubQG.
    *   Jump Modifier Active: Zeigt an, ob ein SubQG-Jump-Modifikator aktiv ist und wie lange noch.

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "Nodes (M)" und "Nodes (C)" Tabs. Visualisiert die internen Knoten der jeweiligen KI.

*   **Modulator Nodes:** Zeigt spezielle Knoten wie Limbus Affektus, Creativus/Pattern Analyzer, Cortex Criticus/Logic Verifier, MetaCognitio/System Monitor und andere Verhaltensmodulatoren der ausgewählten KI.
*   **Semantic Nodes (Sample):** Zeigt eine Auswahl der semantischen Knoten (Konzepte) der ausgewählten KI.
*   **Node Card Details:** Jede Knotenkarte zeigt:
    *   Knotenlabel und Typ-Icon.
    *   Aktivierung (Act): Aktueller Aktivierungswert (0-1).
    *   Visuelle Aktivierungsleiste.
    *   Resonator Score (Res), Focus Score (Foc), Exploration Score (Exp).
    *   Spezifische Zustandsinformationen (z.B. PAD für Limbus, Jump Count für MetaCognitio).

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Zugänglich über die "SubQG (M)" und "SubQG (C)" Tabs. Visualisiert das SubQG der jeweiligen KI und erlaubt Interaktionen.

*   **Matrix-Visualisierung:** Ein Gitter repräsentiert das SubQG. Jede Zelle zeigt farblich ihre Energie und Phase. Ein Tooltip beim Überfahren zeigt genaue Werte.
*   **Interaktionsmöglichkeiten:**
    *   **Inject Energy:** Wert für die Energie, die bei Klick auf eine Zelle injiziert wird.
    *   **Set Phase (Opt.):** Optionaler Phasenwert (0 bis ~6.28 Radiant), der bei Klick gesetzt wird.
    *   Klick auf eine Zelle injiziert die definierte Energie und optional die Phase.
*   **SubQG Jump Info:** Zeigt Details zu kürzlich detektierten Jumps im SubQG der ausgewählten KI (Typ, Peak-Werte).

### 3.5 Emotion Timeline Panel

Zugänglich über den "Emotion Timeline"-Tab.

*   **Agentenauswahl:** Buttons, um zwischen der Anzeige von M.Y.R.A.s und C.A.E.L.U.M.s Emotionsverlauf zu wechseln.
*   **PAD-Zeitverlaufsdiagramm:** Ein Liniendiagramm zeigt die Entwicklung von Pleasure, Arousal und Dominance über die Zeit für die ausgewählte KI an. Die X-Achse ist die Zeit, die Y-Achse der Wert (-1 bis 1). Tooltips zeigen genaue Werte und den dominanten Affekt zum Zeitpunkt.
*   **Interpretation des aktuellen Zustands:** Eine textuelle Interpretation des aktuellsten PAD-Zustands der ausgewählten KI.

### 3.6 Knowledge Panel

Zugänglich über den "Knowledge"-Tab. Hier kann die Wissensbasis durch externe Dokumente erweitert werden. Die Funktionalität ist global und wird von beiden KIs genutzt.

*   **Upload Text File (.txt, .md):** Button und Dateiauswahl zum Hochladen von Text- oder Markdown-Dateien.
*   **Load & Process File Button:** Verarbeitet die ausgewählte Datei und fügt sie der Wissensdatenbank hinzu.
*   **Loaded Sources:** Liste der hochgeladenen Quelldateien mit der Anzahl der daraus generierten Chunks.
*   **Clear All Button:** Löscht die gesamte Wissensdatenbank.
*   **Automatische Ladung:** Beim Start der Anwendung werden `Dokumentation.md` und alle `.md`-Dateien aus dem `docs`-Verzeichnis automatisch geladen.

### 3.7 Dual AI Conversation Panel

Zugänglich über den "Dual AI"-Tab. Ermöglicht es, eine Konversation zwischen M.Y.R.A. und C.A.E.L.U.M. zu initiieren und zu beobachten.

*   **Initial Prompt:** Ein Textfeld, um das Startthema für die Konversation festzulegen.
*   **Conversation Rounds:** Eine Zahleneingabe, um festzulegen, wie viele Antwortrunden die KIs austauschen sollen (1 Runde = jede KI antwortet einmal).
*   **Start Dual Conversation Button:** Startet den Dialog. M.Y.R.A. beginnt in der Regel.
*   **Nachrichtenanzeige:** Zeigt den Gesprächsverlauf. Nachrichten vom Benutzer, M.Y.R.A. und C.A.E.L.U.M. werden unterschiedlich dargestellt. Jede Nachricht enthält den Sprechernamen, den Inhalt und einen Zeitstempel.

### 3.8 Settings Panel

Zugänglich über den "Settings"-Tab. Ermöglicht die detaillierte Konfiguration. Ist in Gruppen unterteilt, die über eine seitliche Navigation ausgewählt werden können.

*   **Localization:** Sprache und UI-Thema.
*   **M.Y.R.A. AI Provider:** KI-Provider, Modell, URL, Temperatur für M.Y.R.A.
*   **C.A.E.L.U.M. AI Provider:** KI-Provider, Modell, URL, Temperatur für C.A.E.L.U.M.
*   **M.Y.R.A. Persona:** Name, Rollenbeschreibung etc. für M.Y.R.A. (bearbeitet die direkt übersetzten/angepassten Werte).
*   **C.A.E.L.U.M. Persona:** Name, Rollenbeschreibung etc. für C.A.E.L.U.M.
*   **M.Y.R.A. System:** SubQG-Parameter, RNG, Zerfallsraten, Fitness-Intervall für M.Y.R.A.
*   **C.A.E.L.U.M. System:** SubQG-Parameter, RNG, Zerfallsraten, Fitness-Intervall für C.A.E.L.U.M.
*   **General System:** Globale Einstellungen wie Chat-History-Länge für LLM-Prompts, RAG-Chunk-Parameter, maximale Länge des Emotionsverlaufs.
*   **Adaptive Fitness - Base Weights:** Gewichtung der Basismetriken für die Fitnessberechnung (gilt für beide KIs, aber auf ihre jeweiligen Zustände angewendet).
*   **Adaptive Fitness - Dimension Contributions:** Gewichtung, wie Basismetriken zu Fitness-Dimensionen beitragen (gilt für beide KIs).
*   **Apply Settings Button:** Speichert alle Änderungen und wendet sie an.
*   **Reset Group / Reset All Buttons:** Ermöglichen das Zurücksetzen von Konfigurationsgruppen oder aller Einstellungen auf Standardwerte.

### 3.9 Chat Interface (M.Y.R.A.)

Der Hauptbereich auf der rechten Seite bleibt das primäre Chat-Interface für direkte Konversationen mit M.Y.R.A.

*   **Nachrichtenanzeige:** Zeigt den Gesprächsverlauf zwischen dem Benutzer und M.Y.R.A.
*   **Eingabefeld:** Textfeld zum Eingeben von Nachrichten an M.Y.R.A.
*   **Senden-Button:** Schickt die eingegebene Nachricht ab.

---

## 4. Technische Architektur & Code Dokumentation

### 4.1 Projektstruktur

(Struktur bleibt wie zuvor beschrieben)

### 4.2 `index.html`

Enthält das Grundgerüst der HTML-Seite. Bindet Tailwind CSS, Heroicons und die JavaScript-Module ein. Definiert eine `importmap` für externe Bibliotheken wie React, ReactDOM, `@google/genai`, `uuid`, `chart.js` und `react-chartjs-2`. Setzt initiales Theme und Sprache aus `localStorage`.

### 4.3 `metadata.json`

(Beschreibung bleibt wie zuvor)

### 4.4 `vite.config.ts`

Konfiguriert Vite. Definiert Aliase (z.B. `@` für den Projekt-Root), setzt Umgebungsvariablen (wie `GEMINI_API_KEY` aus `.env`) und konfiguriert den Entwicklungsserver so, dass er im Netzwerk erreichbar ist (`server: { host: true }`).

### 4.5 `index.tsx`

Einstiegspunkt der React-Anwendung. Rendert die `App`-Komponente in das `div#root`-Element in `index.html`.

### 4.6 `App.tsx`

*   **Zweck:** Die Hauptkomponente der React-Anwendung. Verwaltet den aktiven Tab, die Sichtbarkeit der mobilen Seitenleiste, die Breite der Desktop-Seitenleiste und rendert die entsprechenden UI-Panels.
*   **Logik:**
    *   Verwendet den `useMyraState` Hook, um Zugriff auf den gesamten Anwendungszustand (M.Y.R.A. und C.A.E.L.U.M.) und die Update-Funktionen zu erhalten.
    *   Verwaltet den `activeTab` Zustand, um zu bestimmen, welche Ansicht angezeigt wird.
    *   Implementiert die Logik für die mobile Overlay-Seitenleiste (Öffnen/Schließen, Klick außerhalb).
    *   Implementiert die Logik für die **verstellbare Desktop-Seitenleiste** (Drag-to-Resize), speichert die Breite im `localStorage`.
    *   Rendert die Seitenleiste mit Navigations-Tabs für M.Y.R.A.-spezifische Ansichten (Status (M), Nodes (M), SubQG (M)), C.A.E.L.U.M.-spezifische Ansichten (Status (C), Nodes (C), SubQG (C)) und globale Ansichten (Emotion Timeline, Knowledge, Dual AI, Settings).
    *   Rendert bedingt die Panels basierend auf dem `activeTab` und übergibt die entsprechenden Zustandsdaten und Callbacks.
    *   Der Header zeigt Informationen (Simulationsschritt, Fitness) der KI an, die dem aktiven Tab entspricht, oder einen generischen Titel für globale Tabs.
    *   Das rechte Hauptpanel ist dem `ChatInterface` für die direkte Interaktion mit M.Y.R.A. gewidmet.

### 4.7 `constants.ts`

*   **Zweck:** Definiert globale Konstanten und initiale Zustände.
*   **Inhalt:**
    *   `INITIAL_CONFIG`: Enthält die Standardkonfiguration für `MyraConfig`, einschließlich aller Parameter für M.Y.R.A. und C.A.E.L.U.M. (Persona, KI-Provider, SubQG-Systeme, adaptive Fitness, Emotionsverlauf-Länge etc.).
    *   `INITIAL_EMOTION_STATE`, `INITIAL_NODE_STATES`, `INITIAL_ADAPTIVE_FITNESS_STATE`, `INITIAL_SUBQG_GLOBAL_METRICS`: Standardwerte für M.Y.R.A.s Kernzustände.
    *   `INITIAL_CAELUM_EMOTION_STATE`, `INITIAL_CAELUM_NODE_STATES`, `INITIAL_CAELUM_ADAPTIVE_FITNESS_STATE`, `INITIAL_CAELUM_SUBQG_GLOBAL_METRICS`: Standardwerte für C.A.E.L.U.M.s Kernzustände.

### 4.8 `types.ts`

*   **Zweck:** Definiert alle wichtigen TypeScript-Typen und Interfaces für die Anwendung.
*   **Wichtige Typen:**
    *   `MyraConfig`: Umfassende Konfiguration, die separate Sektionen für M.Y.R.A.s und C.A.E.L.U.M.s Systemparameter, Persona-Einstellungen und KI-Provider-Konfigurationen enthält. Enthält auch `maxPadHistorySize`.
    *   `ChatMessage`, `EmotionState`, `NodeState`, `AdaptiveFitnessState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`: Kernzustandstypen.
    *   `PADRecord`: Typ für Einträge im Emotionsverlauf (Pleasure, Arousal, Dominance, Timestamp, DominantAffect).
    *   `ConfigField` und seine Subtypen: Für die dynamische Erstellung des SettingsPanel, erweitert um `CaelumPersonaEditableField`, `CaelumSystemConfigField`, `GeneralSystemConfigField`.

### 4.9 `hooks/useMyraState.ts`

*   **Zweck:** Der zentrale Hook für das State Management und die Kernlogik der Anwendung.
*   **Kernfunktionen:**
    *   **Zustandsverwaltung:** Verwaltet den Zustand für M.Y.R.A. und C.A.E.L.U.M. parallel. Dies beinhaltet:
        *   Emotionen (`emotionState`, `emotionStateCaelum`) und deren Verläufe (`padHistoryMyra`, `padHistoryCaelum`).
        *   Knotenzustände (`nodeStates`, `nodeStatesCaelum`)
        *   Adaptive Fitness (`adaptiveFitness`, `adaptiveFitnessCaelum`)
        *   SubQG Matrizen & Metriken (`subQgMatrix`, `subQgMatrixCaelum`, etc.)
        *   RNG Instanzen (`rngRef`, `rngRefCaelum`)
        *   Simulationsschritte (`simulationStep`, `simulationStepCaelum`)
        *   Stresslevel (`myraStressLevel`, `caelumStressLevel`)
    *   **Konfigurationsmanagement (`myraConfig`, `updateMyraConfig`):** Lädt/speichert Konfiguration, passt SubQG-Matrizen und RNGs bei Änderungen an. Sanitärisiert `maxPadHistorySize` beim Laden.
    *   **Simulationsschleifen:**
        *   `simulateNetworkStepMyra`: Führt einen Simulationsschritt für M.Y.R.A. durch. Fügt nach der Emotionsaktualisierung einen Eintrag zu `padHistoryMyra` hinzu.
        *   `simulateNetworkStepCaelum`: Führt einen parallelen, unabhängigen Simulationsschritt für C.A.E.L.U.M. durch. Fügt nach der Emotionsaktualisierung einen Eintrag zu `padHistoryCaelum` hinzu.
    *   **KI-Interaktion:**
        *   `generateMyraResponse`: Generiert eine Antwort von M.Y.R.A. im Hauptchat.
        *   `startDualConversation`: Initiiert und verwaltet eine Konversation zwischen M.Y.R.A. und C.A.E.L.U.M.
    *   **Systeminstruktionen:**
        *   `getMyraBaseSystemInstruction`, `getCaelumBaseSystemInstruction`: Erstellen die Systeminstruktionen basierend auf dem jeweiligen aktuellen Zustand.
    *   **Wissensbasis (RAG):**
        *   `loadDocumentationKnowledge`: Lädt beim Start automatisch `Dokumentation.md` und Dateien aus `docs/`.
        *   `loadAndProcessFile`, `clearAllKnowledge`, `retrieveRelevantChunks`.
    *   **SubQG-Interaktion:** `injectSubQgStimulus` (für M.Y.R.A.) und `injectSubQgStimulusCaelum` (für C.A.E.L.U.M.).
    *   **Adaptive Fitness:** Initialisiert und verwendet zwei `AdaptiveFitnessManager`-Instanzen.
    *   **Internationalisierung (`t` Funktion):** Stellt Übersetzungen bereit.

### 4.10 `components/`

#### 4.10.1 `ChatInterface.tsx`

(Beschreibung bleibt wie zuvor)

#### 4.10.2 `DualAiConversationPanel.tsx`

(Beschreibung bleibt wie zuvor, verwendet jetzt spezifische Icons für M.Y.R.A. und C.A.E.L.U.M.)

#### 4.10.3 `EmotionTimelinePanel.tsx`

*   **Zweck:** Zeigt den zeitlichen Verlauf der PAD-Werte (Pleasure, Arousal, Dominance) für M.Y.R.A. und C.A.E.L.U.M. an.
*   **Funktionalität:**
    *   Verwendet `react-chartjs-2` und `chart.js` zur Darstellung von Liniendiagrammen.
    *   Buttons zur Auswahl der anzuzeigenden KI (M.Y.R.A. oder C.A.E.L.U.M.).
    *   Zeigt das Diagramm und eine textuelle Interpretation des aktuellsten PAD-Zustands der ausgewählten KI mithilfe von `interpretPAD` aus `uiHelpers.ts`.

#### 4.10.4 `IconComponents.tsx`

*   **Zweck:** Enthält Definitionen für verschiedene SVG-Icons. Enthält jetzt auch `PresentationChartLineIcon` und `EllipsisVerticalIcon`.

#### 4.10.5 `KnowledgePanel.tsx`

(Beschreibung bleibt wie zuvor, erwähnt die automatische Ladung von Dokumentationsdateien.)

#### 4.10.6 `NodePanel.tsx`

(Beschreibung bleibt wie zuvor)

#### 4.10.7 `SettingsPanel.tsx`

*   **Zweck:** UI zur Konfiguration aller Parameter in `MyraConfig`.
*   **Funktionalität:** Stellt Eingabefelder für alle konfigurierbaren Werte bereit, gruppiert nach Funktionalität. Nutzt eine seitliche Navigation für die Gruppen. Die Gruppen umfassen jetzt spezifische Bereiche für M.Y.R.A. und C.A.E.L.U.M. (System, KI-Provider, Persona) sowie globale Bereiche.

#### 4.10.8 `SubQGDisplay.tsx`

(Beschreibung bleibt wie zuvor)

#### 4.10.9 `SystemStatusPanel.tsx`

(Beschreibung bleibt wie zuvor)

### 4.11 `services/aiService.ts`

*   **Zweck:** Kapselt die Logik für die Kommunikation mit den KI-APIs.
*   **`callAiApi` Funktion:** Nimmt jetzt eine `speakerAIConfig` und eine `speakerPersonaConfig` entgegen, um spezifisch für M.Y.R.A. oder C.A.E.L.U.M. agieren zu können.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

*   **Zweck:** Klasse zur Berechnung der adaptiven Fitness.
*   **Funktionalität:** Wird in `useMyraState` zweimal instanziiert: einmal für M.Y.R.A. und einmal für C.A.E.L.U.M., wobei beide Instanzen dieselben Gewichtungsregeln aus der `adaptiveFitnessConfig` anwenden, aber auf die jeweiligen, unterschiedlichen Systemzustände der KIs.

#### 4.12.2 `db.ts`

*   **Zweck:** Kapselt die Interaktionen mit IndexedDB. Enthält jetzt einen Index auf `source` im `textChunks` Store und die Funktion `clearChunksBySourceFromDB`.

#### 4.12.3 `rng.ts`

(Beschreibung bleibt wie zuvor)

#### 4.12.4 `uiHelpers.ts`

*   **Zweck:** Enthält Hilfsfunktionen für die UI.
*   **Funktionen:**
    *   `getDominantAffect`: Ermittelt den vorherrschenden benannten Affekt basierend auf dem `EmotionState`.
    *   `interpretPAD`: Liefert eine textuelle Interpretation eines PAD-Zustands für die Emotions-Timeline.

---

## 5. Funktionale Tieftauche

### 5.1 Simulationszyklen (M.Y.R.A. & C.A.E.L.U.M.)

Die Anwendung führt zwei unabhängige, parallele Simulationsschleifen durch:

*   **`simulateNetworkStepMyra()`:** Wird in regelmäßigen Abständen aufgerufen. Aktualisiert M.Y.R.A.s SubQG, Emotionen (inkl. Eintrag in `padHistoryMyra`), Knoten, Stress und Fitness.
*   **`simulateNetworkStepCaelum()`:** Wird ebenfalls in regelmäßigen Abständen aufgerufen. Aktualisiert C.A.E.L.U.M.s SubQG, Emotionen (inkl. Eintrag in `padHistoryCaelum`), Knoten, Stress und Fitness.

Diese Trennung gewährleistet, dass M.Y.R.A. und C.A.E.L.U.M. als eigenständige Entitäten operieren.

### 5.2 KI-Antwortgenerierung

*   **Direkter Chat (M.Y.R.A.):** `generateMyraResponse` in `useMyraState` ruft `callAiApi` mit M.Y.R.A.s spezifischer Konfiguration und Zustand auf.
*   **Dual AI Conversation (`startDualConversation`):** Orchestriert den Dialog, indem iterativ `callAiApi` für M.Y.R.A. und dann für C.A.E.L.U.M. aufgerufen wird, jeweils mit deren spezifischen Konfigurationen und aktuellen Systemzuständen als Kontext. Beide nutzen RAG.

### 5.3 Wissensverarbeitung (RAG & Automatische Dokumentenladung)

*   **Automatische Ladung:** Beim Start der Anwendung lädt `loadDocumentationKnowledge` in `useMyraState` den Inhalt von `Dokumentation.md` und allen `.md`-Dateien im `public/docs`-Verzeichnis, zerlegt sie in Chunks und speichert sie in IndexedDB. Bereits vorhandene Chunks aus diesen Quellen werden zuvor gelöscht, um Aktualisierungen zu ermöglichen.
*   **Manuelles Hochladen:** Über das `KnowledgePanel`.
*   **Verarbeitung & Abruf:** Wie zuvor beschrieben, jetzt aber potenziell für beide KIs.

### 5.4 Konfigurationsmanagement

(Beschreibung bleibt im Wesentlichen wie zuvor, aber die Konfiguration in `MyraConfig` ist jetzt umfangreicher und enthält separate Sektionen für M.Y.R.A. und C.A.E.L.U.M.)

### 5.5 Emotionsverlauf-Tracking

*   In `useMyraState.ts` werden die PAD-Werte (Pleasure, Arousal, Dominance) zusammen mit einem Zeitstempel und dem dominanten Affekt nach jedem Simulationsschritt für M.Y.R.A. (`padHistoryMyra`) und C.A.E.L.U.M. (`padHistoryCaelum`) in Arrays gespeichert.
*   Die Länge dieser Arrays ist durch `myraConfig.maxPadHistorySize` begrenzt.
*   Das `EmotionTimelinePanel.tsx` visualisiert diese Daten mithilfe von `react-chartjs-2`.

---

## 6. Detaillierte Konfigurationsparameter

Die detaillierte Beschreibung aller Konfigurationsparameter ist in separate Dateien im `docs/` Verzeichnis ausgelagert:

*   [**AI Provider Configuration**](./docs/config_ai_provider.md) (beinhaltet jetzt M.Y.R.A. & C.A.E.L.U.M.)
*   [**Persona & Behavior**](./docs/config_persona_behavior.md) (beinhaltet jetzt M.Y.R.A. & C.A.E.L.U.M.)
*   [**SubQG Simulation**](./docs/config_subqg_simulation.md) (beinhaltet jetzt M.Y.R.A. & C.A.E.L.U.M.)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag.md) (erwähnt globale Natur und automatische Ladung)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness.md) (erklärt geteilte Config, separate Anwendung)

---

## 7. Einrichtung und Start

(Beschreibung bleibt wie zuvor)
Legen Sie Ihre Dokumentationsdateien (`Dokumentation.md` und andere `.md`-Dateien im Ordner `docs/`) in das `public`-Verzeichnis Ihres Projekts, damit sie beim Start automatisch geladen werden können.
Beispielpfade: `public/Dokumentation.md`, `public/docs/config_adaptive_fitness.md`.
```

## Projektstruktur

*   **`public/`**
    *   `Dokumentation.md` (Diese Datei)
    *   `docs/`
        *   `config_adaptive_fitness.md`
        *   `config_ai_provider.md`
        *   `config_knowledge_rag.md`
        *   `config_persona_behavior.md`
        *   `config_subqg_simulation.md`
    *   `styles/index.css`
*   **`src/` (oder Projekt-Root für `.ts`, `.tsx` Dateien in dieser Struktur)**
    *   `App.tsx`
    *   `index.html`
    *   `index.tsx`
    *   `constants.ts`
    *   `types.ts`
    *   `vite.config.ts`
    *   `metadata.json`
    *   `components/`
        *   `ChatInterface.tsx`
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
    *   ... (andere Konfigurationsdateien wie `tsconfig.json`, `package.json` etc.)

---
