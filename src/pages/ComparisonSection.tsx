import React from 'react';
import { motion } from 'motion/react';
import { Check, X, Clock, Zap, Target } from 'lucide-react';

export function ComparisonSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#c084fc] text-xs font-mono font-medium mb-6">
          <Target className="w-4 h-4" /> ROI MATRIX
        </div>
        <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-2xl leading-tight">
          The manual way is broken. <br className="hidden sm:block" />
          <span className="text-slate-500">We fixed it.</span>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="bg-[#020617] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative"
        >
           <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-[#c084fc]/5 to-transparent pointer-events-none" />

          {/* Header row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800/80 relative z-10">
            <div className="col-span-2 p-6 sm:p-8 flex items-center hidden md:flex">
              <span className="text-sm font-semibold tracking-widest text-slate-500 uppercase">Comparison Vector</span>
            </div>
            <div className="col-span-1 p-6 md:p-8 border-r md:border-l border-slate-800/80 bg-slate-900/30 flex flex-col items-center justify-center text-center">
              <span className="text-slate-400 font-semibold tracking-tight text-sm sm:text-base">Manual Copying</span>
            </div>
            <div className="col-span-1 p-6 md:p-8 bg-[#c084fc]/5 flex flex-col items-center justify-center text-center relative border-b-2 border-[#c084fc]">
              <span className="text-white font-bold tracking-tight text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]">N-nex Engine</span>
            </div>
          </div>

          {/* Rows */}
          {[
            { label: 'Time Spent', manual: '10-15 mins', engine: '< 1 second', engineColor: 'text-[#38bdf8]', icon: Clock },
            { label: 'Token Efficiency', manual: 'Bloated (Hidden Git/Nodes)', engine: 'Surgical (Ignored By Default)', engineColor: 'text-white', icon: Target },
            { label: 'Format Quality', manual: 'Broken markdown indents', engine: 'Native AST-aware formatting', engineColor: 'text-white', icon: Zap },
            { label: 'Privacy/Data', manual: 'Risks exposing env keys', engine: 'Local sandbox isolated', engineColor: 'text-white', icon: Check }
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-2 md:grid-cols-4 ${i !== 3 ? 'border-b border-slate-800/50' : ''} relative z-10`}>
              <div className="col-span-2 p-5 sm:p-6 lg:p-8 flex items-center gap-3 md:gap-4 md:col-span-2 border-b md:border-b-0 border-slate-800/50 md:border-r md:border-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-slate-300 font-medium">{row.label}</span>
              </div>
              <div className="col-span-1 p-5 sm:p-6 lg:p-8 flex items-center justify-center text-center border-r border-slate-800/50 bg-slate-900/30">
                <span className="text-slate-500 font-mono text-xs sm:text-sm">{row.manual}</span>
              </div>
              <div className="col-span-1 p-5 sm:p-6 lg:p-8 flex items-center justify-center text-center bg-[#c084fc]/[0.02]">
                <span className={`font-mono font-semibold text-xs sm:text-sm ${row.engineColor}`}>{row.engine}</span>
              </div>
            </div>
          ))}

        </motion.div>
      </div>
    </div>
  );
}
