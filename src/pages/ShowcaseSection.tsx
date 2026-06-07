import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, FileJson, Sparkles, Code2, Layers } from 'lucide-react';

export function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState<'raw' | 'compiled'>('compiled');

  return (
    <div id="output" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#e879f9] text-xs font-mono font-medium mb-6">
          <Terminal className="w-4 h-4" /> OUTPUT DEMO
        </div>
        <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-2xl leading-tight">
          See the context before <br className="hidden sm:block" />
          <span className="text-slate-500">you send it to the LLM.</span>
        </h2>
        <p className="text-slate-400 max-w-xl text-sm sm:text-base">
          N-nex structures your entire codebase into a single, highly-optimized token stream. Choose between Raw Markdown or XML tag formatting.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-800/80 bg-[#0B0B0C] shadow-2xl overflow-hidden flex flex-col font-mono text-sm"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
            
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button 
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layers className="w-3.5 h-3.5" />
                Raw Files
              </button>
              <button 
                onClick={() => setActiveTab('compiled')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'compiled' ? 'bg-[#c084fc]/20 text-[#e879f9]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Compiled Output
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="relative h-[400px] overflow-hidden bg-[#020617]">
            <AnimatePresence mode="wait">
              {activeTab === 'compiled' ? (
                <motion.div 
                  key="compiled"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 p-6 overflow-y-auto text-slate-300 leading-relaxed custom-scrollbar"
                >
                  <pre className="text-xs sm:text-sm">
<span className="text-[#c084fc]">{'<repository>'}</span>
  <span className="text-[#38bdf8]">{'<file path="src/main.ts">'}</span>
<span className="text-slate-400">{'import { bootstrap } from "./app";\n\nbootstrap();'}</span>
  <span className="text-[#38bdf8]">{'</file>'}</span>
  <span className="text-[#38bdf8]">{'<file path="src/app.ts">'}</span>
<span className="text-slate-400">{'export function bootstrap() {\n  console.log("System initialized.");\n  // Codebase structure optimized\n}'}</span>
  <span className="text-[#38bdf8]">{'</file>'}</span>
<span className="text-[#c084fc]">{'</repository>'}</span>
                  </pre>
                </motion.div>
              ) : (
                <motion.div 
                  key="raw"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 p-6 overflow-y-auto flex"
                >
                  {/* Fake file tree */}
                  <div className="w-48 border-r border-slate-800/80 pr-4 flex flex-col gap-2 text-slate-400">
                    <div className="flex items-center gap-2 text-white"><FileJson className="w-4 h-4 text-emerald-400"/> package.json</div>
                    <div className="flex items-center gap-2 text-white"><Code2 className="w-4 h-4 text-blue-400"/> src/main.ts</div>
                    <div className="flex items-center gap-2 text-white"><Code2 className="w-4 h-4 text-blue-400"/> src/app.ts</div>
                    <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500"/> node_modules/</div>
                    <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500"/> .git/</div>
                  </div>
                  <div className="flex-1 pl-6 flex items-center justify-center text-slate-600 italic">
                    Scattered hierarchy. High metadata overhead.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
