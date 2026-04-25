"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-saffron/10 border border-saffron/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,153,51,0.2)]">
            <Sparkles size={32} className="text-saffron animate-spin-slow" />
          </div>
          <h2 className="gta-text text-2xl italic text-white tracking-widest animate-pulse">
            INITIALIZING NEURAL LINK...
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.5em]">
            Establishing Secure Connection
          </p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content while redirecting to /login
  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
