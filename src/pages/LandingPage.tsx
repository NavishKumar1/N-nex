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
      desc: "Connect any public GitHub repository. Workspace accesses files completely in-browser. Zero cloud storage or external upload."
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
          A seamless browser-first extraction pipeline engineered to keep your IP protected while radically supercharging AI context windows.
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
import { ComparisonSection } from './ComparisonSection';
import { FAQSection } from './FAQSection';
import { ShowcaseSection } from './ShowcaseSection';
import { UseCasesSection } from './UseCasesSection';

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
          <div className="flex items-center h-full sm:w-48">
            <img 
              src="/N-nex.png" 
              alt="Logo" 
              className="object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.15)] cursor-pointer h-12 sm:h-16 shrink-0 md:h-16"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors whitespace-nowrap"
            >
              How it works
            </button>
            <button 
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => {
                document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors whitespace-nowrap"
            >
              Use Cases
            </button>
            <button 
              onClick={() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors"
            >
              FAQ
            </button>
          </div>
          
          <div className="flex items-center gap-3 justify-end sm:w-auto xl:w-48">
            <button
              onClick={onEnter}
              className="group px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#38bdf8] text-slate-950 hover:bg-sky-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.2)] shrink-0"
            >
              <span className="text-[13px] sm:text-[14px] font-bold font-sans tracking-tight whitespace-nowrap">
                Workspace
              </span>
            </button>
            <button 
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800/50 rounded-full transition-colors border border-slate-700"
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
                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden p-3 flex flex-col gap-1 z-50 lg:hidden pointer-events-auto"
              >
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    How it works
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    Use Cases
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center"
                  >
                    FAQ
                  </button>
                  <button 
                    onClick={() => {
                      window.open('#', '_blank');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-slate-300 hover:text-white hover:bg-slate-800/80 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Docs
                  </button>
                </div>
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
                className="bg-transparent border border-slate-700/80 text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-md font-sans font-semibold text-sm hover:bg-slate-800/50 hover:border-slate-500 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                onClick={() => window.open('#', '_blank')}
             >
               <FileText className="w-4 h-4" /> Docs
             </button>
           </div>
         </motion.div>
         
         {/* Custom N-nex Pipeline Visual */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
           className="w-full max-w-[1000px] mt-24 sm:mt-32 relative flex flex-col sm:flex-row items-center justify-between gap-12 sm:gap-0 sm:h-[200px] px-8 lg:px-12 mx-auto"
         >
           {/* SVG Connections Line Background (Desktop) */}
           <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-[60%] h-[4px] pointer-events-none z-0 hidden sm:block">
             <svg width="100%" height="4" overflow="visible" preserveAspectRatio="none">
               <line x1="0" y1="2" x2="100%" y2="2" stroke="#1e293b" strokeWidth="2" />
               <line 
                 x1="0" 
                 y1="2" 
                 x2="100%" 
                 y2="2" 
                 stroke="#0ea5e9" 
                 strokeWidth="3" 
                 strokeDasharray="16 16" 
                 className="animate-[dash_30s_linear_infinite]" 
               />
             </svg>
           </div>
           
           {/* SVG Connections Line Background (Mobile) */}
           <div className="absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 w-[4px] pointer-events-none z-0 sm:hidden">
             <svg width="4" height="100%" overflow="visible" preserveAspectRatio="none">
               <line x1="2" y1="0" x2="2" y2="100%" stroke="#1e293b" strokeWidth="2" />
               <line 
                 x1="2" 
                 y1="0" 
                 x2="2" 
                 y2="100%" 
                 stroke="#0ea5e9" 
                 strokeWidth="3" 
                 strokeDasharray="16 16" 
                 className="animate-[dash_30s_linear_infinite_vertical]" 
               />
             </svg>
           </div>

           {/* Nodes */}
           {/* 1. GitHub Node */}
           <div className="flex flex-col items-center gap-3 sm:gap-4 z-10 w-32 relative group">
             <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[24px] bg-[#0A0F1F] border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
               <Github strokeWidth={1.5} className="text-[#38bdf8] w-8 h-8 sm:w-10 sm:h-10" />
             </div>
             <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#94a3b8] uppercase tracking-widest text-center shadow-sm bg-[#020617]/50 lg:bg-transparent px-2 py-0.5 rounded-lg">GitHub Repo</span>
           </div>

           {/* 2. Core Engine Node */}
           <div className="flex flex-col items-center gap-3 sm:gap-4 z-10 w-48 relative group">
             <div className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-[28px] bg-[#020617] border-2 border-[#0ea5e9] flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-transform group-hover:scale-105 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#0ea5e9]/10 to-transparent pointer-events-none" />
               <Terminal strokeWidth={2} className="text-white w-9 h-9 sm:w-10 sm:h-10 relative z-10" />
             </div>
             <div className="flex flex-col items-center text-center gap-1 sm:gap-1.5 shadow-sm bg-[#020617]/50 lg:bg-transparent px-2 py-1 rounded-lg">
               <span className="text-[13px] sm:text-[14px] font-bold text-white tracking-wide leading-none">N-NEX ENGINE</span>
               <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0ea5e9] tracking-widest uppercase leading-none">AST Parse / Minimize</span>
             </div>
           </div>

           {/* 4. Markdown Context Node */}
           <div className="flex flex-col items-center gap-3 sm:gap-4 z-10 w-32 relative group">
             <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-[24px] bg-[#0A0F1F] border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 relative">
               <FileText strokeWidth={1.5} className="text-white w-8 h-8 sm:w-9 sm:h-9" />
               <div className="absolute -top-2 px-2 py-0.5 rounded-full bg-[#38bdf8] text-[#020617] text-[10px] sm:text-[11px] font-black uppercase shadow-md right-[-10px]">
                 .MD
               </div>
             </div>
             <span className="text-[12px] sm:text-[13px] font-sans font-bold text-[#e2e8f0] tracking-wide text-center shadow-sm bg-[#020617]/50 lg:bg-transparent px-2 py-0.5 rounded-lg">Packed Context</span>
           </div>

           {/* 5. AI Ready Node */}
           <div className="flex flex-col items-center gap-3 sm:gap-4 z-10 w-32 relative group">
             <div className="w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full bg-[#031d14] border border-[#10b981]/60 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
               <Sparkles strokeWidth={2.5} className="text-[#10b981] w-7 h-7 sm:w-8 sm:h-8" />
             </div>
             <span className="text-[11px] sm:text-[12px] font-mono font-bold text-[#10b981] tracking-widest uppercase text-center shadow-sm bg-[#020617]/50 lg:bg-transparent px-2 py-0.5 rounded-lg">AI Ready</span>
           </div>
         </motion.div>
         

         
      </div>

      {/* How it Works Scroll Section */}
      <HowItWorksSection />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="w-full w-screen max-w-[100vw] overflow-hidden z-0 relative -mt-6 sm:-mt-12 -mb-12 sm:-mb-24 h-[100px] sm:h-[180px] lg:h-[220px] flex justify-center pointer-events-none"
      >
        <svg viewBox="0 0 1440 160" className="w-[150%] sm:w-full h-full min-w-[1000px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fade-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="20%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fill-mask-bottom">
              <rect x="0" y="0" width="1440" height="160" fill="url(#fade-bottom)" />
            </mask>
            <linearGradient id="swoosh-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0" />
              <stop offset="20%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="80%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="swoosh-fill-top" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
            <filter id="swoosh-glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="6" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="url(#swoosh-gradient)" 
            strokeWidth="2.5"
            filter="url(#swoosh-glow)"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="1.5"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140 L 1440,160 L 0,160 Z" 
            fill="url(#swoosh-fill-top)"
            mask="url(#fill-mask-bottom)"
          />
        </svg>
      </motion.div>

      {/* Features Grid Section */}
      <FeaturesSection />

      {/* Output Showcase Section */}
      <ShowcaseSection />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Top Swoosh Divider (Purple) - Valley shape */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="w-full w-screen max-w-[100vw] overflow-hidden z-0 relative mt-8 sm:mt-16 -mb-8 sm:-mb-12 h-[100px] sm:h-[180px] lg:h-[220px] flex justify-center pointer-events-none"
      >
        <svg viewBox="0 0 1440 160" className="w-[150%] sm:w-full h-full min-w-[1000px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fade-top-purple" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="20%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fill-mask-top-purple">
              <rect x="0" y="0" width="1440" height="160" fill="url(#fade-top-purple)" />
            </mask>
            <linearGradient id="swoosh-gradient-top-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0" />
              <stop offset="20%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e879f9" stopOpacity="1" />
              <stop offset="80%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="swoosh-fill-top-purple" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>
            <filter id="swoosh-glow-top-purple" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="6" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20" 
            fill="none" 
            stroke="url(#swoosh-gradient-top-purple)" 
            strokeWidth="2.5"
            filter="url(#swoosh-glow-top-purple)"
          />
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20" 
            fill="none" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="1.5"
          />
          <path 
            d="M 0,20 C 250,20 350,140 550,140 L 890,140 C 1090,140 1190,20 1440,20 L 1440,0 L 0,0 Z" 
            fill="url(#swoosh-fill-top-purple)"
            mask="url(#fill-mask-top-purple)"
          />
        </svg>
      </motion.div>

      {/* Comparison ROI Section */}
      <ComparisonSection />

      {/* Developer FAQ Section */}
      <FAQSection />

      {/* Bottom Swoosh Divider */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="w-full w-screen max-w-[100vw] overflow-hidden z-0 relative mt-4 sm:mt-12 -mb-20 sm:-mb-32 h-[100px] sm:h-[180px] lg:h-[220px] flex justify-center pointer-events-none"
      >
        <svg viewBox="0 0 1440 160" className="w-[150%] sm:w-full h-full min-w-[1000px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fade-bottom-final" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="20%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="fill-mask-bottom-final">
              <rect x="0" y="0" width="1440" height="160" fill="url(#fade-bottom-final)" />
            </mask>
            <linearGradient id="swoosh-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0" />
              <stop offset="20%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#e879f9" stopOpacity="1" />
              <stop offset="80%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="swoosh-fill-bottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>
            <filter id="swoosh-glow-bottom" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="6" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="url(#swoosh-gradient-bottom)" 
            strokeWidth="2.5"
            filter="url(#swoosh-glow-bottom)"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140" 
            fill="none" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="1.5"
          />
          <path 
            d="M 0,140 C 250,140 350,20 550,20 L 890,20 C 1090,20 1190,140 1440,140 L 1440,160 L 0,160 Z" 
            fill="url(#swoosh-fill-bottom)"
            mask="url(#fill-mask-bottom-final)"
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
            className="text-[16vw] lg:text-[14vw] leading-[0.8] font-black tracking-tighter text-transparent w-full text-center select-none relative z-10 uppercase"
            style={{ 
              WebkitTextStroke: '1px rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(180deg, transparent 50%, rgba(14, 165, 233, 0.1) 100%)',
              WebkitBackgroundClip: 'text',
            }}
          >
            N-NEX
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
