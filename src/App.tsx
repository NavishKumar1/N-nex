import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  FolderSearch, 
  Github, 
  Settings, 
  Copy, 
  Check, 
  Trash2, 
  Filter, 
  ArrowRight, 
  Activity, 
  Code,
  AlertCircle,
  GitBranch,
  X,
  FileCode,
  Terminal,
  Sparkles,
  Layers,
  Clock,
  LayoutGrid,
  Download,
  FileText,
  RefreshCw,
  FolderSync
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getEncoding } from 'js-tiktoken';

// Initialize the cl100k_base encoding matrix used by GPT-4 and Claude
const tokenizerEncoder = getEncoding('cl100k_base');

// --- Types ---

interface LoadedFile {
  path: string;
  content?: string;
  source: string; // e.g. "github: owner/repo" or "local"
  enabled?: boolean;
  tokens?: number;
}

interface FilterSettings {
  ignoreExtensions: string[];
  ignoreDirectories: string[];
  fetchLimit: number;
}

interface TabItem {
  id: string;
  label: string;
  closeable: boolean;
}

interface HistoricalLog {
  id: number;
  repo: string;
  timestamp: string;
  fileCount: number;
  tokens: number;
}

// --- Constants ---

const DEFAULT_IGNORE_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.gz', 
  '.tar', '.exe', '.dll', '.so', '.dylib', '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.mov', '.mp3', '.wav', '.webp'
];

const DEFAULT_IGNORE_DIRECTORIES = [
  'node_modules', '.git', 'dist', 'build', '.next', '.cache', 'vendor', 
  'out', '.vercel', '.output', '.idea', '.vscode', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
];

const DEFAULT_FETCH_LIMIT = 150;
const STORAGE_KEY = 'context_engine_filters_v3';
const HISTORY_STORAGE_KEY = 'context_engine_history_v3';

const PROMPT_PRESETS = {
  NONE: { 
    label: 'DEFAULT', 
    text: 'You are an elite software engineering assistant. Below is the codebase context and directory layout structural mapping.\n\n' 
  },
  BUG_FINDER: { 
    label: '// BUG FINDER', 
    text: 'You are an expert security and QA automation engineer. Analyze this code strictly for logic flaws, security vulnerabilities, memory leaks, performance bottlenecks, and edge-case exceptions. Provide highly actionable refactoring fixes.\n\n' 
  },
  REFACTOR: { 
    label: '// REFACTOR/CLEAN', 
    text: 'You are a principal systems architect. Review this repository structure and code context for design patterns, SOLID violations, duplication, scalability, and clean system design principles. Suggest minimalist improvements.\n\n' 
  },
  UNIT_TESTS: { 
    label: '// WRITE TESTS', 
    text: 'You are a test-driven development specialist. Analyze the following functions and modules, then output clean, comprehensive unit tests using industry-standard frameworks matching the source languages.\n\n' 
  }
};

export default function App() {
  // --- UI/UX States ---
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Sandbox engine ready for secure context consolidation.');
  const [error, setError] = useState<string | null>(null);

  // Exclusions panel toggling
  const [showSettings, setShowSettings] = useState(false);
  const [customExt, setCustomExt] = useState('');

  // Prompt configuration & historical parameters
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PROMPT_PRESETS>('NONE');
  const [history, setHistory] = useState<HistoricalLog[]>([]);

  // Chrome design tabs
  const [activeTab, setActiveTab] = useState('engine');
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'engine', label: 'Core Workspace', closeable: false },
    { id: 'history', label: 'History Archive', closeable: false },
    { id: 'legal', label: 'Legal & Privacy Policy', closeable: false }
  ]);

  // Loaded primary source files structured cleanly in React State for re-computations
  const [loadedFiles, setLoadedFiles] = useState<LoadedFile[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [renderedText, setRenderedText] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep the underlying codebase payload strictly contained within the secure useRef memory matrix
  const filesContentRef = useRef<Record<string, string>>({});
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const workerBlob = new Blob([`
      self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');

      self.onmessage = async function(e) {
        const { action, payload } = e.data;
        if (action === 'unzip') {
          const { zipBuffer, ignoreDirectories, ignoreExtensions, globalExtensionFilter, sourcePrefix, fetchLimit } = payload;
          try {
            const jszip = new self.JSZip();
            const zip = await jszip.loadAsync(zipBuffer);
            
            let rootPrefix = '';
            const keys = Object.keys(zip.files);
            keys.sort((a, b) => a.length - b.length);
            if (keys.length > 0) {
              const firstKey = keys[0];
              const firstSlashIndex = firstKey.indexOf('/');
              if (firstSlashIndex !== -1) {
                rootPrefix = firstKey.substring(0, firstSlashIndex + 1);
              }
            }

            const files = [];
            const localTreeLines = [];
            const activeExtension = (globalExtensionFilter || '').trim().replace(/^\\*\\./, '').toLowerCase();

            const fileNames = Object.keys(zip.files).filter(name => !zip.files[name].dir);

            for (let i = 0; i < fileNames.length; i++) {
              const rawName = fileNames[i];
              let cleanPath = rawName;
              if (rootPrefix && rawName.startsWith(rootPrefix)) {
                cleanPath = rawName.substring(rootPrefix.length);
              }
              if (!cleanPath) continue;

              const parts = cleanPath.toLowerCase().split('/');
              const isDirIgnored = parts.some(p => ignoreDirectories.some(dir => dir.toLowerCase() === p));
              if (isDirIgnored) continue;

              const ext = '.' + (cleanPath.split('.').pop() || '').toLowerCase();
              const isExtIgnored = ignoreExtensions.some(e => e.toLowerCase() === ext);
              if (isExtIgnored) continue;

              const fileExt = (cleanPath.split('.').pop() || '').toLowerCase();
              if (activeExtension && fileExt !== activeExtension) continue;

              if (fetchLimit && files.length >= fetchLimit) {
                break;
              }

              const content = await zip.files[rawName].async('string');
              localTreeLines.push(cleanPath);

              files.push({
                path: cleanPath,
                content: content,
                source: sourcePrefix,
                ext: fileExt,
                enabled: true
              });
            }

            self.postMessage({ action: 'unzip_complete', payload: { files, localTreeLines } });
          } catch (err) {
            self.postMessage({ action: 'error', payload: err.message || 'Worker decompression failed' });
          }
        }
        
        if (action === 'compile_matrix') {
          const { files, treeText, presetText } = payload;
          let output = presetText + treeText + "## CODE BLOCKS DETAIL:\\n\\n";
          let liveTokens = 0;
          let liveFiles = 0;

          files.forEach(file => {
            if (file.enabled) {
              liveFiles++;
              liveTokens += (file.tokens || 0) + file.path.length + 50;
              output += "### File: " + file.path + "\\n\`\`\`" + (file.ext || '') + "\\n" + file.content + "\\n\`\`\`\\n\\n";
            }
          });

          self.postMessage({ action: 'compile_complete', payload: { output, liveTokens, liveFiles } });
        }
      };
    `], { type: 'application/javascript' });

    const worker = new Worker(URL.createObjectURL(workerBlob));
    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  // --- Final Utility States (GLYPH Feature Upgrades) ---
  const [globalExtensionFilter, setGlobalExtensionFilter] = useState('');
  const [uncheckedFiles, setUncheckedFiles] = useState<Set<string>>(new Set());
  const [promptWrapper, setPromptWrapper] = useState<'SYSTEM' | 'CHAT'>('SYSTEM');
  
  // High-performance search & pagination for Pruning Tree
  const [pruningSearch, setPruningSearch] = useState('');
  const [pruningPage, setPruningPage] = useState(1);

  // Exclusion configuration settings state
  const [filters, setFilters] = useState<FilterSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ignoreExtensions: parsed.ignoreExtensions || DEFAULT_IGNORE_EXTENSIONS,
          ignoreDirectories: parsed.ignoreDirectories || DEFAULT_IGNORE_DIRECTORIES,
          fetchLimit: parsed.fetchLimit || DEFAULT_FETCH_LIMIT
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      ignoreExtensions: DEFAULT_IGNORE_EXTENSIONS,
      ignoreDirectories: DEFAULT_IGNORE_DIRECTORIES,
      fetchLimit: DEFAULT_FETCH_LIMIT
    };
  });

  // Load history from local settings on browser mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  // Sync back to configurations storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const saveHistoryToStorage = (updated: HistoricalLog[]) => {
    setHistory(updated);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  };

  // --- Calculations & Helper Engines ---
  const calculateTokens = (text: string) => {
    if (!text) return 0;
    try {
      return tokenizerEncoder.encode(text).length;
    } catch (e) {
      return Math.ceil(text.length / 4);
    }
  };

  // Tree diagram mapper from structured code sources (Helper)
  const buildTreeFromManifest = (paths: string[]): string => {
    const tree: any = {};
    paths.forEach(p => {
      const parts = p.split('/');
      let current = tree;
      parts.forEach((part, i) => {
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? null : {};
        }
        current = current[part];
      });
    });

    const printTree = (node: any, prefix = ''): string => {
      let output = '';
      if (!node) return '';
      const keys = Object.keys(node).sort((a, b) => {
        if (node[a] !== null && node[b] === null) return -1;
        if (node[a] === null && node[b] !== null) return 1;
        return a.localeCompare(b);
      });

      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        output += `${prefix}${isLast ? '└── ' : '├── '}${key}\n`;
        if (node[key] !== null) {
          output += printTree(node[key], prefix + (isLast ? '    ' : '│   '));
        }
      });
      return output;
    };

    return printTree(tree);
  };

  // Ensure loadedFiles items always have tokens calculated so that summation is incredibly fast
  const processedLoadedFiles = useMemo(() => {
    return loadedFiles.map(f => {
      if (typeof f.tokens !== 'number') {
        const fileContent = filesContentRef.current[`${f.source}:${f.path}`] || '';
        return {
          ...f,
          tokens: calculateTokens(fileContent),
          enabled: f.enabled !== false
        };
      }
      return f;
    });
  }, [loadedFiles]);

  // Checklist Filtration & Paginated States
  const checklistFilteredFiles = useMemo(() => {
    const q = pruningSearch.toLowerCase().trim();
    if (!q) return processedLoadedFiles;
    return processedLoadedFiles.filter(f => f.path.toLowerCase().includes(q));
  }, [processedLoadedFiles, pruningSearch]);

  const totalPruningPages = useMemo(() => {
    return Math.ceil(checklistFilteredFiles.length / 25) || 1;
  }, [checklistFilteredFiles]);

  const paginatedChecklistFiles = useMemo(() => {
    const start = (pruningPage - 1) * 25;
    return checklistFilteredFiles.slice(start, start + 25);
  }, [checklistFilteredFiles, pruningPage]);

  // Reset page safely on search query modification
  useEffect(() => {
    setPruningPage(1);
  }, [pruningSearch]);

  // --- REACTIVE DIRECT METRICS RE-COMPUTATIONS (FILTERS) ---
  const filteredFiles = useMemo(() => {
    return processedLoadedFiles.filter(file => {
      // 1. Dynamic Checklist Pruning
      const fileKey = `${file.source}:${file.path}`;
      if (uncheckedFiles.has(fileKey) || file.enabled === false) {
        return false;
      }

      const pathLower = file.path.toLowerCase();
      const parts = pathLower.split('/');
      
      // 2. Directory exclusions
      if (parts.some(p => filters.ignoreDirectories.some(dir => dir.toLowerCase() === p))) {
        return false;
      }

      // 3. Extension exclusions
      const ext = '.' + (pathLower.split('.').pop() || '');
      if (filters.ignoreExtensions.map(e => e.toLowerCase()).includes(ext)) {
        return false;
      }

      // 4. Global pattern filters
      if (globalExtensionFilter.trim()) {
        const patterns = globalExtensionFilter
          .split(/[\s,;]+/)
          .map(p => p.trim())
          .filter(p => p.length > 0);

        if (patterns.length > 0) {
          const matched = patterns.some(pattern => {
            const patLower = pattern.toLowerCase();
            if (patLower === '*') return true;
            if (patLower.startsWith('*.')) {
              return pathLower.endsWith(patLower.substring(1));
            }
            if (patLower.startsWith('.')) {
              return pathLower.endsWith(patLower);
            }
            const regexStr = patLower
              .replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, "\\$&")
              .replace(/\*/g, ".*");
            try {
              const rx = new RegExp(`^${regexStr}$`);
              if (rx.test(pathLower)) return true;
            } catch (e) {}
            return pathLower.includes(patLower);
          });
          if (!matched) return false;
        }
      }

      return true;
    }).slice(0, filters.fetchLimit);
  }, [loadedFiles, filters, uncheckedFiles, globalExtensionFilter]);

  // dynamic re-packaging matching the filters and custom configurations
  const compiledMarkdown = useMemo(() => {
    if (filteredFiles.length === 0) return '';
    
    // Group files by unique sources to preserve clear custom layered stacks
    const sources: string[] = Array.from(new Set(filteredFiles.map(f => f.source)));
    
    let result = '';
    sources.forEach((source, idx) => {
      if (idx > 0) result += '\n\n---\n\n';
      
      const sourceFiles = filteredFiles.filter(f => f.source === source);
      const filePaths = sourceFiles.map(f => f.path);
      const treeStr = buildTreeFromManifest(filePaths);
      
      result += `### SOURCE LAYER: ${source.toUpperCase()}\n\n## Repository Directory Blueprint\n\`\`\`\n${treeStr}\`\`\`\n\n## Code File Manifest\n\n`;
      
      sourceFiles.forEach(file => {
        const ext = file.path.split('.').pop() || '';
        const fileContent = filesContentRef.current[`${file.source}:${file.path}`] || '';
        result += `### File: ${file.path}\n\`\`\`${ext}\n${fileContent}\n\`\`\`\n\n`;
      });
    });
    
    return result;
  }, [filteredFiles]);

  const fileCount = filteredFiles.length;
  const estimatedChars = compiledMarkdown.length;

  const estimatedTokens = useMemo(() => {
    let sum = 0;
    // 1. Add preset text tokens
    const presetHeaderText = PROMPT_PRESETS[selectedPreset].text;
    sum += calculateTokens(presetHeaderText);

    // 2. Add source headers and blueprints
    if (filteredFiles.length === 0) return sum;
    
    // Group files by unique sources to get the layout tokens
    const sources = Array.from(new Set(filteredFiles.map(f => f.source))) as string[];
    sources.forEach(source => {
      const sourceFiles = filteredFiles.filter(f => f.source === source);
      const filePaths = sourceFiles.map(f => f.path);
      const treeStr = buildTreeFromManifest(filePaths);
      
      const layerHeader = `### SOURCE LAYER: ${source.toUpperCase()}\n\n## Repository Directory Blueprint\n\`\`\`\n${treeStr}\`\`\`\n\n## Code File Manifest\n\n`;
      sum += calculateTokens(layerHeader);

      sourceFiles.forEach(file => {
        const ext = file.path.split('.').pop() || '';
        const fileHeader = `### File: ${file.path}\n\`\`\`${ext}\n\n\`\`\`\n\n`;
        sum += calculateTokens(fileHeader);
        sum += file.tokens || 0;
      });
    });

    if (promptWrapper === 'CHAT') {
      const chatPrefix = "The following text contains a structured repository matrix map and core source code components. Please ingest this layout completely into your active memory context buffer. Do not reply or analyze yet. Simply confirm with 'SYSTEM LAYERS SYNCHRONIZED' if you understand the codebase architecture.\n\n";
      sum += calculateTokens(chatPrefix);
    }
    
    return sum;
  }, [filteredFiles, selectedPreset, promptWrapper]);

  const activeLayers = useMemo(() => {
    return Array.from(new Set(loadedFiles.map(f => f.source)));
  }, [loadedFiles]);

  // --- Chromematic Navigation Tab closure system ---
  const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTabs = tabs.filter(t => t.id !== tabId);
    setTabs(updatedTabs);
    if (activeTab === tabId) {
      setActiveTab('engine');
    }
  };

  // --- Dynamic Framework Context Generator ---
  const generateFinalContextPayload = useCallback(() => {
    const presetHeaderText = PROMPT_PRESETS[selectedPreset].text;
    const bodyText = `${presetHeaderText}${compiledMarkdown}`;
    if (promptWrapper === 'CHAT') {
      return `The following text contains a structured repository matrix map and core source code components. Please ingest this layout completely into your active memory context buffer. Do not reply or analyze yet. Simply confirm with 'SYSTEM LAYERS SYNCHRONIZED' if you understand the codebase architecture.\n\n${bodyText}`;
    }
    return bodyText;
  }, [selectedPreset, compiledMarkdown, promptWrapper]);

  // --- DISK STORAGE STREAMING DOWNLOADERS ---
  const handleDownloadMarkdown = () => {
    compileWithWorker('download_md');
  };

  const handleDownloadJSON = () => {
    compileWithWorker('download_json');
  };

  // --- STABLE LOCAL FILE PICKER INTEGRATION ---
  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleHTML5FolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);
      setIsPreviewVisible(false);
      setRenderedText('');
      setStatus('> INITIATING COLD RUN INGRESS STREAM...');

      let filesData: LoadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const relativePath = file.webkitRelativePath || file.name;

        // Apply folder filter checks
        const parts = relativePath.toLowerCase().split('/');
        const isDirIgnored = parts.some(p => filters.ignoreDirectories.some(dir => dir.toLowerCase() === p));
        if (isDirIgnored) continue;

        const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
        if (filters.ignoreExtensions.map(x => x.toLowerCase()).includes(ext)) {
          continue; // Skip binaries and filtered extensions
        }

        try {
          const text = await file.text();
          const pTokens = calculateTokens(text);
          const contentKey = `local-workspace:${relativePath}`;
          filesContentRef.current[contentKey] = text;

          filesData.push({
            path: relativePath,
            source: 'local-workspace',
            tokens: pTokens,
            enabled: true
          });
        } catch (fileErr) {
          console.warn(`Unreadable local asset skipped: ${relativePath}`, fileErr);
        }
      }

      setStatus('> PARSING COMPONENT HIERARCHIES...');

      if (filesData.length === 0) {
        throw new Error('No compatible files found matching scanning filters after applying exclusions.');
      }

      setStatus('> PACKING BUFFER MATRIX...');
      setLoadedFiles(filesData);

      // Track entry history log
      const tokenSum = filesData.reduce((acc, f) => acc + (f.tokens || 0), 0);
      const logRecord: HistoricalLog = {
        id: Date.now(),
        repo: 'Local Workspace Scan',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fileCount: filesData.length,
        tokens: tokenSum
      };
      saveHistoryToStorage([logRecord, ...history.slice(0, 19)]);

      const targetTabId = 'preview-tab';
      if (!tabs.some(t => t.id === targetTabId)) {
        setTabs(prev => [...prev.filter(t => t.id !== targetTabId), { id: targetTabId, label: 'Matrix Preview', closeable: true }]);
      }
      setActiveTab(targetTabId);
      setStatus(`> ASSEMBLING SYSTEM SYNC FILES: Compiled ${filesData.length} files successfully.`);
    } catch (err: any) {
      console.error(err);
      setStatus(`Import process aborted: ${err.message || err}`);
      setError(err.message || 'Fatal error importing local directory structure.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // --- MULTI-LAYER GITHUB BATCHED FETCH ENGINE (Supports Append/Overwrite) ---
  const executeGithubStreaming = async (isAppendMode: boolean = false) => {
    if (!githubUrl) return;
    try {
      setIsLoading(true);
      setError(null);
      setIsPreviewVisible(false);
      setRenderedText('');
      
      requestAnimationFrame(() => {
        setStatus('> INITIATING COLD RUN INGRESS STREAM...');
      });

      // Clean the incoming string completely of whitespaces and common URL clutter
      let cleanedUrl = githubUrl.trim()
        .replace(/^(https?:\/\/)?(www\.)?/, '') // Strip http://, https://, and www.
        .replace(/\/$/, '');                    // Strip any trailing slashes

      // Extract owner and repository targets using a flexible match mechanism
      const urlSegments = cleanedUrl.split('/');
      const githubIndex = urlSegments.findIndex(part => part.toLowerCase() === 'github.com');
      
      let owner = '';
      let repo = '';

      if (githubIndex !== -1 && urlSegments[githubIndex + 1] && urlSegments[githubIndex + 2]) {
        owner = urlSegments[githubIndex + 1];
        repo = urlSegments[githubIndex + 2];
      } else if (urlSegments[0] && urlSegments[1]) {
        owner = urlSegments[0];
        repo = urlSegments[1];
      }

      // Strip out any trailing file extensions and separators safely (.git, hashes, and query arguments)
      if (repo) {
        repo = repo.replace(/\.git$/, '').split('#')[0].split('?')[0];
      }

      // Final Validation Gate
      if (!owner || !repo || owner.toLowerCase() === 'github.com') {
        requestAnimationFrame(() => {
          setStatus('Pipeline Halted: Format mismatch. Use github.com/owner/repo');
        });
        throw new Error('Url validation error. Expected pattern structure: github.com/username/repository');
      }

      const currentLabelIdentity = `${owner}/${repo}`;

      // Resolve overriding branches parameter
      const urlMatch = githubUrl.match(/github\.com\/[^/]+\/[^/]+\/tree\/([^/]+)/);
      
      requestAnimationFrame(() => {
        setStatus('> STREAMING NETWORK REPOSITORY METADATA FLOW...');
      });

      // Fetch repo metadata to obtain default branch if not specified
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) {
        if (repoRes.status === 403) throw new Error('GitHub API rate limit exhausted. Please try again soon.');
        throw new Error('Repository lookup unreachable. Verify visibility (public access required).');
      }
      const repoData = await repoRes.json();
      const targetBranch = branch || (urlMatch ? urlMatch[1] : repoData.default_branch);

      // Request architectural directory mapping (High efficiency metadata mapping)
      requestAnimationFrame(() => {
        setStatus(`Streaming directory matrix layouts for ${currentLabelIdentity.toUpperCase()}...`);
      });

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`);
      if (!treeRes.ok) {
        throw new Error(`Failed to map file matrix hierarchy. Status: ${treeRes.status}`);
      }
      const treeData = await treeRes.json();

      const localTreeLines: string[] = [];
      const executionQueue: any[] = [];

      // Parse active text filtering expressions to skip processing unneeded files entirely
      const activeExtension = globalExtensionFilter.trim().replace(/^\*\./, '').toLowerCase();

      // Check if file is ignored using local filter parameters
      const isIgnored = (filePath: string) => {
        const pathLower = filePath.toLowerCase();
        const parts = pathLower.split('/');
        
        // Directory exclusions
        if (parts.some(p => filters.ignoreDirectories.some(dir => dir.toLowerCase() === p))) {
          return true;
        }

        // Extension exclusions
        const ext = '.' + (pathLower.split('.').pop() || '');
        if (filters.ignoreExtensions.map(e => e.toLowerCase()).includes(ext)) {
          return true;
        }

        return false;
      };

      treeData.tree.forEach((item: any) => {
        if (!isIgnored(item.path)) {
          localTreeLines.push(item.type === 'tree' ? `${item.path}/` : item.path);
          
          if (item.type === 'blob') {
            const fileExt = (item.path.split('.').pop() || '').toLowerCase();
            
            // Pre-filter files locally before making any network requests
            if (activeExtension && fileExt !== activeExtension) return;
            
            executionQueue.push(item);
          }
        }
      });

      if (executionQueue.length === 0) {
        throw new Error('Zero target files matched the active global extension query criteria.');
      }

      // Respect the configured fetch limit
      const itemsToFetch = executionQueue.slice(0, filters.fetchLimit);
      requestAnimationFrame(() => {
        setStatus(`Processing async streaming pipelines (0/${itemsToFetch.length})...`);
      });

      // HIGH-SPEED SLIDING WINDOW STREAM ENGINE (Bypasses batch lockouts with continuous streams)
      const MAX_CONCURRENT_REQUESTS = 25; // Keeps network pipes completely saturated
      const compiledPayloadObjects: LoadedFile[] = [];
      let activeIndex = 0;
      let completedCount = 0;

      // Worker promise loop pulling items dynamically
      const streamWorker = async () => {
        while (activeIndex < itemsToFetch.length) {
          const itemIndex = activeIndex++; 
          if (itemIndex >= itemsToFetch.length) break;
          const item = itemsToFetch[itemIndex];
          const rawFileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${targetBranch}/${item.path}`;

          try {
            const res = await fetch(rawFileUrl);
            if (res.ok) {
              const content = await res.text();
              if (content && content.trim().length > 0) {
                const fileExt = item.path.split('.').pop() || '';
                const fileTokens = calculateTokens(content);
                
                // Store file content in cache map
                const contentKey = `${currentLabelIdentity}:${item.path}`;
                filesContentRef.current[contentKey] = content;

                compiledPayloadObjects.push({
                  path: item.path,
                  source: currentLabelIdentity,
                  tokens: fileTokens,
                  enabled: true
                });
              }
            }
          } catch (e) {
            console.error(`Skipped raw network connection block: ${item.path}`, e);
          } finally {
            completedCount++;
            requestAnimationFrame(() => {
              setStatus(`Streaming files matrix array (${completedCount}/${itemsToFetch.length})...`);
            });
          }
        }
      };

      // Initialize parallel workers simultaneously
      const workerPool = [];
      const activeWorkersCount = Math.min(MAX_CONCURRENT_REQUESTS, itemsToFetch.length);
      for (let w = 0; w < activeWorkersCount; w++) {
        workerPool.push(streamWorker());
      }

      // Wait for all thread lines to finish successfully
      await Promise.all(workerPool);

      if (isAppendMode) {
        setLoadedFiles(prev => {
          const kept = prev.filter(p => !compiledPayloadObjects.some(f => f.path === p.path && f.source === p.source));
          return [...kept, ...compiledPayloadObjects];
        });
      } else {
        setLoadedFiles(compiledPayloadObjects);
      }

      // Save record tracking details
      const tokensCount = compiledPayloadObjects.reduce((acc, f) => acc + (f.tokens || 0), 0);
      const logRecord: HistoricalLog = {
        id: Date.now(),
        repo: currentLabelIdentity,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fileCount: compiledPayloadObjects.length,
        tokens: tokensCount
      };
      saveHistoryToStorage([logRecord, ...history.slice(0, 19)]);

      const targetTabId = 'preview-tab';
      if (!tabs.some(t => t.id === targetTabId)) {
        setTabs(prev => [...prev.filter(t => t.id !== targetTabId), { id: targetTabId, label: 'Matrix Preview', closeable: true }]);
      }
      setActiveTab(targetTabId);
      setStatus(`Matrix compilation successfully committed to memory-cache: Compiled ${compiledPayloadObjects.length} files.`);
      setIsLoading(false);

    } catch (err: any) {
      console.error(err);
      requestAnimationFrame(() => {
        setStatus(`Pipeline Process Exception: ${err.message || err}`);
      });
      setError(err.message || 'Critical pipeline exception compiling remote source repositories.');
      setIsLoading(false);
    }
  };

  const compileWithWorker = (actionType: 'copy' | 'preview' | 'download_md' | 'download_json') => {
    if (!workerRef.current) return;
    setIsLoading(true);
    setStatus('> STREAMING COMPOSITIONS TO WEB WORKER BACKEND...');

    // Get files metadata from state, and actual contents from useRef
    const payloadFiles = filteredFiles.map(f => {
      const content = filesContentRef.current[`${f.source}:${f.path}`] || '';
      return {
        path: f.path,
        content: content,
        ext: f.path.split('.').pop() || '',
        tokens: f.tokens || 0,
        enabled: f.enabled !== false
      };
    });

    const sources: string[] = Array.from(new Set(filteredFiles.map(f => f.source)));
    let treeText = '';
    sources.forEach((source, idx) => {
      if (idx > 0) treeText += '\n\n---\n\n';
      const sourceFiles = filteredFiles.filter(f => f.source === source);
      const filePaths = sourceFiles.map(f => f.path);
      const treeStr = buildTreeFromManifest(filePaths);
      treeText += `### SOURCE LAYER: ${source.toUpperCase()}\n\n## Repository Directory Blueprint\n\`\`\`\n${treeStr}\`\`\`\n\n## Code File Manifest\n\n`;
    });

    const presetText = PROMPT_PRESETS[selectedPreset].text;
    const finalPreset = promptWrapper === 'CHAT'
      ? `The following text contains a structured repository matrix map and core source code components. Please ingest this layout completely into your active memory context buffer. Do not reply or analyze yet. Simply confirm with 'SYSTEM LAYERS SYNCHRONIZED' if you understand the codebase architecture.\n\n${presetText}`
      : presetText;

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { action, payload } = e.data;
      if (action === 'compile_complete') {
        const { output } = payload;
        
        requestAnimationFrame(() => {
          if (actionType === 'copy') {
            try {
              navigator.clipboard.writeText(output);
              setCopied(true);
              setStatus('Sync complete: full context matrix buffer mapped to clipboard.');
              setTimeout(() => setCopied(false), 2000);
            } catch (err: any) {
              setStatus('Clipboard write blocked: browser permission denied. Text compiled in Matrix Preview tab.');
              setRenderedText(output);
              setIsPreviewVisible(true);
            }
          } else if (actionType === 'preview') {
            setRenderedText(output);
            setIsPreviewVisible(true);
            setStatus('Preview matrix compiled successfully.');
          } else if (actionType === 'download_md') {
            const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const prefix = selectedPreset !== 'NONE' ? `${selectedPreset.toLowerCase()}_` : '';
            const filename = `${prefix}context_payload_${Date.now()}.md`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setStatus(`Matrix saved to disk: "${filename}"`);
          } else if (actionType === 'download_json') {
            const jsonStructure = {
              meta: {
                app: "Context.Engine",
                preset: selectedPreset,
                presetDirective: PROMPT_PRESETS[selectedPreset].text,
                layersCompacted: activeLayers,
                fileCount: fileCount,
                characterCount: output.length,
                tokenEstimate: estimatedTokens,
                compiledAt: new Date().toISOString()
              },
              payloadMarkdown: output,
              files: filteredFiles.map(f => ({
                path: f.path,
                source: f.source,
                charLength: (filesContentRef.current[`${f.source}:${f.path}`] || '').length
              }))
            };
            const blob = new Blob([JSON.stringify(jsonStructure, null, 2)], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `context_package_${Date.now()}.json`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setStatus(`Package saved to disk: "${filename}"`);
          }
          setIsLoading(false);
        });
      } else if (action === 'error') {
        setError(payload || 'Compilation worker encountered an unexpected fault.');
        setIsLoading(false);
      }
    };

    workerRef.current.postMessage({
      action: 'compile_matrix',
      payload: {
        files: payloadFiles,
        treeText,
        presetText: finalPreset
      }
    });
  };

  const handleRevealPreview = () => {
    compileWithWorker('preview');
  };

  const copyToClipboard = () => {
    compileWithWorker('copy');
  };

  const handleForceResync = () => {
    setLoadedFiles([]);
    setUncheckedFiles(new Set());
    setGlobalExtensionFilter('');
    setRenderedText('');
    setIsPreviewVisible(false);
    setGithubUrl('');
    setBranch('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setStatus('SYSTEM ARCHITECTURE PURGED: Active memory cached arrays wiped and context engine re-initiated.');
  };

  const handleApplyHistoryRepo = (savedRepoUrl: string) => {
    setGithubUrl(`github.com/${savedRepoUrl}`);
    setActiveTab('engine');
    setStatus('Historical URL staged. Choose Overwrite or Append to execute.');
  };

  const restoreFromHistoryNode = (savedRepoUrl: string) => {
    if (savedRepoUrl.toLowerCase().includes('local')) {
      setStatus('Historical Local Workspace Scan telemetry reviewed. Local files stay cached in active window session.');
      return;
    }
    const cleanUrl = savedRepoUrl.startsWith('github.com/') ? savedRepoUrl : `github.com/${savedRepoUrl}`;
    setGithubUrl(cleanUrl);
    setActiveTab('engine');
    setStatus(`History Node "${savedRepoUrl}" staged into active pipeline engine memory context. Choose Overwrite or Append.`);
  };

  // --- GARBAGE DELETION MECHANISMS FROM HISTORY ---
  const deleteHistoryEntry = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    saveHistoryToStorage(updated);
    setStatus('Staged historical analytics entity destroyed safely.');
  };

  const clearHistoryArchive = () => {
    saveHistoryToStorage([]);
    setStatus('Stored history archives cleared successfully.');
  };

  const handleAddFilter = () => {
    if (customExt) {
      const formatted = customExt.startsWith('.') ? customExt.toLowerCase() : `.${customExt.toLowerCase()}`;
      if (!filters.ignoreExtensions.includes(formatted)) {
        setFilters(prev => ({
          ...prev,
          ignoreExtensions: [...prev.ignoreExtensions, formatted]
        }));
        setStatus(`Extension dynamic rule registered: Ignored "${formatted}"`);
      }
      setCustomExt('');
    }
  };

  const handleRemoveFilter = (ext: string) => {
    setFilters(prev => ({
      ...prev,
      ignoreExtensions: prev.ignoreExtensions.filter(e => e !== ext)
    }));
    setStatus(`Extension dynamic rule destroyed: Re-allowed "${ext}"`);
  };

  // --- MODEL TOKEN PROGRESS PROGRESS GRAPH METRICS ---
  const modelsBudgets = useMemo(() => {
    const total = Math.max(1, estimatedTokens);
    return [
      { name: 'Claude 3.5 Sonnet', max: 200000, color: 'bg-amber-400 border-amber-400' },
      { name: 'GPT-4o Context', max: 128000, color: 'bg-emerald-400 border-emerald-400' },
      { name: 'Gemini 1.5 Flash', max: 1048576, color: 'bg-blue-400 border-blue-400' },
      { name: 'DeepSeek V3 / R1', max: 64000, color: 'bg-red-400 border-red-400' }
    ].map(m => {
      const percentage = Math.min(100, Math.ceil((total / m.max) * 100));
      return {
        ...m,
        percentage,
        isExceeded: total > m.max
      };
    });
  }, [estimatedTokens]);

  const exceedsAllModels = useMemo(() => {
    return modelsBudgets.every(m => m.isExceeded);
  }, [modelsBudgets]);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-zinc-400 font-mono flex flex-col antialiased selection:bg-white selection:text-black">
      
      {/* Stark Void Navigation Header */}
      <nav className="border-b border-zinc-900 bg-[#0B0B0C] h-14 shrink-0 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-white font-bold tracking-[0.25em] text-xs uppercase">Context.Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block px-2.5 py-1 border border-zinc-900 text-[10px] text-zinc-500 tracking-wider">
            V1.1.0 // MULTI-LAYER COMPILER
          </div>
          <button 
            onClick={handleForceResync}
            className="px-3 py-1.5 border border-red-955/30 bg-red-950/5 text-red-500 hover:bg-red-500 hover:text-black hover:border-red-400 font-black text-[10px] tracking-widest uppercase transition-all duration-150 rounded-none ml-2"
            title="Wipe cached arrays and reset context"
          >
            [ // FORCE RESYNC ENGINE ]
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 border border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all ${showSettings ? 'bg-zinc-900 text-white' : ''}`}
            title="Configure Ignored Extensions & Filters"
          >
            <Settings size={14} />
          </button>
        </div>
      </nav>

      {/* Chrome Style Tab Navigation Bar */}
      <div className="bg-zinc-950 border-b border-zinc-900 flex items-end h-10 px-4 min-w-0 select-none overflow-x-auto shrink-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'preview-tab') {
                  setIsPreviewVisible(false); // safety reset rendering loops
                }
              }}
              className={`flex items-center h-9 px-4 text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-colors relative h-full ${
                isActive 
                  ? 'bg-[#0B0B0C] text-white border-t-2 border-t-white border-x border-x-zinc-900' 
                  : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.closeable && (
                <button 
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="ml-3 p-0.5 rounded-none hover:bg-zinc-900 hover:text-white transition-colors animate-fadeIn"
                >
                  <X size={10} />
                </button>
              )}
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-[1px] bg-[#0B0B0C]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Container Viewport */}
      <div className="flex-1 overflow-auto max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Exclusion Filters Drawer Screen */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-zinc-900 bg-zinc-950/20"
            >
              <div className="p-6 space-y-6 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-white tracking-widest uppercase font-bold flex items-center gap-2">
                    <Filter size={12} />
                    Configuration Controls // Direct Metric Filter Re-Computation
                  </span>
                  <button 
                    onClick={() => setFilters({
                      ignoreExtensions: DEFAULT_IGNORE_EXTENSIONS,
                      ignoreDirectories: DEFAULT_IGNORE_DIRECTORIES,
                      fetchLimit: DEFAULT_FETCH_LIMIT
                    })}
                    className="text-[10px] text-zinc-500 hover:text-white underline underline-offset-4 font-bold uppercase transition-all"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Limits and customized parameters input fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">GitHub Fetch Crawler Limit</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number"
                          min="1"
                          max="500"
                          value={filters.fetchLimit}
                          onChange={(e) => setFilters(prev => ({ 
                            ...prev, 
                            fetchLimit: Math.max(1, Math.min(500, parseInt(e.target.value) || 1)) 
                          }))}
                          className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 w-24 text-white font-mono focus:outline-none focus:border-zinc-500 rounded-none text-xs"
                        />
                        <span className="text-[10px] text-zinc-600">Clamp limit for raw file fetches (1 - 500)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Ignore File Extension</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={customExt}
                          onChange={(e) => setCustomExt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddFilter()}
                          placeholder=".env, .yaml, .config"
                          className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 text-white placeholder:text-zinc-850 font-mono focus:outline-none focus:border-zinc-500 text-xs w-full rounded-none"
                        />
                        <button 
                          onClick={handleAddFilter}
                          className="px-4 border border-zinc-900 text-white hover:bg-neutral-900 font-bold uppercase transition-all h-8"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active extensions ignores status array maps */}
                  <div className="space-y-3">
                    <label className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block">Ignored Extension Rules ({filters.ignoreExtensions.length})</label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-zinc-900 p-2 bg-zinc-950/20 scrollbar-none">
                      {filters.ignoreExtensions.map(ext => (
                        <div key={ext} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 group">
                          <span>{ext}</span>
                          <button 
                            onClick={() => handleRemoveFilter(ext)}
                            className="text-zinc-500 hover:text-red-400 font-bold transition-colors ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 bg-[#0B0B0C] p-4 border border-zinc-900">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Standard Directories Shielded Globally</div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-zinc-650">
                    {filters.ignoreDirectories.map(dir => (
                      <span key={dir} className="bg-zinc-950 border border-zinc-900/50 px-2 py-0.5">{dir}/</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Panels Workspace Render */}
        {activeTab === 'engine' && (
          <div className="space-y-6">
            
            {/* Directives preset selection row (High-Contrast styling) */}
            <div className="border border-zinc-900 p-6 bg-zinc-950/40 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={12} className="text-zinc-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block">SYSTEM PRESET DIRECTIVE (PREPENDED IN COMPILATION)</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.keys(PROMPT_PRESETS).map((key) => {
                  const isSelected = selectedPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPreset(key as keyof typeof PROMPT_PRESETS);
                        setIsPreviewVisible(false); // force visual repack safely
                      }}
                      className={`px-4 py-2 font-black transition-all border tracking-widest uppercase text-[10px] rounded-none ${
                        isSelected 
                          ? 'border-white text-black bg-white' 
                          : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 bg-zinc-950'
                      }`}
                    >
                      {PROMPT_PRESETS[key as keyof typeof PROMPT_PRESETS].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CRITICAL FIX: CLEANED UP FULL-WIDTH WORKSPACE PIPELINE INPUT */}
            <div className="border border-zinc-900 p-8 bg-zinc-950/40 w-full space-y-4">
              <div className="mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Github size={14} className="text-white" />
                  ⛓️ Remote Git Workspace Pipeline
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Fetch, extract, and layer public tree directories dynamically from endpoint mirrors using non-blocking continuous concurrency paths.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">
                      Repository Destination URL
                    </label>
                    <input 
                      type="text"
                      placeholder="github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeGithubStreaming(false)}
                      className="w-full bg-[#0B0B0C] border border-zinc-900 px-4 py-3 text-xs focus:outline-none focus:border-zinc-600 text-zinc-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 block">
                      🔍 Global Extension Filter
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. *.js, *.ts, index.html" 
                      value={globalExtensionFilter}
                      onChange={(e) => {
                        setGlobalExtensionFilter(e.target.value);
                        setStatus(`Compiling dynamic pattern filter: "${e.target.value}"`);
                      }}
                      className="w-full bg-[#0B0B0C] border border-zinc-900 px-4 py-3 text-xs focus:outline-none focus:border-zinc-600 text-zinc-400 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-900/40 mt-2">
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-3 py-2.5">
                    <GitBranch size={11} className="text-zinc-500" />
                    <input 
                      type="text"
                      placeholder="branch (optional)"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="bg-transparent text-[11px] text-zinc-300 font-mono focus:outline-none focus:text-white placeholder:text-zinc-800 w-28"
                    />
                  </div>

                  <div className="flex gap-3 flex-1 sm:flex-initial">
                    <button 
                      onClick={() => executeGithubStreaming(false)} 
                      disabled={isLoading || !githubUrl} 
                      className="flex-1 sm:flex-none border border-white bg-white text-black hover:bg-transparent hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-20"
                    >
                      Overwrite Clean Matrix
                    </button>
                    <button 
                      onClick={() => executeGithubStreaming(true)} 
                      disabled={isLoading || !githubUrl || loadedFiles.length === 0} 
                      className="flex-1 sm:flex-none border border-zinc-800 text-zinc-500 hover:border-white hover:text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-20 bg-zinc-950/60"
                    >
                      + Append Active Layer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* If files are loaded, display active streams layer blocks to provide absolute clarity */}
            {loadedFiles.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950/40 p-5 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] text-zinc-550 border-b border-zinc-900 pb-2">
                  <span className="uppercase tracking-widest font-black flex items-center gap-1.5">
                    <Layers size={11} />
                    Active Compiling Ingress Layers ({activeLayers.length})
                  </span>
                  <button 
                    onClick={() => {
                      setLoadedFiles([]);
                      setStatus('Active layers purged safely from state context.');
                    }}
                    className="text-red-400 hover:text-red-350 tracking-widest font-bold uppercase hover:underline underline-offset-4"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeLayers.map((layer, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 px-3 py-1 text-xs text-white flex items-center gap-2">
                      <span className="font-bold text-zinc-500">[{i + 1}]</span>
                      <span>{layer}</span>
                      <span className="text-[10px] text-zinc-600">({loadedFiles.filter(f => f.source === layer).length} files)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error alerts notification banner (stark design look) */}
            {error && (
              <div className="border border-red-950/40 bg-red-950/5 p-4 flex gap-3 text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-widest text-[9px] block">Pipeline Process Exception:</span>
                  <p className="leading-relaxed font-mono text-[10px]">{error}</p>
                </div>
              </div>
            )}

            {/* Terminal Live Output logs window */}
            <div className="border border-zinc-900 bg-zinc-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-600 text-[9px] uppercase tracking-widest font-black flex items-center gap-2">
                  <Terminal size={10} />
                  Terminal Monitoring Console
                </span>
                <span className="text-zinc-600 text-[9px]">IDLE // ENGINE.SYS</span>
              </div>
              <p className="text-zinc-350 font-mono text-[10px] leading-relaxed">
                &gt; {status}
              </p>
            </div>

          </div>
        )}

        {/* History Archive Panel with garbage deletion mechanism using target unique IDs */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-zinc-405 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} />
                Historical Local Storage Arrays
              </span>
              {history.length > 0 && (
                <button 
                  onClick={clearHistoryArchive}
                  className="text-[9px] text-zinc-500 hover:text-white underline underline-offset-4 uppercase font-bold"
                >
                  Clear Archive
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-[10px] text-zinc-600 py-12 border border-dashed border-zinc-900 text-center uppercase tracking-widest leading-relaxed">
                No telemetry transaction logs staged in client records workspace.
              </p>
            ) : (
              <div className="border border-zinc-900 divide-y divide-zinc-900 bg-zinc-950/10">
                {history.map((log) => {
                  const isLocal = log.repo.toLowerCase().includes('local');
                  return (
                    <div 
                      key={log.id} 
                      onClick={() => restoreFromHistoryNode(log.repo)}
                      className="p-4 flex items-center justify-between text-xs hover:bg-zinc-950/60 transition-all duration-150 cursor-pointer group"
                    >
                      <div className="space-y-1 font-mono text-left">
                        <div className="text-white font-bold tracking-wider uppercase text-[11px] group-hover:text-amber-400 transition-colors">
                          {log.repo}
                        </div>
                        <div className="text-[9px] text-zinc-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>TIMESTAMP: {log.timestamp}</span>
                          <span>•</span>
                          <span>COMPONENTS: {log.fileCount} ENTRIES</span>
                          <span>•</span>
                          <span>CALCULATED: {log.tokens.toLocaleString()} TOKENS</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isLocal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreFromHistoryNode(log.repo);
                            }}
                            className="border border-zinc-805 text-zinc-400 hover:border-white hover:text-white px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-150 bg-zinc-950"
                          >
                            Stage URL
                          </button>
                        )}
                        <button 
                          onClick={(e) => deleteHistoryEntry(log.id, e)}
                          className="p-1.5 border border-zinc-900 text-zinc-600 hover:text-red-400 hover:border-red-950 transition-all duration-150 bg-zinc-950"
                          title="Delete telemetry garbage block"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Compile Visual Pre-views Workspace */}
        {activeTab === 'preview-tab' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Context metrics board */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px bg-zinc-900 border border-zinc-900">
              <div className="bg-[#0B0B0C] p-5">
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                  <FolderSearch size={10} />
                  COMPACTED FILES
                </div>
                <div className="text-lg text-white font-medium">{fileCount}</div>
              </div>
              <div className="bg-[#0B0B0C] p-5">
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                  <Code size={10} />
                  CHARACTERS
                </div>
                <div className="text-lg text-white font-medium">{estimatedChars.toLocaleString()}</div>
              </div>
              <div className="bg-[#0B0B0C] p-5">
                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5">
                  <Activity size={10} />
                  ESTIMATED TOKENS
                </div>
                <div className="text-lg text-white font-medium">{estimatedTokens.toLocaleString()}</div>
              </div>
              
              <div className="bg-[#0B0B0C] p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block font-mono">
                    PROMPT WRAPPER
                  </span>
                  <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-0.5 border border-zinc-900">
                    <button
                      onClick={() => {
                        setPromptWrapper('SYSTEM');
                        setStatus('Prompt formatting selector modified: [ SYSTEM ONLY ] active.');
                      }}
                      className={`py-1 text-[9px] font-black uppercase tracking-wider text-center transition-all duration-150 rounded-none ${
                        promptWrapper === 'SYSTEM'
                          ? 'bg-white text-black font-black'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      SYS ONLY
                    </button>
                    <button
                      onClick={() => {
                        setPromptWrapper('CHAT');
                        setStatus('Prompt formatting selector modified: [ CHAT SHELL ] active.');
                      }}
                      className={`py-1 text-[9px] font-black uppercase tracking-wider text-center transition-all duration-150 rounded-none ${
                        promptWrapper === 'CHAT'
                          ? 'bg-white text-black font-black font-black'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      CHAT SHELL
                    </button>
                  </div>
                </div>

                {exceedsAllModels ? (
                  <button 
                    disabled={true}
                    className="w-full h-10 border border-red-950 bg-red-950/15 text-red-500 font-black text-[9px] leading-tight uppercase flex items-center justify-center p-2 rounded-none cursor-not-allowed animate-pulse"
                    title="Estimated token context size exceeds all supported model budget thresholds. Please trim files in the layer checklist below."
                  >
                    [ EXCEEDS ACCUMULATED BUDGET // TRIM CORE ASSETS ]
                  </button>
                ) : (
                  <button 
                    onClick={copyToClipboard}
                    disabled={fileCount === 0}
                    className="w-full h-10 border border-zinc-800 hover:border-white transition-all text-white font-black text-xs uppercase flex items-center justify-center gap-2 bg-zinc-950 disabled:opacity-30 disabled:pointer-events-none rounded-none"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        EXPORT MATRIX
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* CORE LAYERS & ACTIVE FILE PRUNING TREE */}
            {loadedFiles.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950/30 p-6 space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-zinc-400 animate-pulse" />
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block">
                      CORE LAYERS & ACTIVE FILE PRUNING TREE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[9px] font-mono select-none">
                    <span className="text-zinc-650">STATE CONTROL:</span>
                    <button 
                      onClick={() => {
                        setLoadedFiles(prev => prev.map(f => ({ ...f, enabled: true })));
                        setUncheckedFiles(new Set());
                        setStatus('Pruning checklist reset: All files enrolled back, recalculating tokens.');
                      }}
                      className="text-zinc-500 hover:text-white transition-colors uppercase font-bold min-h-[30px]"
                    >
                      [ CHECK ALL ]
                    </button>
                    <span className="text-zinc-850">|</span>
                    <button 
                      onClick={() => {
                        setLoadedFiles(prev => prev.map(f => ({ ...f, enabled: false })));
                        const allKeys = loadedFiles.map(f => `${f.source}:${f.path}`);
                        setUncheckedFiles(new Set(allKeys));
                        setStatus('Pruning checklist modified: All files unchecked from the active memory context loop.');
                      }}
                      className="text-zinc-500 hover:text-red-400 transition-colors uppercase font-bold min-h-[30px]"
                    >
                      [ UNCHECK ALL ]
                    </button>
                  </div>
                </div>

                {/* Sub-Checklist search search bar filter */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search tree list by name or directory paths..."
                    value={pruningSearch}
                    onChange={(e) => setPruningSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 px-4 h-11 text-xs text-zinc-300 placeholder:text-zinc-800 font-mono focus:outline-none focus:border-zinc-700 rounded-none"
                  />
                  {pruningSearch && (
                    <button 
                      onClick={() => setPruningSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600 hover:text-white font-mono"
                    >
                      [ RESET ]
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto divide-y divide-zinc-900/40 border border-zinc-900 bg-[#0B0B0C] px-4 py-1 font-mono text-[10px] scrollbar-none">
                  {paginatedChecklistFiles.map((file) => {
                    const fileKey = `${file.source}:${file.path}`;
                    const isChecked = file.enabled !== false && !uncheckedFiles.has(fileKey);
                    const fileTokens = file.tokens || 0;
                    
                    return (
                      <div key={fileKey} className="py-3 flex items-center justify-between hover:bg-zinc-950/80 transition-all duration-155 min-h-[44px] gap-4">
                        <label className="flex items-center gap-3 cursor-pointer select-none max-w-[80%] w-full min-h-[44px]">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = new Set(uncheckedFiles);
                              const targetVal = !isChecked;
                              if (isChecked) {
                                next.add(fileKey);
                              } else {
                                next.delete(fileKey);
                              }
                              setUncheckedFiles(next);
                              setLoadedFiles(prev => prev.map(f => {
                                if (`${f.source}:${f.path}` === fileKey) {
                                  return { ...f, enabled: targetVal };
                                }
                                return f;
                              }));
                              setStatus(`Toggled matrix item state: ${targetVal ? 'CHECKED' : 'UNCHECKED'} // ${file.path}`);
                            }}
                            className="sr-only"
                          />
                          <div className={`w-3.5 h-3.5 border transition-all duration-150 flex items-center justify-center rounded-none shrink-0 ${
                            isChecked 
                              ? 'border-white bg-white text-black' 
                              : 'border-zinc-800 bg-transparent hover:border-zinc-600'
                          }`}>
                            {isChecked && <Check size={10} strokeWidth={3} />}
                          </div>
                          <div className="flex flex-col text-left truncate ml-1 max-w-full">
                            <span className={`truncate leading-snug font-medium text-[11px] select-all ${isChecked ? 'text-zinc-200 font-bold' : 'text-zinc-650 line-through'}`}>
                              {file.path}
                            </span>
                            <span className="text-[8px] text-zinc-600 tracking-wider font-mono">
                              LAYER // {file.source.toUpperCase()}
                            </span>
                          </div>
                        </label>
                        <span className={`text-[9px] font-mono px-2 py-0.5 border select-none shrink-0 ${
                          isChecked 
                            ? 'text-zinc-400 bg-zinc-950 border-zinc-900' 
                            : 'text-zinc-700 bg-transparent border-transparent'
                        }`}>
                          {fileTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    );
                  })}
                  {paginatedChecklistFiles.length === 0 && (
                    <div className="py-8 text-center text-zinc-700 uppercase tracking-widest text-[9px]">
                      No matched files in active search filter views.
                    </div>
                  )}
                </div>

                {/* Highly structured pagination buttons row in physical space */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-900 pt-3 text-[10px] gap-2 select-none font-mono">
                  <div className="text-zinc-650 uppercase">
                    Showing {checklistFilteredFiles.length === 0 ? 0 : (pruningPage - 1) * 25 + 1}-{Math.min(checklistFilteredFiles.length, pruningPage * 25)} of {checklistFilteredFiles.length} matched files
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPruningPage(p => Math.max(1, p - 1))}
                      disabled={pruningPage === 1}
                      className="px-2.5 py-1.5 min-h-[30px] border border-zinc-900 hover:border-white disabled:pointer-events-none disabled:opacity-20 text-white font-bold tracking-wider cursor-pointer"
                    >
                      [ PREV ]
                    </button>
                    <span className="text-zinc-500 font-bold font-mono px-1">
                      PAGE {String(pruningPage).padStart(2, '0')} / {String(totalPruningPages).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => setPruningPage(p => Math.min(totalPruningPages, p + 1))}
                      disabled={pruningPage === totalPruningPages}
                      className="px-2.5 py-1.5 min-h-[30px] border border-zinc-900 hover:border-white disabled:pointer-events-none disabled:opacity-20 text-white font-bold tracking-wider cursor-pointer"
                    >
                      [ NEXT ]
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Programmatic Disk streams downloader bindings row */}
            {fileCount > 0 && (
              <div className="border border-zinc-900 bg-zinc-950/30 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 font-mono text-left">
                  <span className="text-white font-bold text-xs uppercase block">Programmatic Saved Documents</span>
                  <p className="text-[10px] text-zinc-600">Save your compiled multi-layer engine matrix directly to high bandwidth disk streams as Markdown or custom JSON configurations.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="h-10 border border-zinc-800 hover:border-white hover:bg-neutral-900 text-white text-[10px] px-4 font-black uppercase tracking-wider transition-all flex items-center gap-2 bg-zinc-950 rounded-none duration-150"
                  >
                    <Download size={12} />
                    Download .md file
                  </button>
                  <button 
                    onClick={handleDownloadJSON}
                    className="h-10 border border-zinc-805 hover:border-white hover:bg-neutral-900 text-white text-[10px] px-4 font-black uppercase tracking-wider transition-all flex items-center gap-2 bg-zinc-950 rounded-none duration-150"
                  >
                    <Download size={12} />
                    Download .json package
                  </button>
                </div>
              </div>
            )}

            {/* VISUAL MODEL TOKEN ALLOCATION GAUGES (PROGRESS GRAPH) */}
            <div className="border border-zinc-900 p-6 bg-zinc-950/40 space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block animate-pulse">VISUAL TRACKING PROGRESS GRAPH // MODEL TOKENS ALLOCATIONS</span>
                <span className="text-[10px] text-zinc-650 font-mono">ESTIMATED TOKEN COUNT: {estimatedTokens.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modelsBudgets.map((model) => (
                  <div key={model.name} className="bg-[#0B0B0C] border border-zinc-900 p-4 space-y-2.5 hover:border-zinc-700 transition-all duration-150">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`font-bold ${model.isExceeded ? 'text-red-400 animate-pulse' : 'text-white'}`}>{model.name}</span>
                      <span className={model.isExceeded ? 'text-red-400 font-bold' : 'text-zinc-500'}>
                        {estimatedTokens.toLocaleString()} / <span className="text-zinc-650 font-black">{model.max.toLocaleString()} max</span>
                      </span>
                    </div>
                    {/* Visual Tracking bar progress graph gauges */}
                    <div className="w-full h-1.5 bg-zinc-950 border border-zinc-901 rounded-none overflow-hidden relative">
                      <div 
                        className={`h-full transition-all duration-550 ${model.isExceeded ? 'bg-red-500' : model.color}`} 
                        style={{ width: `${model.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono select-none">
                      <span className="text-zinc-650">BUDGET USAGE</span>
                      <span className={model.isExceeded ? 'text-red-500 font-bold animate-[pulse_1s_infinite]' : 'text-zinc-400'}>
                        {model.isExceeded ? `EXCEEDED (${model.percentage}% USED) ⚠️` : `${model.percentage}% USED`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance protecting layer */}
            {!isPreviewVisible ? (
              <div className="border border-zinc-900 bg-[#0B0B0C] p-12 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border border-zinc-900 flex items-center justify-center text-zinc-600 rounded-none bg-zinc-950">
                  <FileCode size={18} />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-xs uppercase tracking-widest font-black leading-relaxed">
                    Visual Render Thread Protected
                  </p>
                  <p className="text-[10px] text-zinc-600 max-w-sm mx-auto leading-relaxed font-mono">
                    Compacted raw matrices held safely in background cache memories. Rendering extensive blocks inside browser page DOMs triggers CPU rendering spikes.
                  </p>
                </div>
                <button
                  onClick={handleRevealPreview}
                  disabled={fileCount === 0}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase hover:bg-zinc-200 transition-all tracking-widest rounded-none disabled:opacity-20 disabled:pointer-events-none"
                >
                  Unveil Preview Matrices
                </button>
              </div>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-mono">ACTIVE DIRECTIVES STREAM</span>
                  <button 
                    onClick={() => setIsPreviewVisible(false)}
                    className="text-[10px] text-zinc-500 hover:text-white underline underline-offset-4 uppercase font-bold"
                  >
                    Shield Visual Render
                  </button>
                </div>
                <textarea 
                  readOnly
                  value={renderedText}
                  className="w-full h-[450px] p-4 bg-[#0B0B0C] border border-zinc-900 text-[10px] text-zinc-350 font-mono resize-none focus:outline-none leading-relaxed select-all"
                />
              </div>
            )}

          </div>
        )}

        {/* Legal & Privacy Policy Panel */}
        {activeTab === 'legal' && (
          <div className="space-y-6 animate-fadeIn text-left max-w-3xl mx-auto leading-relaxed">
            <div className="border border-zinc-900 bg-zinc-950/40 p-8 space-y-6">
              
              {/* Header block with metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-5 gap-2">
                <div>
                  <h1 className="text-white font-black tracking-[0.2em] text-sm uppercase">PRIVACY POLICY &amp; LEGAL DISCLOSURES</h1>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">Last System Update: May 2026 // Active Sandbox Assurance</p>
                </div>
                <div className="px-3 py-1 border border-zinc-900 text-[9px] text-zinc-500 tracking-wider font-mono shrink-0 uppercase">
                  ZERO-SERVER SANDBOX ASSURED
                </div>
              </div>

              {/* Complete Legal Texts with low-opacity monospace theme */}
              <div className="text-zinc-400 font-mono text-xs space-y-6 leading-relaxed">
                <p>
                  At <strong className="text-zinc-200">Context.Engine</strong> (referred to below as "the Platform", "we", "us", or "our"), data privacy is not a feature or a policy setting—it is the foundational core of our application architecture. This document outlines the technical framework of our software and states why our system is structurally engineered to guarantee your absolute privacy, anonymity, and legal safety now and in the future.
                </p>

                <div className="space-y-2 border-t border-zinc-900/50 pt-4">
                  <h3 className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">1. CORE ARCHITECTURAL PARADIGM: ZERO-SERVER ENVIRONMENT</h3>
                  <p>
                    Context.Engine operates exclusively as a single-page client-side web application. Our software runs entirely inside your device’s sandbox browser environment.
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1.5 text-zinc-400">
                    <li><strong className="text-zinc-350">No Cloud Infrastructure:</strong> We do not own, lease, or operate external web servers, application servers, cloud databases, or analytics log repositories.</li>
                    <li><strong className="text-zinc-350">No Identity Profiles:</strong> There are no user registration frameworks, login prompts, OAuth authentications, or tracking cookies implemented on this platform.</li>
                    <li><strong className="text-zinc-350">No Corporate Visibility:</strong> It is physically and technically impossible for us to collect, view, monitor, intercept, or copy your source code, file trees, or system prompts.</li>
                  </ul>
                </div>

                <div className="space-y-2 border-t border-zinc-900/50 pt-4">
                  <h3 className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">2. IN-BROWSER LOCAL MEMORY &amp; DATA RETENTION PROCESSING</h3>
                  <p>
                    While data never moves to an external server hosted by us, the Platform harnesses native browser APIs to execute real-time workflow processes:
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1.5 text-zinc-400">
                    <li>
                      <strong className="text-zinc-350">Source Code Matrix Data:</strong> When you stream a remote git repository, the code text files are parsed directly into temporary browser RAM via local variables (<code className="text-zinc-305 bg-zinc-950 px-1 border border-zinc-900">useRef</code> memory buffers). This text stream is strictly used to compile your markdown prompt clipboard modules. Live token usage values are dynamically generated in active memory using localized, precise byte-pair telemetry limits.
                    </li>
                    <li>
                      <strong className="text-zinc-350">State Preservation (LocalStorage Archive):</strong> To optimize developer workflow, the History Archive dashboard relies strictly on browser <code className="text-zinc-305 bg-zinc-950 px-1 border border-zinc-900">localStorage</code> to preserve structural metadata across interface reloads.
                    </li>
                  </ul>
                  <div className="pl-4 space-y-1 text-[11px]">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mt-1">// STORED METRICS &amp; RETENTION SECURITY</p>
                    <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-450">
                      <li><strong className="text-zinc-350">Stored Metrics:</strong> The data saved on your machine is limited to: Repository Identities, Component Target Links, Compiled Token Estimates, and Event Timestamps.</li>
                      <li><strong className="text-zinc-350">Absolute User Sovereignty:</strong> This log is kept entirely on your physical device. You can selectively delete individual records via line-item trash icons, or use the <code className="text-zinc-355 bg-zinc-950 px-1 border border-zinc-900">[ CLEAR ARCHIVE ]</code> button to wipe all trace metrics instantly.</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-900/50 pt-4">
                  <h3 className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">3. EXPLICIT THIRD-PARTY SERVICE INTERACTIONS</h3>
                  <p>
                    To seamlessly compile, stream, and render design assets without forcing you to set up database endpoints or proxy keys, the platform initiates direct client-to-server calls to two external global networks. Your browser interacts directly with their independent content servers under the following parameters:
                  </p>

                  <div className="pl-3 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-zinc-300 font-bold text-[10px] uppercase">A. THE GITHUB DEVELOPMENT NETWORK &amp; SLIDING CONCURRENCY</h4>
                      <p className="text-zinc-400">
                        When mapping or appending a remote project link, your browser directly calls GitHub’s open public API endpoints to parse metadata and stream raw assets.
                      </p>
                      <ul className="list-disc list-inside pl-2 text-[11px] text-zinc-400 space-y-1">
                        <li><strong className="text-zinc-355">API Tree Requests:</strong> Fetched through <code className="text-zinc-300">api.github.com</code> to isolate public folder hierarchies.</li>
                        <li><strong className="text-zinc-355">Continuous Sliding-Window Concurrency:</strong> Individual source code structures are pulled sequentially from <code className="text-zinc-300">raw.githubusercontent.com</code>. To maximize data bandwidth efficiency, your browser initializes an isolated sliding-window pool of up to 25 parallel file network lines simultaneously. These connection loops are run entirely client-side on your network hardware.</li>
                      </ul>
                      <div className="flex gap-3 text-[10px] mt-2">
                        <a href="https://docs.github.com/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline">[ GitHub General Privacy Statement ]</a>
                        <a href="https://docs.github.com/rest" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline">[ GitHub REST API Terms of Use ]</a>
                      </div>
                    </div>

                    <div className="space-y-1 border-t border-zinc-900/30 pt-3">
                      <h4 className="text-zinc-300 font-bold text-[10px] uppercase">B. THE GOOGLE FONTS REGISTRY</h4>
                      <p className="text-zinc-400">
                        To preserve our sharp, high-contrast monochrome design style, our interface links to the Google Fonts directory to fetch specialized monospace typefaces.
                      </p>
                      <ul className="list-disc list-inside pl-2 text-[11px] text-zinc-400 space-y-1">
                        <li><strong className="text-zinc-355">Font Asset Requests:</strong> When initializing the system frame, your browser calls Google’s deployment networks to load the typography package.</li>
                        <li><strong className="text-zinc-355">IP Address Transmission:</strong> During this brief connection, Google's networks naturally log your public IP address to successfully deliver the font components to your browser. Google states that this optimization log is separate from other tracking services and is never cross-referenced to compile user profiles.</li>
                      </ul>
                      <div className="mt-2">
                        <a href="https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline text-[10px]">[ Google Fonts Privacy Documentation ]</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-900/50 pt-4">
                  <h3 className="text-zinc-200 font-bold uppercase tracking-wider text-[11px]">4. GLOBAL REGULATORY COMPLIANCE &amp; HARDWARE PROTECTION</h3>
                  <p>
                    Because Context.Engine operates entirely inside your local client browser sandbox, it inherently provides top-tier compliance metrics with stringent global data privacy regimes:
                  </p>
                  <ul className="list-disc list-inside pl-2 space-y-1.5 text-zinc-400">
                    <li><strong className="text-zinc-355">GDPR &amp; CCPA/CPRA Compliance:</strong> We do not collect, monetize, sell, or rent your intellectual property, personal consumer identifiers, or application data. Your source code never hits our server boundaries. You retain 100% data erasure rights since you control your own local device storage.</li>
                    <li><strong className="text-zinc-355">Absolute Shield Against AI Model Scraping:</strong> Because your codebase arrays are processed inside isolated browser memory loops and never pass through a middleman server, it is physically impossible for our platform or unauthorized data crawlers to scrape your private code repositories to train public AI models.</li>
                    <li><strong className="text-zinc-355">Hardware-Accelerated Thread Safety:</strong> Large repositories are safely structured within hidden background client variables (<code className="text-zinc-305 bg-zinc-950 px-1 border border-zinc-900">useRef</code> memory arrays) rather than being continually injected into the visible page layout DOM. This configuration shields your data structures from unauthorized browser extensions and prevents operating system memory overhead spikes.</li>
                    <li><strong className="text-zinc-355">System Resync Kill-Switch:</strong> Triggering the <code className="text-zinc-355 bg-zinc-950 px-1 border border-[#1b1b1c]">// FORCE RESYNC ENGINE</code> action immediately resets the application UI and purges all residual context vectors from your browser's active RAM cache in a single frame.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Minimalist Industrial Footer */}
        <footer className="border-t border-zinc-900 mt-12 pt-6 pb-2 text-[10px] font-mono text-zinc-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse" />
            <span>CONTEXT.ENGINE // ZERO-SERVER LOCAL CLIENT SECURED</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('legal')}
              className="hover:text-white transition-colors duration-150 uppercase"
            >
              [ Legal &amp; Privacy Policy ]
            </button>
            <span>© 2026 // VOID.ARCHITECTS</span>
          </div>
        </footer>

      </div>

      {/* Elegant void layout radial dots */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}
