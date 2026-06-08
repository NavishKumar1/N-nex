import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, Terminal, FolderSync, Shield, Settings } from 'lucide-react';

export function Docs({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'cli', label: 'CLI Interface', icon: Terminal },
    { id: 'architecture', label: 'Architecture', icon: Shield },
    { id: 'config', label: 'Configuration', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
          </button>
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-slate-950 border border-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <FileText strokeWidth={2} className="text-sky-500 w-4 h-4" />
             </div>
             <span className="text-xl font-bold tracking-tight text-white border-l-2 pl-3 border-slate-800">
               N-NEX <span className="text-slate-500 font-normal">Documentation</span>
             </span>
          </div>
        </div>

        {/* Layout Context */}
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex sm:flex-col gap-2 shrink-0 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-hide">
            <span className="hidden sm:block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-4 mb-4">Contents</span>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-left whitespace-nowrap ${activeTab === tab.id ? 'text-sky-500' : 'text-slate-400 hover:text-white'}`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicatorDocs"
                    className="absolute inset-0 bg-sky-500/10 border border-sky-500/20 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-sky-500' : 'text-slate-500'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#050A15] border border-slate-800/80 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
             
             {/* Content Background Glow */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

             {activeTab === 'overview' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
                 <div>
                   <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Welcome to N-NEX</h1>
                   <p className="text-slate-400 leading-relaxed text-lg">
                     N-NEX is the modern, zero-cloud platform designed for instantly parsing, mapping, and injecting massive GitHub repositories into LLM contexts with absolute precision.
                   </p>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                   <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                     <FolderSync className="w-6 h-6 text-emerald-500 mb-4" />
                     <h3 className="font-bold text-lg mb-2">Zero Client Setup</h3>
                     <p className="text-slate-400 text-sm">
                       No cloning, no Node installations, no environments to configure. Paste a URL and extract instantly entirely in the browser.
                     </p>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                     <Shield className="w-6 h-6 text-[#8b5cf6] mb-4" />
                     <h3 className="font-bold text-lg mb-2">Maximum Privacy</h3>
                     <p className="text-slate-400 text-sm">
                       Your source code is never transmitted to our servers. All execution happens in ephemeral local sandboxed memory.
                     </p>
                   </div>
                 </div>
                 
                 <div className="pt-6 border-t border-slate-800/50">
                    <h3 className="font-bold text-xl mb-4">Core Philosophy</h3>
                    <p className="text-slate-400 leading-relaxed max-w-3xl">
                      LLMs are highly sensitive to context bloat. Uploading raw directories full of package-locks, compiled outputs, and hidden files heavily degrades model reasoning. N-NEX is the filter layer between your source truth and the AI, ensuring only meaningful Abstract Syntax is passed through.
                    </p>
                 </div>
               </motion.div>
             )}

             {activeTab === 'cli' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
                 <div>
                   <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">CLI Interface</h1>
                   <p className="text-slate-400 leading-relaxed text-lg">
                     N-NEX integrates perfectly with existing terminal workflows. When the web dashboard is not enough, use our zero-dependency standalone binary.
                   </p>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-semibold text-lg">Installation</h3>
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                     <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900/50">
                       <Terminal className="w-4 h-4 text-slate-500" />
                       <span className="text-slate-400 font-mono text-xs">sh</span>
                     </div>
                     <div className="font-mono text-sm text-sky-500 p-6 flex items-center gap-2">
                       <span className="text-pink-500">❯</span> <span>npm install -g n-nex-cli</span>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-semibold text-lg">Basic Usage</h3>
                   <p className="text-slate-400 text-sm">Target a local directory or remote repository:</p>
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                     <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900/50">
                       <Terminal className="w-4 h-4 text-slate-500" />
                       <span className="text-slate-400 font-mono text-xs">zsh</span>
                     </div>
                     <div className="font-mono text-sm text-sky-400 flex flex-col gap-2 p-6">
                       <span className="text-slate-500"># Pack local directory to clipboard</span>
                       <span className="flex items-center gap-2"><span className="text-pink-500">❯</span> n-nex pack ./src/ --clipboard</span>
                       
                       <span className="text-slate-500 mt-2"># Fetch and process remote instantly</span>
                       <span className="flex items-center gap-2"><span className="text-pink-500">❯</span> n-nex fetch github.com/user/repo --out context.md</span>
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'architecture' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
                 <div>
                   <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">User-First Architecture</h1>
                   <p className="text-slate-400 leading-relaxed text-lg">
                     We operate under a Strict Ephemeral execution mandate prioritizing user privacy. There is absolutely NO authentication required, and we NEVER store your repositories.
                   </p>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="border-l-2 border-emerald-500 pl-6 py-2">
                      <h3 className="text-white font-bold mb-2">1. No Authentication Required</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        N-NEX is designed to be frictionless. There are no accounts to create, no OAuth steps, and no login walls. Simply paste a link and instantly extract its AST tree.
                      </p>
                    </div>

                    <div className="border-l-2 border-sky-400 pl-6 py-2">
                      <h3 className="text-white font-bold mb-2">2. Zero Persistent Storage</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Your source code is never transmitted to, or stored on, our database. We do not cache your AST. All executions are strictly local and memory-bound, meaning when you close the tab, the entire execution timeline evaporates.
                      </p>
                    </div>

                    <div className="border-l-2 border-purple-400 pl-6 py-2">
                      <h3 className="text-white font-bold mb-2">3. Clipboard Injection</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        The final output is injected into the Clipboard API immediately, and the buffer is cleared. At no point is `localStorage`, `IndexedDB`, or any permanent write-stream engaged for raw code content.
                      </p>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'config' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 relative z-10">
                 <div>
                   <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Advanced Configuration</h1>
                   <p className="text-slate-400 leading-relaxed text-lg">
                     You can provide an `n-nex.config.json` inside your repository to natively instruct the engine on structure protocols.
                   </p>
                 </div>

                 <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900/50">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-slate-400 font-mono text-xs ml-4">n-nex.config.json</span>
                    </div>
                    <pre className="text-sky-400 font-mono text-sm leading-loose overflow-x-auto p-6">
{`{
  "ignorePatterns": [
    "**/*.spec.ts",
    "legacy-code/",
    "**/*.lock"
  ],
  "formatStyle": "markdown",
  "injectMetadata": true,
  "maxTokens": 128000
}`}
                    </pre>
                 </div>
                 
                 <p className="text-slate-400 text-sm">
                   By committing this file to your root directory, anyone who drops your repository into N-NEX will automatically receive the tailored subset of your project, maintaining perfect LLM context framing for your codebase.
                 </p>
               </motion.div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
}
