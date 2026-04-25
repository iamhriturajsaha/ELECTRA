import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getPerformance, type FirebasePerformance } from "firebase/performance";
import { initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCLCAqjcReLTDsw7G2fqy-g5EJ_BCRAa28",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "electra-949d1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "electra-949d1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "electra-949d1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "521395050210",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:521395050210:web:52c73a0cbc25aad59630bb",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase Performance Monitoring — tracks page load, API latency, custom traces
let perf: FirebasePerformance | null = null;
if (typeof window !== "undefined") {
  try {
    perf = getPerformance(app);
  } catch {
    // Performance SDK requires browser environment
  }
}

// Firebase App Check — reCAPTCHA Enterprise protects APIs from abuse
let appCheck: AppCheck | null = null;
/*
if (typeof window !== "undefined") {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // App Check requires valid reCAPTCHA key
  }
}
*/

export { app, auth, db, storage, perf, appCheck };
