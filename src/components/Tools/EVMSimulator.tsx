"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Fingerprint, Activity, Lock, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** EVM simulation step identifiers */
type EVMStep = 0 | 1 | 2 | 3 | 4;

/** Candidate identifier union type */
type CandidateId = "alpha" | "beta" | "gamma";

/** Shape of a single audit log entry */
interface LogEntry {
  msg: string;
  time: string;
}

/** Shape of a candidate record */
interface Candidate {
  id: CandidateId;
  name: string;
  symbol: string;
}

/** Shape of the vote tally */
type Tally = Record<CandidateId, number>;

/** Duration in ms for biometric scan animation */
const SCAN_DURATION_MS = 2500;

/** Duration in ms for VVPAT verification animation */
const VVPAT_DURATION_MS = 3500;

/** Maximum number of log entries to retain */
const MAX_LOG_ENTRIES = 5;

/** Total vote count used for tally percentage calculation */
const TOTAL_VOTES_BASELINE = 40_000;

const CANDIDATES: Candidate[] = [
  { id: "alpha", name: "Candidate Alpha", symbol: "☀" },
  { id: "beta",  name: "Candidate Beta",  symbol: "☘" },
  { id: "gamma", name: "Candidate Gamma", symbol: "⚓" },
];

const INITIAL_TALLY: Tally = { alpha: 12042, beta: 8931, gamma: 15220 };

export default function EVMSimulator() {
  const [step, setStep] = useState<EVMStep>(0);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [tally, setTally] = useState<Tally>(INITIAL_TALLY);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Keep local ref for render (no behaviour change)
  const candidates = CANDIDATES;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    setLogs([
      { msg: "SYSTEM_IDLE", time: new Date().toLocaleTimeString() },
      { msg: "WAITING_FOR_UPLINK", time: new Date().toLocaleTimeString() }
    ]);
  }, []);

  const addLog = useCallback((msg: string) => {
    setLogs(prev =>
      [{ msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, MAX_LOG_ENTRIES)
    );
  }, []);

  const startScan = useCallback(() => {
    setStep(1);
    addLog("Initializing Biometric Scan");
    setTimeout(() => {
      setStep(2);
      addLog("Biometrics Verified");
      addLog("Polling Hardware Ready");
    }, SCAN_DURATION_MS);
  }, [addLog]);

  const handleVote = useCallback((id: CandidateId, name: string) => {
    setVotedFor(name);
    addLog(`Vote Recorded ID: ${id.toUpperCase()}`);
    setTally(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setStep(3);
    setTimeout(() => {
      setStep(4);
      addLog("VVPAT Audit Complete");
      addLog("Encrypting Vote Hash");
    }, VVPAT_DURATION_MS);
  }, [addLog]);

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="glass-panel p-12 rounded-[4rem] border border-white/5 relative overflow-hidden bg-slate-950/40">
      {/* Background Tech Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="flex flex-wrap gap-10 text-[8px] font-mono text-white">
          {Array(100).fill(0).map((_, i) => <span key={i}>0x7F{i}A9B{i}2 TX ENCRYPT ACTIVE</span>)}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Info & Real-time Tally */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald/10 border border-emerald/30 px-3 py-1 rounded text-[10px] font-bold text-emerald mb-6 uppercase tracking-widest">
              <Activity size={14} className="animate-pulse" /> Live Polling Feed
            </div>
            <h2 className="gta-text text-6xl italic text-white mb-6 leading-none">Poll Vox V4</h2>
            <p className="text-white/60 leading-relaxed mb-8 text-sm">
              Securing the world&apos;s largest democracy via **Distributed Neural Tallying**. Experience the full EVM-VVPAT lifecycle.
            </p>
          </div>

          {/* Real-time Tally SaaS Module */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Network Tally Snapshot</h4>
            {candidates.map(c => (
              <div key={c.id} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-white/60">{c.name}</span>
                    <span className="text-saffron font-mono">{tally[c.id as keyof typeof tally].toLocaleString()} V_SHA</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-saffron"
                      initial={{ width: 0 }}
                      animate={{ width: `${(tally[c.id as keyof typeof tally] / 40000) * 100}%` }}
                    />
                 </div>
              </div>
            ))}
          </div>

          {/* Scrolling Logs */}
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-[9px] space-y-1 h-32 overflow-hidden">
             <p className="text-saffron/40 mb-2 border-b border-white/5 pb-1">Secure Logs v1.0.2</p>
             {logs.map((log, i) => (
               <div key={i} className="flex gap-4">
                  <span className="text-white/20">[{log.time}]</span>
                  <span className="text-emerald/80">{log.msg}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Right: The EVM Hardware Simulator */}
        <div className="lg:col-span-7">
          <div className="bg-[#1e293b] border-[12px] border-[#334155] rounded-[4rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-[#334155] px-8 py-2 rounded-t-3xl text-[10px] font-black text-white/40 tracking-[0.6em]">
              EVM Model 2026 Pro
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                  <div className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-saffron/20 shadow-[0_0_30px_rgba(255,153,51,0.2)]">
                    <Fingerprint size={48} className="text-saffron" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 italic tracking-tight">Identity Pending</h3>
                  <button 
                    onClick={startScan}
                    className="bg-saffron text-black px-12 py-4 rounded-2xl font-black uppercase text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(255,153,51,0.4)]"
                  >
                    Scan Biometrics
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="w-48 h-48 border-4 border-emerald/20 rounded-full mx-auto relative flex items-center justify-center overflow-hidden">
                     <motion.div 
                        initial={{ top: "-100%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-emerald shadow-[0_0_20px_#10B981] z-20"
                     />
                     <Fingerprint size={80} className="text-emerald animate-pulse" />
                  </div>
                  <p className="mt-8 text-xs font-black text-emerald uppercase tracking-[0.5em] animate-pulse">Scanning Bio Signature...</p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="vote" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-4">
                  <div className="flex items-center justify-center gap-4 mb-8">
                     <Lock size={16} className="text-emerald" />
                     <p className="text-[10px] font-black text-emerald uppercase tracking-[0.3em]">Hardware Link Ready</p>
                  </div>
                  {candidates.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-black/40 border border-white/5 p-5 rounded-3xl hover:border-saffron/50 transition-all group">
                      <div className="flex items-center gap-6">
                        <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{c.symbol}</span>
                        <div>
                          <span className="font-black text-white uppercase text-base block">{c.name}</span>
                          <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">ID_CODE: {c.id.toUpperCase()}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleVote(c.id as CandidateId, c.name)}
                        className="w-14 h-14 rounded-full bg-red-600 border-[6px] border-red-500 active:scale-90 active:bg-red-400 transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center group-hover:scale-110"
                      >
                         <div className="w-2 h-2 bg-white rounded-full opacity-30" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="vvpat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                   <div className="w-56 h-72 bg-slate-900 border-4 border-slate-800 rounded-2xl mx-auto relative overflow-hidden p-8 shadow-inner">
                      <div className="absolute top-0 left-0 w-full h-1 bg-saffron/50 animate-scan z-10" />
                      <motion.div 
                        initial={{ y: -200 }}
                        animate={{ y: 0 }}
                        className="bg-white text-black p-5 text-[10px] font-mono text-left shadow-lg"
                      >
                         <div className="flex justify-between border-b border-black/10 pb-2 mb-4">
                            <Database size={14} />
                            <span className="font-black">VVPAT Slip</span>
                         </div>
                         <p className="opacity-50 text-[8px]">SESSION ID: 0x992B...</p>
                         <p className="mt-4">Vote Confirmed For:</p>
                         <p className="font-black text-lg my-2 tracking-tighter">{votedFor?.toUpperCase()}</p>
                         <div className="mt-6 pt-4 border-t border-black/10 flex justify-between items-end">
                            <span className="text-[20px]">{candidates.find(c => c.name === votedFor)?.symbol}</span>
                            <CheckCircle2 size={24} className="text-emerald" />
                         </div>
                      </motion.div>
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent" />
                   </div>
                   <p className="mt-8 text-[10px] font-black text-saffron uppercase tracking-[0.3em] animate-pulse">Verifying Paper Evidence...</p>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                   <div className="w-24 h-24 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                     <CheckCircle2 size={48} className="text-emerald" />
                   </div>
                   <h3 className="text-4xl font-black text-emerald mb-4 italic">Poll Secured</h3>
                   <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.5em] mb-12">Vote Hash: 0x992B...C22F</p>
                   <button 
                    onClick={() => setStep(0)}
                    className="bg-white/5 border border-white/10 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all"
                  >
                    Reset Hardware
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
