import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { Check, X, Clock, Zap, Target, Shield, BugOff } from 'lucide-react';

export function ComparisonSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div id="comparison" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#34d399] text-xs font-mono font-medium mb-6">
          <Target className="w-4 h-4" /> ROI MATRIX
        </div>
        <h2 className="text-[2.2rem] sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight mb-6 max-w-3xl leading-tight">
          The manual workflow is obsolete. <br className="hidden sm:block" />
          <span className="text-slate-500">N-nex is the new standard.</span>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          className="bg-[#0A0F1F] border border-slate-800/80 rounded-[32px] overflow-hidden shadow-2xl relative group"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  650px circle at ${mouseX}px ${mouseY}px,
                  rgba(16, 185, 129, 0.1),
                  transparent 80%
                )
              `,
            }}
          />

          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />

          {/* Header row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800/80 relative z-10 glass-panel">
            <div className="col-span-2 p-6 sm:p-8 flex items-center hidden md:flex">
              <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Analysis Vector</span>
            </div>
            <div className="col-span-1 p-6 md:p-8 border-r md:border-l border-slate-800/80 bg-slate-900/40 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 font-semibold tracking-tight text-sm sm:text-base">Manual Copying</span>
            </div>
            <div className="col-span-1 p-6 md:p-8 bg-emerald-500/5 flex flex-col items-center justify-center text-center relative border-b-2 border-emerald-500">
              <span className="text-white font-bold tracking-widest uppercase text-sm sm:text-base drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">N-nex Engine</span>
            </div>
          </div>

          {/* Rows */}
          {[
            { label: 'Time to Context', manual: '10-15 mins of copy-pasting', engine: 'Instantaneous (<1s)', engineColor: 'text-[#34d399]', icon: Clock },
            { label: 'Token Efficiency', manual: 'Bloated (Hidden Git/Nodes)', engine: 'Surgical (Dynamic Pruning)', engineColor: 'text-white', icon: Shield },
            { label: 'Export Quality', manual: 'Broken indents, messy trees', engine: 'Native AST-aware markdown', engineColor: 'text-white', icon: Zap },
            { label: 'Data Security', manual: 'Risks exposing local `.env` keys', engine: 'Ephemeral Sandbox Isolation', engineColor: 'text-white', icon: BugOff }
          ].map((row, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`grid grid-cols-2 md:grid-cols-4 ${i !== 3 ? 'border-b border-slate-800/60' : ''} relative z-10 hover:bg-slate-800/20 transition-colors`}
            >
              <div className="col-span-2 p-5 sm:p-6 lg:p-8 flex items-center gap-4 md:col-span-2 border-b md:border-b-0 border-slate-800/60 md:border-r md:border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                  <row.icon className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-slate-200 font-semibold text-sm sm:text-base">{row.label}</span>
              </div>
              <div className="col-span-1 p-5 sm:p-6 lg:p-8 flex items-center justify-center text-center border-r border-slate-800/60 bg-slate-900/40">
                <div className="flex flex-col items-center gap-2">
                  <X className="w-4 h-4 text-red-400 opacity-70" />
                  <span className="text-slate-500 font-sans text-xs sm:text-sm">{row.manual}</span>
                </div>
              </div>
              <div className="col-span-1 p-5 sm:p-6 lg:p-8 flex items-center justify-center text-center bg-emerald-500/[0.03]">
                <div className="flex flex-col items-center gap-2">
                  <Check className="w-5 h-5 text-[#34d399]" />
                  <span className={`font-mono font-bold text-xs sm:text-sm ${row.engineColor}`}>{row.engine}</span>
                </div>
              </div>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </div>
  );
}
