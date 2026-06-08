# N-NEX Workspace & CLI

**The Next-Generation Context Extraction Engine for AI Code Generation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/n-nex.svg)](https://www.npmjs.com/package/n-nex)

N-NEX is an enterprise-grade developer utility designed to recursively compile complex project directory maps and code assets into highly optimized context payloads (Markdown, JSON, or TXT) for Large Language Models (LLMs). By providing precise, token-optimized context, N-NEX bridges the gap between massive codebases and AI prompt limits.

N-NEX features both a **Command Line Interface (CLI)** for immediate terminal usage and a **Web Workspace (GUI)** for structured analysis, filtering, and codebase topology visual rendering.

---

## 🚀 Features

### Core Processing Engine
* **Universal Repository Support:** Ingest local file directory paths or remote GitHub repositories.
* **Intelligent File Filtering:** Automatically excludes build directories, lockfiles, and binaries based on `.gitignore` and default patterns. Sub-checklist pruning enables granular token optimization.
* **Token Gauge Matrix:** Live-calculates context windows relative to major models (Claude 3.5, GPT-4o, Gemini 1.5, DeepSeek) via integrated `cl100k_base` estimation.
* **Secure Cache Memory:** Extracts massive codebases (up to 6.5M+ tokens) directly into background memory, safeguarding your browser DOM and system CPU from rendering spikes.

### N-NEX Web Workspace
* **Codebase Topology Visualization:** Renders interactive, clustered D3.js node charts of your codebase architecture.
* **Metrics Dashboard:** Analyzes contributor networks, language distribution, commit velocity, and repository size in an elegant UI.
* **System Preset Directives:** Prepend compiled matrices with system-level behavioral bounds (e.g., `// BUG FINDER`, `// REFACTOR`, `// WRITE TESTS`).

### N-NEX CLI
* **Zero-Configuration Execution:** Pack local environments or fetch remote GitHub archives with a single command.
* **Format Flexibility:** Export directly to Markdown (`.md`), Plain Text (`.txt`), or highly structured JSON payloads (`.json`).
* **Direct Clipboard Output:** Built-in `pbcopy`/`xclip` bindings pipe compiled matrices directly into your clipboard for instant prompt pasting.

---

## 📦 Installation & Usage (CLI)

### Global Installation
You can install the CLI globally via NPM:

```bash
npm install -g n-nex
```

### Local Execution (via npx)
```bash
npx n-nex pack ./src/ --clipboard --format json
```

### CLI Command Reference

**Pack a local repository**
```bash
n-nex pack <directory> [options]
```

**Fetch a remote GitHub repository**
```bash
n-nex fetch <github_url> [options]
```

#### CLI Options
| Flag | Description | Default |
| :--- | :--- | :--- |
| `--out <file>` | Output file destination path | `null` |
| `--clipboard` | Copy the compiled context to system clipboard | `false` |
| `--format <fmt>` | Export format (`md`, `txt`, `json`) | `md` |
| `--wrapper <wrap>` | Wrapper type (`system`, `chat`) | `system` |
| `--preset <key>` | Prompt preset (`NONE`, `BUG_FINDER`, `REFACTOR`, `UNIT_TESTS`) | `NONE` |
| `--token <token>`| GitHub Personal Access Token (for private remote repos) | `null` |

---

## 💻 Running the Web Workspace

To run the interactive React/Vite workspace locally:

```bash
# Clone the core repository
git clone https://github.com/your-org/n-nex.git
cd n-nex

# Install dependencies
npm install

# Start the environment
npm run dev
```
Navigate to the provided localhost port (default `3000`) to access the interface.

---

## 🏗️ Architecture & Privacy

**100% Client-Side RAM Processing (Web Mode)**
N-NEX Web operates entirely in your browser. Local folders are parsed using standard HTML5 File System APIs, and remote repositories are mapped using GitHub's open API boundaries. Your proprietary codebase data never transverses through a third-party proprietary server—eliminating data governance liabilities.

**Hardware Thread Shield**
Visualizing large strings or 2,000+ files breaks browser engines. N-NEX handles rendering via decoupled React hooks and state-deferred memory caches.

---

## 🤝 Contributing

We welcome pull requests! For major changes, please open an issue first to discuss the proposed change. Ensure all tests and linting protocols pass before submitting PRs.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details. Engineered for elite developers.