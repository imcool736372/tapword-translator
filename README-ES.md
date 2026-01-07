<p align="center">
  <img src="resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>Traduce como si tomaras notas</b>
</p>

<p align="center">
    <br> 
    <a href="README.md">English</a> | 
    <a href="README-CN.md">简体中文</a> | 
    <a href="README-DE.md">Deutsch</a> | 
    <b>Español</b> | 
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

![Demostración de TapWord Translator](resources/public/demo.gif)

## 📖 Introducción

Las traducciones contextuales aparecen **justo debajo del texto original**, como subtítulos en una película o anotaciones en un libro.

La filosofía es simple: **No interrumpir**. Mantener al usuario en el "estado de flujo" de lectura mientras proporciona traducciones de alta calidad impulsadas por IA cuando sea necesario.

> Este repositorio alberga la **Edición Comunitaria** de TapWord Translator. Es completamente de código abierto, enfocada en la privacidad y diseñada para funcionar con tus propias claves API (OpenAI, DeepSeek o cualquier proveedor compatible con OpenAI).

## ⭐ Características principales

### Traducción estilo notas
Las traducciones aparecen como **subtítulos directamente bajo el texto**. Sin ventanas emergentes, sin saltos. Se siente como tomar notas en la página, manteniendo tu flujo de lectura ininterrumpido.

### Precisión impulsada por IA
Impulsado por IA avanzada (LLMs), comprende el **contexto completo** de las oraciones, entregando traducciones que son mucho más precisas y matizadas que las herramientas tradicionales.

### Selección inteligente de palabras
Selecciona parte de una palabra y la extensión **expande automáticamente a la palabra completa**. No necesitas ser preciso—solo resalta cualquier porción y obtén la traducción de la palabra completa.


## 🚀 Instalación

### Opción 1: Chrome Web Store (gratis)
La versión oficial es gratuita.

[**Instalar desde Chrome Web Store**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### Opción 2: Compilar la Edición Comunitaria
Si prefieres el modelo **Usa tu propia clave**, puedes compilarla tú mismo:

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator-plugin.git
    cd tapword-translator-plugin
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Compilar el proyecto**
    ```bash
    npm run build:community
    ```

4.  **Cargar en Chrome**
    - Abre Chrome y navega a `chrome://extensions/`
    - Activa el **Modo de desarrollador** (interruptor superior derecho)
    - Haz clic en **Cargar extensión sin empaquetar**
    - Selecciona la carpeta `dist` generada en el paso 3

## ⚙️ Configuración (Edición Comunitaria)

Comienza a usar la extensión en 30 segundos:

1.  Haz clic en el icono de la extensión en la barra de herramientas de tu navegador para abrir el **Popup**
2.  Haz clic en el icono de **Configuración** (engranaje) para abrir la página de Opciones
3.  Localiza "API personalizada" (en la Edición Comunitaria es obligatorio)
4.  Ingresa tu **configuración de API**:
    - **Clave API**: `sk-.......`
    - **Modelo**: `gpt-3.5-turbo`, `gpt-4o` u otros modelos compatibles
    - **URL base de API**: Por defecto es `https://api.openai.com/v1`, pero puedes cambiarlo para usar proxies u otros proveedores (ej. DeepSeek, Moonshot)
5.  ¡Guarda y disfruta!

## 🛠 Desarrollo

Usamos un stack moderno: **TypeScript**, **Vite** y **HTML/CSS puro**.

### Estructura del proyecto
```
src/
├── 1_content/       # Scripts inyectados en páginas web (UI que ves en las páginas)
├── 2_background/    # Service workers (llamadas API, menú contextual)
├── 3_popup/         # UI del popup de la extensión
├── 5_backend/       # Servicios API compartidos
├── 6_translate/     # Lógica de negocio de traducción
└── 8_generate/      # Ingeniería de prompts LLM y análisis de respuestas
```

### Comandos

| Comando | Descripción |
| :--- | :--- |
| `npm run dev:community` | Iniciar servidor de desarrollo en modo watch (Configuración Comunitaria) |
| `npm run build:community` | Compilar para producción (Configuración Comunitaria) |
| `npm type-check` | Ejecutar verificación de tipos TypeScript |
| `npm test` | Ejecutar pruebas unitarias con Vitest |

### Nota de arquitectura: El sistema de "Compilación dual"
Usamos variables de entorno en tiempo de compilación para separar la lógica Comunitaria y Oficial:
- **Compilación Comunitaria**: `VITE_APP_EDITION=community`. Desactiva la lógica de nube propietaria, fuerza el uso de API personalizada y elimina el código TTS
- **Compilación Oficial**: (Privada) Incluye lógica de servidor propietaria

## 👏 Contribuir

Somos una comunidad de estudiantes de idiomas y lectores ávidos. Si tienes ideas frescas, sugerencias de UI o correcciones de errores, nos encantaría recibir tus contribuciones. ¡Los Pull Requests son bienvenidos!

1.  Haz un Fork del proyecto
2.  Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3.  Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4.  Haz push a la rama (`git push origin feature/AmazingFeature`)
5.  Abre un Pull Request

## 📄 Licencia

Distribuido bajo la **Licencia AGPL-3.0**. Consulta `LICENSE.txt` para más información.

---

<p align="center">
  Hecho con ❤️ para lectores de todo el mundo.
</p>
