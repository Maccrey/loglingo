"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = "loglingo_session_started_at";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function isSessionExpired() {
  if (typeof window === "undefined") return false;
  const value = window.localStorage.getItem(SESSION_KEY);
  if (!value) return false;
  const startedAt = Number(value);
  return Number.isFinite(startedAt) ? Date.now() - startedAt > SESSION_TTL_MS : false;
}

function markSessionStart() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, String(Date.now()));
}

function clearSessionMark() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (current) => {
      if (current && isSessionExpired()) {
        await signOut(auth);
        clearSessionMark();
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, provider);
    markSessionStart();
    setLoading(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      markSessionStart();
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      markSessionStart();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserEmail = async (newEmail: string, currentPassword: string) => {
    if (!user || !user.email) {
      throw new Error("No user logged in");
    }
    
    // Re-authenticate user before email change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update email
    await updateEmail(user, newEmail);
    
    // Send verification to new email
    await sendEmailVerification(user);
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      throw new Error("No user logged in");
    }
    await sendEmailVerification(user);
  };

  const signOutUser = async () => {
    await signOut(auth);
    clearSessionMark();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      updateUserEmail,
      sendVerificationEmail,
      signOutUser 
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
