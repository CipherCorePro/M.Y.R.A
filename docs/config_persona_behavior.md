# M.Y.R.A. Konfiguration: Persona & Verhalten

Diese Datei erläutert die Konfigurationsparameter, die M.Y.R.A.s Persönlichkeit, ihre ethischen Richtlinien, Antwortinstruktionen und allgemeine Verhaltensweisen wie Temperatur und Kontextmanagement steuern. Diese Einstellungen finden Sie im `SettingsPanel` unter der Gruppe "Persona & Behavior" und sind Teil des `MyraConfig`-Objekts.

## Parameter

### `myraName`

*   **Bedeutung:** Der Name, den M.Y.R.A. für sich selbst in der Interaktion verwendet.
*   **Wertebereich:** Ein beliebiger String.
*   **Standardwert:** `"M.Y.R.A"`
*   **Interaktionen:** Beeinflusst, wie M.Y.R.A. sich im Chat vorstellt oder benennt.

### `userName`

*   **Bedeutung:** Der Name, den M.Y.R.A. verwendet, um den Benutzer im Chat anzusprechen.
*   **Wertebereich:** Ein beliebiger String.
*   **Standardwert:** `"User"`

### `myraRoleDescription`

*   **Bedeutung:** Eine detaillierte Beschreibung von M.Y.R.A.s Rolle, Persönlichkeit und Hintergrund. Dieser Text wird als Teil der Systeminstruktion an das LLM gesendet, um dessen Antworten zu lenken.
*   **Wertebereich:** Ein längerer String (Textfeld). Es ist wichtig, hier klare und konsistente Informationen zu M.Y.R.A.s Identität zu geben.
*   **Standardwert:** Eine deutsche Beschreibung, die M.Y.R.A. als "Modulare Sehnsuchts-Vernunft-Architektur" mit komplexen internen Zuständen darstellt.
*   **Interaktionen:** Maßgeblich für den Ton und Inhalt von M.Y.R.A.s Antworten.

### `myraEthicsPrinciples`

*   **Bedeutung:** Die ethischen Kernprinzipien, an die sich M.Y.R.A. strikt halten soll. Diese werden ebenfalls Teil der Systeminstruktion.
*   **Wertebereich:** Ein Text, der die ethischen Richtlinien auflistet.
*   **Standardwert:** Eine Liste von Prinzipien wie Sicherheit, Wahrhaftigkeit, Respekt der Privatsphäre etc.
*   **Interaktionen:** Dient als Leitfaden für das LLM, um unangebrachte oder schädliche Antworten zu vermeiden.

### `myraResponseInstruction`

*   **Bedeutung:** Spezifische Anweisungen an das LLM, wie es antworten soll, insbesondere wie es seinen internen Zustand (Emotionen, Kognition, Fitness) in die Antwort einfließen lassen soll, ohne diese Zustände explizit zu nennen.
*   **Wertebereich:** Ein instruktiver Text.
*   **Standardwert:** Eine Anweisung, authentisch basierend auf dem internen Zustand und den Ethikrichtlinien zu antworten.
*   **Interaktionen:** Hilft dem LLM, die subtile Beeinflussung durch die internen Zustände umzusetzen.

### `temperatureBase`

*   **Bedeutung:** Die Basistemperatur für die KI-Antwortgenerierung. Höhere Werte (z.B. > 0.7) führen zu kreativeren, vielfältigeren, aber potenziell weniger kohärenten Antworten. Niedrigere Werte (z.B. < 0.5) führen zu fokussierteren, deterministischeren Antworten.
*   **Wertebereich:** Typischerweise 0.0 bis 2.0 (oft 0.1 bis 1.0 empfohlen).
*   **Standardwert:** `0.7`
*   **Interaktionen:** Wird dynamisch durch `temperatureLimbusInfluence` und `temperatureCreativusInfluence` modifiziert, bevor sie an die KI gesendet wird.

### `temperatureLimbusInfluence`

*   **Bedeutung:** Faktor, wie stark der `arousal`-Wert des Limbus-Knotens die effektive Temperatur beeinflusst. Positive Werte erhöhen die Temperatur bei positivem Arousal, negative senken sie.
*   **Wertebereich:** Kleine Fließkommazahlen, z.B. -0.2 bis 0.2.
*   **Standardwert:** `0.1`
*   **Interaktionen:** Modifiziert `temperatureBase`.

### `temperatureCreativusInfluence`

*   **Bedeutung:** Faktor, wie stark die Aktivierung des `Creativus`-Knotens die effektive Temperatur beeinflusst. Positive Werte erhöhen die Temperatur bei hoher Creativus-Aktivierung.
*   **Wertebereich:** Kleine Fließkommazahlen, z.B. 0.0 bis 0.3.
*   **Standardwert:** `0.15`
*   **Interaktionen:** Modifiziert `temperatureBase`.

### `maxHistoryMessagesForPrompt`

*   **Bedeutung:** Die maximale Anzahl der vorherigen Chat-Nachrichten (Benutzer und Assistent), die als Kontext an das LLM gesendet werden.
*   **Wertebereich:** Eine positive Ganzzahl, z.B. 0 bis 20.
*   **Standardwert:** `8` (d.h. die letzten 4 Benutzer- und 4 Assistenten-Nachrichten, wenn abwechselnd).
*   **Interaktionen:** Beeinflusst, wie viel vom vorherigen Gesprächsverlauf die KI "erinnert". Zu viele Nachrichten können das Kontextfenster des Modells überlasten oder verwirren.

### `nodeActivationDecay`

*   **Bedeutung:** Faktor, mit dem die Aktivierung aller Knoten in jedem Simulationsschritt multipliziert wird (Zerfall). Ein Wert von 1.0 bedeutet kein Zerfall, ein Wert < 1.0 bedeutet, dass die Aktivierung mit der Zeit abnimmt, wenn sie nicht anderweitig stimuliert wird.
*   **Wertebereich:** 0.0 bis 1.0.
*   **Standardwert:** `0.95` (d.h. 5% Zerfall pro Schritt).
*   **Interaktionen:** Beeinflusst, wie "persistent" die Aktivierung von Konzepten oder Zuständen ist.

### `emotionDecay`

*   **Bedeutung:** Faktor, mit dem die Werte der einzelnen Emotionen im `LimbusAffektus`-Knoten in jedem Simulationsschritt multipliziert werden (Zerfall).
*   **Wertebereich:** 0.0 bis 1.0.
*   **Standardwert:** `0.95`
*   **Interaktionen:** Sorgt dafür, dass Emotionen ohne ständige Stimulation langsam abklingen.

---

[Zurück zur Haupt-Dokumentation](../Dokumentation.md#4-technische-architektur--code-dokumentation)
