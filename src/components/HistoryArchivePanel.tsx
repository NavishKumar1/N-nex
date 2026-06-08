import React from 'react';
import { Clock, FolderSync, FileCode, Code2, Trash2 } from 'lucide-react';
import { HistoricalLog } from '../types';

interface HistoryArchivePanelProps {
  history: HistoricalLog[];
  clearHistoryArchive: () => void;
  restoreFromHistoryNode: (repo: string) => void;
  deleteHistoryEntry: (id: number, e: React.MouseEvent) => void;
}

export const HistoryArchivePanel: React.FC<HistoryArchivePanelProps> = ({
  history,
  clearHistoryArchive,
  restoreFromHistoryNode,
  deleteHistoryEntry,
}) => {
  return (
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
  );
};
