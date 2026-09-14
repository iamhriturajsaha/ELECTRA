"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  getAdditionalUserInfo,
  deleteUser
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { trackEvent } from "@/lib/analytics";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (allowRegistration?: boolean) => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  updateUserIdentity: (name: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPasskey: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  updateUserIdentity: async () => {},
  updateUserEmail: async () => {},
  updateUserPasskey: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Upserts a user profile document in Firestore on each sign-in.
 * Uses merge to avoid overwriting existing fields.
 */
async function upsertUserProfile(user: User): Promise<void> {
  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      lastLoginAt: serverTimestamp(),
    }, { merge: true });
  } catch {
    // Non-blocking — auth works without Firestore write
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Cache auth state for next visit
      if (typeof window !== "undefined") {
        localStorage.setItem("electra_auth_cached", currentUser ? "true" : "false");
      }

      // Track auth state + upsert Firestore profile
      if (currentUser) {
        trackEvent("auth", "session_active", currentUser.email ?? undefined);
        upsertUserProfile(currentUser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (allowRegistration = false) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser ?? false;

      if (isNewUser && !allowRegistration) {
        // User is not registered — delete the auto-created account and reject
        await deleteUser(result.user);
        await signOut(auth);
        throw new Error("auth/user-not-found: No account exists for this Google identity. Please register first.");
      }

      if (isNewUser && allowRegistration) {
        // Registration via Google — create profile and keep them logged in
        await upsertUserProfile(result.user);
        trackEvent("auth", "google_register", result.user.email ?? undefined);
        return; // Caller handles navigation
      }

      // Existing user — normal sign in
      trackEvent("auth", "google_sign_in", result.user.email ?? undefined);
      await upsertUserProfile(result.user);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Google Sign-in Error:", errorMessage);
      trackEvent("auth", "google_sign_in_failed", errorMessage);
      throw error;
    }
  };

  const loginWithEmail = async (e: string, p: string) => {
    try {
      await signInWithEmailAndPassword(auth, e, p);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  };

  const registerWithEmail = async (e: string, p: string) => {
    try {
      await createUserWithEmailAndPassword(auth, e, p);
      // Automatically log them in (default Firebase behavior)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  };

  const updateUserIdentity = async (name: string) => {
    if (!auth.currentUser) throw new Error("No active session");
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setUser({ ...auth.currentUser }); // Force refresh
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    if (!auth.currentUser) throw new Error("No active session");
    try {
      await updateEmail(auth.currentUser, newEmail);
      setUser({ ...auth.currentUser });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  };

  const updateUserPasskey = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error("No active session");
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, signInWithGoogle, loginWithEmail, registerWithEmail, 
      updateUserIdentity, updateUserEmail, updateUserPasskey, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
