import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderSearch, Code, Activity, Check, Copy, Download, RefreshCw 
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MatrixPreviewPanelProps {
  fileCount: number;
  estimatedChars: number;
  estimatedTokens: number;
  promptWrapper: 'SYSTEM' | 'CHAT';
  setPromptWrapper: (val: 'SYSTEM' | 'CHAT') => void;
  setStatus: (val: string) => void;
  copyToClipboard: () => void;
  copied: boolean;
  previewMode: 'raw' | 'rendered';
  setPreviewMode: (val: 'raw' | 'rendered') => void;
  renderedText: string;
  downloadAsTextFile: () => void;
  handleDownloadTXT: () => void;
  handleDownloadJSON: () => void;
}

export const MatrixPreviewPanel: React.FC<MatrixPreviewPanelProps> = ({
  fileCount,
  estimatedChars,
  estimatedTokens,
  promptWrapper,
  setPromptWrapper,
  setStatus,
  copyToClipboard,
  copied,
  previewMode,
  setPreviewMode,
  renderedText,
  downloadAsTextFile,
  handleDownloadTXT,
  handleDownloadJSON,
}) => {
  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button 
          onClick={downloadAsTextFile}
          disabled={fileCount === 0}
          className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 rounded-lg border border-slate-700 disabled:opacity-50"
        >
          <Download size={14} /> EXPORT (.MD)
        </button>
        <button 
          onClick={handleDownloadTXT}
          disabled={fileCount === 0}
          className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 rounded-lg border border-slate-700 disabled:opacity-50"
        >
          <Download size={14} /> EXPORT (.TXT)
        </button>
        <button 
          onClick={handleDownloadJSON}
          disabled={fileCount === 0}
          className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white transition-all text-xs font-semibold flex items-center justify-center gap-2 rounded-lg border border-slate-700 hover:border-sky-500/50 hover:text-sky-400 disabled:opacity-50"
        >
          <Download size={14} /> EXPORT (.JSON)
        </button>
      </div>

      {/* Compile Visual Pre-views Workspace */}
      <div className="border border-slate-800 bg-slate-900/50 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-slate-800/80 bg-slate-900 gap-3">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-sky-400" />
            <span className="text-xs text-white font-mono font-semibold tracking-wide uppercase">Live Render</span>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-md border border-slate-800">
            <button
              onClick={() => setPreviewMode('raw')}
              className={`px-3 py-1.5 text-[10px] font-bold font-mono transition-colors rounded ${previewMode === 'raw' ? 'bg-slate-800 text-sky-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Raw Extracted Buffer
            </button>
            <button
              onClick={() => setPreviewMode('rendered')}
              className={`px-3 py-1.5 text-[10px] font-bold font-mono transition-colors rounded ${previewMode === 'rendered' ? 'bg-slate-800 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Shield Visual Render
            </button>
          </div>
        </div>
        <div className="w-full h-[450px] bg-slate-950 border border-slate-800/80 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {previewMode === 'raw' ? (
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
              {renderedText ? renderedText : "Execute a payload generation to view."}
            </SyntaxHighlighter>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none p-4 font-sans text-slate-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {renderedText ? renderedText : "Execute a payload generation to view."}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
