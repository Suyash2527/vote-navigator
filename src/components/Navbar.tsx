"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useGame } from "@/lib/GameContext";
import { Vote, Menu, X, LogOut, User, Zap, Trophy, Shield } from "lucide-react";

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

  // Calculate XP progress for the current level
  // Level = floor(sqrt(XP / 100)) + 1
  // XP required for Level L = (L-1)^2 * 100
  // XP required for Level L+1 = L^2 * 100
  const currentLevelXP = Math.pow(gameState.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(gameState.level, 2) * 100;
  const xpInCurrentLevel = gameState.xp - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-2.5 flex items-center justify-between border border-primary/20"
          style={{ boxShadow: "0 0 25px rgba(255, 107, 53, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center shadow-lg group-hover:shadow-primary/40 transition-all group-hover:scale-110 duration-300">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight gradient-text hidden sm:block leading-none">VoteNavigator</span>
              <span className="text-[10px] font-bold text-accent hidden sm:block tracking-widest uppercase mt-0.5">Democracy Edition</span>
            </div>
          </Link>

          {/* Desktop nav — game-style pills */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-[11px] font-black transition-all duration-200 flex items-center gap-2 tracking-widest uppercase ${
                    active
                      ? "text-primary"
                      : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30 neon-border"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="text-base relative z-10">{link.icon}</span>
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth / HUD right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* HUD Stats */}
                <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-foreground/40 tracking-widest uppercase">{gameState.rank}</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-warning/10 border border-warning/30 text-warning text-[10px] font-black">
                      Lvl {gameState.level}
                    </div>
                  </div>
                  {/* XP Bar Container */}
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="absolute inset-y-0 left-0 xp-bar rounded-full"
                    />
                  </div>
                </div>

                {/* Player Profile Chip */}
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center relative group">
                    <User className="w-5 h-5 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                      <Shield className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-black truncate max-w-[80px]">{user.displayName || user.email?.split("@")[0]}</span>
                    <span className="text-[9px] font-bold text-accent tracking-wider uppercase">{gameState.xp} XP</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-foreground/40 hover:text-danger hover:bg-danger/10 transition-all border border-transparent hover:border-danger/20"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-black text-foreground/50 hover:text-foreground transition-colors border border-transparent hover:border-border/30 uppercase tracking-widest">
                  Log in
                </Link>
                <Link href="/signup" className="btn-primary !px-5 !py-2 text-[10px] font-black tracking-[0.2em] neon-border">
                  JOIN MISSION
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-3 glass rounded-2xl p-4 flex flex-col gap-1.5 border border-primary/20 shadow-2xl"
            >
              {/* Mobile Stats HUD */}
              {user && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary tracking-widest uppercase">Rank: {gameState.rank}</span>
                      <span className="text-sm font-black">{user.displayName || user.email?.split("@")[0]}</span>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-warning/20 border border-warning/40 text-warning text-xs font-black">
                      LEVEL {gameState.level}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 mb-1">
                    <div className="h-full xp-bar" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-foreground/30 tracking-widest uppercase">
                    <span>{gameState.xp} Total XP</span>
                    <span>{xpNeededForNext - xpInCurrentLevel} XP to Next Level</span>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-3 tracking-[0.15em] uppercase ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary border border-primary/20 neon-border"
                      : "text-foreground/50 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-white/5 pt-3 mt-1.5 flex flex-col gap-2">
                {!user && (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3.5 rounded-xl text-xs font-black text-foreground/50 hover:text-foreground transition-all tracking-widest uppercase text-center">Log in</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-xs font-black tracking-[0.2em] uppercase">Join Mission</Link>
                  </>
                )}
                {user && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="px-4 py-3.5 rounded-xl text-xs font-black text-center text-danger hover:bg-danger/10 transition-all tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
