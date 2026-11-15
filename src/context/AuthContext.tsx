"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  focusRegion: string;
  avatarUrl: string;
  badge: string;
  lastActive: string;
}

export const DEMO_USERS: Record<string, UserProfile> = {
  selamawit: {
    id: "usr_selamawit",
    name: "Dr. Selamawit Bekele",
    email: "s.bekele@ethiodrought.org",
    role: "Lead Drought Intelligence Scientist",
    organization: "EDRMC & NASA Harvest Consortium",
    focusRegion: "Borena & Somali Pastoral Belts",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    badge: "NASA 2026 LEAD INVESTIGATOR",
    lastActive: "Active Telemetry Connected",
  },
  tadesse: {
    id: "usr_tadesse",
    name: "Tadesse Alemayehu",
    email: "t.alemayehu@oromia-drm.gov.et",
    role: "Zonal Disaster Response Coordinator",
    organization: "Oromia Disaster Risk Management Commission",
    focusRegion: "Borena Zone (Yabello / Tula Wells)",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    badge: "REGIONAL FIELD OPERATOR",
    lastActive: "Field Node Active",
  },
  marcus: {
    id: "usr_marcus",
    name: "Dr. Marcus Vance",
    email: "marcus.vance@nasa.gov",
    role: "Hydrological Remote Sensing Specialist",
    organization: "NASA Goddard Space Flight Center (GSFC)",
    focusRegion: "East Africa FLDAS & GPM Telemetry",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    badge: "NASA EARTH SCIENCE GSFC",
    lastActive: "Constellation Link Synchronized",
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  isProfileModalOpen: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginAs: (demoKey: "selamawit" | "tadesse" | "marcus") => void;
  signup: (data: {
    name: string;
    email: string;
    password?: string;
    organization: string;
    role: string;
    focusRegion: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  openLogin: () => void;
  openSignup: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  toggleProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "ethiodrought_active_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.selamawit);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Default to lead investigator
        setUser(DEMO_USERS.selamawit);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS.selamawit));
      }
    } catch {
      // fallback to in-memory state
    }
  }, []);

  const login = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    // Match against demo users or create custom session
    let matched = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === trimmed);
    if (!matched) {
      // Allow custom email signin
      matched = {
        id: "usr_" + Date.now(),
        name: email.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
        email: email,
        role: "Earth Science Analyst",
        organization: "Scientific Contributor",
        focusRegion: "Nationwide (All Zones)",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        badge: "VERIFIED ANALYST",
        lastActive: "Online Telemetry",
      };
    }
    setUser(matched);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
    } catch {}
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginAs = (demoKey: "selamawit" | "tadesse" | "marcus") => {
    const selected = DEMO_USERS[demoKey] || DEMO_USERS.selamawit;
    setUser(selected);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const signup = (data: {
    name: string;
    email: string;
    organization: string;
    role: string;
    focusRegion: string;
  }) => {
    if (!data.name.trim() || !data.email.trim()) {
      return { success: false, error: "Name and email are required" };
    }
    const newUser: UserProfile = {
      id: "usr_" + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role.trim() || "Drought Monitor",
      organization: data.organization.trim() || "Independent Researcher",
      focusRegion: data.focusRegion || "Borena Zone",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      badge: "RESEARCH INVESTIGATOR",
      lastActive: "Just Registered · Connected",
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsProfileModalOpen(false);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        isProfileModalOpen,
        login,
        loginAs,
        signup,
        logout,
        updateProfile,
        openLogin: () => {
          setAuthModalMode("login");
          setIsAuthModalOpen(true);
        },
        openSignup: () => {
          setAuthModalMode("signup");
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false),
        openProfileModal: () => setIsProfileModalOpen(true),
        closeProfileModal: () => setIsProfileModalOpen(false),
        toggleProfileModal: () => setIsProfileModalOpen((prev) => !prev),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
