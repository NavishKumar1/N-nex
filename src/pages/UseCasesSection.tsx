import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Telescope, Blocks, GitPullRequest, Zap } from 'lucide-react';

const useCases = [
  {
    icon: Telescope,
    title: "Legacy Code Archaeologists",
    description: "Feed entire undocumented legacy folders to an LLM to automatically generate robust architecture documentation, identify technical debt, and build modernization roadmaps.",
    color: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
    rotate: -6,
    translateY: 20
  },
  {
    icon: Blocks,
    title: "Full-Stack Refactors",
    description: "Provide the frontend component trees and backend API routes simultaneously to consistently wire up a new feature across the entire stack without hallucinating endpoints.",
    color: "from-purple-500/20 to-fuchsia-500/5",
    iconColor: "text-purple-400",
    rotate: 0,
    translateY: 0
  },
  {
    icon: GitPullRequest,
    title: "PR Summaries & Code Reviews",
    description: "Compile a specific Git branch or local delta to get an automated, exhaustive security review, architecture check, and context-aware pull request summary from your AI.",
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
    rotate: 6,
    translateY: 20
  }
];

function TiltCard({ useCase, index }: { useCase: typeof useCases[0], index: number }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const [isHovered, setIsHovered] = useState(false);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="flex-1 w-full max-w-[340px] mx-auto min-h-[380px]"
      style={{
        zIndex: isHovered ? 30 : 10,
        perspective: 1200
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateZ: isHovered ? 0 : useCase.rotate,
          y: isHovered ? -15 : useCase.translateY,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="h-full bg-[#0A0F1F] border border-slate-700/80 rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-2xl cursor-default group"
      >
        {/* Dynamic Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
        
        {/* Mouse Follow Glow */}
        <motion.div
          className="absolute w-[400px] h-[400px] bg-white/10 rounded-full pointer-events-none blur-3xl"
          style={{
            x: useTransform(mouseXSpring, [0, 1], ["-70%", "30%"]),
            y: useTransform(mouseYSpring, [0, 1], ["-70%", "30%"]),
            left: "50%",
            top: "50%",
          }}
        />

        <div 
          className="w-14 h-14 rounded-2xl bg-[#020617] border border-slate-700/80 flex flex-col items-center justify-center mb-8 shrink-0 relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out"
          style={{ transform: "translateZ(40px)" }}
        >
          <useCase.icon strokeWidth={1.5} className={`w-7 h-7 ${useCase.iconColor}`} />
        </div>
        
        <h3 
          className="text-2xl font-semibold text-white mb-4 tracking-tight relative z-10 drop-shadow-md" 
          style={{ transform: "translateZ(30px)" }}
        >
          {useCase.title}
        </h3>
        
        <p 
          className="text-slate-400 text-[15px] leading-relaxed relative z-10 drop-shadow-sm" 
          style={{ transform: "translateZ(20px)" }}
        >
          {useCase.description}
        </p>
        
        <div 
          className="mt-auto relative z-10 pt-8"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
            <div className={`h-full w-1/3 bg-gradient-to-r ${useCase.color} group-hover:w-full transition-all duration-1000 ease-out`} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function UseCasesSection() {
  return (
    <div id="use-cases" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative overflow-hidden">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#38bdf8] text-xs font-mono font-medium mb-6">
          <Zap className="w-4 h-4" /> IDEAL WORKFLOWS
        </div>
        <h2 className="text-[2.2rem] sm:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-3xl leading-tight">
          Supercharge your <br className="hidden sm:block" />
          <span className="text-slate-500">development velocity.</span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10 max-w-6xl mx-auto lg:-mx-4 xl:-mx-8">
        {useCases.map((useCase, index) => (
          <TiltCard key={index} useCase={useCase} index={index} />
        ))}
      </div>
    </div>
  );
}
