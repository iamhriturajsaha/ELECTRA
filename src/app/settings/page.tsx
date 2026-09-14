"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, LogOut, ArrowLeft, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SettingsPage() {
  const { user, updateUserIdentity, updateUserEmail, updateUserPasskey, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (name !== user?.displayName) {
        await updateUserIdentity(name);
      }
      if (email !== user?.email) {
        await updateUserEmail(email);
      }
      setSuccess("Identity attributes updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("requires-recent-login")) {
        setError("Security Policy: Updating communication link requires recent authentication. Please re-authenticate.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passkey verification mismatch.");
      return;
    }

    setLoading(true);
    try {
      await updateUserPasskey(password);
      setSuccess("Passkey secured successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("requires-recent-login")) {
        setError("Security Policy: Modifying passkey requires recent authentication. Please re-authenticate.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Return to Interface
        </Link>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm">
            <ShieldCheck size={32} className="text-saffron" />
          </div>
          <div>
            <h1 className="gta-text text-4xl italic text-white leading-none tracking-tight mb-2">IDENTITY CONFIG</h1>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em]">Account Parameters</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p className="font-mono text-xs leading-relaxed">{error}</p>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald/10 border border-emerald/30 text-emerald p-4 rounded-xl flex items-start gap-3 text-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="font-mono text-xs leading-relaxed">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald to-transparent opacity-50" />
          
          <h2 className="text-lg font-black text-white italic mb-6">General Identity</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Display Designation</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-emerald outline-none transition-all font-mono placeholder:text-white/20" placeholder="Agent Name" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Communication Link</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-emerald outline-none transition-all font-mono placeholder:text-white/20" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-auto px-8 bg-emerald/20 text-emerald border border-emerald/50 p-3 rounded-xl font-black uppercase text-xs hover:bg-emerald hover:text-black transition-all disabled:opacity-50">
              Synchronize Profile
            </button>
          </form>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
          
          <h2 className="text-lg font-black text-white italic mb-6">Security Uplink</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">New Passkey</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-red-500 outline-none transition-all font-mono placeholder:text-white/20" placeholder="••••••••••••" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Verify Passkey</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 p-4 pl-11 rounded-xl text-white text-sm focus:border-red-500 outline-none transition-all font-mono placeholder:text-white/20" placeholder="••••••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !password} className="w-auto px-8 bg-red-500/20 text-red-500 border border-red-500/50 p-3 rounded-xl font-black uppercase text-xs hover:bg-red-500 hover:text-black transition-all disabled:opacity-50">
              Fortify Security
            </button>
          </form>
        </div>

        <div className="pt-8 pb-16 flex justify-end">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-500/70 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-widest bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 hover:bg-red-500/20">
            <LogOut size={16} /> Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
}
