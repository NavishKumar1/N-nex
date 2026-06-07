export interface LoadedFile {
  path: string;
  content?: string;
  source: string; // e.g. "github: owner/repo" or "local"
  enabled?: boolean;
  tokens?: number;
}

export interface FilterSettings {
  ignoreExtensions: string[];
  ignoreDirectories: string[];
  fetchLimit: number;
}

export interface TabItem {
  id: string;
  label: string;
  closeable: boolean;
}

export interface HistoricalLog {
  id: number;
  repo: string;
  timestamp: string;
  fileCount: number;
  tokens: number;
}