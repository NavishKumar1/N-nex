import React from 'react';
import { motion } from 'motion/react';
import { Telescope, Blocks, GitPullRequest, Zap } from 'lucide-react';

const useCases = [
  {
    icon: Telescope,
    title: "Legacy Code Archaeologists",
    description: "Feed entire undocumented legacy folders to an LLM to automatically generate robust architecture documentation, identify technical debt, and build modernization roadmaps.",
    color: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-cyan-400"
  },
  {
    icon: Blocks,
    title: "Full-Stack Refactors",
    description: "Provide the LLM with frontend component trees and backend API routes simultaneously to consistently wire up a new feature across the entire stack without hallucinating endpoints.",
    color: "from-purple-500/20 to-fuchsia-500/5",
    iconColor: "text-fuchsia-400"
  },
  {
    icon: GitPullRequest,
    title: "PR Summaries & Code Reviews",
    description: "Compile a specific Git branch or local delta to get an automated, exhaustive security review, architecture check, and context-aware pull request summary from your AI model.",
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400"
  }
];

export function UseCasesSection() {
  return (
    <div id="use-cases" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#38bdf8] text-xs font-mono font-medium mb-6">
          <Zap className="w-4 h-4" /> PERFECT FOR
        </div>
        <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-2xl leading-tight">
          Supercharge your <br className="hidden sm:block" />
          <span className="text-slate-500">development workflows.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {useCases.map((useCase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none -z-10" 
                 style={{ backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))` }} 
            />
            <div className={`h-full bg-[#020617] border border-slate-800/80 rounded-3xl p-8 sm:p-10 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:border-slate-700/80 group-hover:-translate-y-1 shadow-lg group-hover:shadow-2xl`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${useCase.color} rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center mb-8 shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-500 ease-out">
                <useCase.icon className={`w-6 h-6 ${useCase.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight relative z-10">
                {useCase.title}
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed relative z-10">
                {useCase.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
