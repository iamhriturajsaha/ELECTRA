"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Fingerprint, Lock, Mail, AlertTriangle, ArrowRight, ShieldCheck, UserPlus, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const switchTab = (login: boolean) => {
    setIsLogin(login);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        // --- Registration validations ---
        if (password.length < 6) {
          setError("REGISTRATION FAILED: Passkey must be at least 6 characters.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("REGISTRATION FAILED: Passkeys do not match.");
          setLoading(false);
          return;
        }

        await registerWithEmail(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      if (isLogin) {
        setError(msg.includes("auth/") ? "ACCESS DENIED: Invalid credentials or unregistered identity." : msg);
      } else {
        if (msg.includes("weak-password")) setError("REGISTRATION FAILED: Passkey must be at least 6 characters.");
        else if (msg.includes("email-already-in-use")) setError("REGISTRATION FAILED: Identity already active in the system.");
        else setError("REGISTRATION FAILED: " + msg.replace("Firebase: ", ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithGoogle(!isLogin);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("auth/popup-closed-by-user")) {
        // User closed popup — do nothing
      } else if (msg.includes("auth/user-not-found") || msg.includes("No account exists")) {
        setError("ACCESS DENIED: No account exists for this Google identity. Please register first.");
      } else {
        setError("ACCESS DENIED: Google verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
            <ShieldCheck size={40} className="text-saffron" />
          </div>
          <h1 className="gta-text text-5xl italic text-white leading-none tracking-tight mb-2">ELECTRA</h1>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em]">Secure Terminal Access</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-saffron to-transparent opacity-50" />
          <div className="absolute -left-10 top-10 w-20 h-40 bg-saffron/10 blur-[50px] rotate-45" />

          {/* Tabs */}
          <div className="flex gap-4 mb-8 relative z-10">
            <button 
              onClick={() => switchTab(true)}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${isLogin ? 'border-saffron text-saffron' : 'border-white/10 text-white/40 hover:text-white'}`}
            >
              Authenticate
            </button>
            <button 
              onClick={() => switchTab(false)}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${!isLogin ? 'border-saffron text-saffron' : 'border-white/10 text-white/40 hover:text-white'}`}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm overflow-hidden"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="font-mono text-xs leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Alert */}
          <AnimatePresence mode="wait">
            {success && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm overflow-hidden"
              >
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                <p className="font-mono text-xs leading-relaxed">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleEmailAuth} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Identity (Email)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-saffron outline-none transition-all font-mono placeholder:text-white/20"
                  placeholder="citizen@india.gov"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Passkey</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-saffron outline-none transition-all font-mono placeholder:text-white/20"
                  placeholder="••••••••••••"
                />
              </div>
              {!isLogin && password.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5 ml-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`h-1 w-6 rounded-full transition-all ${
                          password.length >= level * 3 
                            ? password.length >= 10 ? 'bg-emerald-500' : password.length >= 8 ? 'bg-yellow-500' : 'bg-red-500'
                            : 'bg-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest font-bold text-white/30">
                    {password.length < 6 ? 'Too Short' : password.length < 8 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password — only on Register */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="confirm-pw"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Confirm Passkey</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      type="password" 
                      required={!isLogin}
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-slate-900/50 border p-4 pl-11 rounded-xl text-white text-sm focus:border-saffron outline-none transition-all font-mono placeholder:text-white/20 ${
                        confirmPassword && confirmPassword !== password 
                          ? 'border-red-500/50' 
                          : confirmPassword && confirmPassword === password 
                            ? 'border-emerald-500/50' 
                            : 'border-white/10'
                      }`}
                      placeholder="••••••••••••"
                    />
                    {confirmPassword && confirmPassword === password && (
                      <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[8px] text-red-500 uppercase tracking-widest font-bold ml-1 mt-1">Passkeys do not match</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading || (!isLogin && password !== confirmPassword)}
              className="w-full bg-saffron text-black p-4 rounded-xl font-black uppercase text-sm hover:bg-white transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(255,153,51,0.2)] disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  {isLogin ? 'Initiate Session' : 'Create Identity'}
                  {isLogin ? <ArrowRight size={16} /> : <UserPlus size={16} />}
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 relative z-10">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button 
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3 relative z-10"
          >
            <Fingerprint size={18} className="text-saffron" />
            {isLogin ? 'Authenticate via Google' : 'Register via Google'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
