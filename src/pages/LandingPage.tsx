import React, { useState, useEffect, useRef } from 'react';
import { Github, FolderSync, Terminal, FileText, Sparkles, Layers, Cpu, Zap, Shield, Activity, Filter, Wand2, Database, Lock, Code2, MoveRight, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    {
      icon: <FolderSync className="w-5 h-5 sm:w-6 sm:h-6 text-[#38bdf8]" />,
      title: "Secure Ingestion",
      desc: "Select local directories or connect a GitHub repository. N-nex accesses files completely client-side. Zero cloud upload."
    },
    {
      icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#818cf8]" />,
      title: "AST Processing",
      desc: "Our engine parses the code structure, strips unnecessary whitespace, and intelligently ignores native binary and build artifacts."
    },
    {
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#c084fc]" />,
      title: "Context Layering",
      desc: "Files are seamlessly concatenated with their full structural root paths intact, establishing critical relational mapping context."
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#e879f9]" />,
      title: "Token Perfection",
      desc: "Generates highly readable Markdown arrays loaded directly into your clipboard for top-tier AI context windows."
    }
  ];

  return (
    <div id="how-it-works" className="w-full max-w-6xl mx-auto px-6 py-32 sm:py-48 z-10 relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24 md:mb-32"
      >
        <h2 className="text-[2.2rem] sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight mb-6">
          Architectural <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7dd3fc] to-[#0ea5e9]">Flow</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          A seamless local-first extraction pipeline engineered to keep your IP protected while radically supercharging AI context windows.
        </p>
      </motion.div>

      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
        <div className="absolute left-[24px] sm:left-1/2 top-4 bottom-4 w-px bg-slate-800/80 -translate-x-1/2 z-0" />
        <motion.div 
          className="absolute left-[24px] sm:left-1/2 top-4 w-px bg-gradient-to-b from-[#38bdf8] via-[#818cf8] to-[#e879f9] -translate-x-1/2 z-10 origin-top shadow-[0_0_20px_rgba(56,189,248,0.8)]"
          style={{ height: lineHeight }}
        />

        <div className="flex flex-col gap-12 sm:gap-24 w-full">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="relative w-full">
                <div className="absolute left-[24px] sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#020617] border border-slate-700/80 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(2,6,23,1)] overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-[#38bdf8]/10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                  <div className="relative z-10">
                    {step.icon}
                  </div>
                </div>

                <div className="w-full sm:flex items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -30 : 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={"ml-[64px] sm:ml-0 sm:w-1/2 " + (isEven ? 'sm:pr-12 lg:pr-20 flex sm:justify-end' : 'sm:pl-12 lg:pl-20 sm:ml-[50%] flex sm:justify-start')}
                  >
                    <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 sm:p-8 rounded-3xl hover:bg-slate-800/60 transition-colors hover:border-slate-700 shadow-xl w-full max-w-[420px] text-left relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight relative z-10">{step.title}</h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed relative z-10">{step.desc}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { FeaturesSection } from './FeaturesSection';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-100">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
      
      {/* Floating Pill Navbar */}
      <div className="fixed z-50 flex justify-center left-0 right-0 px-4 md:px-6 top-4 sm:top-6 pointer-events-none">
        <nav className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl rounded-full shadow-2xl pointer-events-auto border border-slate-800/80 w-full max-w-[1200px] h-16 sm:h-20 px-4 sm:px-8 relative">
          <div className="flex items-center h-full gap-2 sm:gap-6 md:gap-10">
            <img 
              src="/N-nex.png" 
              alt="Logo" 
              className="object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.15)] cursor-pointer h-10 sm:h-16 shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <div className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-slate-400 hover:text-white px-3 md:px-5 py-2 rounded-full font-sans font-medium text-[12px] md:text-[14px] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-400 hover:text-white px-3 md:px-5 py-2 rounded-full font-sans font-medium text-[12px] md:text-[14px] transition-colors whitespace-nowrap"
              >
                How it works
              </button>
              <button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-slate-400 hover:text-white px-3 md:px-5 py-2 rounded-full font-sans font-medium text-[12px] md:text-[14px] transition-colors"
              >
                Features
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onEnter}
              className="group px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-slate-100 text-slate-900 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
            >
              <span className="text-[12px] sm:text-[14px] font-semibold font-sans tracking-tight whitespace-nowrap">
                Workspace
              </span>
            </button>
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-800/50 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[calc(100%+12px)] left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-2 sm:p-4 flex flex-col gap-1 z-50 md:hidden pointer-events-auto"
              >
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors"
                >
                  How it works
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-slate-300 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors"
                >
                  Features
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Hero Content Re-mapped to Demo Image Style */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 sm:pt-48 pb-20 z-10 px-6 max-w-7xl mx-auto w-full">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex flex-col items-center text-center space-y-6 w-full mt-10 md:mt-0"
         >
           <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] font-sans font-medium tracking-tight text-white leading-[1.1] sm:leading-[1.1]">
             Powering the <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e0f2fe] via-[#7dd3fc] to-[#0ea5e9] drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
               Repository Extraction Lifecycle
             </span>
           </h1>
           <p className="text-[15px] sm:text-lg md:text-xl text-slate-400 font-sans max-w-3xl leading-relaxed mt-4">
             Make experimentation repeatable, iterate faster, and gain momentum with our memory-accelerated repository compile engine.
           </p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full">
             <button
                onClick={onEnter}
                className="bg-slate-100 text-slate-950 px-8 py-3.5 sm:px-10 sm:py-4 rounded-md font-sans font-semibold text-sm hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/20 w-full sm:w-auto"
             >
               Start building
             </button>
             <button
                className="bg-transparent border border-slate-700/80 text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-md font-sans font-semibold text-sm hover:bg-slate-800/50 hover:border-slate-500 transition-colors w-full sm:w-auto"
                onClick={onEnter}
             >
               Get a demo
             </button>
           </div>
         </motion.div>
         
         {/* Custom N-nex Pipeline Visual */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
           className="w-full max-w-[1000px] mt-24 sm:mt-32 relative hidden sm:block h-[400px]"
         >
           {/* SVG Connections */}
           <svg 
             className="absolute inset-0 w-full h-full pointer-events-none" 
             viewBox="0 0 1000 400" 
             preserveAspectRatio="xMidYMid meet"
           >
             <defs>
               <linearGradient id="pipe-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.1" />
                 <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                 <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
               </linearGradient>
               <linearGradient id="pipe-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                 <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
               </linearGradient>
             </defs>

             {/* Path from GitHub to Core */}
             <path d="M 90 60 C 250 60 250 200 360 200" fill="none" stroke="url(#pipe-gradient-1)" strokeWidth="2" opacity="0.4" />
             <path d="M 90 60 C 250 60 250 200 360 200" fill="none" stroke="url(#pipe-glow)" strokeWidth="3" className="animate-[dash_8s_linear_infinite]" strokeDasharray="10 15" />

             {/* Path from Local to Core */}
             <path d="M 90 340 C 250 340 250 200 360 200" fill="none" stroke="url(#pipe-gradient-1)" strokeWidth="2" opacity="0.4" />
             <path d="M 90 340 C 250 340 250 200 360 200" fill="none" stroke="url(#pipe-glow)" strokeWidth="3" className="animate-[dash_8s_linear_infinite]" strokeDasharray="10 15" />

             {/* Path from Core to Markdown */}
             <path d="M 440 200 L 660 200" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.4" />
             <path d="M 440 200 L 660 200" fill="none" stroke="#38bdf8" strokeWidth="3" className="animate-[dash_5s_linear_infinite]" strokeDasharray="15 20" />

             {/* Path from Markdown to AI */}
             <path d="M 740 200 L 910 200" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.4" />
             <path d="M 740 200 L 910 200" fill="none" stroke="#38bdf8" strokeWidth="3" className="animate-[dash_5s_linear_infinite]" strokeDasharray="15 20" />
           </svg>

           {/* Nodes */}
           {/* 1. GitHub Node */}
           <div className="absolute top-[15%] left-[5%] -translate-y-1/2 flex flex-col items-center gap-3">
             <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] z-10 relative">
               <Github className="text-[#38bdf8] w-8 h-8" />
             </div>
             <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">GitHub Repo</span>
           </div>

           {/* 2. Local Node */}
           <div className="absolute top-[85%] left-[5%] -translate-y-1/2 flex flex-col items-center gap-3">
             <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.15)] z-10 relative">
               <FolderSync className="text-[#38bdf8] w-8 h-8" />
             </div>
             <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">Local Folder</span>
           </div>

           {/* 3. Core Engine Node */}
           <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
             <div className="w-24 h-24 rounded-3xl bg-[#020617] border-2 border-[#0ea5e9]/50 flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.3)] z-10 relative overflow-hidden group hover:border-[#38bdf8] transition-colors">
               <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9]/10 to-transparent" />
               <Terminal className="text-[#bae6fd] w-12 h-12 relative z-20 group-hover:scale-110 transition-transform" />
             </div>
             <div className="flex flex-col items-center">
               <span className="text-[13px] font-bold text-white tracking-wide">N-NEX ENGINE</span>
               <span className="text-[10px] font-mono text-[#38bdf8]">AST PARSE / MINIMIZE</span>
             </div>
           </div>

           {/* 4. Markdown Context Node */}
           <div className="absolute top-[50%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
             <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.2)] z-10 relative">
               <FileText className="text-white w-10 h-10" />
               <div className="absolute -top-2 -right-2 bg-[#0ea5e9] text-[9px] font-bold px-2 py-0.5 rounded-full text-[#020617]">.MD</div>
             </div>
             <span className="text-[12px] font-medium text-[#bae6fd]">Packed Context</span>
           </div>

           {/* 5. AI Ready Node */}
           <div className="absolute top-[50%] left-[95%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 animate-[pulse_3s_ease-in-out_infinite]">
             <div className="w-16 h-16 rounded-full bg-slate-800 border border-green-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10 relative">
               <Sparkles className="text-green-400 w-8 h-8" />
             </div>
             <span className="text-[11px] font-mono font-bold text-green-400 tracking-wider">AI READY</span>
           </div>
         </motion.div>
         
         {/* Mobile Alternative Visual Flow */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="w-full flex flex-col items-center gap-6 mt-16 sm:hidden text-sm font-mono text-[#bae6fd]"
         >
            <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-full w-full max-w-[250px] text-center shadow-lg">1. Fetch Local / GitHub</div>
            <div className="h-10 w-px bg-gradient-to-b from-slate-800 to-slate-600" />
            <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-full w-full max-w-[250px] text-center shadow-lg">2. Parse AST / Minify</div>
            <div className="h-10 w-px bg-gradient-to-b from-slate-800 to-slate-600" />
            <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-full w-full max-w-[250px] text-center shadow-lg">3. Layer Dependencies</div>
            <div className="h-10 w-px bg-gradient-to-b from-slate-800 to-[#0ea5e9]" />
            <div className="bg-[#020617] border border-[#0ea5e9]/50 shadow-[0_0_20px_rgba(56,189,248,0.2)] px-6 py-3 rounded-full w-full max-w-[250px] text-center text-white font-bold">4. AI-Ready Context Output</div>
         </motion.div>
         
      </div>

      {/* How it Works Scroll Section */}
      <HowItWorksSection />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="w-full w-screen max-w-full overflow-hidden z-10 relative mt-4 sm:mt-8 -mb-4 sm:-mb-6 h-[60px] sm:h-[120px] lg:h-[160px] flex justify-center"
      >
        <svg viewBox="0 0 1440 160" className="w-[150%] sm:w-full h-full min-w-[1000px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fade-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="60%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fill-mask-bottom">
              <rect x="0" y="0" width="1440" height="160" fill="url(#fade-bottom)" />
            </mask>
            <linearGradient id="swoosh-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0" />
              <stop offset="20%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="80%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
            <filter id="swoosh-glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="5" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="url(#swoosh-gradient)" 
            strokeWidth="3"
            filter="url(#swoosh-glow)"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="rgba(255,255,255,0.6)" 
            strokeWidth="1"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140 L 1440,160 L 0,160 Z" 
            fill="url(#swoosh-gradient)"
            opacity="0.1" 
            mask="url(#fill-mask-bottom)"
          />
        </svg>
      </motion.div>

      {/* Features Grid Section */}
      <FeaturesSection />

      {/* Bottom Swoosh Divider */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="w-full w-screen max-w-full overflow-hidden z-10 relative mt-10 sm:mt-16 -mb-4 sm:-mb-8 h-[60px] sm:h-[120px] lg:h-[160px] flex justify-center"
      >
        <svg viewBox="0 0 1440 160" className="w-[150%] sm:w-full h-full min-w-[1000px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fade-top" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="60%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fill-mask-top">
              <rect x="0" y="0" width="1440" height="160" fill="url(#fade-top)" />
            </mask>
            <linearGradient id="swoosh-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0" />
              <stop offset="20%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#e879f9" stopOpacity="1" />
              <stop offset="80%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
            <filter id="swoosh-glow-bottom" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="5" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20" 
            fill="none" 
            stroke="url(#swoosh-gradient-bottom)" 
            strokeWidth="3"
            filter="url(#swoosh-glow-bottom)"
          />
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20" 
            fill="none" 
            stroke="rgba(255,255,255,0.6)" 
            strokeWidth="1"
          />
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20 L 1440,0 L 0,0 Z" 
            fill="url(#swoosh-gradient-bottom)"
            opacity="0.1" 
            mask="url(#fill-mask-top)"
          />
        </svg>
      </motion.div>

      {/* Ready to Extract Section CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl mx-auto px-6 pt-4 pb-12 sm:pt-12 sm:pb-24 flex flex-col justify-center items-center z-10 relative opacity-90 text-center mb-8"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight mb-8">
          Ready to supercharge <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e879f9] to-[#c084fc] drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">your AI context?</span>
        </h2>
        <button
          onClick={onEnter}
          className="group px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-slate-100 text-slate-900 hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:-translate-y-1"
        >
          <span className="text-sm sm:text-lg font-bold font-sans tracking-tight">
            Launch Workspace
          </span>
          <MoveRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="w-full mt-auto relative z-10 overflow-hidden pt-20 pb-12 px-6 border-t border-slate-800/50 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[1400px] relative flex flex-col"
        >
          
          <h2 
            className="text-[22vw] lg:text-[18vw] leading-[0.8] font-black tracking-tighter text-transparent w-full text-center select-none relative z-10"
            style={{ 
              WebkitTextStroke: '1px rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(180deg, transparent 50%, rgba(14, 165, 233, 0.1) 100%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            N-nex
          </h2>
        </motion.div>
      </footer>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed top-6 sm:top-8 left-6 sm:left-8 text-[10px] hidden sm:block text-slate-500 tracking-widest uppercase pointer-events-none z-10 font-sans font-medium"
      >
        V.2 // COMPILE.ARCHITECTS
      </motion.div>
    </div>
  );
}
