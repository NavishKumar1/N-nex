export const DEFAULT_IGNORE_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.gz', 
  '.tar', '.exe', '.dll', '.so', '.dylib', '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.mov', '.mp3', '.wav', '.webp'
];

export const DEFAULT_IGNORE_DIRECTORIES = [
  'node_modules', '.git', 'dist', 'build', '.next', '.cache', 'vendor', 
  'out', '.vercel', '.output', '.idea', '.vscode', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
];

export const DEFAULT_FETCH_LIMIT = 150;
export const STORAGE_KEY = 'n_nex_filters_v3';
export const HISTORY_STORAGE_KEY = 'n_nex_history_v3';

export const PROMPT_PRESETS = {
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