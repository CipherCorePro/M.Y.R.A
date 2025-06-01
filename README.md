
# M.Y.R.A. SubQG Integration - Dokumentation
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Inhaltsverzeichnis

1.  [Einleitung](#1-einleitung)
2.  [Core Konzepte & Glossar](#2-core-konzepte--glossar)
3.  [Benutzeroberfläche (UI) Guide](#3-benutzeroberfläche-ui-guide)
    *   [3.1 Hauptlayout](#31-hauptlayout)
    *   [3.2 Status Panel](#32-status-panel)
    *   [3.3 Nodes Panel](#33-nodes-panel)
    *   [3.4 SubQG Panel](#34-subqg-panel)
    *   [3.5 Knowledge Panel](#35-knowledge-panel)
    *   [3.6 Settings Panel](#36-settings-panel)
    *   [3.7 Chat Interface](#37-chat-interface)
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
        *   [`IconComponents.tsx`](#4102-iconcomponentstsx)
        *   [`KnowledgePanel.tsx`](#4103-knowledgepaneltsx)
        *   [`NodePanel.tsx`](#4104-nodepaneltsx)
        *   [`SettingsPanel.tsx`](#4105-settingspaneltsx)
        *   [`SubQGDisplay.tsx`](#4106-subqgdisplaytsx)
        *   [`SystemStatusPanel.tsx`](#4107-systemstatuspaneltsx)
    *   [4.11 `services/aiService.ts`](#411-servicesaiservicets)
    *   [4.12 `utils/`](#412-utils)
        *   [`adaptiveFitnessManager.ts`](#4121-adaptivefitnessmanagerts)
        *   [`db.ts`](#4122-dbts)
        *   [`rng.ts`](#4123-rngts)
5.  [Funktionale Tieftauche](#5-funktionale-tieftauche)
    *   [5.1 Simulationszyklus (`simulateNetworkStep`)](#51-simulationszyklus-simulatenetworkstep)
    *   [5.2 KI-Antwortgenerierung (`generateMyraResponse`)](#52-ki-antwortgenerierung-generatemyraresponse)
    *   [5.3 Wissensverarbeitung (`loadAndProcessFile`, RAG)](#53-wissensverarbeitung-loadandprocessfile-rag)
    *   [5.4 Konfigurationsmanagement](#54-konfigurationsmanagement)
6.  [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter)
7.  [Einrichtung und Start](#7-einrichtung-und-start)


---

## 1. Einleitung

Dieses Dokument beschreibt die M.Y.R.A. (Modular Yearning Reasoning Architecture) Web-Anwendung mit SubQG-Integration. Die Anwendung bietet eine interaktive Oberfläche zur Simulation und Interaktion mit einer KI, deren kognitiv-affektive Prozesse durch ein simuliertes SubQuantenfeld-Grundfeld (SubQG) beeinflusst werden. Sie nutzt die Gemini API (oder eine lokale LM Studio Instanz) für intelligente Antworten und visualisiert interne Zustände wie SubQG-Metriken, Knotenzustände, Emotionen und adaptive Fitness.

Die Kernidee ist es, eine KI zu schaffen, deren Verhalten nicht nur auf trainierten Daten basiert, sondern auch durch dynamische, emergente interne Zustände geprägt wird, die von einem komplexen Subsystem (SubQG) beeinflusst werden. Dieses Dokument dient als Leitfaden für Benutzer und Entwickler.

---

## 2. Core Konzepte & Glossar

*   **M.Y.R.A. (Modular Yearning Reasoning Architecture):** Der Name der KI und des Projekts. Ziel ist eine modulare Architektur, die rudimentäre Formen von "Sehnsucht" (Yearning) und logischem Schlussfolgern (Reasoning) simuliert.
*   **SubQG (SubQuantenfeld-Grundfeld):** Ein simuliertes Feld, das als Basis für emergente Dynamiken dient. Es besteht aus einer Matrix von Energiewerten und Phasen, die sich über Zeit entwickeln und miteinander interagieren. "SubQG Jumps" sind signifikante Fluktuationen in diesem Feld, die M.Y.R.A.s Zustand beeinflussen können.
*   **Knoten (Nodes):** Repräsentationen von Konzepten, Emotionen oder kognitiven Funktionen innerhalb von M.Y.R.A.
    *   **Semantische Knoten:** Repräsentieren spezifische Konzepte (z.B. "Kunst", "Ethik").
    *   **Limbus Affektus:** Ein spezieller Knoten, der den emotionalen Gesamtzustand von M.Y.R.A. modelliert.
    *   **Creativus:** Beeinflusst die Kreativität und Neuartigkeit in M.Y.R.A.s Verhalten.
    *   **Cortex Criticus:** Steuert kritische Bewertung und Stabilität.
    *   **MetaCognitio:** Überwacht den Gesamtzustand des Netzwerks und erkennt systemweite Ereignisse wie SubQG Jumps.
    *   **Verhaltensmodulatoren (Social, Valuation, Conflict, Executive):** Knoten, die soziale Kognition, Bewertung, Konfliktüberwachung und exekutive Kontrolle simulieren.
*   **Emotion State (PAD-Modell & spezifische Emotionen):** Der emotionale Zustand wird durch Pleasure (Vergnügen), Arousal (Erregung) und Dominance (Dominanz) sowie spezifischere Emotionen wie Anger (Wut), Disgust (Ekel), Fear (Angst) und Greed (Gier) repräsentiert.
*   **Adaptive Fitness:** Ein System zur Bewertung der "Gesundheit" und Leistung von M.Y.R.A. Es umfasst einen Gesamt-Score und verschiedene Dimensionen (Knowledge Expansion, Internal Coherence, Expressive Creativity, Goal Focus). Diese Werte sollen (zukünftig) M.Y.R.A.s Lernprozesse und Parameter adaptiv beeinflussen.
*   **RAG (Retrieval Augmented Generation):** Ein Ansatz, bei dem die KI vor der Antwortgenerierung relevante Informationen aus einer Wissensdatenbank (hier: geladene Text-Chunks) abruft und diese zur Anreicherung ihrer Antwort nutzt.
*   **Text Chunk:** Ein Textabschnitt, der aus einem externen Dokument extrahiert und in der Wissensdatenbank gespeichert wird.
*   **Resonator Score:** Ein (aktuell vereinfachter) Wert für jeden Knoten, der seine "Resonanz" oder Aktivität im Quantenkontext repräsentiert.
*   **Focus Score / Exploration Score:** Metriken (aktuell vereinfacht) auf Knotenebene, die angeben, wie stark ein Knoten im Fokus steht oder zur Exploration beiträgt.
*   **SubQG Jump:** Eine signifikante, plötzliche Veränderung im SubQG, die durch hohe Energie- und Kohärenzspitzen gefolgt von einem Abfall charakterisiert ist. Diese Jumps können M.Y.R.A.s interne Zustände und Verhalten beeinflussen.
*   **Phasenkohärenz (Phase Coherence):** Ein Maß dafür, wie synchron die Phasen der einzelnen Zellen im SubQG sind. Hohe Kohärenz kann auf geordnete Zustände oder Resonanzen hinweisen.
*   **IndexedDB:** Eine clientseitige Datenbank im Browser, die verwendet wird, um Text-Chunks persistent zu speichern.
*   **LM Studio:** Eine Software, die es ermöglicht, Large Language Models (LLMs) lokal auf dem eigenen Computer auszuführen.
*   **Gemini API:** Ein von Google bereitgestellter Dienst für den Zugriff auf fortschrittliche KI-Modelle.
*   **RNG (Random Number Generator):** Wird für verschiedene stochastische Prozesse in der Simulation verwendet, insbesondere im SubQG. Es gibt eine deterministische (SubQG) und eine nicht-deterministische (Quantum) Variante.

---

## 3. Benutzeroberfläche (UI) Guide

### 3.1 Hauptlayout

Die Benutzeroberfläche ist in drei Hauptbereiche unterteilt:

*   **Header:** Zeigt den Titel "M.Y.R.A Interface", den aktuellen Simulationsschritt (`Sim Step`) und die Gesamt-Fitness (`Fitness`) von M.Y.R.A. an.
*   **Linkes Panel (Aside):** Enthält Tabs zur Navigation zwischen verschiedenen Ansichten und Kontrollmöglichkeiten:
    *   Status
    *   Nodes
    *   SubQG
    *   Knowledge
    *   Settings
*   **Rechtes Panel (Main):** Zeigt das Chat Interface für die Interaktion mit M.Y.R.A.

### 3.2 Status Panel

Zugänglich über den "Status"-Tab. Dieses Panel gibt einen Überblick über die wichtigsten internen Zustände von M.Y.R.A.

*   **Emotion State:**
    *   **Pleasure:** Das aktuelle Vergnügungsniveau (-1 bis 1).
    *   **Arousal:** Das aktuelle Erregungsniveau (-1 bis 1).
    *   **Dominance:** Das aktuelle Dominanzniveau (-1 bis 1).
    *   **Dominant Affect:** Die stärkste der spezifischen negativen/positiven Emotionen (z.B. Anger, Fear) und ihr Wert.
*   **Adaptive Fitness:**
    *   **Overall Score:** Der Gesamtfitnesswert von M.Y.R.A. (0 bis 1).
    *   **Knowledge Expansion:** Fitness-Dimension, die Lernfähigkeit und Exploration bewertet.
    *   **Internal Coherence:** Fitness-Dimension, die innere Stimmigkeit und Stabilität bewertet.
    *   **Expressive Creativity:** Fitness-Dimension, die Kreativität und Neuartigkeit im Ausdruck bewertet.
    *   **Goal Focus:** Fitness-Dimension, die Zielorientierung bewertet.
*   **SubQG Metrics:**
    *   **Avg. Energy:** Durchschnittliche Energie im SubQG-Feld.
    *   **Std. Energy:** Standardabweichung der Energie im SubQG-Feld.
    *   **Phase Coherence:** Maß für die Synchronität der Phasen im SubQG-Feld.
    *   **Jump Modifier Active:** Zeigt an, ob ein SubQG-Jump kürzlich einen Modifikator aktiviert hat, dessen Wert und die verbleibenden Schritte seiner Aktivität.

### 3.3 Nodes Panel

Zugänglich über den "Nodes"-Tab. Dieses Panel visualisiert die verschiedenen internen Knoten von M.Y.R.A.

*   **Modulator Nodes:** Zeigt spezielle Knoten an, die globale Aspekte von M.Y.R.A.s Verhalten steuern (Limbus Affektus, Creativus, Cortex Criticus, MetaCognitio, Social Cognitor, Valuation System, Conflict Monitor, Executive Control).
*   **Semantic Nodes (Sample):** Zeigt eine Auswahl der semantischen Konzeptknoten an (z.B. "Concept: AI", "Concept: Ethics"). Es werden die ersten 4 von allen geladenen semantischen Knoten angezeigt.
*   **Node Card Details:**
    *   **Icon & Label:** Visuelle Kennung und Name des Knotens.
    *   **Activation (Act):** Der aktuelle Aktivierungswert des Knotens (0 bis 1), auch visualisiert durch einen Fortschrittsbalken. Hohe Werte bedeuten hohe Relevanz oder Aktivität.
    *   **Resonator Score (Res):** Ein Maß für die "Resonanz" des Knotens.
    *   **Focus Score (Foc):** Ein Maß dafür, wie stark der Knoten im Fokus steht.
    *   **Exploration Score (Exp):** Ein Maß dafür, wie stark der Knoten zur Exploration beiträgt.
    *   **Spezifische Zustände:**
        *   Für **Limbus Affektus:** Zeigt P(leasure), A(rousal), D(ominance).
        *   Für **MetaCognitio:** Zeigt die Anzahl der erkannten SubQG "Jumps".

### 3.4 SubQG Panel

Zugänglich über den "SubQG"-Tab. Dieses Panel visualisiert das SubQuantenfeld-Grundfeld und erlaubt Interaktionen.

*   **Matrix-Visualisierung:**
    *   Zeigt ein Gitter (z.B. 16x16), wobei jede Zelle einen Punkt im SubQG darstellt.
    *   Die **Farbe** jeder Zelle repräsentiert eine Kombination aus ihrer **Energie** und ihrer **Phase**. Typischerweise wird der Farbton (Hue) durch die Phase bestimmt und Sättigung/Helligkeit durch die Energie.
    *   Ein Tooltip beim Überfahren einer Zelle mit der Maus zeigt die exakten (x,y)-Koordinaten, Energie (E) und Phase (P) an.
*   **Interaktionsmöglichkeiten:**
    *   **Inject Energy:** Ein Eingabefeld, um einen Energiewert (z.B. 0.1) festzulegen.
    *   **Set Phase (Opt):** Ein optionales Eingabefeld, um einen Phasenwert (0 bis ca. 6.28) festzulegen. Wenn leer, wird die Phase nicht geändert.
    *   **Aktion:** Ein Klick auf eine Zelle in der Matrix injiziert den eingestellten Energiedelta-Wert in diese Zelle und setzt optional die Phase. Dies simuliert einen externen Einfluss auf das SubQG.
*   **SubQG Jump Info:**
    *   Wenn ein "Jump" (signifikante Fluktuation) im SubQG erkannt wird, werden hier Details angezeigt:
        *   **Type:** Art des Jumps (z.B. "energy_phase_resonance_peak_decay").
        *   **Peak E / Peak C:** Maximale Energie und Kohärenz vor dem Abfall, der den Jump ausgelöst hat.

### 3.5 Knowledge Panel

Zugänglich über den "Knowledge"-Tab. Hier kann M.Y.R.A.s Wissensbasis durch externe Dokumente erweitert werden.

*   **Upload Text File (.txt):**
    *   Ein Dateiauswahlfeld, um `.txt`-Dateien von Ihrem Computer hochzuladen.
    *   Nach Auswahl einer Datei wird der Dateiname angezeigt.
    *   **Load Selected File Button:** Klickt man diesen Button, wird die ausgewählte Datei verarbeitet:
        *   Der Text wird in kleinere Abschnitte (Chunks) zerlegt.
        *   Diese Chunks werden in der Browser-Datenbank (IndexedDB) gespeichert und sind somit persistent über Sitzungen hinweg verfügbar.
        *   Die Liste der "Loaded Sources" wird aktualisiert.
    *   Ein Ladeindikator zeigt an, während die Datei verarbeitet wird.
*   **Loaded Sources:**
    *   Zeigt eine Liste aller Dokumentquellen (Dateinamen), die bisher geladen wurden.
    *   Für jede Quelle wird die Anzahl der daraus generierten Chunks angezeigt.
    *   **Clear All Button:** Entfernt **alle** geladenen Chunks aus der Anwendung und der persistenten Browser-Datenbank. Dies setzt M.Y.R.A.s Wissensbasis aus externen Dokumenten zurück.
    *   **Total Chunks:** Zeigt die Gesamtanzahl aller aktuell geladenen Text-Chunks an.

### 3.6 Settings Panel

Zugänglich über den "Settings"-Tab. Ermöglicht die detaillierte Konfiguration von M.Y.R.A.s Parametern. Die Einstellungen sind in Gruppen unterteilt. Siehe [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter) für eine ausführliche Erklärung jeder Einstellung.

*   **AI Configuration:** Einstellungen für den KI-Provider (Gemini/LM Studio) und Modelle.
*   **Persona & Behavior:** M.Y.R.A.s Persönlichkeit, Ethik, Antwortinstruktionen, Temperatur, Kontextlänge.
*   **SubQG Simulation:** Parameter für das SubQG-Feld, Jump-Mechanik und RNG.
*   **Knowledge & RAG:** Einstellungen für das Chunking von Texten und den RAG-Abruf.
*   **Adaptive Fitness:** Gewichtungen und Parameter für das Fitness-System.
*   **Apply Settings Button:** Speichert die geänderten Einstellungen.

### 3.7 Chat Interface

Der Hauptbereich auf der rechten Seite.

*   **Nachrichtenanzeige:** Zeigt den bisherigen Gesprächsverlauf zwischen dem Benutzer und M.Y.R.A. an.
*   **Eingabefeld:** Textfeld zum Eingeben von Nachrichten an M.Y.R.A.
*   **Senden-Button:** Schickt die eingegebene Nachricht ab.

---

## 4. Technische Architektur & Code Dokumentation

### 4.1 Projektstruktur

Das Projekt ist eine React-Anwendung, die mit TypeScript und Vite erstellt wurde.

```
/
├── docs/                       # Ausführliche Konfigurations-Dokumentationen
│   ├── config_adaptive_fitness.md
│   ├── config_ai_provider.md
│   ├── config_knowledge_rag.md
│   ├── config_persona_behavior.md
│   └── config_subqg_simulation.md
├── public/                     # Statische Assets
├── src/
│   ├── components/             # React UI Komponenten
│   ├── hooks/                  # React Hooks (Logik & State Management)
│   ├── services/               # Kommunikation mit externen APIs
│   ├── utils/                  # Hilfsfunktionen und Klassen
│   ├── constants.ts            # Globale Konstanten und Initialzustände
│   ├── types.ts                # TypeScript Typdefinitionen
│   └── index.tsx               # Haupteinstiegspunkt der React-Anwendung
├── index.html                  # HTML-Hauptseite
├── metadata.json               # Metadaten für die Anwendung
├── vite.config.ts              # Vite Build-Konfiguration
├── tsconfig.json               # TypeScript Konfiguration
└── package.json                # Projekt Abhängigkeiten und Skripte
└── Dokumentation.md            # Diese Datei
```

### 4.2 `index.html`

*   **Zweck:** Die Haupt-HTML-Datei, die die Anwendung lädt.
*   **Struktur:**
    *   Standard HTML5-Boilerplate.
    *   Lädt Tailwind CSS für das Styling und Heroicons.
    *   **Import Map (`<script type="importmap">`):** Definiert Aliase für Modulimporte von CDNs (esm.sh) für React, @google/genai, uuid.
    *   Ein `<div id="root"></div>`, in das die React-Anwendung gerendert wird.
    *   Skript für Dark-Mode-Handling.
    *   Lädt das Haupt-TypeScript-Modul (`index.tsx`).

### 4.3 `metadata.json`

*   **Zweck:** Enthält Metadaten über die Anwendung.
*   **Felder:** `name`, `description`, `requestFramePermissions`, `prompt`.

### 4.4 `vite.config.ts`

*   **Zweck:** Konfigurationsdatei für Vite.
*   **Kernfunktionen:**
    *   Lädt Umgebungsvariablen (z.B. `GEMINI_API_KEY`).
    *   Integriert das Vite React Plugin.
    *   Definiert `process.env.API_KEY` für den Client-Code.
    *   Definiert Pfad-Aliase.

### 4.5 `index.tsx`

*   **Zweck:** Der Haupteinstiegspunkt der React-Anwendung.
*   **Logik:** Rendert die `<App />`-Komponente in das `root`-HTML-Element.

### 4.6 `App.tsx`

*   **Zweck:** Die Hauptkomponente der Anwendung; steuert Layout und Navigation.
*   **State Management:** Verwendet `useMyraState` für den Anwendungszustand. `activeTab` steuert die Anzeige im linken Panel.
*   **Funktionen:** `handleConfigChange`, `handleLoadFile`, `handleClearKnowledge`.
*   **Layout:** Definiert Header, linkes Panel (Tabs für Status, Nodes, SubQG, Knowledge, Settings) und rechtes Panel (Chat).

### 4.7 `constants.ts`

*   **Zweck:** Definiert globale Konstanten und initiale Zustände.
*   **Exportierte Konstanten:** `INITIAL_ADAPTIVE_FITNESS_CONFIG`, `INITIAL_CONFIG` (Hauptkonfiguration), `INITIAL_EMOTION_STATE`, `INITIAL_NODE_STATES`, `INITIAL_ADAPTIVE_FITNESS_STATE`, `INITIAL_SUBQG_GLOBAL_METRICS`, `API_KEY_FOR_GEMINI`.

### 4.8 `types.ts`

*   **Zweck:** Enthält alle zentralen TypeScript-Typdefinitionen.
*   **Wichtige Typen:** `MyraConfig`, `ChatMessage`, `EmotionState`, `NodeState`, `SubQgGlobalMetrics`, `SubQgJumpInfo`, `AdaptiveFitnessState`, `AdaptiveFitnessConfig`, `TextChunk`, diverse Typen für API-Antworten und Konfigurationsfelder.

### 4.9 `hooks/useMyraState.ts`

*   **Zweck:** Zentraler Custom Hook für den Großteil des Anwendungszustands und der Logik.
*   **State-Variablen:** `myraConfig`, `chatHistory`, `emotionState`, `nodeStates`, `adaptiveFitness`, SubQG-Zustände, Ladezustände, `processedTextChunks`, etc.
*   **Refs:** `rngRef` (für RNG-Instanz), `fitnessManagerRef` (für `AdaptiveFitnessManager`-Instanz).
*   **Kernfunktionen:**
    *   `updateMyraConfig`: Aktualisiert die Konfiguration.
    *   `calculateSubQgMetrics`, `detectSubQgJump`, `simulateSubQgStep`: Logik für die SubQG-Simulation.
    *   `injectSubQgStimulus`: Modifiziert SubQG-Zellen.
    *   `updateEmotionState`, `updateNodeActivations`: Aktualisieren interne Zustände.
    *   `simulateNetworkStep`: Hauptsimulationsschleife, ruft periodisch die `AdaptiveFitnessManager`-Berechnung auf.
    *   `loadAndProcessFile`, `clearAllKnowledge`: Management der Wissensbasis (Chunks).
    *   `retrieveRelevantChunks`: RAG-Abruflogik.
    *   `generateMyraResponse`: Erzeugt KI-Antworten unter Einbeziehung des internen Zustands und RAG.
*   **`useEffect` Hooks:** Für Initialisierung (Laden von Chunks aus DB), RNG-Management und Starten des Simulationsintervalls.

### 4.10 `components/`

Detaillierte Beschreibungen der einzelnen UI-Komponenten.

#### 4.10.1 `ChatInterface.tsx`

*   Stellt die Chat-UI bereit, zeigt Nachrichten an, handhabt Benutzereingaben.

#### 4.10.2 `IconComponents.tsx`

*   Definiert wiederverwendbare SVG-Icon-Komponenten.

#### 4.10.3 `KnowledgePanel.tsx`

*   UI für das Hochladen von Textdateien und die Verwaltung der Wissens-Chunks.

#### 4.10.4 `NodePanel.tsx`

*   Visualisiert Modulator- und semantische Knoten mit ihren aktuellen Zuständen.

#### 4.10.5 `SettingsPanel.tsx`

*   Ermöglicht die detaillierte Konfiguration aller `MyraConfig`-Parameter, gruppiert nach Funktionalität. Verwendet dynamisch generierte Formularfelder.

#### 4.10.6 `SubQGDisplay.tsx`

*   Visualisiert das SubQG-Gitter (Energie/Phase) und erlaubt manuelle Stimulation einzelner Zellen. Zeigt Jump-Informationen an.

#### 4.10.7 `SystemStatusPanel.tsx`

*   Zeigt eine Übersicht der wichtigsten Systemmetriken: Emotionen, Adaptive Fitness und SubQG-Globalwerte.

### 4.11 `services/aiService.ts`

*   **Zweck:** Kapselt die Logik für die Kommunikation mit externen KI-APIs.
*   **Funktionen:**
    *   `getGenAIInstance`: Initialisiert das Gemini SDK.
    *   `transformGeminiSDKResponse`: Konvertiert Gemini SDK-Antworten.
    *   `callLmStudioApi`: Kommuniziert mit einer lokalen LM Studio Instanz.
    *   `callAiApi`: Hauptfunktion, die je nach Konfiguration an Gemini oder LM Studio weiterleitet. Baut den Kontext für die KI auf (Systeminstruktion, Historie, Prompt).

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

*   **Klasse `AdaptiveFitnessManager`:**
    *   Verantwortlich für die Berechnung aller Fitness-Metriken und -Dimensionen basierend auf dem aktuellen Systemzustand und der Konfiguration.
    *   `calculateMetricsAndFitness()`: Kernmethode, die individuelle Metriken (Kohärenz, Resonanz, Zielerreichung etc.) und daraus die übergeordneten Fitness-Dimensionen sowie den Gesamtfitness-Score berechnet. Verwendet Gewichte aus `MyraConfig.adaptiveFitnessConfig`.

#### 4.12.2 `db.ts`

*   **Zweck:** Hilfsfunktionen für die Interaktion mit IndexedDB zur persistenten Speicherung von `TextChunk`-Objekten.
*   **Funktionen:** `openDB`, `addChunksToDB`, `getAllChunksFromDB`, `clearAllChunksFromDB`.

#### 4.12.3 `rng.ts`

*   **Zweck:** Definiert und implementiert Zufallszahlengeneratoren (deterministischer `SubQGRNG` via LCG und nicht-deterministischer `QuantumRNG` via `Math.random()`).

---

## 5. Funktionale Tieftauche

### 5.1 Simulationszyklus (`simulateNetworkStep` in `useMyraState.ts`)

Der Simulationszyklus aktualisiert M.Y.R.A.s interne Zustände:
1.  SubQG-Simulation: Energie- und Phasenentwicklung, Jump-Erkennung.
2.  Emotionsaktualisierung: Zerfall und zufällige Fluktuationen.
3.  Knotenaktivierungs-Update: Zerfall, zufällige Fluktuationen, spezifische Logik für Modulatoren, Einfluss von SubQG-Jumps.
4.  Adaptive Fitness Berechnung: Periodische Neuberechnung der Fitness-Scores durch den `AdaptiveFitnessManager`.

### 5.2 KI-Antwortgenerierung (`generateMyraResponse` in `useMyraState.ts`)

Erzeugt KI-Antworten:
1.  Sammelt Kontext: Rollenbeschreibung, Ethik, aktueller interner Zustand (Emotionen, Knoten, Fitness, SubQG-Events).
2.  RAG: Ruft relevante Text-Chunks aus der Wissensbasis ab und fügt sie dem Kontext hinzu.
3.  Dynamische Temperatur: Berechnet die Temperatur für die KI-Anfrage.
4.  API-Aufruf: Sendet den aufbereiteten Prompt an die konfigurierte KI (Gemini oder LM Studio).
5.  Interne Zustandsanpassung: Aktualisiert Emotionen und Knotenaktivierungen basierend auf der Antwort.

### 5.3 Wissensverarbeitung (`loadAndProcessFile`, RAG in `useMyraState.ts`)

Ermöglicht M.Y.R.A. das "Lernen" aus Textdateien:
1.  Dateien werden in Chunks zerlegt (konfigurierbare Größe/Überlappung).
2.  Chunks werden persistent in IndexedDB gespeichert.
3.  Für RAG werden relevante Chunks basierend auf Keyword-Übereinstimmung mit dem Benutzer-Prompt abgerufen.

### 5.4 Konfigurationsmanagement

Die `MyraConfig` steuert fast alle Aspekte der Simulation. Änderungen im `SettingsPanel` werden über `useMyraState.updateMyraConfig` angewendet und beeinflussen dynamisch das Verhalten der Anwendung.

---

## 6. Detaillierte Konfigurationsparameter

Für eine detaillierte Erklärung jedes Konfigurationsparameters, der im `SettingsPanel` angepasst werden kann, einschließlich Bedeutung, sinnvoller Wertebereiche und Interaktionen, siehe die folgenden Dokumente im `docs/` Verzeichnis:

*   [AI Provider Konfiguration](./docs/config_ai_provider.md)
*   [Persona & Verhalten Konfiguration](./docs/config_persona_behavior.md)
*   [SubQG Simulation Konfiguration](./docs/config_subqg_simulation.md)
*   [Knowledge Base & RAG Konfiguration](./docs/config_knowledge_rag.md)
*   [Adaptive Fitness Konfiguration](./docs/config_adaptive_fitness.md)

---

## 7. Einrichtung und Start

1.  **Abhängigkeiten:** Stellen Sie sicher, dass eine moderne Node.js-Umgebung vorhanden ist. Falls `node_modules` nicht existieren, führen Sie `npm install` (oder `yarn install`) aus (abhängig vom Projektsetup).
2.  **API-Schlüssel (für Gemini):** Erstellen Sie eine Datei `.env` im Projektwurzelverzeichnis und fügen Sie Ihren Gemini API-Schlüssel hinzu:
    ```
    GEMINI_API_KEY=DEIN_GEMINI_API_SCHLUESSEL
    ```
3.  **LM Studio (optional):** Wenn Sie LM Studio verwenden möchten, stellen Sie sicher, dass es läuft, ein Modell geladen ist und der Server unter der in den M.Y.R.A.-Einstellungen konfigurierten URL erreichbar ist.
4.  **Entwicklungsserver starten:**
    ```bash
    npm run dev
    # oder
    yarn dev
    ```
5.  Öffnen Sie die in der Konsole angezeigte URL (meist `http://localhost:5173`) in Ihrem Browser.

```
