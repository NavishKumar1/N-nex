<div align="center">
  <h1>N-NEX</h1>
  <p><strong>Enterprise-Grade Context Compiler for Large Language Models</strong></p>

  [![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-646CFF)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org/)
</div>

<hr />

## 📖 Overview

**N-NEX** is an advanced developer utility engineered to securely compile complex project directories and remote GitHub repositories into highly optimized context payloads (Markdown, JSON, or TXT). By providing precise, token-optimized context, N-NEX bridges the gap between massive codebases and AI prompt limits.

Whether you are conducting an architectural review, hunting for security vulnerabilities, or simply seeking an AI-assisted codebase walkthrough, N-NEX ensures your Large Language Models receive the right context without the noise.

## ✨ Core Features

* 🚀 **Zero Retention Architecture:** Strict client-side execution. Your source code is never transmitted to, or stored in, any backend database. 
* 🧠 **BPE Token Estimation:** Built-in real-time token tracking (using `js-tiktoken`) to ensure your context payloads fit perfectly within LLM context windows (e.g., Claude 3 Opus, GPT-4o, Gemini 1.5 Pro).
* 🌳 **Codebase Topology Visualization:** Interactive D3.js force-directed graphs to map directory structures and architectural complexity at a glance.
* 📊 **Velocity & Metrics Dashboards:** Analyze commit history, contribution heatmaps, and repository timelines dynamically before feeding code to AI.
* 🔍 **Smart Pruning & Filtering:** Automatically excludes build directories (`node_modules`, `dist`), lockfiles, and binaries based on `.gitignore` and default patterns. 

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, Motion (Framer Motion)
- **Backend (Stateless Proxy):** Express.js (deployed via Node)
- **Visualizations:** D3.js, Recharts
- **Icons & Styling:** Lucide React, Shadcn/ui patterns

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NavishKumar1/N-nex.git
   cd N-nex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔒 Security & Privacy

N-NEX operates under a **Strict Ephemeral execution mandate**. 
- There is absolutely NO authentication required for public repositories. 
- GitHub Personal Access Tokens (used for bypassing rate limits) are stored strictly in your browser's local storage and never transmitted to our telemetry servers.
- The compiled matrix payload is injected directly into your local clipboard or downloaded locally.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with precision for the modern AI engineering era.</b><br/>
  <a href="https://github.com/NavishKumar1/N-nex">Star us on GitHub</a>
</div>