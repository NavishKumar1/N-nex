import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare } from 'lucide-react';

const faqs = [
  {
    question: "Is my code really private? Does it leave my machine?",
    answer: "Yes, absolute zero-cloud. Workspace uses modern browser architectures to fetch public GitHub repositories directly into your client session. Not a single line of your code is persistently stored on our servers. All extraction and formatting happens ephemerally in your browser memory."
  },
  {
    question: "Which file types are ignored?",
    answer: "By default, Workspace ignores massive dependencies (node_modules, vendor directories), hidden repository data (.git, .svn), built artifacts (dist, build, .next), and binary assets (images, audio, videos, compiled executables). We only extract meaningful text-based source code."
  },
  {
    question: "How do you count tokens?",
    answer: "We use a fast BPE (Byte-Pair Encoding) algorithm running entirely in-browser. Our token counting metrics map closely to standard encodings, providing a highly accurate estimate of context consumption for major large language models."
  },
  {
    question: "Can I customize the extraction format?",
    answer: "Yes. Workspace provides options to structure the output into clean XML tags or raw markdown, giving you full control over how you want to present the context to your LLMs."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div id="faq" className="w-full max-w-7xl mx-auto px-6 py-24 sm:py-32 z-10 relative">
      <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[#38bdf8] text-xs font-mono font-medium mb-6">
          <MessageSquare className="w-4 h-4" /> DEVELOPER FAQ
        </div>
        <h2 className="text-[2.2rem] sm:text-4xl md:text-5xl font-sans font-medium text-white tracking-tight mb-6 max-w-2xl leading-tight">
          Common Questions <br className="hidden sm:block" />
          <span className="text-slate-500">Answered Transparently</span>
        </h2>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-[#020617] border ${openIndex === index ? 'border-slate-600' : 'border-slate-800/80'} rounded-2xl overflow-hidden shadow-lg transition-colors duration-300`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 sm:p-8 text-left outline-none"
            >
              <span className={`font-semibold text-base sm:text-lg tracking-tight ${openIndex === index ? 'text-white' : 'text-slate-300'} transition-colors duration-300 pr-6`}>
                {faq.question}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${openIndex === index ? 'bg-slate-800 border-slate-700 text-white' : 'bg-transparent border-slate-800 text-slate-500'}`}>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-slate-400 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
