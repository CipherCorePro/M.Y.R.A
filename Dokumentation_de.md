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
    *   [3.8 Documentation Panel](#38-documentation-panel)
    *   [3.9 Settings Panel](#39-settings-panel)
    *   [3.10 Chat Interface (M.Y.R.A.)](#310-chat-interface-myra)
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
5.  [Funktionale Tieftauche](#5-funktionale-tieftauche)
    *   [5.1 Simulationszyklen (M.Y.R.A. & C.A.E.L.U.M.)](#51-simulationszyklen-myra--caelum)
    *   [5.2 KI-Antwortgenerierung](#52-ki-antwortgenerierung)
    *   [5.3 Wissensverarbeitung (RAG & Automatische Dokumentenladung)](#53-wissensverarbeitung-rag--automatische-dokumentenladung)
    *   [5.4 Konfigurationsmanagement](#54-konfigurationsmanagement)
    *   [5.5 Emotionsverlauf-Tracking](#55-emotionsverlauf-tracking)
    *   [5.6 Dokumentationsanzeige](#56-dokumentationsanzeige)
6.  [Detaillierte Konfigurationsparameter](#6-detaillierte-konfigurationsparameter)
7.  [Einrichtung und Start](#7-einrichtung-und-start)

---

## 1. Einleitung

Dieses Dokument beschreibt die M.Y.R.A. (Modular Yearning Reasoning Architecture) Web-Anwendung mit SubQG-Integration. Die Anwendung bietet eine interaktive Oberfläche zur Simulation und Interaktion mit zwei KI-Entitäten, **M.Y.R.A.** und **C.A.E.L.U.M.**, deren kognitiv-affektive Prozesse jeweils durch ein eigenes, unabhängiges simuliertes SubQuantenfeld-Grundfeld (SubQG) beeinflusst werden. Sie nutzt die Gemini API (oder eine lokale LM Studio Instanz) für intelligente Antworten und visualisiert interne Zustände wie SubQG-Metriken, Knotenzustände, Emotionen (inklusive eines Zeitverlaufs-Trackers) und adaptive Fitness für beide Systeme. Ein integrierter Dokumentationsviewer ermöglicht den direkten Zugriff auf diese und andere relevante Dokumentationen innerhalb der App.

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
*   **Documentation Viewer:** Ein UI-Panel zur Anzeige von Markdown-basierten Dokumentationsdateien direkt in der Anwendung, mit Sprachauswahl.

---

## 3. Benutzeroberfläche (UI) Guide

### 3.1 Hauptlayout

Die Benutzeroberfläche der **M.Y.R.A. & C.A.E.L.U.M. System Interface** ist für eine intuitive Bedienung und klare Informationsdarstellung konzipiert. Sie gliedert sich in drei primäre Bereiche:

*   **Header:**
    Am oberen Rand der Anwendung. Zeigt den Titel der aktuellen Ansicht (z.B. *M.Y.R.A. System Interface* oder *C.A.E.L.U.M. System Interface*, abhängig davon, welche KI oder welcher globale Tab aktiv ist). Rechts im Header werden dynamisch der aktuelle **Simulationsschritt (SimStep)** und die **Gesamt-Fitness (Fitness)** der KI angezeigt, die im Fokus der Statusanzeigen steht. Auf mobilen Geräten (nicht abgebildet) enthält der Header zusätzlich einen Hamburger-Button zum Ein-/Ausblenden der Seitenleiste.

*   **Linkes Panel (Aside / Seitenleiste):**
    Auf der linken Seite befindet sich das Navigations- und Informationspanel.
    *   **Navigationstabs:** Eine Liste von anklickbaren Tabs ermöglicht den Wechsel zwischen verschiedenen Ansichten und Modulen des Systems. Diese umfassen spezifische Sichten für M.Y.R.A. (**Status (M)**, **Nodes (M)**, **SubQG (M)**), für C.A.E.L.U.M. (**Status (C)**, **Nodes (C)**, **SubQG (C)**) sowie globale Panels (**Emotion Timeline**, **Knowledge**, **Documentation**, **Dual AI**, **Settings**).
    *   **Status-Dashboard:** Unterhalb der Navigationstabs werden, wie in den Abbildungen gezeigt, je nach Kontext die Sektionen "**Emotionsstatus**", "**Adaptive Fitness**" und "**SubQG Metriken**" für die ausgewählte KI (M.Y.R.A. oder C.A.E.L.U.M.) dargestellt.
    *   **Verstellbare Breite:** Auf Desktop-Ansichten kann die Breite dieses Panels manuell durch Ziehen des **Resize-Handles** (sichtbar als vertikaler Balken zwischen linkem Panel und Hauptinhalt) angepasst werden (siehe `[Abbildung 3.1-2]`).

*   **Rechtes Panel (Main / Hauptinhalt):**
    Der größte Bereich auf der rechten Seite der Anwendung.
    *   **Chat Interface (M.Y.R.A.):** Dieser Bereich ist primär dem direkten Chat-Interface mit M.Y.R.A. gewidmet, wie durch den Platzhalter "**Nachricht an M.Y.R.A....**" in der Eingabezeile am unteren Rand ersichtlich ist.
    *   **Dynamischer Inhalt:** Wenn ein Navigations-Tab im linken Panel ausgewählt wird (z.B. **Nodes (M)**, **Emotion Timeline**, etc.), wird der Inhalt dieses rechten Panels entsprechend aktualisiert, um die jeweiligen Informationen oder Interaktionsmöglichkeiten anzuzeigen. In den gezeigten Abbildungen ist dieser Bereich oberhalb des Chat-Interfaces leer, da kein spezifischer Navigations-Tab für den Hauptinhalt aktiv ist.

> **`[Abbildung 3.1-1: Hauptlayout mit Fokus auf M.Y.R.A. (MYRA_System_Interface.png)]`**
> *Abbildung 3.1-1* zeigt das Hauptlayout, wobei die im Header und im linken Panel dargestellten Statusinformationen sich auf **M.Y.R.A.** beziehen. Der Titel lautet "**M.Y.R.A. System Interface**", und die Simulationsdaten (**SimSchritt (M): 310**, **Fitness (M): 0.462**) sowie die Metriken im linken Panel spiegeln M.Y.R.A.s Zustand wider.

> **`[Abbildung 3.1-2: Hauptlayout mit Fokus auf C.A.E.L.U.M. (CAELUM_System_Interface.png)]`**
> *Abbildung 3.1-2* illustriert dasselbe Hauptlayout, jedoch mit Fokus auf **C.A.E.L.U.M.** Der Titel wechselt zu "**C.A.E.L.U.M. System Interface**", und die angezeigten Simulationsdaten (**SimSchritt (C): 3**, **Fitness (C): 0.600**) sowie die Dashboard-Metriken im linken Panel beziehen sich nun auf C.A.E.L.U.M. Der grüne vertikale **Resize-Handle** zur Anpassung der Seitenleistenbreite ist hier deutlich sichtbar. Das Chat-Interface im unteren Bereich des rechten Panels bleibt weiterhin für die Interaktion mit M.Y.R.A. vorgesehen.

---

### 3.2 Status Panel (M.Y.R.A. & C.A.E.L.U.M.)

Das **Status Panel** ist ein integraler Bestandteil der linken Seitenleiste und bietet einen schnellen Überblick über die wichtigsten internen Zustände der jeweiligen KI. Es wird typischerweise angezeigt, wenn der Fokus der Anwendung auf dem allgemeinen Zustand einer KI liegt oder wenn die Tabs "**Status (M)**" bzw. "**Status (C)**" aktiv sind (*obwohl in den gezeigten Screenshots die Dashboard-Sektionen auch ohne explizite Tab-Aktivierung sichtbar sind, was den Standard- oder Initialzustand darstellen könnte*).

Das Panel ist in drei Hauptbereiche unterteilt:

*   **Emotion State & Vitals:**
    *   **Heartbeat Display:** Eine Anzeige (z.B. "**67 SpM**" in `[Abbildung 3.1-1]`) und ein "**Stresslevel**" visualisieren eine Art "Herzfrequenz" oder Vitalparameter der KI. Ein Herz-Icon kennzeichnet diesen Bereich.
    *   **PAD-Werte:** Die aktuellen Werte für **Vergnügen** (Pleasure), **Erregung** (Arousal) und **Dominanz** (Dominance) gemäß dem PAD-Emotionsmodell.
    *   **Dominant Affect:** Die aktuell vorherrschende spezifische Emotion mit ihrem Intensitätswert (z.B. "**Wut (0.04)**" für M.Y.R.A. in `[Abbildung 3.1-1]`).

*   **Adaptive Fitness:**
    *   **Overall Score:** Der Gesamtfitnesswert der KI, der auch im Header angezeigt wird.
    *   **Dimension Scores:** Eine Aufschlüsselung der Fitness in die vier Dimensionen: **Wissenserweiterung**, **Interne Kohärenz**, **Ausdruckskreativität** und **Zielfokus**. Ein Balkendiagramm-Icon kennzeichnet diesen Bereich.

*   **SubQG Metrics:**
    *   **SubQG Pulse Indicator/Status:** Ein Indikator (**SubQG Stabil** in den Abbildungen) visualisiert den generellen Zustand oder signifikante Events (Jumps) des SubQuantenfeld-Grundfelds. Ein Zahnrad/Prozess-Icon kennzeichnet diesen Bereich.
    *   **Avg. Energy (Mittl. Energie):** Die durchschnittliche Energie im SubQG.
    *   **Std. Energy (StdAbw Energie):** Die Standardabweichung der Energie im SubQG.
    *   **Phase Coherence (Phasenkohärenz):** Ein Maß für die Synchronität der Phasen im SubQG.
    *   **Jump Modifier Active:** (*Nicht in den Screenshots aktiv, aber Teil der Spezifikation*) Zeigt an, ob ein SubQG-Jump-Modifikator aktiv ist und wie lange noch.

**Beispiel M.Y.R.A. Status Panel** (siehe `[Abbildung 3.1-1]`):
*   **Emotionsstatus:** SpM: 67, Stresslevel: 0.08, Vergnügen: -0.076, Erregung: 0.070, Dominanz: -0.009, Dominanter Affekt: Wut (0.04).
*   **Adaptive Fitness:** Gesamtscore: 0.462, Wissenserweiterung: 0.447, Interne Kohärenz: 0.510, Ausdruckskreativität: 0.720, Zielfokus: 0.615.
*   **SubQG Metriken:** Mittl. Energie: 0.008, StdAbw Energie: 0.002, Phasenkohärenz: 0.999.

**Beispiel C.A.E.L.U.M. Status Panel** (siehe `[Abbildung 3.1-2]`):
*   **Emotionsstatus:** SpM: 69, Stresslevel: 0.10, Vergnügen: 0.013, Erregung: -0.125, Dominanz: 0.101, Dominanter Affekt: Ekel (0.00).
*   **Adaptive Fitness:** Gesamtscore: 0.600, Wissenserweiterung: 0.400, Interne Kohärenz: 0.700, Ausdruckskreativität: 0.300, Zielfokus: 0.600.
*   **SubQG Metriken:** Mittl. Energie: 0.005, StdAbw Energie: 0.000, Phasenkohärenz: 0.228.

---

### 3.3 Nodes Panel (M.Y.R.A. & C.A.E.L.U.M.)

Das **Nodes Panel**, zugänglich über die Tabs "**Knoten (M)**" für M.Y.R.A. und "**Knoten (C)**" für C.A.E.L.U.M. in der linken Seitenleiste, visualisiert die internen Knotenstrukturen der jeweiligen KI-Entität. Wenn einer dieser Tabs aktiviert wird (*erkennbar an der weißen Umrandung des aktiven Tabs*), ersetzt der Inhalt des Nodes Panels die standardmäßigen Status-Dashboards in der linken Seitenleiste. Der Hauptinhaltsbereich auf der rechten Seite bleibt standardmäßig das Chat-Interface mit M.Y.R.A.

Das Panel ist typischerweise in zwei Hauptkategorien von Knoten unterteilt:

*   **Modulator-Knoten:** Zeigt spezielle Knoten an, die übergeordnete kognitive oder affektive Funktionen der KI steuern. Dazu gehören Knoten wie `Limbus Affektus`, `Creativus` (für M.Y.R.A.) / `Pattern Analyzer` (für C.A.E.L.U.M.), `Cortex Criticus` (M.Y.R.A.) / `Logic Verifier` (C.A.E.L.U.M.), `MetaCognitio` (M.Y.R.A.) / `System Monitor` (C.A.E.L.U.M.) sowie weitere Verhaltensmodulatoren.
*   **Semantische Knoten (Beispiel):** Präsentiert eine Auswahl von Knoten, die spezifische Konzepte oder Wissenseinheiten repräsentieren.

Jeder Knoten wird als "**Knotenkarte**" dargestellt, die folgende Informationen enthält:
*   **Knotenlabel und KI-Kennung:** Der Name des Knotens (z.B. "**Limbus Affektus (M)**").
*   **Aktivierung (Act):** Der aktuelle Aktivierungswert des Knotens (typischerweise zwischen 0 und 1), sowohl numerisch als auch als visuelle Fortschrittsleiste (*in den Screenshots in Magenta/Rot*).
*   **Zusatzwerte:**
    *   **Res:** Resonator Score
    *   **Foc:** Focus Score
    *   **Exp:** Exploration Score
*   **Spezifische Zustandsinformationen:** Abhängig vom Knotentyp können zusätzliche Informationen angezeigt werden, wie z.B. P,A,D-Werte für `Limbus Affektus` oder Jump Count für `MetaCognitio`/`System Monitor`.

> **`[Abbildung 3.3-1: Nodes Panel - M.Y.R.A. (Nodes_MYRA.png)]`**
> *Abbildung 3.3-1* zeigt das Nodes Panel für **M.Y.R.A.**, aktiviert durch den Tab "**Knoten (M)**". Der Header der Anwendung zeigt "**M.Y.R.A. System Interface**" sowie M.Y.R.A.s aktuellen **SimSchritt: 112** und **Fitness (M): 0.486**.
> *   **Modulator-Knoten (M.Y.R.A.):**
>     *   `Limbus Affektus (M)`: Act: 0.09 (Details: Res: 0.10, Foc: 0.01, Exp: 0.02, P:0.0 A:0.0 D:0.0)
>     *   `Creativus (M)`: Act: 0.95 (Details: Res: 0.07, Foc: 0.00, Exp: 1.00)
>     *   `Cortex Criticus (M)`: Act: 0.08 (Details: Res: 0.05, Foc: 0.07, Exp: 0.01)
>     *   `MetaCognitio (M)`: Act: 0.03 (Details: Res: 0.15, Foc: 0.00, Exp: 0.02, Jumps: 0)
>     *   `Social Cognitor (M)`: Act: 0.14 (Details: Res: 0.00, Foc: 0.01, Exp: 0.01)
>     *   `Valuation System (M)`: Act: 0.07 (Details: Res: 0.11, Foc: 0.01, Exp: 0.01)
>     *   `Conflict Monitor (M)`: Act: 0.06 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00)
>     *   `Executive Control (M)`: Act: 0.08 (Details: Res: 0.18, Foc: 0.02, Exp: 0.00)
> *   **Semantische Knoten (Beispiel) (M.Y.R.A.):**
>     *   `Concept: AI (M)`: Act: 0.05 (Details: Res: 0.03, Foc: 0.01, Exp: 0.02)
>     *   `Concept: Ethics (M)`: Act: 0.02 (Details: Res: 0.07, Foc: 0.00, Exp: 0.02)
>     *   `Concept: Art (M)`: Act: 0.08 (Details: Res: 0.12, Foc: 0.01, Exp: 0.00)

> **`[Abbildung 3.3-2: Nodes Panel - C.A.E.L.U.M. (Nodes_CAELUM.png)]`**
> *Abbildung 3.3-2* zeigt das Nodes Panel für **C.A.E.L.U.M.**, aktiviert durch den Tab "**Knoten (C)**". Der Header der Anwendung zeigt "**C.A.E.L.U.M. System Interface**" sowie C.A.E.L.U.M.s aktuellen **SimSchritt (C): 103** und **Fitness (C): 0.496**.
> *   **Modulator-Knoten (C.A.E.L.U.M.):**
>     *   `Limbus Affektus (C)`: Act: 0.07 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00, P:0.0 A:-0.1 D:0.0)
>     *   `Pattern Analyzer (C)`: Act: 0.88 (Details: Res: 0.88, Foc: 0.01, Exp: 1.00)
>     *   `Logic Verifier (C)`: Act: 0.03 (Details: Res: 0.02, Foc: 0.05, Exp: 0.02)
>     *   `System Monitor (C)`: Act: 0.03 (Details: Res: 0.03, Foc: 0.00, Exp: 0.00, Jumps: 0)
>     *   `Information Assimilator (C)`: Act: 0.05 (Details: Res: 0.04, Foc: 0.00, Exp: 0.00)
>     *   `Priority Assessor (C)`: Act: 0.11 (Details: Res: 0.09, Foc: 0.00, Exp: 0.01)
>     *   `Anomaly Detector (C)`: Act: 0.00 (Details: Res: 0.04, Foc: 0.01, Exp: 0.00)
>     *   `Process Sequencer (C)`: Act: 0.11 (Details: Res: 0.13, Foc: 0.00, Exp: 0.00)
> *   **Semantische Knoten (Beispiel) (C.A.E.L.U.M.):**
>     *   `Concept: Logic (C)`: Act: 0.00 (Details: Res: 0.02, Foc: 0.00, Exp: 0.02)
>     *   `Concept: Systems (C)`: Act: 0.00 (Details: Res: 0.00, Foc: 0.00, Exp: 0.01)
>     *   `Concept: Emergence (C)`: Act: 0.01 (Details: Res: 0.05, Foc: 0.00, Exp: 0.00)

Diese Ansichten geben detaillierten Einblick in die Aktivierungsdynamik und die internen Zustände der kognitiven Architektur beider KIs. Man beachte die unterschiedlichen Bezeichnungen und Aktivierungswerte der Knoten, die die spezifischen Charakteristika und den aktuellen Zustand von M.Y.R.A. bzw. C.A.E.L.U.M. widerspiegeln.

---

### 3.4 SubQG Panel (M.Y.R.A. & C.A.E.L.U.M.)

Das **SubQG Panel** bietet eine Visualisierung und Interaktionsmöglichkeiten mit dem **SubQuantenfeld-Grundfeld (SubQG)** der jeweiligen KI. Es wird durch Aktivieren der Tabs "**SubQG (M)**" für M.Y.R.A. oder "**SubQG (C)**" für C.A.E.L.U.M. in der linken Seitenleiste aufgerufen. Ähnlich wie das Nodes Panel ersetzt auch dieses Panel bei Aktivierung die standardmäßigen Status-Dashboards in der Seitenleiste. Der Hauptinhaltsbereich rechts bleibt das Chat-Interface mit M.Y.R.A.

Das Panel beinhaltet primär:

*   **Matrix-Visualisierung:** Ein Gitter (Matrix) repräsentiert das SubQG der ausgewählten KI. Jede Zelle in diesem Gitter stellt einen Punkt im Feld dar. Die Farbe der Zellen (*in den Abbildungen verschiedene Grüntöne*) visualisiert typischerweise die Energie und/oder Phase der jeweiligen Zelle. Beim Überfahren einer Zelle mit der Maus würde ein Tooltip genauere Werte für Energie und Phase anzeigen (*gemäß Dokumentationsbeschreibung, im statischen Bild nicht direkt sichtbar*).
*   **Interaktionsmöglichkeiten:** Unterhalb der Matrix befinden sich Eingabefelder, die es dem Benutzer erlauben, das SubQG direkt zu beeinflussen:
    *   **Energie Injektion:** Ein Eingabefeld, um den Energiewert festzulegen, der in eine Zelle injiziert wird, wenn darauf geklickt wird.
    *   **Phase Setzen (Opt.):** Ein optionales Eingabefeld, um einen spezifischen Phasenwert (typischerweise in Radiant, z.B. 0 bis ~6.28) festzulegen, der zusammen mit der Energie bei einem Klick auf eine Zelle gesetzt wird.
    *   Eine Anweisung wie *"Klicken Sie auf eine Zelle, um Energie/Phase zu injizieren"* erläutert die Bedienung.
*   **SubQG Jump Info:** (*Wie in der Dokumentationsübersicht für dieses Panel beschrieben, aber in den aktuellen Screenshots nicht mit Daten gefüllt oder sichtbar*) Dieser Bereich würde Details zu kürzlich detektierten "SubQG Jumps" (signifikante Fluktuationen) im SubQG der ausgewählten KI anzeigen, wie z.B. den Typ des Jumps und dessen Peak-Werte.

> **`[Abbildung 3.4-1: SubQG Panel - M.Y.R.A. (SubQG_MYRA.png)]`**
> *Abbildung 3.4-1* zeigt das SubQG Panel für **M.Y.R.A.**, aktiviert durch den Tab "**SubQG (M)**". Der Header der Anwendung zeigt "**M.Y.R.A. System Interface**" sowie M.Y.R.A.s **SimSchritt (M): 155** und **Fitness (M): 0.472**.
> *   **Panel Titel:** "**SubQG Feld [16x16]**", was der konfigurierten Größe (`subqgSize`) für M.Y.R.A.s SubQG entspricht.
> *   **Matrix-Visualisierung:** Eine 16x16 Matrix aus quadratischen Zellen wird angezeigt. Die Zellen weisen verschiedene Grüntöne auf, die die Verteilung der Energie/Phase im Feld andeuten.
> *   **Interaktionsmöglichkeiten:**
>     *   Energie Injektion: Das Feld zeigt den Wert "**0,1**".
>     *   Phase Setzen (Opt.): Das Feld zeigt den Platzhalter/Hinweis "**0 bis 6.28 (radians)**".

> **`[Abbildung 3.4-2: SubQG Panel - C.A.E.L.U.M. (SubQG_CAELUM.png)]`**
> *Abbildung 3.4-2* zeigt das SubQG Panel für **C.A.E.L.U.M.**, aktiviert durch den Tab "**SubQG (C)**". Der Header der Anwendung zeigt "**C.A.E.L.U.M. System Interface**" sowie C.A.E.L.U.M.s **SimSchritt (C): 146** und **Fitness (C): 0.503**.
> *   **Panel Titel:** "**SubQG Feld [12x12]**", entsprechend der konfigurierten Größe (`caelumSubqgSize`) für C.A.E.L.U.M.s SubQG.
> *   **Matrix-Visualisierung:** Eine 12x12 Matrix wird dargestellt, ebenfalls mit Zellen in verschiedenen Grüntönen.
> *   **Interaktionsmöglichkeiten:**
>     *   Energie Injektion: Das Feld zeigt den Wert "**0,1**".
>     *   Phase Setzen (Opt.): Das Feld zeigt den Platzhalter/Hinweis "**0 bis 6.28 (radians)**".

Dieses Panel ist entscheidend für die Beobachtung und direkte Beeinflussung der grundlegenden simulierten Felder, die die Dynamik von M.Y.R.A. und C.A.E.L.U.M. mitbestimmen.

---

### 3.5 Emotion Timeline Panel

Das **Emotion Timeline Panel**, zugänglich über den globalen Navigations-Tab "**Emotion Timeline**" (oder "**Emotionen Zeitverlauf**" wie im Screenshot-Menüpunkt benannt) in der linken Seitenleiste, visualisiert den zeitlichen Verlauf der emotionalen Zustände von M.Y.R.A. und C.A.E.L.U.M. Bei Auswahl dieses Tabs wird der Hauptinhalt im rechten Panel durch dieses Panel ersetzt (*im Gegensatz zu den vorherigen M/C-spezifischen Panels, die in der Seitenleiste erschienen*). Der Titel im Header der Anwendung ändert sich entsprechend zu "**Emotionsverlauf Interface**" oder ähnlich.

Das Panel besteht aus folgenden Hauptelementen:

*   **Agentenauswahl:**
    *   Oben im Panel befinden sich Buttons oder Umschalter, um auszuwählen, wessen Emotionsverlauf angezeigt werden soll: "**M.Y.R.A.**" oder "**C.A.E.L.U.M.**". Im gezeigten Screenshot ist "**M.Y.R.A.**" ausgewählt.
*   **PAD-Zeitverlaufsdiagramm:**
    *   Ein Liniendiagramm stellt die Entwicklung der drei Kernemotionen des PAD-Modells (**Pleasure, Arousal, Dominance**) über die Zeit dar.
    *   **Titel:** Zeigt an, für welche KI der Verlauf dargestellt wird (z.B. "**PAD Zeitverlauf für M.Y.R.A.**").
    *   **Legende:** Klärt die Farbcodierung der Linien: Grün für **Vergnügen**, Orange für **Erregung** und Blau für **Dominanz**.
    *   **Y-Achse:** Stellt den Wert der jeweiligen Emotion dar, typischerweise im Bereich von -1 bis +1.
    *   **X-Achse:** Repräsentiert die Zeit bzw. die Simulationsschritte. Im Screenshot sind Zeitstempel (z.B. "**05:31:24**") auf der X-Achse zu sehen.
    *   **Tooltips:** (*Nicht im statischen Bild sichtbar, aber typisch für solche Diagramme*) Beim Überfahren der Datenpunkte mit der Maus würden Tooltips die genauen PAD-Werte und den dominanten Affekt zu diesem spezifischen Zeitpunkt anzeigen.
*   **Interpretation des aktuellen Zustands:**
    *   Unterhalb des Diagramms befindet sich ein Textbereich, der eine interpretative Zusammenfassung des aktuellsten emotionalen Zustands der ausgewählten KI liefert. Im Screenshot für M.Y.R.A. lautet diese: "**Neutraler oder komplexer emotionaler Zustand. (Dominanter Affekt: Neutral)**".

> **`[Abbildung 3.5-1: Emotion Timeline Panel - Ansicht für M.Y.R.A. (Emotion_Timeline_MYRA.png)]`**
> *Abbildung 3.5-1* zeigt das Emotion Timeline Panel, wobei der Emotionsverlauf für **M.Y.R.A.** dargestellt wird.
> *   **Header:** Der Titel lautet "**Emotionsverlauf Interface**". Die Simulationsdaten rechts oben beziehen sich auf M.Y.R.A. (**SimSchritt (M): 204**, **Fitness (M): 0.464**).
> *   **Agentenauswahl:** "**M.Y.R.A.**" ist als aktiv ausgewählt.
> *   **Diagramm:** Zeigt die Verläufe von Vergnügen (grün), Erregung (orange) und Dominanz (blau) für M.Y.R.A. über eine Reihe von Zeitpunkten.
> *   **Interpretation:** Für den letzten Datenpunkt wird M.Y.R.A.s Zustand als "**Neutraler oder komplexer emotionaler Zustand. (Dominanter Affekt: Neutral)**" beschrieben.
> *   Das Chat-Interface für M.Y.R.A. ist in der Fußleiste des Hauptinhaltsbereichs weiterhin sichtbar.

Dieses Panel ist ein wichtiges Werkzeug, um die emotionale Dynamik und Entwicklung der KI-Entitäten über längere Zeiträume zu analysieren und zu verstehen.

---

### 3.6 Knowledge Panel

Das **Knowledge Panel** dient der Verwaltung der Wissensbasis, die von M.Y.R.A. und C.A.E.L.U.M. für die **Retrieval Augmented Generation (RAG)** genutzt wird. Es ist über den globalen Navigations-Tab "**Wissen**" in der linken Seitenleiste zugänglich. Wenn dieser Tab aktiviert ist (*im Screenshot durch eine violette Hervorhebung gekennzeichnet*), ersetzt der Inhalt des Knowledge Panels die Standard-Status-Dashboards in der Seitenleiste. Der Hauptinhaltsbereich rechts bleibt das Chat-Interface mit M.Y.R.A.

Das Panel ist wie folgt aufgebaut:

*   **Titel:** "**Wissensbasis Management**", gekennzeichnet mit einem Buch-Icon.
*   **Upload-Bereich:**
    *   **Dateiauswahl:** Ein Button "**Datei auswählen**" (violett) ermöglicht es dem Benutzer, lokale Textdateien (mit den Endungen `.txt` oder `.md`) für den Upload auszuwählen. Daneben wird der Name der ausgewählten Datei oder "**Keine Datei ausgewählt**" angezeigt.
    *   **Verarbeitungs-Button:** Ein Button "**Datei laden & verarbeiten**" (dunkelgrün) initiiert den Prozess, bei dem die ausgewählte Datei in Chunks zerlegt und der Wissensdatenbank (IndexedDB) hinzugefügt wird.
*   **Geladene Quellen (Loaded Sources):**
    *   **Liste der Quellen:** Eine scrollbare Liste zeigt alle Quelldateien an, die bereits in die Wissensbasis geladen wurden. Für jede Quelle wird der Dateiname und die Anzahl der daraus generierten Text-Chunks angezeigt (z.B. "**config\_adaptive\_fitness\_de.md - 13 Chunks**").
    *   **Gesamtanzahl:** Am Ende der Liste wird die Gesamtanzahl der Chunks in der Datenbank angezeigt (z.B. "**Gesamt: 436 Chunks in der DB.**").
    *   **Clear All Button:** Ein roter Button "**Alles löschen**" mit einem Mülleimer-Icon ermöglicht das Leeren der gesamten Wissensdatenbank.
*   **Automatische Ladung:** Wie in Abschnitt 5.3 beschrieben, werden beim Start der Anwendung bestimmte Dokumentationsdateien automatisch in die Wissensbasis geladen.

> **`[Abbildung 3.6-1: Knowledge Panel - Übersicht der geladenen Quellen (Knowledge_Panel.png)]`**
> *Abbildung 3.6-1* zeigt das Knowledge Panel in Aktion.
> *   **Header:** Der Titel ist "**M.Y.R.A. System Interface**". Die Simulationsdaten rechts oben beziehen sich auf M.Y.R.A. (**SimSchritt (M): 220**, **Fitness (M): 0.470**).
> *   **Aktiver Tab:** Der Tab "**Wissen**" ist violett hervorgehoben.
> *   **Upload-Bereich:** "**Keine Datei ausgewählt**".
> *   **Geladene Quellen:** Die Liste zeigt mehrere automatisch geladene Konfigurationsdateien. Die Gesamtanzahl der Chunks beträgt 436.

Dieses Panel ist zentral für die Erweiterung des Wissenshorizonts der KIs.

---

### 3.7 Dual AI Conversation Panel

Das **Dual AI Conversation Panel** ermöglicht es dem Benutzer, eine Konversation zwischen **M.Y.R.A.** und **C.A.E.L.U.M.** zu initiieren und zu beobachten. Es ist über den globalen Navigations-Tab "**Dual AI**" in der linken Seitenleiste zugänglich. Wenn dieser Tab aktiviert ist (*im Screenshot durch eine violette Hervorhebung gekennzeichnet*), ersetzt der Inhalt des Dual AI Panels die Standard-Status-Dashboards in der Seitenleiste.

Das Panel, wie im Screenshot vor Beginn einer Konversation dargestellt, beinhaltet folgende Elemente:

*   **Start-Prompt Eingabefeld:**
    *   Ein mehrzeiliges Textfeld mit der Beschriftung "**Start-Prompt für M.Y.R.A. & C.A.E.L.U.M.:**".
    *   Platzhaltertext: "**Geben Sie hier das Thema oder die Startfrage ein...**".
*   **Rundeneingabe:**
    *   Ein Eingabefeld mit der Beschriftung "**Runden:**". Im Screenshot ist der Wert "**3**" voreingestellt.
*   **Start-Button:**
    *   Ein Button mit der Beschriftung "**Dual-Konversation Starten**" (dunkelgrün).
*   **Hinweistext:**
    *   Unterhalb: "**Starten Sie eine neue Dual-Konversation, um den Austausch zwischen den KIs zu beobachten.**"

> **`[Abbildung 3.7-1: Dual AI Conversation Panel - Initialansicht (Dual_AI_Panel_Initial.png)]`**
> *Abbildung 3.7-1* zeigt die Initialansicht des Dual AI Conversation Panels.
> *   **Header:** Der Titel ist "**M.Y.R.A. System Interface**". M.Y.R.A.s Daten: **SimSchritt (M): 280**, **Fitness (M): 0.467**.
> *   **Aktiver Tab:** "**Dual AI**" ist violett hervorgehoben.
> *   **Eingabebereich:** Zeigt Felder für Start-Prompt und Runden (voreingestellt auf 3).
> *   **Hauptinhaltsbereich:** Der rechte Hauptbereich ist leer. Die Chat-Eingabezeile für M.Y.R.A. ist am unteren Rand weiterhin sichtbar.

Sobald die Konversation gestartet ist, würde der Hauptinhaltsbereich den Dialogverlauf anzeigen. Dieses Panel bietet eine einzigartige Möglichkeit, die Interaktion der beiden KI-Persönlichkeiten zu studieren.

---

### 3.8 Documentation Panel

Das **Documentation Panel** ermöglicht den direkten Zugriff auf die integrierte Anwendungsdokumentation. Es wird über den globalen Navigations-Tab "**Dokumentation**" in der linken Seitenleiste aufgerufen. Wenn dieser Tab aktiviert ist (*im Screenshot durch eine violette Hervorhebung gekennzeichnet*), ersetzt sein Inhalt die Standard-Status-Dashboards. Der Titel im Header ändert sich zu "**Dokumentation Interface**".

Das Panel ist wie folgt aufgebaut:

*   **Panel-Titel und Icon:** Oben im Panel steht "**Dokumentation**".
*   **Dokumentenauswahl (Dropdown-Menü):**
    *   Ein Dropdown-Menü rechts im Panel-Header ermöglicht die Auswahl des Themas.
    *   Im Screenshot ist "**Hauptdokumentation**" ausgewählt.
    *   Optionen umfassen:
        *   `Hauptdokumentation`
        *   `Konfig: Adaptive Fitness`
        *   `Konfig: KI Provider`
        *   `Konfig: Wissensbasis & RAG`
        *   `Konfig: Persona & Verhalten`
        *   `Konfig: SubQG Simulation`
*   **Inhaltsanzeige:**
    *   Zeigt den Inhalt der ausgewählten Markdown-Datei.
    *   Die korrekte Sprachversion (Deutsch/Englisch) wird automatisch geladen. Im Screenshot ist die deutsche Version der "**M.Y.R.A. SubQG Integration - Dokumentation**" sichtbar.
    *   Markdown wird zu HTML konvertiert (Überschriften, Listen, Links, etc.).

> **`[Abbildung 3.8-1: Documentation Panel - Anzeige der Hauptdokumentation mit Auswahlmenü (Documentation_Panel.png)]`**
> *Abbildung 3.8-1* zeigt das Documentation Panel.
> *   **Header:** Titel "**Dokumentation Interface**". M.Y.R.A.s Daten: **SimSchritt (M): 263**, **Fitness (M): 0.457**.
> *   **Aktiver Tab:** "**Dokumentation**" ist violett hervorgehoben.
> *   **Dokumentenauswahl:** Dropdown ist geöffnet, "**Hauptdokumentation**" ausgewählt.
> *   **Inhaltsanzeige:** Beginn der deutschen Hauptdokumentation ist sichtbar.

Dieses Panel ermöglicht den direkten Zugriff auf Informationen in der Anwendung.

---

### 3.9 Settings Panel

Das **Settings Panel** bietet eine umfassende Oberfläche zur detaillierten Konfiguration verschiedener Aspekte der Anwendung, einschließlich der Parameter für M.Y.R.A., C.A.E.L.U.M. und globale Systemeinstellungen. Es ist über den globalen Navigations-Tab "**Einstellungen**" in der linken Seitenleiste zugänglich. Wenn dieser Tab aktiviert ist (*in den Screenshots durch eine violette Hervorhebung gekennzeichnet*), ersetzt der Inhalt des Settings Panels die Standard-Status-Dashboards in der Seitenleiste. Der Hauptinhaltsbereich rechts bleibt das Chat-Interface mit M.Y.R.A.

Das Panel ist in zwei Hauptbereiche unterteilt:

*   **Linke Navigationsleiste für Konfigurationsgruppen:**
    *   Eine vertikale Liste von Tabs oder Buttons ermöglicht die Auswahl der spezifischen Konfigurationsgruppe, die im rechten Bereich des Panels bearbeitet werden soll. Die Gruppen umfassen:
        *   `Lokalisierung` (mit einem Globus-Icon)
        *   `M.Y.R.A. KI Provider`
        *   `C.A.E.L.U.M. KI Provider`
        *   `M.Y.R.A. Persona`
        *   `C.A.E.L.U.M. Persona`
        *   `M.Y.R.A. System`
        *   `C.A.E.L.U.M. System`
        *   `Allgemeines System`
        *   `Adaptive Fitness (Basisgew.)`
        *   `Adaptive Fitness (Dimensionen)`
    *   Die aktuell ausgewählte Gruppe ist hervorgehoben (z.B. durch eine andere Hintergrundfarbe).
*   **Rechter Einstellungsbereich:**
    *   Dieser Bereich zeigt die spezifischen Konfigurationsfelder für die in der linken Navigationsleiste ausgewählte Gruppe an.
    *   **Globale Aktionsbuttons:** Oben in diesem Bereich befinden sich Buttons, die für alle Einstellungen gelten:
        *   `Alles Zurücksetzen` (rot): Setzt alle Konfigurationen in allen Gruppen auf ihre Standardwerte zurück.
        *   `Änderungen speichern` (grün): Übernimmt und speichert alle vorgenommenen Änderungen.
    *   **Gruppenspezifischer Reset-Button:** Neben dem Titel der aktuell ausgewählten Konfigurationsgruppe befindet sich oft ein Button `Gruppe zurücksetzen` (rot), um nur die Einstellungen dieser spezifischen Gruppe auf ihre Standardwerte zurückzusetzen.
    *   **Eingabefelder:** Für jede Einstellung gibt es entsprechende Eingabefelder (Textfelder, Dropdowns, Zahlenfelder etc.) mit Beschriftungen, die den Parameter erklären.

Im Folgenden werden die Inhalte der einzelnen Konfigurationsgruppen anhand der bereitgestellten Screenshots illustriert:

> **`[Abbildung 3.9-1: Settings Panel - Gruppe 'Lokalisierung' (Settings_Localization.png)]`**
> *   Zeigt die Gruppe "**Lokalisierung**".
> *   **Header:** Der Anwendungstitel ist "**M.Y.R.A. System Interface**". M.Y.R.A.s **SimSchritt (M): 282**, **Fitness (M): 0.485**.
> *   **Aktiver Tab:** "**Einstellungen**" in der Hauptnavigation und "**Lokalisierung**" in der Gruppen-Navigation sind aktiv.
> *   **Felder:**
>     *   **Sprache:** Dropdown, aktuell "**Deutsch**" ausgewählt.
>     *   **Design-Thema:** Dropdown, aktuell "**Matrix (Kontrast)**" ausgewählt.

> **`[Abbildung 3.9-2: Settings Panel - Gruppe 'M.Y.R.A. KI Provider' (Settings_MYRA_AI_Provider.png)]`**
> *   Zeigt die Gruppe "**M.Y.R.A. KI Provider**".
> *   **Felder:**
>     *   **M.Y.R.A. KI Provider:** Dropdown, aktuell "**Gemini API**" ausgewählt.
>     *   **M.Y.R.A. Gemini Modell:** Textfeld, Wert "**gemini-2.5-flash-preview-04-17**".
>     *   **M.Y.R.A. Basis Temperatur:** Zahlenfeld, Wert "**0,7**".

> **`[Abbildung 3.9-3: Settings Panel - Gruppe 'C.A.E.L.U.M. KI Provider' (Settings_CAELUM_AI_Provider.png)]`**
> *   Zeigt die Gruppe "**C.A.E.L.U.M. KI Provider**".
> *   **Felder:**
>     *   **C.A.E.L.U.M. KI Provider:** Dropdown, aktuell "**Gemini API**" ausgewählt.
>     *   **C.A.E.L.U.M. Gemini Modell:** Textfeld, Wert "**gemini-2.5-flash-preview-05-20**".
>     *   **C.A.E.L.U.M. Basis Temperatur:** Zahlenfeld, Wert "**0,5**".

> **`[Abbildung 3.9-4: Settings Panel - Gruppe 'M.Y.R.A. Persona' (Settings_MYRA_Persona.png)]`**
> *   Zeigt die Gruppe "**M.Y.R.A. Persona**".
> *   **Felder:**
>     *   **M.Y.R.A. Name:** Textfeld, Wert "**M.Y.R.A.**".
>     *   **Benutzername:** Textfeld, Wert "**Raff**".
>     *   **M.Y.R.A. Rollenbeschreibung:** Mehrzeiliges Textfeld mit einer detaillierten Beschreibung (Text im Screenshot sichtbar).
>     *   **M.Y.R.A. Ethik:** Mehrzeiliges Textfeld mit ethischen Grundsätzen (Text im Screenshot sichtbar).
>     *   **M.Y.R.A. Antwortinstruktion:** Mehrzeiliges Textfeld mit Anweisungen zum Antwortverhalten (Text im Screenshot sichtbar).

> **`[Abbildung 3.9-5: Settings Panel - Gruppe 'C.A.E.L.U.M. Persona' (Settings_CAELUM_Persona.png)]`**
> *   Zeigt die Gruppe "**C.A.E.L.U.M. Persona**".
> *   **Felder:**
>     *   **C.A.E.L.U.M. Name:** Textfeld, Wert "**C.A.E.L.U.M.**".
>     *   **C.A.E.L.U.M. Rollenbeschreibung:** Mehrzeiliges Textfeld (Text im Screenshot sichtbar).
>     *   **C.A.E.L.U.M. Ethik:** Mehrzeiliges Textfeld (Text im Screenshot sichtbar).
>     *   **C.A.E.L.U.M. Antwortinstruktion:** Mehrzeiliges Textfeld (Text im Screenshot sichtbar).

> **`[Abbildung 3.9-6: Settings Panel - Gruppe 'M.Y.R.A. System' (Settings_MYRA_System.png)]`**
> *   Zeigt die Gruppe "**M.Y.R.A. System**".
> *   **Felder:**
>     *   **M.Y.R.A. SubQG Größe:** Wert "**16**".
>     *   **M.Y.R.A. SubQG Basisenergie:** Wert "**0,01**".
>     *   **M.Y.R.A. SubQG Kopplung:** Wert "**0,015**".
>     *   **M.Y.R.A. SubQG Init. Energierauschen StdAbw:** Wert "**0,001**".
>     *   **M.Y.R.A. RNG Typ:** Dropdown, "**Deterministisch (Seed)**" ausgewählt.
>     *   **M.Y.R.A. SubQG Seed (optional):** Platzhalter "**Leer für zufällig**".
>     *   **M.Y.R.A. Knoten Aktivierungszerfall:** Wert "**0,95**".
>     *   **M.Y.R.A. Emotionszerfall:** Wert "**0,95**".
>     *   **M.Y.R.A. Fitness Update Intervall (Schritte):** Wert "**3**".

> **`[Abbildung 3.9-7: Settings Panel - Gruppe 'C.A.E.L.U.M. System' (Settings_CAELUM_System.png)]`**
> *   Zeigt die Gruppe "**C.A.E.L.U.M. System**".
> *   **Felder:**
>     *   **C.A.E.L.U.M. SubQG Größe:** Wert "**12**".
>     *   **C.A.E.L.U.M. SubQG Basisenergie:** Wert "**0,005**".
>     *   **C.A.E.L.U.M. RNG Typ:** Dropdown, "**Deterministisch (Seed)**" ausgewählt.
>     *   **C.A.E.L.U.M. SubQG Seed (optional):** Wert "**12345**".
>     *   **C.A.E.L.U.M. Knoten Aktivierungszerfall:** Wert "**0,97**".
>     *   **C.A.E.L.U.M. Emotionszerfall:** Wert "**0,98**".
>     *   **C.A.E.L.U.M. Fitness Update Intervall (Schritte):** Wert "**5**".

> **`[Abbildung 3.9-8: Settings Panel - Gruppe 'Allgemeines System' (Settings_General_System.png)]`**
> *   Zeigt die Gruppe "**Allgemeines System**".
> *   **Felder:**
>     *   **Aktive Chat-KI:** Dropdown, "**M.Y.R.A.**" ausgewählt.
>     *   **Max. Chatverlauf für Prompt:** Wert "**8**".
>     *   **Temperatur: Limbus Einfluss:** Wert "**0,1**".
>     *   **Temperatur: Creativus Einfluss:** Wert "**0,15**".
>     *   **RAG Chunk Größe:** Wert "**500**".
>     *   **RAG Chunk Überlappung:** Wert "**50**".
>     *   **RAG Max. Chunks Abruf:** Wert "**3**".
>     *   **Max. Einträge Emotionsverlauf:** Wert "**200**".

> **`[Abbildung 3.9-9: Settings Panel - Gruppe 'Adaptive Fitness (Basisgew.)' (Settings_Adaptive_Fitness_Base.png)]`**
> *   Zeigt die Gruppe "**Adaptive Fitness (Basisgew.)**" für die Basisgewichtungen.
> *   **Felder:**
>     *   **Gewicht: Kohärenz-Proxy:** Wert "**0,15**".
>     *   **Gewicht: Netzwerkkomplexitäts-Proxy:** Wert "**0,05**".
>     *   **Gewicht: Mittl. Resonator-Score:** Wert "**0,15**".
>     *   **Gewicht: Zielerreichungs-Proxy:** Wert "**0,15**".
>     *   **Gewicht: Explorations-Score:** Wert "**0,15**".
>     *   **Gewicht: Fokus-Score:** Wert "**0,1**".
>     *   **Gewicht: Kreativitäts-Score:** Wert "**0,05**".
>     *   **Gewicht: Konflikt-Malusfaktor:** Wert "**-0,1**".

> **`[Abbildung 3.9-10: Settings Panel - Gruppe 'Adaptive Fitness (Dimensionen)' (Settings_Adaptive_Fitness_Dimensions.png)]`**
> *   Zeigt die Gruppe "**Adaptive Fitness (Dimensionen)**" für die Dimensionsbeiträge.
> *   **Felder:**
>     *   **Dim: Wissenserw. -> Lerneffizienz:** Wert "**0,5**".
>     *   **Dim: Wissenserw. -> Exploration:** Wert "**0,5**".
>     *   **Dim: Int. Kohärenz -> Kohärenz:** Wert "**0,6**".
>     *   **Dim: Int. Kohärenz -> Resonanz:** Wert "**0,2**".
>     *   **Dim: Ausdr. Kreat. -> Kreativität:** Wert "**0,5**".
>     *   **Dim: Ausdr. Kreat. -> Creativus Akt.:** Wert "**0,3**".
>     *   **Dim: Ausdr. Kreat. -> Exploration:** Wert "**0,2**".
>     *   **Dim: Zielfokus -> Zielerreichung:** Wert "**0,6**".
>     *   **Dim: Zielfokus -> Fokus:** Wert "**0,4**".

Das Settings Panel ist somit die zentrale Anlaufstelle für die Feinabstimmung und Anpassung nahezu aller Aspekte des M.Y.R.A. & C.A.E.L.U.M. Systems, was eine hohe Flexibilität für Experimente und spezifische Anwendungsfälle ermöglicht.

---

### 3.10 Chat Interface (M.Y.R.A.)

Der Hauptbereich auf der rechten Seite bleibt das primäre Chat-Interface für direkte Konversationen mit M.Y.R.A.

*   **Nachrichtenanzeige:** Zeigt den Gesprächsverlauf zwischen dem Benutzer und M.Y.R.A.
*   **Eingabefeld:** Textfeld zum Eingeben von Nachrichten an M.Y.R.A.
*   **Senden-Button:** Schickt die eingegebene Nachricht ab.

---

## 4. Technische Architektur & Code Dokumentation

### 4.1 Projektstruktur

*   **`public/`**
    *   `Dokumentation_de.md` (Diese Datei in Deutsch)
    *   `Dokumentation_en.md` (Diese Datei in Englisch)
    *   `docs/` (enthält alle `config_*.md` Dateien, jeweils in `_de.md` und `_en.md` Versionen)
        *   `config_adaptive_fitness_de.md` / `config_adaptive_fitness_en.md`
        *   `config_ai_provider_de.md` / `config_ai_provider_en.md`
        *   `config_knowledge_rag_de.md` / `config_knowledge_rag_en.md`
        *   `config_persona_behavior_de.md` / `config_persona_behavior_en.md`
        *   `config_subqg_simulation_de.md` / `config_subqg_simulation_en.md`
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
    *   ... (andere Konfigurationsdateien wie `tsconfig.json`, `package.json` etc.)

### 4.2 `index.html`

Enthält das Grundgerüst der HTML-Seite. Bindet Tailwind CSS, Heroicons und die JavaScript-Module ein. Definiert eine `importmap` für externe Bibliotheken wie React, ReactDOM, `@google/genai`, `uuid`, `chart.js`, `react-chartjs-2`, `react-markdown`, `remark-gfm` und `react-syntax-highlighter`. Setzt initiales Theme und Sprache aus `localStorage`.

### 4.3 `metadata.json`

Metadaten der Anwendung, Name, Beschreibung, angeforderte Berechtigungen (z.B. Kamera, Mikrofon - aktuell nicht genutzt).

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
    *   Rendert die Seitenleiste mit Navigations-Tabs für M.Y.R.A.-spezifische Ansichten (Status (M), Nodes (M), SubQG (M)), C.A.E.L.U.M.-spezifische Ansichten (Status (C), Nodes (C), SubQG (C)) und globale Ansichten (Emotion Timeline, Knowledge, Documentation, Dual AI, Settings).
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
    *   `ActiveTab`: Definiert die möglichen aktiven Tabs, inklusive `'documentation'`.

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
        *   `loadDocumentationKnowledge`: Lädt beim Start automatisch Dokumentationsdateien (z.B. `Dokumentation_de.md`, `docs/config_ai_provider_en.md`) basierend auf der aktuellen Spracheinstellung.
        *   `loadAndProcessFile`, `clearAllKnowledge`, `retrieveRelevantChunks`.
    *   **SubQG-Interaktion:** `injectSubQgStimulus` (für M.Y.R.A.) und `injectSubQgStimulusCaelum` (für C.A.E.L.U.M.).
    *   **Adaptive Fitness:** Initialisiert und verwendet zwei `AdaptiveFitnessManager`-Instanzen.
    *   **Internationalisierung (`t` Funktion):** Stellt Übersetzungen bereit.

### 4.10 `components/`

#### 4.10.1 `ChatInterface.tsx`

Für die direkte Interaktion mit M.Y.R.A.

#### 4.10.2 `DualAiConversationPanel.tsx`

Ermöglicht Konversationen zwischen M.Y.R.A. und C.A.E.L.U.M.

#### 4.10.3 `EmotionTimelinePanel.tsx`

Zeigt den zeitlichen Verlauf der PAD-Werte für M.Y.R.A. und C.A.E.L.U.M. an.

#### 4.10.4 `DocumentationPanel.tsx`

*   **Zweck:** Zeigt Markdown-basierte Dokumentationsdateien an.
*   **Funktionalität:** Lädt und rendert ausgewählte `.md`-Dateien (z.B. `Dokumentation_de.md`, `docs/config_ai_provider_en.md`) basierend auf der aktuellen Spracheinstellung der App. Verwendet `react-markdown` und `react-syntax-highlighter`.

#### 4.10.5 `IconComponents.tsx`

Enthält SVG-Icons, inklusive `DocumentTextIcon` für den Dokumentations-Tab.

#### 4.10.6 `KnowledgePanel.tsx`

Verwaltung der Wissensbasis (RAG).

#### 4.10.7 `NodePanel.tsx`

Visualisiert die Knoten von M.Y.R.A. oder C.A.E.L.U.M.

#### 4.10.8 `SettingsPanel.tsx`

UI zur Konfiguration aller Parameter in `MyraConfig`.

#### 4.10.9 `SubQGDisplay.tsx`

Visualisiert das SubQG von M.Y.R.A. oder C.A.E.L.U.M.

#### 4.10.10 `SystemStatusPanel.tsx`

Zeigt den Status (Emotionen, Fitness, SubQG) von M.Y.R.A. oder C.A.E.L.U.M. an.

### 4.11 `services/aiService.ts`

Kapselt die Logik für die Kommunikation mit den KI-APIs.

### 4.12 `utils/`

#### 4.12.1 `adaptiveFitnessManager.ts`

Klasse zur Berechnung der adaptiven Fitness.

#### 4.12.2 `db.ts`

Kapselt die Interaktionen mit IndexedDB.

#### 4.12.3 `rng.ts`

Definiert die RNG-Implementierungen.

#### 4.12.4 `uiHelpers.ts`

Hilfsfunktionen für die UI, z.B. `getDominantAffect` und `interpretPAD`.

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

*   **Automatische Ladung:** Beim Start der Anwendung lädt `loadDocumentationKnowledge` in `useMyraState` den Inhalt von Dokumentationsdateien wie `Dokumentation_de.md` (oder `_en.md`) und allen `.md`-Dateien im `public/docs/`-Verzeichnis (mit passendem Sprachsuffix), zerlegt sie in Chunks und speichert sie in IndexedDB. Bereits vorhandene Chunks aus diesen Quellen werden zuvor gelöscht, um Aktualisierungen zu ermöglichen.
*   **Manuelles Hochladen:** Über das `KnowledgePanel`.
*   **Verarbeitung & Abruf:** Relevante Chunks werden bei Bedarf abgerufen und der KI als Kontext bereitgestellt.

### 5.4 Konfigurationsmanagement

Die `MyraConfig` in `useMyraState` speichert alle Einstellungen. Änderungen im `SettingsPanel` werden über `updateMyraConfig` verarbeitet und im `localStorage` persistiert.

### 5.5 Emotionsverlauf-Tracking

*   In `useMyraState.ts` werden die PAD-Werte (Pleasure, Arousal, Dominance) zusammen mit einem Zeitstempel und dem dominanten Affekt nach jedem Simulationsschritt für M.Y.R.A. (`padHistoryMyra`) und C.A.E.L.U.M. (`padHistoryCaelum`) in Arrays gespeichert.
*   Die Länge dieser Arrays ist durch `myraConfig.maxPadHistorySize` begrenzt.
*   Das `EmotionTimelinePanel.tsx` visualisiert diese Daten mithilfe von `react-chartjs-2`.

### 5.6 Dokumentationsanzeige

*   Das `DocumentationPanel.tsx` ist für die Anzeige der In-App-Dokumentation zuständig.
*   Es verwendet ein Dropdown, um ein Dokumentationsthema auszuwählen.
*   Basierend auf der Auswahl und der globalen Spracheinstellung (`myraConfig.language`) wird die entsprechende Markdown-Datei (z.B. `/Dokumentation_de.md` oder `/docs/config_ai_provider_en.md`) vom `public`-Verzeichnis geladen.
*   `react-markdown` mit `remark-gfm` und `react-syntax-highlighter` rendert den Markdown-Inhalt zu HTML.

---

## 6. Detaillierte Konfigurationsparameter

Die detaillierte Beschreibung aller Konfigurationsparameter ist in separate Dateien im `docs/` Verzeichnis ausgelagert (jeweils in Deutsch und Englisch verfügbar):

*   [**AI Provider Configuration**](./docs/config_ai_provider_de.md)
*   [**Persona & Behavior**](./docs/config_persona_behavior_de.md)
*   [**SubQG Simulation**](./docs/config_subqg_simulation_de.md)
*   [**Knowledge Base & RAG**](./docs/config_knowledge_rag_de.md)
*   [**Adaptive Fitness**](./docs/config_adaptive_fitness_de.md)

---

## 7. Einrichtung und Start

1.  **Abhängigkeiten installieren:** `npm install` (oder `yarn install`).
2.  **API Key:** Erstellen Sie eine `.env`-Datei im Projekt-Root und fügen Sie Ihren Gemini API Key hinzu:
    `GEMINI_API_KEY=DEIN_API_KEY_HIER`
3.  **Entwicklungsserver starten:** `npm run dev` (oder `yarn dev`).
4.  **Dokumentationsdateien:** Platzieren Sie Ihre Markdown-Dokumentationsdateien (jeweils als `*_de.md` und `*_en.md`) im `public`-Verzeichnis.
    *   Hauptdokumentation: `public/Dokumentation_de.md` und `public/Dokumentation_en.md`.
    *   Detailkonfigurationen: `public/docs/config_BEZEICHNUNG_de.md` und `public/docs/config_BEZEICHNUNG_en.md`.
    Diese werden beim Start automatisch für die RAG-Funktion und den Documentation Viewer geladen.
5.  **Zugriff:** Öffnen Sie die angezeigte lokale URL (z.B. `http://localhost:5173`) oder Netzwerk-URL in Ihrem Browser.
