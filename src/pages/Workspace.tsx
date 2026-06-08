import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { InteractiveFileTree } from '../components/InteractiveFileTree';
import { QuickStartTour } from '../components/QuickStartTour';
import { 
  FolderSearch, Github, Settings, Copy, Check, Trash2, Filter, ArrowRight, Activity, Code,
  AlertCircle, GitBranch, X, FileCode, Terminal, Sparkles, Layers, Clock, LayoutGrid, Download,
  FileText, RefreshCw, FolderSync, Code2, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getEncoding } from 'js-tiktoken';
import { LoadedFile, FilterSettings, TabItem, HistoricalLog } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  DEFAULT_IGNORE_EXTENSIONS, DEFAULT_IGNORE_DIRECTORIES, DEFAULT_FETCH_LIMIT, 
  STORAGE_KEY, HISTORY_STORAGE_KEY, PROMPT_PRESETS 
} from '../utils/constants';

const tokenizerEncoder = getEncoding('cl100k_base');

export default function Workspace({ onBackToLanding }: { onBackToLanding: () => void }) {
  // --- UI/UX States ---
  const [githubUrl, setGithubUrl] = useState('');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('compile_architects_github_token') || '');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Sandbox engine ready for secure context consolidation.');
  const [error, setError] = useState<string | null>(null);

  // Exclusions panel toggling
  const [showSettings, setShowSettings] = useState(false);
  const [customExt, setCustomExt] = useState('');

  // Theme switcher state
  const [isLightMode, setIsLightMode] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light');
  });

  useEffect(() => {
    if (githubToken) {
      localStorage.setItem('compile_architects_github_token', githubToken);
    }
  }, [githubToken]);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [isLightMode]);

  // Prompt configuration & historical parameters
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PROMPT_PRESETS>('NONE');
  const [history, setHistory] = useState<HistoricalLog[]>([]);

  // Chrome design tabs
  const [activeTab, setActiveTab] = useState('engine');
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: 'engine', label: 'Core Workspace', closeable: false },
    { id: 'history', label: 'History Archive', closeable: false }
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
          
          const langMap = {
            'js': 'JavaScript', 'jsx': 'React (JSX)', 'ts': 'TypeScript', 'tsx': 'React (TSX)',
            'py': 'Python', 'java': 'Java', 'rb': 'Ruby', 'go': 'Go', 'rs': 'Rust',
            'c': 'C', 'cpp': 'C++', 'cs': 'C#', 'html': 'HTML', 'css': 'CSS',
            'json': 'JSON', 'md': 'Markdown', 'sh': 'Shell Script', 'yml': 'YAML',
            'yaml': 'YAML', 'xml': 'XML', 'php': 'PHP', 'swift': 'Swift', 'kt': 'Kotlin',
            'sol': 'Solidity', 'sql': 'SQL', 'vue': 'Vue.js', 'svelte': 'Svelte'
          };

          const detectedLangs = new Set();
          files.forEach(f => {
            if (f.enabled && f.ext) {
              const extLower = f.ext.toLowerCase();
              const lang = langMap[extLower] || extLower.toUpperCase();
              detectedLangs.add(lang);
            }
          });

          let languageHeader = "";
          if (detectedLangs.size > 0) {
            languageHeader = "## LANGUAGE ANALYSIS:\\n- " + Array.from(detectedLangs).join("\\n- ") + "\\n\\n";
          }

          let output = presetText + languageHeader + treeText + "## CODE BLOCKS DETAIL:\\n\\n";
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

  const handleToggleFile = useCallback((fileKey: string, targetVal: boolean) => {
    setUncheckedFiles(prev => {
      const next = new Set(prev);
      if (!targetVal) next.add(fileKey);
      else next.delete(fileKey);
      return next;
    });
    setLoadedFiles(prev => prev.map(f => {
      if (`${f.source}:${f.path}` === fileKey) {
        return { ...f, enabled: targetVal };
      }
      return f;
    }));
    setStatus(`Toggled matrix item state: ${targetVal ? 'CHECKED' : 'UNCHECKED'} // ${fileKey}`);
  }, []);

  const handleToggleDirectory = useCallback((fileKeys: string[], targetVal: boolean) => {
    setUncheckedFiles(prev => {
      const next = new Set(prev);
      fileKeys.forEach(key => {
        if (!targetVal) next.add(key);
        else next.delete(key);
      });
      return next;
    });
    const keySet = new Set(fileKeys);
    setLoadedFiles(prev => prev.map(f => {
      if (keySet.has(`${f.source}:${f.path}`)) {
        return { ...f, enabled: targetVal };
      }
      return f;
    }));
    setStatus(`Toggled bulk matrix directory state: ${targetVal ? 'CHECKED' : 'UNCHECKED'} // ${fileKeys.length} files`);
  }, []);

  // --- Final Utility States (GLYPH Feature Upgrades) ---
  const [globalExtensionFilter, setGlobalExtensionFilter] = useState('');
  const [uncheckedFiles, setUncheckedFiles] = useState<Set<string>>(new Set());
  const [promptWrapper, setPromptWrapper] = useState<'SYSTEM' | 'CHAT'>('SYSTEM');
  
  // High-performance search & pagination for Pruning Tree
  const [pruningSearch, setPruningSearch] = useState('');

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

  const handleDownloadTXT = () => {
    compileWithWorker('download_txt');
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
      let rawInput = githubUrl.trim();
      let inlineToken = '';

      // Check for inline auth token (e.g. https://<token>@github.com/...)
      const authMatch = rawInput.match(/^(?:https?:\/\/)?(?:[^:]+:)?([^@:]+)@github\.com/i);
      if (authMatch) {
        inlineToken = authMatch[1];
        if (inlineToken.toLowerCase() === 'git') inlineToken = ''; // Ignore standard git user
        rawInput = rawInput.replace(/(https?:\/\/)?(?:[^:]+:)?([^@:]+)@/, '$1');
      }

      let cleanedUrl = rawInput
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

      const effectiveToken = inlineToken || githubToken;

      const apiHeaders: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (effectiveToken) {
        apiHeaders['Authorization'] = `Bearer ${effectiveToken.trim()}`;
      }
      
      const rawHeaders: Record<string, string> = {};
      if (effectiveToken) {
        rawHeaders['Authorization'] = `Bearer ${effectiveToken.trim()}`;
      }

      // Resolve overriding branches parameter
      const treeMatch = githubUrl.match(/github\.com\/[^/]+\/[^/]+\/tree\/([^/?#]+)/);
      const commitMatch = githubUrl.match(/github\.com\/[^/]+\/[^/]+\/commit\/([a-f0-9]+)/);
      const prMatch = githubUrl.match(/github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/);
      
      requestAnimationFrame(() => {
        setStatus('> STREAMING NETWORK REPOSITORY METADATA FLOW...');
      });

      let targetBranch = branch.trim();

      // If user provided a pure number in the branch field, maybe it's a PR. 
      // We will assume it's a PR if it's purely digits and no branch exists with that name?
      // Actually we can check PRs if it starts with #
      let manualPrMatch = null;
      if (targetBranch.startsWith('#')) {
        manualPrMatch = targetBranch.substring(1);
      } else if (!targetBranch && prMatch) {
        manualPrMatch = prMatch[1];
      } else if (targetBranch && /^\d+$/.test(targetBranch)) {
        // Option fallback if they just type 123
        manualPrMatch = targetBranch;
      }

      if (manualPrMatch) {
        requestAnimationFrame(() => {
          setStatus(`> RESOLVING PULL REQUEST #${manualPrMatch} METADATA...`);
        });
        const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${manualPrMatch}`, { headers: apiHeaders });
        if (!prRes.ok) {
          throw new Error(`Failed to lookup Pull Request #${manualPrMatch}.`);
        }
        const prData = await prRes.json();
        targetBranch = prData.head.sha; // Extract exact head commit
      } else if (!targetBranch) {
        if (commitMatch) {
          targetBranch = commitMatch[1];
        } else if (treeMatch) {
          targetBranch = treeMatch[1];
        } else {
          // Fetch repo metadata to obtain default branch if not specified
          const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: apiHeaders });
          if (!repoRes.ok) {
            if (repoRes.status === 403) throw new Error('GitHub API rate limit exhausted. Please try again soon. ' + (effectiveToken ? 'Check if token is valid.' : 'Use a token to increase limits.'));
            if (repoRes.status === 404) throw new Error('Repository not found. ' + (effectiveToken ? 'Check token permissions and scopes (requires repo scope).' : 'If it is private, provide a GitHub Personal Access Token.'));
            throw new Error(`Repository lookup unreachable. HTTP ${repoRes.status}`);
          }
          const repoData = await repoRes.json();
          targetBranch = repoData.default_branch;
        }
      }

      // Request architectural directory mapping (High efficiency metadata mapping)
      requestAnimationFrame(() => {
        setStatus(`Streaming directory matrix layouts for ${currentLabelIdentity.toUpperCase()}...`);
      });

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`, { headers: apiHeaders });
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
            const res = await fetch(rawFileUrl, { headers: rawHeaders });
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

  const compileWithWorker = (actionType: 'copy' | 'preview' | 'download_md' | 'download_txt' | 'download_json') => {
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
          } else if (actionType === 'download_md' || actionType === 'download_txt') {
            const ext = actionType === 'download_md' ? 'md' : 'txt';
            const mimeType = actionType === 'download_md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
            const blob = new Blob([output], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const prefix = selectedPreset !== 'NONE' ? `${selectedPreset.toLowerCase()}_` : '';
            const filename = `${prefix}context_payload_${Date.now()}.${ext}`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setStatus(`Matrix saved to disk: "${filename}"`);
          } else if (actionType === 'download_json') {
            const jsonStructure = {
              meta: {
                app: "Workspace",
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

  const downloadAsTextFile = () => {
    compileWithWorker('download_md');
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
    setStatus('SYSTEM ARCHITECTURE PURGED: Active memory cached arrays wiped and workspace re-initiated.');
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

  // --- GLOBAL SHORTCUT LAYER ---
  const handleKeyboardSubmitRef = useRef<() => void>();
  handleKeyboardSubmitRef.current = () => {
    const fileCount = loadedFiles.filter(f => !uncheckedFiles.has(`${f.source}:${f.path}`)).length;
    if (fileCount > 0) {
      // If we are actively previewing matrices, update the preview. Otherwise, copy to clipboard.
      if (activeTab === 'preview') {
        compileWithWorker('preview');
      } else {
        copyToClipboard();
      }
    } else if (githubUrl) {
      // If no files active but there's a github URL, trigger generation
      executeGithubStreaming(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleKeyboardSubmitRef.current?.();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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



  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col antialiased selection:bg-sky-400/30 selection:text-white">
      <QuickStartTour />
      {/* Stark Void Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-slate-950 h-20 sm:h-24 shrink-0 flex items-center justify-between px-3 sm:px-6 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center justify-center hover:bg-slate-800/80 rounded-md transition-colors group p-1 sm:p-2"
            title="Return to Interface"
          >
            <img src="/N-nex.png" alt="N-nex" className="h-16 sm:h-20 cursor-pointer opacity-90 group-hover:opacity-100 object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.15)]" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-800/80 pl-2 sm:pl-4">
            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
            <span className="text-white font-bold tracking-widest text-[10px] sm:text-xs uppercase font-sans">Workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex px-3 py-1.5 border border-slate-800/80 text-[10px] text-slate-400 tracking-wider rounded-lg font-mono items-center shadow-inner bg-slate-900/50">
            <Sparkles className="w-3 h-3 text-purple-400 mr-1.5" />
            V1.1.0 COMPILER
          </div>
          <button 
            onClick={handleForceResync}
            className="px-3 sm:px-4 py-1.5 border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-400 font-bold text-[10px] tracking-widest uppercase transition-all duration-200 rounded-md ml-2 flex items-center shadow-sm"
            title="Wipe cached arrays and reset context"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            <span className="hidden sm:inline">FORCE RESYNC</span>
            <span className="sm:hidden">RESYNC</span>
          </button>
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="p-1.5 sm:p-2 border border-slate-800/80 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-600 transition-all duration-200 rounded-md shadow-sm ml-2"
            title="Toggle Theme"
          >
            {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 sm:p-2 border rounded-md transition-all duration-200 shadow-sm ml-2 ${showSettings ? 'bg-sky-400 text-slate-950 border-sky-400' : 'border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-600 bg-slate-950'}`}
            title="Configure Ignored Extensions & Filters"
          >
            <Settings size={14} />
          </button>
        </div>
      </nav>

      {/* Modern SaaS Tab Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 flex items-center h-14 px-3 sm:px-6 min-w-0 select-none overflow-x-auto shrink-0 scrollbar-none gap-2">
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
              className={`flex items-center h-9 px-4 text-xs font-medium tracking-wide cursor-pointer transition-all rounded-md border whitespace-nowrap ${
                isActive 
                  ? 'bg-slate-800 text-white border-slate-700 shadow-sm' 
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.closeable && (
                <button 
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="ml-2 p-0.5 rounded-full hover:bg-slate-700 hover:text-white transition-colors animate-fadeIn"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Container Viewport */}
      <div className="flex-1 overflow-auto max-w-5xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        
        {/* Exclusion Filters Drawer Screen */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-slate-800 bg-slate-900/50 shadow-lg rounded-xl backdrop-blur-sm"
            >
              <div className="p-4 sm:p-6 space-y-6 text-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Filter size={14} className="text-sky-400" />
                    Configuration Controls // Metric Filter
                  </span>
                  <button 
                    onClick={() => setFilters({
                      ignoreExtensions: DEFAULT_IGNORE_EXTENSIONS,
                      ignoreDirectories: DEFAULT_IGNORE_DIRECTORIES,
                      fetchLimit: DEFAULT_FETCH_LIMIT
                    })}
                    className="text-xs text-slate-400 hover:text-sky-400 font-medium transition-colors"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Limits and customized parameters input fields */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium">GitHub Fetch Limit</label>
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
                          className="bg-slate-950 border border-slate-800/80 px-3 py-2 w-24 text-white font-mono focus:outline-none focus:border-sky-400 rounded-md text-xs shadow-inner"
                        />
                        <span className="text-xs text-slate-500">Max file fetches (1-500)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium">Ignore File Extension</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={customExt}
                          onChange={(e) => setCustomExt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddFilter()}
                          placeholder=".env, .yaml, .config"
                          className="bg-slate-950 border border-slate-800/80 px-3 py-2 text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-sky-400 text-xs w-full rounded-md shadow-inner"
                        />
                        <button 
                          onClick={handleAddFilter}
                          className="px-4 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-medium transition-all rounded-md h-[34px] flex items-center text-xs"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active extensions ignores status array maps */}
                  <div className="space-y-3">
                    <label className="text-xs text-slate-400 font-medium block">Ignored Extension Rules <span className="text-slate-500 font-normal">({filters.ignoreExtensions.length})</span></label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-slate-800/80 p-3 bg-slate-950/20 rounded-md scrollbar-none">
                      {filters.ignoreExtensions.map(ext => (
                        <div key={ext} className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 text-xs text-slate-300 group rounded-md shadow-sm">
                          <span className="font-mono">{ext}</span>
                          <button 
                            onClick={() => handleRemoveFilter(ext)}
                            className="text-slate-500 hover:text-red-400 transition-colors ml-1 focus:outline-none leading-none mt-[1px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950 p-5 border border-slate-800/80 rounded-lg">
                  <div className="text-xs text-slate-400 font-medium">Standard Directories Shielded Globally</div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-mono">
                    {filters.ignoreDirectories.map(dir => (
                      <span key={dir} className="bg-slate-950 border border-slate-800/80 px-2 py-1 rounded-md shadow-sm">{dir}/</span>
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
            <div className="border border-slate-800 bg-slate-900/50 p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-sky-400" />
                <span className="text-xs text-slate-300 font-semibold tracking-wide block">System Preset Directive</span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-sans">
                {Object.keys(PROMPT_PRESETS).map((key) => {
                  const isSelected = selectedPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPreset(key as keyof typeof PROMPT_PRESETS);
                        setIsPreviewVisible(false); // force visual repack safely
                      }}
                      className={`px-4 py-2 font-medium transition-all border rounded-lg shadow-sm whitespace-nowrap text-xs sm:text-sm flex-1 sm:flex-initial text-center ${
                        isSelected 
                          ? 'border-sky-400 text-slate-950 bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
                          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800 bg-slate-800/50'
                      }`}
                    >
                      {PROMPT_PRESETS[key as keyof typeof PROMPT_PRESETS].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CRITICAL FIX: CLEANED UP FULL-WIDTH WORKSPACE PIPELINE INPUT */}
            <div className="border border-slate-800 p-5 sm:p-8 rounded-xl bg-slate-900/50 w-full space-y-4 sm:space-y-5 shadow-sm">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Github size={16} className="text-sky-400" />
                  Remote Git Workspace Pipeline
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Fetch, extract, and layer public tree directories dynamically from endpoint mirrors using non-blocking continuous concurrency paths.
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                  <div className="md:col-span-4">
                    <label className="text-xs text-slate-300 font-medium mb-2 block">
                      Repository Destination URL
                    </label>
                    <input 
                      id="tour-step-2-github"
                      type="text"
                      placeholder="github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeGithubStreaming(false)}
                      className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm rounded-lg shadow-inner focus:outline-none focus:border-sky-400 text-slate-300 font-mono transition-colors"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 font-medium mb-2 block">
                      Branch / Hash / PR <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. main, a1b2c3d, 15"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeGithubStreaming(false)}
                      className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm rounded-lg shadow-inner focus:outline-none focus:border-sky-400 text-slate-300 font-mono transition-colors"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-300 font-medium mb-2 block">
                      GitHub Token <span className="text-slate-500 font-normal">(For Private Repos)</span>
                    </label>
                    <input 
                      type="password"
                      placeholder="ghp_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeGithubStreaming(false)}
                      className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm rounded-lg shadow-inner focus:outline-none focus:border-sky-400 text-slate-300 font-mono transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-300 font-medium mb-2 block">
                      Global Filter <span className="text-slate-500 font-normal">(Opt)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. *.js" 
                      value={globalExtensionFilter}
                      onChange={(e) => {
                        setGlobalExtensionFilter(e.target.value);
                        setStatus(`Compiling dynamic pattern filter: "${e.target.value}"`);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm rounded-lg shadow-inner focus:outline-none focus:border-sky-400 text-slate-400 font-mono transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 mt-2">
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 shadow-inner">
                    <GitBranch size={14} className="text-slate-500" />
                    <input 
                      type="text"
                      placeholder="branch (optional)"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="bg-transparent text-sm text-slate-300 font-mono focus:outline-none focus:text-white placeholder:text-slate-600 w-32"
                    />
                  </div>

                    <div className="flex gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
                    <button 
                      id="tour-step-3-compile"
                      onClick={() => executeGithubStreaming(false)} 
                      disabled={isLoading || !githubUrl} 
                      className="flex-1 border border-sky-400 bg-sky-400 text-slate-950 hover:bg-sky-400 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group relative"
                    >
                      Overwrite Layer
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] hidden group-hover:block whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Shortcut: <kbd className="bg-slate-800 px-1 rounded">Ctrl+Enter</kbd>
                      </div>
                    </button>
                    <button 
                      onClick={() => executeGithubStreaming(true)} 
                      disabled={isLoading || !githubUrl || loadedFiles.length === 0} 
                      className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900"
                    >
                      + Append Layer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* If files are loaded, display active streams layer blocks to provide absolute clarity */}
            {loadedFiles.length > 0 && (
              <div className="border border-slate-700 bg-slate-800/30 p-5 rounded-xl space-y-4 animate-fadeIn shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-700/80 pb-3">
                  <span className="font-semibold flex items-center gap-2">
                    <Layers size={14} className="text-purple-400" />
                    Active Compiling Ingress Layers ({activeLayers.length})
                  </span>
                  <button 
                    onClick={() => {
                      setLoadedFiles([]);
                      setStatus('Active layers purged safely from state context.');
                    }}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors text-xs"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeLayers.map((layer, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-2 shadow-sm">
                      <span className="font-semibold text-slate-500">[{i + 1}]</span>
                      <span className="font-mono">{layer}</span>
                      <span className="text-xs text-slate-500">({loadedFiles.filter(f => f.source === layer).length} files)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error alerts notification banner (stark design look) */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-xl flex gap-3 text-red-200 text-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-bold tracking-wide text-xs block text-red-300">Pipeline Process Exception:</span>
                  <p className="leading-relaxed font-mono text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Terminal Live Output logs window */}
            <div className="border border-slate-700 bg-slate-950 p-5 rounded-xl space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400 text-xs font-semibold flex items-center gap-2">
                  <Terminal size={14} className="text-slate-500" />
                  Terminal Console
                </span>
                <span className="text-slate-500 text-[10px] font-mono flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500/80 rounded-full animate-pulse" />
                  IDLE // ENGINE
                </span>
              </div>
              <p className="text-sky-400 font-mono text-xs leading-relaxed font-medium">
                <span className="text-slate-500 mr-2">&gt;</span>{status}
              </p>
            </div>

          </div>
        )}

        {/* History Archive Panel with garbage deletion mechanism using target unique IDs */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-white text-sm font-semibold flex items-center gap-2">
                <Clock size={16} className="text-purple-400" />
                Recent Workspace Archives
              </span>
              {history.length > 0 && (
                <button 
                  onClick={clearHistoryArchive}
                  className="text-xs text-slate-400 hover:text-white font-medium transition-colors"
                >
                  Clear Archive
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-900/30 text-center">
                <FolderSync className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-sm text-slate-400 font-medium">No history archives available</p>
                <p className="text-xs text-slate-500 mt-1">Saved structures will appear here for quick access</p>
              </div>
            ) : (
              <div className="border border-slate-800 divide-y divide-slate-800 bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
                {history.map((log) => {
                  const isLocal = log.repo.toLowerCase().includes('local');
                  return (
                    <div 
                      key={log.id} 
                      onClick={() => restoreFromHistoryNode(log.repo)}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group gap-4 sm:gap-0"
                    >
                      <div className="space-y-1.5 text-left w-full sm:w-auto">
                        <div className="text-slate-200 font-semibold text-sm group-hover:text-sky-400 transition-colors truncate max-w-[280px] sm:max-w-[400px]">
                          {log.repo}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {log.timestamp}</span>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <span className="flex items-center gap-1.5"><FileCode className="w-3 h-3" /> {log.fileCount} files</span>
                          <span className="hidden sm:inline text-slate-600">•</span>
                          <span className="flex items-center gap-1.5"><Code2 className="w-3 h-3" /> {log.tokens.toLocaleString()} tokens</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {!isLocal && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreFromHistoryNode(log.repo);
                            }}
                            className="flex-1 sm:flex-initial border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 text-xs font-medium transition-all duration-200 bg-slate-800 rounded-lg text-center"
                          >
                            Stage Source
                          </button>
                        )}
                        <button 
                          onClick={(e) => deleteHistoryEntry(log.id, e)}
                          className="flex-none p-2 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200 bg-slate-800 rounded-lg"
                          title="Delete history entry"
                        >
                          <Trash2 size={14} />
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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-semibold tracking-wide mb-1 flex items-center gap-2">
                  <FolderSearch size={14} className="text-sky-400" />
                  Compacted Files
                </div>
                <div className="text-2xl text-white font-bold">{fileCount}</div>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-semibold tracking-wide mb-1 flex items-center gap-2">
                  <Code size={14} className="text-purple-400" />
                  Characters
                </div>
                <div className="text-2xl text-white font-bold">{estimatedChars.toLocaleString()}</div>
              </div>
              <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-center">
                <div className="text-xs text-slate-400 font-semibold tracking-wide mb-1 flex items-center gap-2">
                  <Activity size={14} className="text-fuchsia-400" />
                  Estimated Tokens
                </div>
                <div className="text-2xl text-white font-bold">{estimatedTokens.toLocaleString()}</div>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-2 text-left">
                  <span className="text-xs text-slate-400 font-semibold tracking-wide block">
                    Prompt Wrapper
                  </span>
                  <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => {
                        setPromptWrapper('SYSTEM');
                        setStatus('Prompt formatting selector modified: [ SYSTEM ONLY ] active.');
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold tracking-wide text-center transition-all duration-200 rounded-md ${
                        promptWrapper === 'SYSTEM'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-300 transparent'
                      }`}
                    >
                      SYS ONLY
                    </button>
                    <button
                      onClick={() => {
                        setPromptWrapper('CHAT');
                        setStatus('Prompt formatting selector modified: [ CHAT SHELL ] active.');
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold tracking-wide text-center transition-all duration-200 rounded-md ${
                        promptWrapper === 'CHAT'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-300 transparent'
                      }`}
                    >
                      CHAT SHELL
                    </button>
                  </div>
                </div>

                  <button 
                    onClick={copyToClipboard}
                    disabled={fileCount === 0}
                    className="w-full h-10 border border-sky-400 hover:bg-sky-400 text-sky-400 hover:text-slate-950 transition-all font-bold text-xs flex items-center justify-center gap-2 bg-sky-400/10 disabled:opacity-30 disabled:pointer-events-none rounded-lg shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-inherit" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        EXPORT MATRIX <span className="opacity-50 tracking-normal ml-1">(Ctrl+Enter)</span>
                      </>
                    )}
                  </button>
              </div>
            </div>

            {/* CORE LAYERS & ACTIVE FILE PRUNING TREE */}
            {loadedFiles.length > 0 && (
              <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-sm text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/50 pb-4 gap-3">
                  <div className="flex items-center gap-2 font-sans">
                    <Layers size={16} className="text-sky-400" />
                    <span className="text-sm text-white font-semibold">
                      Core Layers & Active File Tree
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono select-none bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <button 
                      onClick={() => {
                        setLoadedFiles(prev => prev.map(f => ({ ...f, enabled: true })));
                        setUncheckedFiles(new Set());
                        setStatus('Pruning checklist reset: All files enrolled back, recalculating tokens.');
                      }}
                      className="text-slate-400 hover:text-white transition-colors font-semibold"
                    >
                      CHECK ALL
                    </button>
                    <span className="text-slate-700">|</span>
                    <button 
                      onClick={() => {
                        setLoadedFiles(prev => prev.map(f => ({ ...f, enabled: false })));
                        const allKeys = loadedFiles.map(f => `${f.source}:${f.path}`);
                        setUncheckedFiles(new Set(allKeys));
                        setStatus('Pruning checklist modified: All files unchecked from the active memory context loop.');
                      }}
                      className="text-slate-400 hover:text-red-400 transition-colors font-semibold"
                    >
                      UNCHECK ALL
                    </button>
                  </div>
                </div>

                {/* Sub-Checklist search search bar filter */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <FolderSearch size={16} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search tree list by name or directory paths..."
                    value={pruningSearch}
                    onChange={(e) => setPruningSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 pl-10 pr-16 h-[42px] text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 rounded-lg shadow-inner transition-colors"
                  />
                  {pruningSearch && (
                    <button 
                      onClick={() => setPruningSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white font-medium px-2 py-1 bg-slate-800 rounded-md transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto border border-slate-800 bg-slate-950 rounded-lg shadow-inner py-1 overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <InteractiveFileTree 
                    files={checklistFilteredFiles}
                    uncheckedFiles={uncheckedFiles}
                    onToggleFile={handleToggleFile}
                    onToggleDirectory={handleToggleDirectory}
                    searchQuery={pruningSearch}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 text-xs gap-3 select-none font-sans text-slate-400">
                  <div className="font-medium">
                    Showing <span className="text-white">{checklistFilteredFiles.length}</span> matched files in active view layout
                  </div>
                </div>

              </div>
            )}

            {/* Programmatic Disk streams downloader bindings row */}
            {fileCount > 0 && (
              <div className="border border-slate-800 bg-slate-900/50 p-4 sm:p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1.5 font-sans text-left">
                  <span className="text-white font-semibold text-sm block">Programmatic Saved Documents</span>
                  <p className="text-xs text-slate-400">Save your compiled multi-layer engine matrix directly to high bandwidth disk streams as Markdown or custom JSON configurations.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="flex-1 md:flex-initial h-10 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-5 font-semibold transition-all flex items-center justify-center gap-2 bg-slate-800/50 rounded-lg shadow-sm"
                  >
                    <Download size={14} />
                    Download .md
                  </button>
                  <button 
                    onClick={handleDownloadTXT}
                    className="flex-1 md:flex-initial h-10 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-5 font-semibold transition-all flex items-center justify-center gap-2 bg-slate-800/50 rounded-lg shadow-sm"
                  >
                    <Download size={14} />
                    Download .txt
                  </button>
                  <button 
                    onClick={handleDownloadJSON}
                    className="flex-1 md:flex-initial h-10 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs px-5 font-semibold transition-all flex items-center justify-center gap-2 bg-slate-800/50 rounded-lg shadow-sm"
                  >
                    <Download size={14} />
                    Download .json
                  </button>
                </div>
              </div>
            )}



            {/* Performance protecting layer */}
            {!isPreviewVisible ? (
              <div className="border border-slate-800/80 bg-slate-950 p-12 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border border-slate-800/80 flex items-center justify-center text-slate-500 rounded-none bg-slate-950">
                  <FileCode size={18} />
                </div>
                <div className="space-y-2">
                  <p className="text-white text-xs uppercase tracking-widest font-black leading-relaxed">
                    Visual Render Thread Protected
                  </p>
                  <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed font-mono">
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
              <div className="border border-slate-800/80 bg-slate-950 p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">ACTIVE DIRECTIVES STREAM</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={copyToClipboard}
                      className="text-[10px] text-sky-400 hover:text-white uppercase font-bold flex items-center gap-1"
                    >
                      {copied ? <><Check size={12}/> COPIED</> : <><Copy size={12}/> COPY CONTEXT</>}
                    </button>
                    <button 
                      onClick={() => setIsPreviewVisible(false)}
                      className="text-[10px] text-slate-400 hover:text-white underline underline-offset-4 uppercase font-bold"
                    >
                      Shield Visual Render
                    </button>
                  </div>
                </div>
                <div className="w-full h-[450px] bg-slate-950 border border-slate-800/80 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <SyntaxHighlighter 
                    language="markdown"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '10px',
                      lineHeight: '1.6',
                    }}
                    wrapLines={true}
                  >
                    {renderedText}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Minimalist Industrial Footer */}
        <footer className="border-t border-slate-800/80 mt-12 pt-6 pb-2 text-[10px] font-mono text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-pulse" />
            <span>WORKSPACE // ZERO-SERVER LOCAL CLIENT SECURED</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 // VOID.ARCHITECTS</span>
          </div>
        </footer>

      </div>

      {/* Elegant void layout radial dots */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
    </div>
  );
}
