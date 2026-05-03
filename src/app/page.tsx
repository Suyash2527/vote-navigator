"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, Shield, Target, Trophy, ArrowRight, 
  Users, MapPin, Search, Rocket, BarChart3,
  Globe, LayoutGrid, Newspaper, Flame,
  Medal, Star, Activity, Bell
} from "lucide-react";
import { useGame } from "@/lib/GameContext";

export default function Home() {
  const { gameState } = useGame();
  const { xp, level, rank } = gameState;

  const MISSION_PACKS = [
    {
      title: "Voter Training Simulator",
      desc: "Test your knowledge, earn XP, and unlock the 'Civic Champion' badge.",
      href: "/quiz",
      icon: <Target className="w-8 h-8 text-orange-500" />,
      color: "border-orange-500/20 hover:border-orange-500/50",
      xp: "500 XP",
      difficulty: "Starter",
      hot: true
    },
    {
      title: "Mission Map: Timeline",
      desc: "Navigate the electoral journey from registration to the final vote.",
      href: "/timeline",
      icon: <LayoutGrid className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500/20 hover:border-blue-500/50",
      xp: "1200 XP",
      difficulty: "Advanced",
      hot: false
    },
    {
      title: "State Intelligence",
      desc: "Live data on all Indian states: Governments, major parties, and history.",
      href: "/states",
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      color: "border-emerald-500/20 hover:border-emerald-500/50",
      xp: "NEW Dossier",
      difficulty: "Expert",
      hot: true
    }
  ];

  const LEADERBOARD = [
    { name: "Rahul S.", rank: 1, level: 42, xp: "14.2k", avatar: "🥇" },
    { name: "Priya K.", rank: 2, level: 38, xp: "12.8k", avatar: "🥈" },
    { name: "Amit V.", rank: 3, level: 35, xp: "11.5k", avatar: "🥉" },
    { name: "Anjali M.", rank: 4, level: 31, xp: "9.2k", avatar: "👤" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden font-['Outfit']">
      <div className="mesh-gradient" />
      
      {/* Background Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- NEWS TICKER --- */}
        <div className="ticker-container rounded-xl mb-12 glass overflow-hidden border-primary/20">
          <div className="ticker-content flex items-center gap-12 py-2">
            {[
              "🚀 LIVE: 2024 Election Training Missions Released",
              "🇮🇳 ECI announces new voter outreach program",
              "🏆 TOP RANKING: Citizen Rahul S. reaches Level 42",
              "✅ SYSTEM UPDATE: State Intelligence dossiers now online",
              "🗳️ FACT CHECK: AI Guide ready for 24/7 electoral assistance"
            ].map((text, i) => (
              <span key={i} className="text-[11px] font-black tracking-widest uppercase text-primary flex items-center gap-2 whitespace-nowrap">
                <Activity className="w-3 h-3" /> {text}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- MAIN CONTENT (9 cols) --- */}
          <div className="lg:col-span-8">
            {/* --- HERO SECTION --- */}
            <section className="mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/30 text-primary text-[10px] font-black mb-8 tracking-[0.2em] uppercase"
              >
                <Flame className="w-4 h-4" /> The Ultimate Democratic Simulator
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
              >
                LEVEL UP YOUR<br />
                <span className="gradient-text">PATRIOTISM.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-foreground/60 text-xl max-w-2xl mb-12 leading-relaxed"
              >
                Join the elite tier of Indian citizens. Master the electoral landscape through 
                immersive missions, real-time intel, and AI-powered guidance.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/quiz" className="btn-premium flex items-center gap-3">
                  LAUNCH MISSION <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/states" className="glass glass-card px-8 py-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center gap-2 border border-white/5">
                  STATE DOSSIERS
                </Link>
              </motion.div>
            </section>

            {/* --- MISSION PACKS --- */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tight">Active <span className="text-primary">Objectives</span></h2>
                <div className="h-[1px] flex-1 mx-8 bg-white/5" />
              </div>

              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {MISSION_PACKS.map((mission, idx) => (
                  <motion.div 
                    key={idx}
                    variants={item}
                    className={`group glass-card rounded-[2rem] p-8 border ${mission.color} relative overflow-hidden`}
                  >
                    {mission.hot && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-red-500 rounded-md text-[8px] font-black text-white tracking-widest uppercase animate-pulse">
                        TRENDING
                      </div>
                    )}
                    
                    <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                      {mission.icon}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-yellow-500 font-black text-xs tracking-widest uppercase">{mission.xp}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-foreground/40 font-bold text-[10px] tracking-widest uppercase">{mission.difficulty}</span>
                    </div>

                    <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">
                      {mission.title}
                    </h3>
                    
                    <p className="text-foreground/60 mb-8 text-sm leading-relaxed">
                      {mission.desc}
                    </p>

                    <Link 
                      href={mission.href}
                      className="inline-flex items-center gap-2 font-black text-xs tracking-widest uppercase group-hover:translate-x-2 transition-transform"
                    >
                      BEGIN MISSION <ArrowRight className="w-4 h-4 text-primary" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* --- SIDEBAR (4 cols) --- */}
          <div className="lg:col-span-4 space-y-8">
            {/* Player Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2rem] border-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-white to-accent" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20 border border-white/20">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-foreground/40 uppercase tracking-widest mb-1">Rank</h4>
                  <p className="text-2xl font-black text-primary uppercase tracking-tight">{rank}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-foreground/40 tracking-widest uppercase">Level Progress</span>
                    <span className="text-sm font-black">Level {level}</span>
                  </div>
                  <div className="xp-bar-container">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      className="xp-bar-fill" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mb-1">Total XP</p>
                    <p className="text-xl font-black text-orange-500">{xp.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mb-1">Badges</p>
                    <p className="text-xl font-black text-emerald-500">12</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Global Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2rem] border-white/5"
            >
              <div className="flex items-center gap-2 mb-8">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h4 className="font-black text-sm tracking-widest uppercase">Global Citizens</h4>
              </div>

              <div className="space-y-4">
                {LEADERBOARD.map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{user.avatar}</span>
                      <div>
                        <p className="font-black text-sm">{user.name}</p>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Level {user.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">{user.xp}</p>
                      <p className="text-[8px] font-black text-foreground/20 uppercase tracking-widest">XP</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-white/5 transition-colors">
                View Full Ranking
              </button>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform">
                <Medal className="w-24 h-24" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Medal className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase mb-1">New Unlock</p>
                <p className="font-black text-sm">Verified Elector</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
