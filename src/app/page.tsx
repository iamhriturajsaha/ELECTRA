"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const ChatBox = dynamic(() => import("@/components/Assistant/ChatBox"));
const Timeline = dynamic(() => import("@/components/Education/Timeline"));
const LocationFinder = dynamic(() => import("@/components/Tools/LocationFinder"));
const CalendarSync = dynamic(() => import("@/components/Tools/CalendarSync"));
const VoterIDCard = dynamic(() => import("@/components/Tools/VoterIDCard"));
const CivicQuiz = dynamic(() => import("@/components/Tools/CivicQuiz"));
const EVMSimulator = dynamic(() => import("@/components/Tools/EVMSimulator"));
const ConstituencySearchModal = dynamic(() => import("@/components/Tools/ConstituencySearchModal"));

import { Vote, Shield, Globe, Terminal, Clock, CheckCircle2, Users, Zap, Award, TrendingUp, Fingerprint, Mail } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * @name Home
 * @description The primary dashboard for the Electra Democracy Interface.
 * Orchestrates civic tools, AI assistance, and national sentiment analytics.
 * @author Hrituraj Saha
 */
export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 12, mins: 45, secs: 30 });
  const [isJoined, setIsJoined] = useState(false);
  const [voterSentiment, setVoterSentiment] = useState({ ready: 68, confused: 22, excited: 10 });
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSentimentVote = (type: keyof typeof voterSentiment) => {
    setVoterSentiment(prev => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const { scrollYProgress } = useScroll();

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-saffron selection:text-black font-sans overflow-x-hidden">
      <div className="scanning-line" />
      <ConstituencySearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Side Background Sentinels */}
      <div className="fixed inset-y-0 left-4 z-[5] pointer-events-none hidden lg:flex items-center">
        <h2 className="gta-text text-[120px] text-white/[0.03] rotate-180 [writing-mode:vertical-lr] select-none">INDIA</h2>
      </div>
      <div className="fixed inset-y-0 right-4 z-[5] pointer-events-none hidden lg:flex items-center">
        <h2 className="gta-text text-[120px] text-white/[0.03] [writing-mode:vertical-lr] select-none">भारत</h2>
      </div>

      {/* Massive Ashoka Chakra Sentinel */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-[0.03]">
        {isMounted && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <svg width="800" height="800" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="white" strokeWidth="1" />
              {[...Array(24)].map((_, i) => (
                <line 
                  key={i} 
                  x1="50" y1="50" 
                  x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)} 
                  y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)} 
                  stroke="white" 
                  strokeWidth="0.5" 
                />
              ))}
            </svg>
          </motion.div>
        )}
      </div>

      {/* Tiranga Neural Glows */}
      <div className="fixed top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-saffron/10 to-transparent pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-emerald/10 to-transparent pointer-events-none z-0" />

      {/* Static Glowing Tiranga Beacons */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Saffron - Top Left */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-saffron rounded-full blur-[120px]"
        />
        {/* White - Top Right */}
        <motion.div
          animate={{ opacity: [0.05, 0.2, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white rounded-full blur-[150px]"
        />
        {/* Emerald - Bottom Right */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-emerald rounded-full blur-[120px]"
        />
      </div>

      {/* Scroll Progress Bar (Safe Mode) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-saffron z-[200] origin-left shadow-[0_0_15px_rgba(255,153,51,0.8)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] flex gap-4 items-center">
        <a href="#guide" title="Protocol" className="w-12 h-12 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center text-saffron shadow-[0_0_15px_rgba(255,153,51,0.2)] hover:bg-saffron hover:text-black transition-all">
          <Shield size={20} />
        </a>
        <a href="#simulator" title="EVM Simulator" className="w-12 h-12 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center text-saffron shadow-[0_0_15px_rgba(255,153,51,0.2)] hover:bg-saffron hover:text-black transition-all">
          <Terminal size={20} />
        </a>
        <a href="#analytics" title="Network Stats" className="w-12 h-12 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center text-saffron shadow-[0_0_15px_rgba(255,153,51,0.2)] hover:bg-saffron hover:text-black transition-all">
          <TrendingUp size={20} />
        </a>
        <a href="#ambassador" title="Join Elite" className="w-12 h-12 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center text-saffron shadow-[0_0_15px_rgba(255,153,51,0.2)] hover:bg-saffron hover:text-black transition-all">
          <Users size={20} />
        </a>
        <Link href="/settings" title="Identity Config" className="w-12 h-12 bg-saffron/10 border border-saffron/30 rounded-full flex items-center justify-center text-saffron shadow-[0_0_15px_rgba(255,153,51,0.2)] hover:bg-saffron hover:text-black transition-all">
          <Fingerprint size={20} />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/futuristic_india.png" 
            className="opacity-30 grayscale contrast-125"
            alt="Futuristic India"
            fill
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-saffron mb-12 uppercase tracking-[0.2em] shadow-xl">
              <Clock size={16} className="text-saffron" />
              Live Election Countdown: 
              <span className="text-white font-mono ml-2">
                {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M : {timeLeft.secs}S
              </span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8, letterSpacing: "1em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "-0.05em" }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="gta-text text-[100px] md:text-[220px] leading-none mb-6 italic select-none relative group px-8"
            >
              <span className="relative z-10 bg-gradient-to-r from-saffron via-white to-emerald bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,153,51,0.3)] pr-4">
                ELECTRA
              </span>
              <motion.span 
                animate={{ 
                  opacity: [0, 0.3, 0],
                  x: [-5, 5, -5],
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 z-0 text-white blur-[4px] select-none group-hover:opacity-100 opacity-0"
              >
                ELECTRA
              </motion.span>
            </motion.h1>
            
            <h2 className="gta-text text-3xl md:text-5xl leading-tight mb-12 italic text-saffron tracking-tight">
              THE FUTURE OF CIVIC PARTICIPATION.
            </h2>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button 
                onClick={() => scrollToSection('guide')}
                className="px-12 py-5 bg-saffron text-black font-black uppercase text-xl gta-text italic hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,153,51,0.3)]"
              >
                Launch Protocol
              </button>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="px-12 py-5 border border-white/20 text-white font-black uppercase text-xl gta-text italic hover:bg-white/10"
              >
                Net Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Path to Polls */}
      <section id="guide" className="container mx-auto px-6 py-32 scroll-mt-32">
        <div className="text-center mb-20">
          <h2 className="gta-text text-7xl italic text-white mb-4">THE PATH TO POLLS</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-[0.5em] font-bold">Immutable sequence of civic duty</p>
        </div>
        <div className="glass-panel p-12 rounded-[3rem] cyber-border neon-glow">
          <Timeline />
        </div>
      </section>

      {/* Analytics & Sentiment Matrix */}
      <section id="analytics" className="container mx-auto px-6 py-32 scroll-mt-32">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-24">
            <div className="lg:col-span-4">
               <h2 className="gta-text text-6xl italic text-white mb-4 leading-none uppercase">Network Stats</h2>
               <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em] leading-relaxed">
                 Real-time visualization of national democratic sentiment.
               </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: "Total Voters", val: "968.2M", icon: <Users /> },
                 { label: "Turnout Trend", val: "+4.2%", icon: <TrendingUp /> },
                 { label: "Polling Units", val: "1.2M", icon: <Globe /> },
                 { label: "Security", val: "Encrypt L4", icon: <Shield /> }
               ].map((s, i) => (
                 <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-saffron/30 transition-all">
                    <div className="text-saffron mb-4">{s.icon}</div>
                    <div className="font-mono text-xl text-white mb-1">{s.val}</div>
                    <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">{s.label}</div>
                 </div>
               ))}
            </div>
         </div>

         {/* Sentiment Matrix (Functional) */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { id: 'ready', label: 'Voter Readiness', val: voterSentiment.ready, color: '#10B981', desc: 'Verified and ready to poll.' },
              { id: 'confused', label: 'Information Gap', val: voterSentiment.confused, color: '#FF9933', desc: 'Seeking procedural guidance.' },
              { id: 'excited', label: 'Civic Energy', val: voterSentiment.excited, color: '#3B82F6', desc: 'Engaged in community outreach.' }
            ].map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="font-black text-white text-xs uppercase tracking-widest mb-2">{item.label}</h4>
                    <div className="text-5xl font-black text-white mb-4 italic leading-none">{item.val}%</div>
                    <p className="text-[10px] text-white/40 mb-8 uppercase font-bold tracking-wider">{item.desc}</p>
                    <button 
                      onClick={() => handleSentimentVote(item.id as keyof typeof voterSentiment)}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all"
                    >
                      Audit Sentiment
                    </button>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1 transition-all duration-1000" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
              </div>
            ))}
         </div>
      </section>

      {/* EVM Simulator */}
      <section id="simulator" className="container mx-auto px-6 py-32 scroll-mt-32">
         <EVMSimulator />
      </section>

      <div className="container mx-auto px-6 py-32 space-y-48">
        {/* Eligibility Checker & Recommendation Engine */}
        <section className="glass-panel p-16 rounded-[4rem] border border-white/5 relative overflow-hidden text-center max-w-5xl mx-auto shadow-2xl">
           <div className="relative z-10">
             <h2 className="gta-text text-5xl italic text-white mb-6 uppercase tracking-tighter">Eligibility Audit</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               {[
                 { id: 'age', label: "Age Check", val: "18+ YEARS", icon: <Clock /> },
                 { id: 'id', label: "Identity Check", val: "VOTER_ID", icon: <Shield /> },
                 { id: 'roll', label: "Status Check", val: "ON_ROLL", icon: <CheckCircle2 /> }
               ].map((c, i) => (
                 <button 
                  key={i} 
                  onClick={() => setActiveStep(c.id)}
                  className={`p-8 rounded-3xl border transition-all group ${activeStep === c.id ? 'border-saffron bg-saffron/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                 >
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all ${activeStep === c.id ? 'bg-saffron text-black' : 'bg-saffron/10 text-saffron group-hover:bg-saffron group-hover:text-black'}`}>
                     {c.icon}
                   </div>
                   <h4 className="font-bold text-white mb-2">{c.label}</h4>
                   <p className="text-xs text-saffron font-black uppercase tracking-widest">{c.val}</p>
                 </button>
               ))}
             </div>
             
             <AnimatePresence mode="wait">
               {activeStep && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   className="bg-saffron/10 border border-saffron/20 p-8 rounded-3xl inline-block max-w-2xl mx-auto"
                 >
                    <div className="flex items-center gap-4 text-left">
                       <Zap className="text-saffron shrink-0" size={32} />
                       <div>
                          <p className="text-white font-bold text-lg italic">Recommended Next Step</p>
                          <p className="text-white/60 text-xs uppercase tracking-widest mt-1">
                            {activeStep === 'age' ? 'Verify your DOB against official records in the AI Core.' : activeStep === 'id' ? 'Launch the E-Identity Simulator to generate your digital ID.' : 'Search the Polling Registry to confirm your local station assignment.'}
                          </p>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </section>

        {/* E-Identity Preview */}
        <section id="id-system" className="scroll-mt-32">
          <VoterIDCard />
        </section>

        {/* AI Core */}
        <section id="assistant" className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center scroll-mt-32">
          <div className="lg:col-span-4 space-y-8">
             <div className="w-16 h-16 bg-saffron/10 border border-saffron/20 rounded-2xl flex items-center justify-center neon-glow">
               <Terminal className="text-saffron" size={32} />
             </div>
             <div>
               <h2 className="gta-text text-6xl italic leading-none mb-4 text-white">NEURAL CORE</h2>
               <p className="text-muted-foreground leading-relaxed">
                 Engage with Electra&apos;s high-speed AI for instant procedural audits and legal guidance.
               </p>
             </div>
          </div>
          <div className="lg:col-span-8 glass-panel p-2">
             <ChatBox />
          </div>
        </section>

        {/* Ambassador Program (High-Functionality Onboarding) */}
        <section id="ambassador" className="bg-gradient-to-br from-indigo-900/20 to-transparent p-20 rounded-[5rem] border border-white/5 relative overflow-hidden text-center max-w-6xl mx-auto shadow-2xl scroll-mt-32">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Award size={400} />
           </div>
           
           <AnimatePresence mode="wait">
             {!isJoined ? (
               <motion.div key="join" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="gta-text text-6xl italic text-white mb-6">BECOME AN AMBASSADOR</h2>
                  <p className="text-white/60 leading-relaxed mb-12">
                    Join our elite squad of **Civic Influencers**. Help neighbors register and earn the **Electra Diamond Badge**.
                  </p>
                  <button 
                    onClick={() => setIsJoined(true)}
                    className="px-12 py-6 bg-white text-black font-black uppercase text-xl gta-text italic hover:bg-saffron transition-all skew-x-[-10deg] shadow-2xl"
                  >
                    Initialize Member ID
                  </button>
               </motion.div>
             ) : (
               <motion.div 
                 key="badge" 
                 initial={{ opacity: 0, x: 20, skewX: -20 }} 
                 animate={{ opacity: 1, x: 0, skewX: 0 }} 
                 className="relative z-10 max-w-2xl mx-auto"
               >
                  <div 
                    id="ambassador-card" 
                    style={{
                      backgroundColor: '#020617',
                      padding: '48px',
                      borderRadius: '48px',
                      border: '1px solid rgba(255, 153, 51, 0.5)',
                      boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                      marginBottom: '32px',
                      position: 'relative',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '96px',
                      height: '96px',
                      backgroundColor: '#FF9933',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 32px auto',
                      boxShadow: '0 10px 30px rgba(255, 153, 51, 0.3)'
                    }}>
                      <Fingerprint size={48} color="#000000" />
                    </div>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', fontStyle: 'italic', color: 'white', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>ACCESS GRANTED</h3>
                    <p style={{ fontSize: '14px', color: '#FF9933', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '4px', margin: '0 0 40px 0' }}>Elite Civic Ambassador</p>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '24px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                       <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px' }}>Digital Hash</span>
                       <code style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace' }}>ELECTRA TX 091XJ</code>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      const element = document.getElementById('ambassador-card');
                      if (!element) return;
                      const canvas = await html2canvas(element, { backgroundColor: '#020617', scale: 2 });
                      const imgData = canvas.toDataURL('image/png');
                      const pdf = new jsPDF('p', 'mm', 'a4');
                      const imgProps = pdf.getImageProperties(imgData);
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                      pdf.save('Electra_Ambassador_Kit.pdf');
                    }}
                    className="w-full py-6 bg-saffron text-black font-black uppercase text-base tracking-widest rounded-2xl hover:bg-white transition-all shadow-2xl"
                  >
                    Download Member Kit
                  </button>
               </motion.div>
             )}
           </AnimatePresence>
        </section>

        {/* Civic Mastery */}
        <section className="bg-gradient-to-br from-saffron/10 to-transparent p-16 rounded-[4rem] border border-white/5 relative overflow-hidden text-center">
           <h2 className="gta-text text-6xl italic text-saffron mb-12">CIVIC MASTERY</h2>
           <CivicQuiz />
        </section>

        {/* Final Assets */}
        <section id="tools" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start scroll-mt-32">
           <CalendarSync />
           <LocationFinder />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 pt-32 pb-12 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />
        
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 text-left">
              {/* Brand Col */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Vote size={32} className="text-saffron" />
                    <span className="gta-text text-3xl text-white">ELECTRA</span>
                 </div>
                 <p className="text-xs text-white/40 leading-relaxed uppercase font-bold tracking-wider">
                    The next-generation democracy interface. Built for transparency, education, and civic empowerment across India.
                 </p>
              </div>

              {/* Navigation Col */}
              <div className="space-y-6">
                 <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">Platform</h4>
                 <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <li><a href="#guide" className="hover:text-white transition-colors">Electoral Protocol</a></li>
                    <li><a href="#simulator" className="hover:text-white transition-colors">EVM Simulator</a></li>
                    <li><a href="#analytics" className="hover:text-white transition-colors">Network Statistics</a></li>
                    <li><a href="#ambassador" className="hover:text-white transition-colors">Elite Ambassador</a></li>
                 </ul>
              </div>

              {/* Contact Col */}
              <div className="space-y-6">
                 <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">Developer</h4>
                 <div className="space-y-4">
                    <p className="text-white font-bold text-sm italic">Hrituraj Saha</p>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-relaxed">
                       Computer Science Graduate<br/>
                       AI/ML & Software Engineer
                    </p>
                 </div>
              </div>

              {/* Social Col */}
              <div className="space-y-6">
                 <h4 className="text-saffron font-black text-xs uppercase tracking-[0.3em]">Connect</h4>
                 <div className="flex gap-4">
                    <a href="https://linkedin.com/in/hrituraj-saha-5794b53a0" target="_blank" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-saffron hover:text-saffron transition-all group">
                       <Users size={18} />
                    </a>
                    <a href="https://github.com/iamhriturajsaha" target="_blank" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-saffron hover:text-saffron transition-all">
                       <Globe size={18} />
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('iamhriturajsaha@gmail.com');
                        const btn = document.getElementById('mail-btn');
                        if (btn) {
                          btn.innerText = 'COPIED';
                          setTimeout(() => { btn.innerText = ''; }, 2000);
                        }
                        window.location.href = 'mailto:iamhriturajsaha@gmail.com';
                      }}
                      className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-saffron hover:text-saffron transition-all relative group"
                    >
                       <Mail size={18} />
                       <span id="mail-btn" className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-saffron bg-black/80 px-2 py-1 rounded border border-saffron/20 pointer-events-none empty:hidden"></span>
                    </button>
                 </div>
                 <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Available for strategic collaboration</p>
              </div>
           </div>

           <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em]">
                © 2026 Electra Net // Designed by Hrituraj Saha
              </p>
              <div className="flex gap-8 text-[8px] font-black uppercase tracking-widest text-white/20">
                 <span className="flex items-center gap-2"><Shield size={10}/> Data Encrypted</span>
                 <span className="flex items-center gap-2"><Zap size={10}/> High Speed Uplink</span>
              </div>
           </div>
        </div>
      </footer>
    </main>
  );
}
