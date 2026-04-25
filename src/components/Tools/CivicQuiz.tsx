"use client";

import { useState, useCallback } from "react";
import { Trophy, Zap, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { saveQuizResult } from "@/lib/firestore-service";

/** Total points awarded per correct answer */
const POINTS_PER_CORRECT = 100;

/** Rank labels keyed by minimum score threshold */
const RANK_THRESHOLDS: { min: number; label: string }[] = [
  { min: 500, label: "VETERAN_VOTER" },
  { min: 300, label: "INFORMED_CITIZEN" },
  { min: 0,   label: "CITIZEN_RECRUIT" },
];

/** Returns the rank label for a given score */
function getRank(score: number): string {
  return RANK_THRESHOLDS.find((t) => score >= t.min)?.label ?? "CITIZEN_RECRUIT";
}

const QUESTIONS = [
  {
    id: 1,
    q: "What is the minimum age to vote in India?",
    a: ["18", "21", "25", "16"],
    correct: 0,
  },
  {
    id: 2,
    q: "What does NOTA stand for on the ballot?",
    a: ["No Other Truly Available", "None of the Above", "None of these Applicants", "National Option To Abide"],
    correct: 1,
  },
  {
    id: 3,
    q: "What is the primary role of the VVPAT machine?",
    a: ["Generate Voter ID", "Allow voters to verify their vote", "Count votes automatically", "Connect to the Internet"],
    correct: 1,
  },
  {
    id: 4,
    q: "How long is the Model Code of Conduct usually in effect?",
    a: ["Only on Polling Day", "From date of announcement until results", "One month before voting", "10 days before voting"],
    correct: 1,
  },
  {
    id: 5,
    q: "Which constitutional body conducts elections in India?",
    a: ["Parliament", "Supreme Court", "Election Commission of India", "NITI Aayog"],
    correct: 2,
  },
  {
    id: 6,
    q: "Which form is used for new voter registration?",
    a: ["Form 7", "Form 8", "Form 6", "Form 6B"],
    correct: 2,
  }
];

export default function CivicQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return; // prevent double-click
    setSelected(idx);
    const correct = QUESTIONS[currentQ].correct;
    const isCorrect = idx === correct;
    const newScore = isCorrect ? score + POINTS_PER_CORRECT : score;

    // Google Analytics: track each answer
    trackEvent("quiz", isCorrect ? "answer_correct" : "answer_wrong", QUESTIONS[currentQ].q, idx);

    if (isCorrect) setScore(newScore);

    setTimeout(async () => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        // Google Analytics: quiz completed
        trackEvent("quiz", "quiz_completed", getRank(newScore), newScore);
        // Firestore: persist the result
        try {
          await saveQuizResult({
            score: newScore,
            totalQuestions: QUESTIONS.length,
            rank: getRank(newScore),
          });
        } catch {
          // Non-blocking — quiz still works offline
        }
      }
    }, 1000);
  }, [currentQ, score, selected]);

  const reset = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelected(null);
    trackEvent("quiz", "quiz_restarted");
  }, []);

  if (showResult) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center cyber-border neon-glow max-w-md mx-auto">
        <Trophy size={64} className="text-saffron mx-auto mb-6 animate-bounce" />
        <h3 className="gta-text text-3xl mb-2 text-white italic">Protocol Complete</h3>
        <p className="text-muted-foreground text-sm mb-6 uppercase font-bold tracking-widest">You&apos;ve earned {score} Democracy Points!</p>
        <div className="text-5xl font-black text-saffron mb-8 font-mono tracking-tighter">
          RANK: {getRank(score)}
        </div>
        <button 
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 bg-saffron text-black py-4 rounded-xl font-black uppercase hover:bg-white transition-all shadow-lg"
        >
          <RefreshCcw size={20} /> Restart Mission
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex justify-between items-end px-2">
        <div>
          <span className="text-[10px] font-bold text-saffron uppercase tracking-[0.2em]">Electoral Audit</span>
          <h2 className="gta-text text-3xl text-white italic leading-none">PHASE {currentQ + 1}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Mastery</span>
          <p className="font-mono text-xl text-saffron">{score.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mx-2 border border-white/5">
        <motion.div 
          className="h-full bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="space-y-6"
        >
          <p className="text-2xl font-black text-white leading-tight italic px-2">
            {QUESTIONS[currentQ].q}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {QUESTIONS[currentQ].a.map((opt, idx) => (
              <button
                key={opt}
                disabled={selected !== null}
                onClick={() => handleAnswer(idx)}
                className={`
                  text-left p-5 rounded-2xl border transition-all flex items-center justify-between group
                  ${selected === idx 
                    ? (idx === QUESTIONS[currentQ].correct ? "border-emerald bg-emerald/10 text-emerald" : "border-red-500 bg-red-500/10 text-red-500")
                    : "border-white/10 bg-white/5 text-white/80 hover:border-saffron hover:bg-saffron/10 hover:text-white"
                  }
                `}
              >
                <span className="font-bold text-sm uppercase tracking-wide">{opt}</span>
                {selected === idx && (
                  idx === QUESTIONS[currentQ].correct 
                    ? <CheckCircle2 className="text-emerald" size={20} /> 
                    : <XCircle className="text-red-500" size={20} />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 text-white/40 border-t border-white/5 pt-8">
        <Zap size={16} className="text-saffron animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Complete all phases to unlock Veteran Rank</span>
      </div>
    </div>
  );
}
