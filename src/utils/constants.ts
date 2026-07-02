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
    text: 'You are an elite software engineering assistant. Below is the codebase context and directory layout structural mapping. Use this context to answer my questions precisely and accurately.\n\n' 
  }
};