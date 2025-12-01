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
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
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

  const signOutUser = async () => {
    await signOut(auth);
    clearSessionMark();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signInWithGoogle, signOutUser }),
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
