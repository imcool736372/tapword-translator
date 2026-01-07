<p align="center">
  <img src="resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>Traduire comme prendre des notes</b>
</p>

<p align="center">
    <br> 
    <a href="README.md">English</a> | 
    <a href="README-CN.md">简体中文</a> | 
    <a href="README-DE.md">Deutsch</a> | 
    <a href="README-ES.md">Español</a> | 
    <b>Français</b> | 
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

![Démonstration de TapWord Translator](resources/public/demo.gif)

## 📖 Introduction

Les traductions contextuelles apparaissent **directement sous le texte original**, comme des sous-titres dans un film ou des annotations dans un livre.

La philosophie est simple : **Ne pas interrompre**. Préserver l'état de « flux » de lecture de l'utilisateur tout en fournissant des traductions de haute qualité alimentées par l'IA lorsque nécessaire.

> Ce dépôt héberge l'**Édition Communautaire** de TapWord Translator. Elle est entièrement open source, axée sur la confidentialité et conçue pour fonctionner avec vos propres clés API (OpenAI, DeepSeek ou tout fournisseur compatible OpenAI).

## ⭐ Fonctionnalités principales

### Traduction style annotation
Les traductions apparaissent comme des **sous-titres directement sous le texte**. Pas de fenêtres contextuelles, pas de sauts. Cela ressemble à prendre des notes sur la page, préservant votre flux de lecture.

### Précision alimentée par l'IA
Alimenté par une IA avancée (LLMs), il comprend le **contexte complet** des phrases, offrant des traductions bien plus précises et nuancées que les outils traditionnels.

### Sélection intelligente de mots
Sélectionnez une partie d'un mot, et l'extension **étend automatiquement au mot complet**. Pas besoin de sélection précise—surlignez simplement n'importe quelle portion et obtenez la traduction du mot entier.


## 🚀 Installation

### Option 1 : Chrome Web Store (gratuit)
La version officielle est gratuite.

[**Installer depuis le Chrome Web Store**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### Option 2 : Compiler l'Édition Communautaire
Si vous préférez le modèle **Apportez votre propre clé**, vous pouvez la compiler vous-même :

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator-plugin.git
    cd tapword-translator-plugin
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Compiler le projet**
    ```bash
    npm run build:community
    ```

4.  **Charger dans Chrome**
    - Ouvrez Chrome et naviguez vers `chrome://extensions/`
    - Activez le **Mode développeur** (interrupteur en haut à droite)
    - Cliquez sur **Charger l'extension non empaquetée**
    - Sélectionnez le dossier `dist` généré à l'étape 3

## ⚙️ Configuration (Édition Communautaire)

Commencez à utiliser l'extension en 30 secondes :

1.  Cliquez sur l'icône de l'extension dans la barre d'outils de votre navigateur pour ouvrir le **Popup**
2.  Cliquez sur l'icône **Paramètres** (engrenage) pour ouvrir la page Options
3.  Localisez « API personnalisée » (obligatoire dans l'Édition Communautaire)
4.  Entrez votre **configuration API** :
    - **Clé API** : `sk-.......`
    - **Modèle** : `gpt-3.5-turbo`, `gpt-4o` ou autres modèles compatibles
    - **URL de base API** : Par défaut `https://api.openai.com/v1`, mais vous pouvez la modifier pour utiliser des proxies ou d'autres fournisseurs (ex. DeepSeek, Moonshot)
5.  Enregistrez et profitez !

## 🛠 Développement

Nous utilisons une stack moderne : **TypeScript**, **Vite** et **HTML/CSS pur**.

### Structure du projet
```
src/
├── 1_content/       # Scripts injectés dans les pages web (UI visible sur les pages)
├── 2_background/    # Service workers (appels API, menu contextuel)
├── 3_popup/         # UI du popup de l'extension
├── 5_backend/       # Services API partagés
├── 6_translate/     # Logique métier de traduction
└── 8_generate/      # Ingénierie de prompts LLM et analyse des réponses
```

### Commandes

| Commande | Description |
| :--- | :--- |
| `npm run dev:community` | Démarrer le serveur de développement en mode watch (Configuration Communautaire) |
| `npm run build:community` | Compiler pour la production (Configuration Communautaire) |
| `npm type-check` | Exécuter la vérification des types TypeScript |
| `npm test` | Exécuter les tests unitaires avec Vitest |

### Note d'architecture : Le système de « Double compilation »
Nous utilisons des variables d'environnement au moment de la compilation pour séparer la logique Communautaire et Officielle :
- **Compilation Communautaire** : `VITE_APP_EDITION=community`. Désactive la logique cloud propriétaire, impose l'utilisation d'API personnalisée et supprime le code TTS
- **Compilation Officielle** : (Privée) Inclut la logique serveur propriétaire

## 👏 Contribuer

Nous sommes une communauté d'apprenants de langues et de lecteurs passionnés. Si vous avez des idées nouvelles, des suggestions d'interface ou des corrections de bugs, nous serions ravis de recevoir vos contributions. Les Pull Requests sont chaleureusement accueillies !

1.  Forkez le projet
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3.  Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Poussez vers la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

## 📄 Licence

Distribué sous la **Licence AGPL-3.0**. Voir `LICENSE.txt` pour plus d'informations.

---

<p align="center">
  Créé avec ❤️ pour les lecteurs du monde entier.
</p>
