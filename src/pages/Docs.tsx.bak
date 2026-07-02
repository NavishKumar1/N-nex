import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Terminal, Shield, Zap, Search, Layers, Layout, Activity, Lock } from 'lucide-react';

export function Docs({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'features' | 'architecture' | 'cli'>('quickstart');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors bg-slate-900/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-slate-950 border border-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <BookOpen strokeWidth={2} className="text-sky-500 w-4 h-4" />
             </div>
             <span className="text-xl font-bold tracking-tight text-white border-l-2 pl-3 border-slate-800">
               Documentation
             </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />
            
            <button 
              onClick={() => setActiveTab('quickstart')}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 relative ${
                activeTab === 'quickstart' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" /> Quickstart
              {activeTab === 'quickstart' && <motion.div layoutId="indicator" className="absolute -left-[17px] w-[2px] h-6 bg-sky-400 hidden md:block rounded-r" />}
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 relative ${
                activeTab === 'features' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <Layout className="w-4 h-4" /> Advanced Features
              {activeTab === 'features' && <motion.div layoutId="indicator" className="absolute -left-[17px] w-[2px] h-6 bg-sky-400 hidden md:block rounded-r" />}
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 relative ${
                activeTab === 'architecture' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" /> Architecture & Privacy
              {activeTab === 'architecture' && <motion.div layoutId="indicator" className="absolute -left-[17px] w-[2px] h-6 bg-sky-400 hidden md:block rounded-r" />}
            </button>
            <button 
              onClick={() => setActiveTab('cli')}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 relative ${
                activeTab === 'cli' ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> CLI Tooling
              {activeTab === 'cli' && <motion.div layoutId="indicator" className="absolute -left-[17px] w-[2px] h-6 bg-sky-400 hidden md:block rounded-r" />}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#050A15] border border-slate-800/80 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden min-h-[600px]">
             
             {/* Ambient Background */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />
             
             <AnimatePresence mode="wait">
               {activeTab === 'quickstart' && (
                 <motion.div 
                    key="quickstart"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 relative z-10"
                 >
                   <div>
                     <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Getting Started</h1>
                     <p className="text-slate-400 leading-relaxed text-lg">
                       Welcome to N-NEX. This guide will show you how to fetch and process your first GitHub repository into an LLM-ready AST payload.
                     </p>
                   </div>
                   
                   <div className="space-y-6">
                     <div className="flex gap-6">
                       <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 font-mono text-sky-400 font-bold">1</div>
                       <div>
                         <h3 className="font-bold text-xl mb-2">Paste a Repository URL</h3>
                         <p className="text-slate-400">Head to the Workspace and locate the URL input bar. Paste any public GitHub repository link (e.g. <code>https://github.com/facebook/react</code>).</p>
                       </div>
                     </div>
                     <div className="flex gap-6">
                       <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 font-mono text-sky-400 font-bold">2</div>
                       <div>
                         <h3 className="font-bold text-xl mb-2">Configure Personal Token (Optional but Recommended)</h3>
                         <p className="text-slate-400">GitHub limits unauthenticated API requests. Click the <Lock className="inline w-3 h-3 mx-1"/> icon next to the search bar to enter a read-only GitHub Personal Access Token. This enables deep fetching without rate limits.</p>
                       </div>
                     </div>
                     <div className="flex gap-6">
                       <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 font-mono text-sky-400 font-bold">3</div>
                       <div>
                         <h3 className="font-bold text-xl mb-2">Select Files & Compile</h3>
                         <p className="text-slate-400">Once fetched, use the file explorer to check or uncheck files you want to include in your payload. Select a prompt preset on the right panel, and hit <strong>Generate Payload</strong>.</p>
                       </div>
                     </div>
                   </div>

                   <div className="bg-slate-900/50 border border-sky-500/20 rounded-2xl p-6">
                     <h3 className="font-bold text-lg mb-2 text-sky-400 flex items-center gap-2">
                       <Search className="w-5 h-5" /> Quick Search Tip
                     </h3>
                     <p className="text-slate-300 text-sm">
                       Use the search bar above the file explorer to quickly filter extensions (e.g. <code>.ts</code>, <code>.tsx</code>) or specific directories. Click "Select All" to bulk check the filtered results.
                     </p>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'features' && (
                 <motion.div 
                    key="features"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 relative z-10"
                 >
                   <div>
                     <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Advanced Visualizations</h1>
                     <p className="text-slate-400 leading-relaxed text-lg">
                       N-NEX now ships with powerful visual analytical tools designed to help you understand a repository's architecture and history before feeding it to an LLM.
                     </p>
                   </div>

                   <div className="space-y-12">
                     <div className="relative pl-6 border-l-2 border-slate-800">
                        <div className="absolute w-3 h-3 bg-sky-500 rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                        <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                           <Layers className="w-6 h-6 text-sky-400" />
                           Codebase Tree Canvas
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-4">
                           Instead of just reading a flat list of files, N-NEX now renders an interactive <strong>D3.js node tree canvas</strong> representing the directory structure of the repository.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                           <li>Hover over nodes to see directory and file names.</li>
                           <li>Visually identify large clusters of complexity or deep directory nesting.</li>
                           <li>Pans and zooms gracefully using industry-standard D3 force/tree layouts.</li>
                        </ul>
                     </div>

                     <div className="relative pl-6 border-l-2 border-slate-800">
                        <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                           <Activity className="w-6 h-6 text-emerald-400" />
                           Contributions & Time Tree
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-4">
                           Understand the velocity and history of the codebase with the new <strong>Metrics & Contributions Dashboard</strong>.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
                           <li><strong>Contribution Graph:</strong> A GitHub-style heat map visualizing commit frequency over time.</li>
                           <li><strong>Commit Time Tree:</strong> A chronological timeline of the repository's most recent commits, complete with author avatars and commit messages.</li>
                           <li>Easily spot active vs. dormant projects before wasting LLM context on outdated code.</li>
                        </ul>
                     </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'architecture' && (
                 <motion.div 
                    key="architecture"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-10 relative z-10"
                 >
                   <div>
                     <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">User-First Architecture</h1>
                     <p className="text-slate-400 leading-relaxed text-lg">
                       We operate under a Strict Ephemeral execution mandate prioritizing user privacy. There is absolutely NO authentication required, and we NEVER store your repositories.
                     </p>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Shield className="w-5 h-5 text-emerald-400" /> No Authentication Required
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          N-NEX is designed to be frictionless. There are no accounts to create, no OAuth steps, and no login walls. Simply paste a link and instantly extract its AST tree.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Lock className="w-5 h-5 text-sky-400" /> Zero Persistent Storage
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Your source code is never transmitted to, or stored on, our database. We do not cache your AST. All executions are strictly local and memory-bound, meaning when you close the tab, the entire execution timeline evaporates.
                        </p>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                           <Layout className="w-5 h-5 text-purple-400" /> Clipboard Injection
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          The final output is injected into the Clipboard API immediately. At no point is `localStorage`, `IndexedDB`, or any permanent write-stream engaged for raw code content.
                        </p>
                      </div>
                   </div>
                 </motion.div>
               )}

               {activeTab === 'cli' && (
                 <motion.div 
                    key="cli"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8 relative z-10"
                 >
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
                         
                         <span className="text-slate-500 mt-4"># Fetch and process remote instantly</span>
                         <span className="flex items-center gap-2"><span className="text-pink-500">❯</span> n-nex fetch github.com/user/repo --out context.md</span>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
