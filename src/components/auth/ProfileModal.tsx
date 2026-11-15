"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import {
  X,
  User,
  Mail,
  Building,
  MapPin,
  LogOut,
  Edit3,
  Check,
  ShieldCheck,
  Satellite,
  Compass,
  ArrowRight,
  Radio,
  Sparkles,
} from "lucide-react";

export const ProfileModal: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isProfileModalOpen,
    closeProfileModal,
    logout,
    loginAs,
    updateProfile,
    openLogin,
  } = useAuth();
  const { lang, setSelectedRegionId } = useApp();
  const isAmharic = lang === "am";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editOrg, setEditOrg] = useState("");
  const [editRegion, setEditRegion] = useState("");

  if (!isProfileModalOpen) return null;

  const handleStartEdit = () => {
    if (!user) return;
    setEditName(user.name);
    setEditOrg(user.organization);
    setEditRegion(user.focusRegion);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      organization: editOrg,
      focusRegion: editRegion,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={closeProfileModal} />

      <div className="relative w-full max-w-sm rounded-3xl bg-[#0b1424]/95 border border-[rgba(168,191,220,0.25)] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-6 z-10 text-[#FBFCFD] space-y-5 select-none mt-12 sm:mt-14">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(168,191,220,0.12)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-bold">
              {isAmharic ? "የባለሙያ መገለጫ" : "INVESTIGATOR PROFILE"}
            </span>
          </div>

          <button
            onClick={closeProfileModal}
            className="w-7 h-7 rounded-full bg-[#162036] hover:bg-[#253352] border border-white/10 flex items-center justify-center text-[#999CA0] hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {isAuthenticated && user ? (
          <>
            {/* User Avatar & Name Card */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-accent-cyan/60 shadow-[0_0_20px_rgba(40,215,197,0.4)] shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#040507]" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-bold text-[#FBFCFD] truncate">
                  {user.name}
                </h3>
                <span className="text-[11px] text-[#A8BFDC] font-mono block truncate">
                  {user.email}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-accent-blue/30 border border-accent-blue/50 text-[9px] font-mono text-accent-cyan uppercase tracking-wider">
                  {user.badge}
                </span>
              </div>
            </div>

            {/* Editing Form vs Display Mode */}
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="p-3.5 rounded-2xl bg-[#121929] border border-accent-cyan/30 space-y-3">
                <div>
                  <label className="text-[9px] font-mono text-[#999CA0] uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#FBFCFD] font-mono focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-[#999CA0] uppercase block mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={editOrg}
                    onChange={(e) => setEditOrg(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#FBFCFD] font-mono focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-[#999CA0] uppercase block mb-1">
                    Assigned Region
                  </label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#FBFCFD] font-mono focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 rounded-lg bg-transparent text-xs text-[#999CA0] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-accent-cyan text-[#040507] text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </form>
            ) : (
              /* User Metadata Detail Box */
              <div className="p-3.5 rounded-2xl bg-[#121929] border border-[rgba(168,191,220,0.12)] space-y-2 text-xs">
                <div className="flex items-start gap-2 text-[#A8BFDC]">
                  <Building className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                  <span className="leading-snug">{user.organization}</span>
                </div>

                <div className="flex items-start gap-2 text-[#A8BFDC]">
                  <MapPin className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                  <span>
                    Focus: <strong className="text-white">{user.focusRegion}</strong>
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#999CA0] border-t border-white/5">
                  <span>TELEMETRY NODE</span>
                  <span className="text-emerald-400 font-bold">{user.lastActive}</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link
                href="/explore"
                onClick={() => {
                  setSelectedRegionId("borena");
                  closeProfileModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-panel-dark hover:bg-accent-blue/30 border border-[rgba(168,191,220,0.15)] hover:border-accent-cyan/40 text-xs text-[#FBFCFD] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent-cyan" />
                  <span>{isAmharic ? "ወደተመደበልዎት ዞን ካርታ ይሂዱ" : "Jump to Assigned Focus Zone"}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#999CA0] group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" />
              </Link>

              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="w-full py-2 px-3 rounded-xl bg-[#121929] hover:bg-[#162036] border border-white/5 text-xs text-[#A8BFDC] hover:text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isAmharic ? "መረጃዎን ያሻሽሉ" : "Edit Profile Info"}</span>
                </button>
              )}
            </div>

            {/* Switch Personas Section */}
            <div className="pt-3 border-t border-[rgba(168,191,220,0.12)] space-y-2">
              <span className="text-[10px] font-mono text-[#999CA0] uppercase tracking-wider block">
                {isAmharic ? "የባለሙያ ሚናዎችን ይቀያይሩ" : "SWITCH DEMO PERSONA"}
              </span>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                <button
                  onClick={() => loginAs("selamawit")}
                  className={`p-2 rounded-xl border transition-all ${
                    user.id === "usr_selamawit"
                      ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                      : "bg-[#121929] border-white/5 text-[#A8BFDC] hover:text-white"
                  }`}
                >
                  Dr. Selamawit
                </button>
                <button
                  onClick={() => loginAs("tadesse")}
                  className={`p-2 rounded-xl border transition-all ${
                    user.id === "usr_tadesse"
                      ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                      : "bg-[#121929] border-white/5 text-[#A8BFDC] hover:text-white"
                  }`}
                >
                  Tadesse (Field)
                </button>
                <button
                  onClick={() => loginAs("marcus")}
                  className={`p-2 rounded-xl border transition-all ${
                    user.id === "usr_marcus"
                      ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                      : "bg-[#121929] border-white/5 text-[#A8BFDC] hover:text-white"
                  }`}
                >
                  Dr. Marcus (NASA)
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-mono text-red-300 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isAmharic ? "ውጣ (Sign Out)" : "DISCONNECT / SIGN OUT"}</span>
              </button>
            </div>
          </>
        ) : (
          /* Logged out state */
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center text-accent-cyan mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-[#FBFCFD]">
                {isAmharic ? "መለያ አልገባም" : "No Active Session"}
              </h3>
              <p className="text-xs text-[#A8BFDC] mt-1">
                {isAmharic
                  ? "የተሟላ የሳተላይት መረጃ ለማግኘት ይግቡ ወይም አዲስ መለያ ይክፈቱ።"
                  : "Sign in to access authorized NASA telemetry nodes, saved alert filters, and investigation queues."}
              </p>
            </div>

            <button
              onClick={() => {
                closeProfileModal();
                openLogin();
              }}
              className="w-full py-2.5 rounded-xl bg-accent-cyan text-[#040507] hover:bg-white font-mono text-xs font-bold tracking-wider transition-all"
            >
              {isAmharic ? "ይግቡ / ይመዝገቡ" : "SIGN IN / REGISTER"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
