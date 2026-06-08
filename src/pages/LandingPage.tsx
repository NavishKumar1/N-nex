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
      icon: <FolderSync className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />,
      title: "Secure Ingestion",
      desc: "Connect any public GitHub repository. Workspace accesses files completely in-browser. Zero cloud storage or external upload."
    },
    {
      icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#818cf8]" />,
      title: "AST Processing",
      desc: "Our engine parses the code structure, strips unnecessary whitespace, and intelligently ignores native binary and build artifacts."
    },
    {
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
      title: "Context Layering",
      desc: "Files are seamlessly concatenated with their full structural root paths intact, establishing critical relational mapping context."
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-400" />,
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
          Architectural <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7dd3fc] to-sky-500">Flow</span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          A seamless browser-first extraction pipeline engineered to keep your IP protected while radically supercharging AI context windows.
        </p>
      </motion.div>

      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
        <div className="absolute left-[24px] sm:left-1/2 top-4 bottom-4 w-px bg-slate-800/80 -translate-x-1/2 z-0" />
        <motion.div 
          className="absolute left-[24px] sm:left-1/2 top-4 w-px bg-gradient-to-b from-sky-400 via-[#818cf8] to-fuchsia-400 -translate-x-1/2 z-10 origin-top shadow-[0_0_20px_rgba(56,189,248,0.8)]"
          style={{ height: lineHeight }}
        />

        <div className="flex flex-col gap-12 sm:gap-24 w-full">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="relative w-full">
                <div className="absolute left-[24px] sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border border-slate-700/80 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(2,6,23,1)] overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-sky-400/10"
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
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

export default function LandingPage({ onEnter, onDocs, onPrivacy, onTerms }: { onEnter: () => void, onDocs?: () => void, onPrivacy?: () => void, onTerms?: () => void }) {
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-100">
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
            <button 
              onClick={() => onDocs && onDocs()}
              className="text-slate-400 hover:text-white px-2.5 xl:px-3 py-2 rounded-full font-sans font-medium text-[13px] transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Docs
            </button>
          </div>
          
          <div className="flex items-center gap-3 justify-end sm:w-auto xl:w-48">
            <button
              onClick={onEnter}
              className="group px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-sky-400 text-slate-950 hover:bg-sky-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.2)] shrink-0"
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
                      if (onDocs) onDocs();
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
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#e0f2fe] via-[#7dd3fc] to-sky-500 drop-shadow-[0_0_35px_rgba(56,189,248,0.4)]">
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
                onClick={() => onDocs && onDocs()}
             >
               <FileText className="w-4 h-4" /> Docs
             </button>
           </div>
         </motion.div>
         
         {/* Converging Funnel Pipeline Visual */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
           className="w-full max-w-[1000px] mt-24 sm:mt-32 relative flex flex-col items-center h-[350px] mx-auto px-4"
         >
           {/* Connecting Converging Curves SVG */}
           <div className="absolute top-[40px] w-full h-[250px] pointer-events-none z-0">
             <svg width="100%" height="100%" viewBox="0 0 1000 250" preserveAspectRatio="none">
               {/* Left Far Node Curve */}
               <path d="M 200 0 C 400 0, 500 100, 500 250" fill="none" stroke="url(#blue-gradient-1)" strokeWidth="2" strokeLinecap="round" className="animate-[dash_4s_linear_infinite]" strokeDasharray="10 10" />
               <path d="M 200 0 C 400 0, 500 100, 500 250" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" className="z-[-1] absolute" />
               
               {/* Left Near Node Curve */}
               <path d="M 400 0 C 450 0, 500 100, 500 250" fill="none" stroke="url(#blue-gradient-2)" strokeWidth="2" strokeLinecap="round" className="animate-[dash_20s_linear_infinite]" strokeDasharray="15 15" />
               <path d="M 400 0 C 450 0, 500 100, 500 250" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

               {/* Right Near Node Curve */}
               <path d="M 600 0 C 550 0, 500 100, 500 250" fill="none" stroke="url(#blue-gradient-3)" strokeWidth="2" strokeLinecap="round" className="animate-[dash_6s_linear_infinite]" strokeDasharray="12 12" />
               <path d="M 600 0 C 550 0, 500 100, 500 250" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

               {/* Right Far Node Curve */}
               <path d="M 800 0 C 600 0, 500 100, 500 250" fill="none" stroke="url(#blue-gradient-4)" strokeWidth="2" strokeLinecap="round" className="animate-[dash_8s_linear_infinite]" strokeDasharray="10 10"/>
               <path d="M 800 0 C 600 0, 500 100, 500 250" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

               {/* Central Stalk line down to final engine */}
               <line x1="500" y1="200" x2="500" y2="250" stroke="#0ea5e9" strokeWidth="3" />

               <defs>
                 <linearGradient id="blue-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
                 </linearGradient>
                 <linearGradient id="blue-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                   <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                 </linearGradient>
                 <linearGradient id="blue-gradient-3" x1="100%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                   <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                 </linearGradient>
                 <linearGradient id="blue-gradient-4" x1="100%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
                 </linearGradient>
               </defs>
             </svg>
           </div>

           {/* Top 4 Nodes Container */}
           <div className="flex w-full justify-between sm:justify-center sm:gap-14 md:gap-24 z-10 px-2 lg:px-8">
             
             {/* Node 1 */}
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                 <FileText strokeWidth={1.5} className="text-slate-400 w-5 h-5 sm:w-6 sm:h-6" />
               </div>
               <span className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase">Content</span>
             </div>

             {/* Node 2 */}
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                 <FolderSync strokeWidth={1.5} className="text-slate-400 w-5 h-5 sm:w-6 sm:h-6" />
               </div>
               <span className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase">Structure</span>
             </div>

             {/* Node 3 */}
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                 <Github strokeWidth={1.5} className="text-slate-400 w-5 h-5 sm:w-6 sm:h-6" />
               </div>
               <span className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase">History</span>
             </div>

             {/* Node 4 */}
             <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg transition-transform hover:-translate-y-1">
                 <Cpu strokeWidth={1.5} className="text-slate-400 w-5 h-5 sm:w-6 sm:h-6" />
               </div>
               <span className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-widest uppercase">Metadata</span>
             </div>
             
           </div>

           {/* Final Output Node at Bottom */}
           <div className="absolute bottom-[-20px] flex flex-col items-center z-10">
             <div className="h-12 w-px bg-gradient-to-b from-transparent to-sky-500" />
             <div className="flex flex-col items-center gap-3 relative group">
               <div className="w-[80px] h-[80px] sm:w-[94px] sm:h-[94px] rounded-3xl bg-slate-950 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />
                 <Sparkles strokeWidth={2} className="text-emerald-500 w-8 h-8 sm:w-10 sm:h-10 relative z-10" />
               </div>
               <div className="flex flex-col items-center text-center gap-1.5 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 shadow-xl">
                 <span className="text-[12px] sm:text-[14px] font-bold text-white tracking-wide leading-none">AI Context Pack</span>
                 <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-500 tracking-widest uppercase leading-none">Ignition Ready</span>
               </div>
             </div>
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">your AI context?</span>
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
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 sm:pt-20 mt-8 sm:mt-12 border-t border-slate-800/30">
            <div className="flex items-center gap-6 text-sm font-sans font-medium text-slate-500">
              <button onClick={() => onPrivacy && onPrivacy()} className="hover:text-white transition-colors">Privacy Policy</button>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <button onClick={() => onTerms && onTerms()} className="hover:text-white transition-colors">Terms of Use</button>
            </div>
          </div>
        </motion.div>
      </footer>

    </div>
  );
}
