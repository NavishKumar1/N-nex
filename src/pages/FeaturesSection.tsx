import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Code2, Sparkles, Filter, GitPullRequest, ArrowRight, CheckCircle2 } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div id="features" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-24 sm:mb-32 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sky-400 text-xs font-mono font-medium mb-6">
          <Sparkles className="w-4 h-4" /> PLATFORM CAPABILITIES
        </div>
        <h2 className="text-[2.2rem] sm:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-3xl leading-tight">
          Precision Extraction Engine. <br className="hidden sm:block" />
          <span className="text-slate-500">Engineered for large language models.</span>
        </h2>
      </div>

      <div className="space-y-32 sm:space-y-40 max-w-6xl mx-auto">
        
        {/* Feature 1: Zero-Cloud Storage */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <div className="w-16 h-16 bg-sky-500/10 border border-sky-500/30 rounded-2xl flex items-center justify-center transform -rotate-3 mb-8 shadow-inner">
              <Shield strokeWidth={1.5} className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Zero-Cloud Execution</h3>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Engineered to execute all processing directly within your local browser environment. The workspace fetches and parses your repositories without a single byte ever being durably stored on our servers.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-500" /> Complete source code privacy
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-500" /> No server-side persistence
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-500" /> No external LLM telemetry
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="p-1 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-950 shadow-2xl">
              <div className="bg-slate-950 rounded-[1.8rem] h-full w-full p-8 relative overflow-hidden border border-slate-800/80">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Lock className="w-48 h-48 text-sky-500 rotate-12" />
                </div>
                <div className="font-mono text-sm space-y-4 relative z-10">
                  <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-3 mb-6">
                    <span>SECURITY_KERNEL</span>
                    <span className="text-emerald-500 font-bold text-xs flex items-center gap-2">● ISOLATED</span>
                  </div>
                  <div className="text-slate-400"># Validating execution context... OK</div>
                  <div className="text-slate-400"># Instantiating WebAssembly parser... OK</div>
                  <div className="text-slate-400"># Bypassing server ingress nodes...</div>
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 mt-6 text-[#bae6fd]">
                    <div className="flex items-center gap-3 mb-2">
                       <Lock size={16} className="text-sky-400" /> Local Sandboxed Stream Activity
                    </div>
                    <div>Source fetched &amp; parsed completely in memory. Data never leaves your machine.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature 2: High Speed Telemetry & Filtering */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="p-1 rounded-[2rem] bg-gradient-to-bl from-slate-800 to-slate-950 shadow-2xl">
              <div className="bg-slate-950 rounded-[1.8rem] h-full w-full p-6 sm:p-8 relative overflow-hidden border border-slate-800/80">
                <div className="font-mono text-sm space-y-2 relative z-10 w-full">
                  <div className="text-slate-500 mb-4 tracking-widest text-[10px] sm:text-xs">PRUNING_ENGINE // FILE_TREE</div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-600 line-through">.git/</span>
                    <span className="text-xs bg-slate-900 text-slate-600 px-2 py-0.5 rounded-full border border-slate-800">IGNORED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-600 line-through">node_modules/</span>
                    <span className="text-xs bg-slate-900 text-slate-600 px-2 py-0.5 rounded-full border border-slate-800">IGNORED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
                    <span className="text-slate-600 line-through">package-lock.json (4MB)</span>
                    <span className="text-xs bg-slate-900 text-slate-600 px-2 py-0.5 rounded-full border border-slate-800">PRUNED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-emerald-500/20 bg-emerald-500/5 px-3 rounded-lg mt-2">
                    <span className="text-slate-200">src/components/App.tsx</span>
                    <span className="text-xs bg-emerald-500/20 text-[#34d399] px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">EXTRACTED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-emerald-500/20 bg-emerald-500/5 px-3 rounded-lg">
                    <span className="text-slate-200">src/utils/engine.ts</span>
                    <span className="text-xs bg-emerald-500/20 text-[#34d399] px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">EXTRACTED</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center transform rotate-3 mb-8 shadow-inner">
              <Filter strokeWidth={1.5} className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Dynamic Signal Pruning</h3>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Instantly strips away massive build artifacts, lock files, binary assets, and hidden directories via our AST-inspired ignore arrays. Generate an exceptionally clean textual output tailored perfectly for generative AI context windows.
            </p>
            <a href="#demo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-[#34d399] font-semibold hover:gap-3 transition-all mt-4 border-b border-[#34d399]/30 pb-0.5 hover:border-[#34d399]">
              Try the filter pipeline <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Feature 3: Precision Targeting */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center transform -rotate-3 mb-8 shadow-inner">
              <GitPullRequest strokeWidth={1.5} className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Granular Targeting</h3>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Stop generating context that is thousands of files too large. Lock directly onto specific feature branches, precise commit hashes, or active Pull Requests with one click.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Support for custom Branch extraction
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Direct ingestion of open Pull Requests
              </li>
              <li className="flex items-center gap-3 text-slate-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-purple-500" /> Point-in-time specific Commit Hashes
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full"
          >
            <div className="p-1 rounded-[2rem] bg-gradient-to-tr from-slate-800 to-purple-500/20 shadow-2xl">
              <div className="bg-slate-950 rounded-[1.8rem] h-full w-full p-8 relative overflow-hidden border border-slate-800/80">
                <div className="flex flex-col gap-6">
                  {/* Mock Branch Targeting Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Target Ingress Selection</label>
                    <div className="flex items-center gap-3 bg-slate-900 border border-purple-500/30 rounded-xl p-3 shadow-inner">
                      <GitPullRequest className="text-purple-500 w-5 h-5" />
                      <span className="text-slate-300 font-mono text-sm flex-1">github.com/facebook/react/pull/26002</span>
                    </div>
                  </div>
                  
                  {/* Mock Engine Pipeline */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-[11px] sm:text-xs">
                     <div className="flex items-center gap-2 text-slate-500">
                       <span className="text-slate-600">&gt;</span> resolving metadata for PR #26002...
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                       <span className="text-slate-600">&gt;</span> mapping head sha <span className="text-purple-500">a87d0e9</span>...
                     </div>
                     <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-1">
                       <span className="text-slate-300">CONTEXT_SYNCED_FOR_REVIEW</span>
                       <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">READY</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

