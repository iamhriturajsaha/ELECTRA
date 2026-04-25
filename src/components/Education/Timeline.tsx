"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, ExternalLink, Info } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Check Eligibility",
    description: "Are you 18 or older? Ensure you are a resident of the constituency you're registering in.",
    tip: "You can check your name in the current electoral roll on the ECI website.",
    link: "https://electoralsearch.eci.gov.in",
  },
  {
    id: 2,
    title: "Register to Vote",
    description: "Submit Form 6 online via the Voter Service Portal or the Voter Helpline App.",
    tip: "Keep your Aadhaar and a passport-sized photo ready for the upload.",
    link: "https://voters.eci.gov.in",
  },
  {
    id: 3,
    title: "Verify Enrollment",
    description: "Once processed, verify your details on the electoral roll to ensure everything is correct.",
    tip: "Your BLO (Booth Level Officer) may visit for physical verification.",
    link: "https://electoralsearch.eci.gov.in",
  },
  {
    id: 4,
    title: "Polling Day",
    description: "Find your polling booth and cast your vote using your Voter ID or other valid IDs.",
    tip: "Remember to carry your identity proof to the polling station.",
    link: "https://voters.eci.gov.in",
  },
];

export default function Timeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white mb-8">The Path to Voting</h3>
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(idx)}
            className={`w-full text-left p-6 rounded-2xl transition-all border flex items-center justify-between group ${
              activeStep === idx 
              ? "bg-saffron/10 border-saffron/50 shadow-[0_0_15px_rgba(255,153,51,0.1)]" 
              : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={activeStep >= idx ? "text-saffron" : "text-white/20"}>
                {activeStep > idx ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <div>
                <h4 className={`font-bold ${activeStep === idx ? "text-saffron" : "text-white"}`}>
                  {step.title}
                </h4>
                <p className="text-[10px] text-white/40 uppercase font-bold mt-1 tracking-wider">
                  Step {idx + 1}
                </p>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 transition-transform ${activeStep === idx ? "translate-x-0 text-saffron" : "-translate-x-4 opacity-0 text-white/20"}`} />
          </button>
        ))}
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-10 rounded-[2.5rem] border border-white/10 h-full flex flex-col justify-between shadow-2xl"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-3 py-1 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest">
                <Info size={14} /> Official Guidelines
              </div>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                {STEPS[activeStep].title}
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {STEPS[activeStep].description}
              </p>

              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                <h5 className="text-xs font-bold text-saffron uppercase tracking-widest mb-2">Pro-Tip</h5>
                <p className="text-sm text-white/80 italic leading-relaxed">
                  {STEPS[activeStep].tip}
                </p>
              </div>
            </div>

            <a 
              href={STEPS[activeStep].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-saffron text-black px-8 py-4 rounded-xl font-bold hover:bg-white transition-all w-full md:w-auto"
            >
              Get Started Online <ExternalLink size={18} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
