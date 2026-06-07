import React from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Filter, Lock, Cpu, Code2, Sparkles } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div id="features" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#38bdf8] text-xs font-mono font-medium mb-6">
          <Sparkles className="w-4 h-4" /> ENGINE CAPABILITIES
        </div>
        <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-2xl leading-tight">
          Enterprise-grade extraction. <br className="hidden sm:block" />
          <span className="text-slate-500">Without the enterprise servers.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto auto-rows-min">
        
        {/* Bento Box 1 - Local First Privacy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 bg-[#020617] border border-slate-800/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0284c7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="mb-16">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-6 h-6 text-[#38bdf8]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Zero-Cloud Storage Policy</h3>
              <p className="text-slate-400 leading-relaxed max-w-md">
                We engineered this platform to execute all processing entirely within your browser environment. Workspace fetches GitHub repositories directly, parsing gigabytes of code without a single byte being durably stored on our servers. Your assets are processed ephemerally in memory.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest mt-auto border-t border-slate-800/50 pt-6 font-semibold">
              <Lock className="w-4 h-4 text-green-400" /> End-to-end sandbox isolated
            </div>
          </div>
        </motion.div>

        {/* Bento Box 2 - Token Optimization */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors shadow-xl"
        >
          <div className="relative z-10 w-full">
            <div className="w-12 h-12 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">BPE Telemetry</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Real-time token counting maps directly to cl100k_base encodings (used by GPT-4 and Claude 3.5), allowing you to pack context windows without truncation.
            </p>
          </div>
          
          <div className="bg-[#020617] border border-slate-800/80 rounded-xl p-4 mt-8 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 font-bold">
               <span>CONTEXT_WINDOW</span>
               <span className="text-[#38bdf8]">~ 182K TKNS</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 whileInView={{ width: "85%" }} 
                 transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]" 
               />
            </div>
          </div>
        </motion.div>

        {/* Bento Box 3 - Smart Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-xl"
        >
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <Filter className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <Filter className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Smart Pruning</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dynamically bypasses build artifacts, binary logs, deeply nested node_modules, and hidden git arrays. Extracts exactly zero bytes of noise.
            </p>
          </div>
        </motion.div>

        {/* Bento Box 4 - Engine Speeds */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 bg-[#020617] border border-slate-800/80 rounded-3xl p-8 sm:p-10 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-2xl flex flex-col md:flex-row gap-8 justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#818cf8]/5 opacity-0 group-hover:opacity-100 transition-duration-500" />
          
          <div className="relative z-10 w-full max-w-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Thread-Optimized Engine</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Built on performant browser stream APIs, we bypass UI-blocking rendering loops completely. Large repos parse asynchronously via virtual DOM detachment. 
            </p>
          </div>
          
          <div className="relative z-10 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 w-full md:max-w-[300px] shadow-inner flex flex-col justify-center font-mono text-[10px] sm:text-xs text-slate-400 gap-3">
             <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-slate-500 tracking-wider">v1_engine_log</span>
                <span className="text-green-400 font-bold">● ONLINE</span>
             </div>
             <div className="space-y-2 pt-2 tracking-wide font-medium">
               <div><span className="text-slate-600">&gt;</span> fetching /main... [14ms]</div>
               <div><span className="text-slate-600">&gt;</span> expanding nodes... <span className="text-[#38bdf8]">[82ms]</span></div>
               <div className="text-slate-600">&gt; filtering dotfiles... ok.</div>
               <div><span className="text-slate-600">&gt;</span> tree minified... <span className="text-[#38bdf8]">[103ms]</span></div>
               <div className="text-green-400">&gt; context generation complete.</div>
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
