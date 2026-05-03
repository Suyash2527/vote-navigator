"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useGame } from "@/lib/GameContext";
import { Vote, Menu, X, LogOut, User, Zap, Trophy, Shield, Activity } from "lucide-react";

const navLinks = [
  { href: "/journey", label: "Journey", icon: "⚔️" },
  { href: "/timeline", label: "Timeline", icon: "🗺️" },
  { href: "/quiz", label: "Quiz", icon: "🎯" },
  { href: "/states", label: "States", icon: "🏛️" },
  { href: "/faq", label: "AI Guide", icon: "🤖" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { gameState } = useGame();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const currentLevelXP = Math.pow(gameState.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(gameState.level, 2) * 100;
  const xpInCurrentLevel = gameState.xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* News Ticker Overlay */}
        <div className="ticker-container glass border-none !bg-primary/10">
          <div className="ticker-content flex items-center gap-12 py-1">
             <span className="text-[9px] font-black tracking-[0.3em] uppercase text-primary flex items-center gap-2 whitespace-nowrap">
               <Activity className="w-3 h-3" /> SYSTEM STATUS: OPERATIONAL
             </span>
             <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40 flex items-center gap-2 whitespace-nowrap">
               • ECI LIVE UPDATES CONNECTED • 2024 MISSION PACKS LOADED • GLOBAL LEADERBOARD SYNCED •
             </span>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all group-hover:scale-110 duration-300 border border-white/20">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter gradient-text hidden sm:block leading-none">VoteNavigator</span>
                <span className="text-[9px] font-bold text-accent hidden sm:block tracking-[0.2em] uppercase mt-1">Democracy OS</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 flex items-center gap-2 tracking-[0.1em] uppercase ${
                      active
                        ? "text-primary"
                        : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="text-base relative z-10">{link.icon}</span>
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-6">
                  {/* HUD */}
                  <div className="hidden sm:flex flex-col items-end gap-2 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-foreground/40 tracking-widest uppercase">{gameState.rank}</span>
                      <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-[9px] font-black">
                        LVL {gameState.level}
                      </div>
                    </div>
                    <div className="xp-bar-container w-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        className="xp-bar-fill"
                      />
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative group hover:border-primary/50 transition-colors">
                      <User className="w-5 h-5 text-primary" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="hidden xl:flex flex-col">
                      <span className="text-sm font-black tracking-tight">{user.displayName || user.email?.split("@")[0]}</span>
                      <span className="text-[10px] font-bold text-accent tracking-widest uppercase">{gameState.xp} XP</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl text-foreground/30 hover:text-danger hover:bg-danger/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/signup" className="btn-premium !px-6 !py-3 !text-[11px] font-black tracking-[0.2em]">
                  JOIN THE MISSION
                </Link>
              )}

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4"
            >
              <div className="glass rounded-3xl p-6 flex flex-col gap-2 border border-white/10 shadow-2xl">
                {user && (
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 mb-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary tracking-widest uppercase">{gameState.rank}</span>
                        <span className="text-lg font-black">{user.displayName || user.email?.split("@")[0]}</span>
                      </div>
                      <div className="px-4 py-1.5 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-black">
                        LEVEL {gameState.level}
                      </div>
                    </div>
                    <div className="xp-bar-container mb-2">
                      <div className="h-full xp-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-foreground/40 tracking-widest uppercase">
                      <span>{gameState.xp} XP</span>
                      <span>Next Level in {nextLevelXP - gameState.xp} XP</span>
                    </div>
                  </div>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-5 py-4 rounded-2xl text-xs font-black transition-all flex items-center gap-4 tracking-widest uppercase ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground/50 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                
                <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-2">
                  {user ? (
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="px-5 py-4 rounded-2xl text-xs font-black text-danger hover:bg-danger/10 transition-all tracking-widest uppercase flex items-center justify-center gap-3"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  ) : (
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-premium text-center">Join Mission</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
