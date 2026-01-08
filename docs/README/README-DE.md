<p align="center">
  <img src="../../resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>Übersetzen wie Notizen machen</b>
</p>

<p align="center">
    <br> 
    <a href="../../README.md">English</a> | 
    <a href="README-CN.md">简体中文</a> | 
    <b>Deutsch</b> | 
    <a href="README-ES.md">Español</a> | 
    <a href="README-FR.md">Français</a> | 
    <a href="README-JA.md">日本語</a> | 
    <a href="README-KO.md">한국어</a> | 
    <a href="README-RU.md">Русский</a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb" target="_blank">
    <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/stars/bjcaamcpfbhldgngnfmnmcdkcmdmhebb?color=F472B6&label=Chrome&style=flat-square&logo=google-chrome&logoColor=white" />
  </a>
  <a href="LICENSE.txt" target="_blank">
    <img alt="License" src="https://img.shields.io/badge/License-AGPL--3.0-4ADE80?style=flat-square" />
  </a>
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
</p>

---

![TapWord Translator Demo](../../resources/public/demo.gif)

## 📖 Über das Projekt

Kontextbewusste Übersetzungen werden **direkt unter dem Originaltext** platziert – wie Untertitel in einem Film oder Anmerkungen in einem Buch.

Die Kernidee ist einfach: **Keine Ablenkungen.** Nutzer bleiben im Lesefluss, während hochwertige KI-Übersetzungen bei Bedarf bereitstehen.

> Dieses Repository enthält die **Community Edition** von TapWord Translator. Sie ist vollständig quelloffen, datenschutzorientiert und funktioniert mit Ihren eigenen API-Keys (OpenAI, DeepSeek oder jeder OpenAI-kompatible Anbieter).

## ⭐ Hauptfunktionen

### Übersetzungen im Notizstil
Übersetzungen erscheinen als **Untertitel direkt unter dem Text**. Keine Pop-ups, keine Sprünge. Es fühlt sich an wie Notizen auf einer Seite – Ihr Lesefluss bleibt ungestört.

### KI-gestützte Präzision
Angetrieben durch fortschrittliche KI (LLMs) versteht die Erweiterung den **vollständigen Kontext** von Sätzen und liefert Übersetzungen, die weit genauer und nuancierter sind als herkömmliche Tools.

### Intelligente Wortauswahl
Wählen Sie einen Teil eines Wortes aus, und die Erweiterung **erweitert automatisch auf das vollständige Wort**. Keine präzise Auswahl nötig—markieren Sie einfach einen beliebigen Teil und erhalten Sie die Übersetzung des ganzen Wortes.


## 🚀 Installation

### Option 1: Chrome Web Store (kostenlos)
Die offizielle Version kann kostenlos genutzt werden.

[**Im Chrome Web Store installieren**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### Option 2: Community Edition selbst erstellen
Falls Sie das **Bring Your Own Key**-Modell bevorzugen, können Sie die Erweiterung selbst bauen:

1.  **Repository klonen**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator-plugin.git
    cd tapword-translator-plugin
    ```

2.  **Abhängigkeiten installieren**
    ```bash
    npm install
    ```

3.  **Projekt bauen**
    ```bash
    npm run build:community
    ```

4.  **In Chrome laden**
    - Öffnen Sie Chrome und navigieren Sie zu `chrome://extensions/`
    - Aktivieren Sie den **Entwicklermodus** (Schalter oben rechts)
    - Klicken Sie auf **Entpackte Erweiterung laden**
    - Wählen Sie den in Schritt 3 erstellten `dist`-Ordner aus

## ⚙️ Konfiguration (Community Edition)

Starten Sie in 30 Sekunden:

1.  Klicken Sie auf das Erweiterungs-Symbol in Ihrer Browser-Symbolleiste, um das **Popup** zu öffnen
2.  Klicken Sie auf das **Einstellungs-Symbol** (Zahnrad), um die Optionsseite zu öffnen
3.  Finden Sie "Benutzerdefinierte API" (in der Community Edition erforderlich)
4.  Geben Sie Ihre **API-Konfiguration** ein:
    - **API-Key**: `sk-.......`
    - **Modell**: `gpt-3.5-turbo`, `gpt-4o` oder andere kompatible Modelle
    - **API-Basis-URL**: Standard ist `https://api.openai.com/v1`, kann aber für Proxys oder andere Anbieter geändert werden (z.B. DeepSeek, Moonshot)
5.  Speichern und loslegen!

## 🛠 Entwicklung

Wir nutzen einen modernen Stack: **TypeScript**, **Vite** und **reines HTML/CSS**.

### Projektstruktur
```
src/
├── 1_content/       # Skripte für Webseiten (UI auf Seiten)
├── 2_background/    # Service Workers (API-Aufrufe, Kontextmenü)
├── 3_popup/         # Erweiterungs-Popup-UI
├── 5_backend/       # Gemeinsame API-Dienste
├── 6_translate/     # Übersetzungs-Geschäftslogik
└── 8_generate/      # LLM-Prompt-Engineering & Antwort-Parsing
```

### Befehle

| Befehl | Beschreibung |
| :--- | :--- |
| `npm run dev:community` | Entwicklungsserver im Watch-Modus starten (Community-Konfiguration) |
| `npm run build:community` | Produktions-Build erstellen (Community-Konfiguration) |
| `npm type-check` | TypeScript-Typprüfung durchführen |
| `npm test` | Unit-Tests mit Vitest ausführen |

### Architektur-Hinweis: Das „Dual Build"-System
Wir verwenden Compile-Time-Umgebungsvariablen, um Community- und offizielle Logik zu trennen:
- **Community Build**: `VITE_APP_EDITION=community`. Deaktiviert proprietäre Cloud-Logik, erzwingt benutzerdefinierte API-Nutzung und entfernt TTS-Code
- **Offizieller Build**: (Privat) Enthält proprietäre Server-Logik

## 👏 Mitwirken

Wir sind eine Community von Sprachlernenden und begeisterten Lesern. Wenn Sie frische Ideen, UI-Vorschläge oder Bug-Fixes haben, würden wir uns über Ihre Beiträge freuen. Pull Requests sind herzlich willkommen!

1.  Forken Sie das Projekt
2.  Erstellen Sie Ihren Feature-Branch (`git checkout -b feature/AmazingFeature`)
3.  Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4.  Pushen Sie zum Branch (`git push origin feature/AmazingFeature`)
5.  Öffnen Sie einen Pull Request

## 📄 Lizenz

Veröffentlicht unter der **AGPL-3.0-Lizenz**. Weitere Informationen finden Sie in `LICENSE.txt`.

---

<p align="center">
  Mit ❤️ für Leser auf der ganzen Welt gemacht.
</p>
