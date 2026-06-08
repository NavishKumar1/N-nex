import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500 selection:text-white flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <button 
            onClick={onBack}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors bg-slate-900/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-slate-950 border border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Shield strokeWidth={2} className="text-emerald-500 w-4 h-4" />
             </div>
             <span className="text-xl font-bold tracking-tight text-white border-l-2 pl-3 border-slate-800">
               Privacy Policy
             </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="prose prose-invert prose-slate max-w-none pb-20"
        >
          <div className="bg-[#050A15] border border-slate-800/80 rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-8 text-slate-300 leading-relaxed text-[15px]">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h1>
                <p className="text-slate-500 font-mono text-sm max-w-[800px]">Last Updated: June 8, 2026</p>
              </div>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
                <p>
                  Welcome to N-NEX. We respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard information when you use our platform, which is designed with a strict zero-retention architecture. By accessing N-NEX, you agree to this Privacy Policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">2. Host and Infrastructure</h2>
                <p>
                  Our platform is hosted on and deployed via <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400 underline">Vercel</a>. Vercel automatically collects certain technical information as part of its infrastructure delivery, such as IP addresses, referring URLs, and diagnostic data to ensure the platform remains online and secure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">3. Third-Party Services We Use</h2>
                <p>We strictly limit third-party operations to the absolute minimum necessary to run our service effectively:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Google Analytics:</strong> We use <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400 underline">Google Analytics</a> to understand aggregated user behaviors, measure traffic, and optimize our platform layout. Google Analytics may set non-identifying cookies in your browser. Our use of Google Analytics focuses strictly on aggregate trends and completely avoids tracking source code payloads or parameters.
                  </li>
                  <li>
                    <strong>Google Fonts:</strong> Web typography is served dynamically using <a href="https://developers.google.com/fonts/faq/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400 underline">Google Fonts</a> API. Requests to Google Fonts are unauthenticated, meaning no cookies are sent, and your visits are not linked to your Google accounts.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">4. Zero Source Code Retention</h2>
                <p className="text-white border-l-2 border-emerald-500 pl-4 py-1">
                  <strong>The core guarantee:</strong> We do NOT store, examine, or keep logs of the repositories, codebases, or source files you query using N-NEX.
                </p>
                <p>
                  Execution traces occur transiently in your local browser state and memory. When fetching public repositories from GitHub, our execution proxy merely passes the data stream to your client. No persistent backend logging tracks the contents of your queried directories. All output buffers are cleared upon browser tab closure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">5. Cookies and Local Storage</h2>
                <p>
                  We primarily operate in a stateless nature. N-NEX does not require accounts or user authentication, therefore no persistent session cookies are created. Aside from the analytical cookies mentioned above, any ephemeral data produced by our AST generator uses your browser's RAM, and optionally the Clipboard API upon your explicit request.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">6. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will indicate any updates by changing the "Last Updated" date at the top of the policy. Because we don't hold user accounts, you must review this page periodically to remain informed concerning our data principles.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">7. Contact</h2>
                <p>
                  If you have concerns about our privacy practices, you can reach out via public channels associated with the N-NEX deployment manifest or repository owner.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
