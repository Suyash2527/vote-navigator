"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, Shield, Target, Trophy, ArrowRight, 
  Users, MapPin, Search, Rocket, BarChart3,
  Globe, LayoutGrid, Newspaper
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
      xp: "500 XP Available",
      difficulty: "Starter"
    },
    {
      title: "Mission Map: Timeline",
      desc: "Navigate the electoral journey from registration to the final vote.",
      href: "/timeline",
      icon: <LayoutGrid className="w-8 h-8 text-blue-500" />,
      color: "border-blue-500/20 hover:border-blue-500/50",
      xp: "1200 XP Available",
      difficulty: "Advanced"
    },
    {
      title: "State Intelligence",
      desc: "Live data on all Indian states: Governments, major parties, and history.",
      href: "/states",
      icon: <Globe className="w-8 h-8 text-emerald-500" />,
      color: "border-emerald-500/20 hover:border-emerald-500/50",
      xp: "New Intel",
      difficulty: "Expert"
    }
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
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-sm font-bold mb-8 animate-float"
          >
            <Rocket className="w-4 h-4" /> 2024 ELECTION SEASON LIVE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
          >
            BE THE <span className="gradient-text">LEGEND</span><br />
            OF DEMOCRACY
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-xl max-w-2xl mx-auto mb-10"
          >
            The ultimate gamified platform to master the Indian electoral process. 
            Level up, earn ranks, and lead the nation's civic future.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/quiz" className="btn-primary px-10 py-4 font-bold text-lg flex items-center gap-2">
              START YOUR MISSION <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/timeline" className="glass glass-hover px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 border border-white/10">
              VIEW MISSION MAP
            </Link>
          </motion.div>
        </section>

        {/* --- STATS OVERVIEW --- */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
        >
          <motion.div variants={item} className="glass p-6 rounded-2xl border-l-4 border-orange-500">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Current Level</p>
            <h3 className="text-3xl font-black text-orange-500">{level}</h3>
          </motion.div>
          <motion.div variants={item} className="glass p-6 rounded-2xl border-l-4 border-blue-500">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Total XP</p>
            <h3 className="text-3xl font-black text-blue-500">{xp.toLocaleString()}</h3>
          </motion.div>
          <motion.div variants={item} className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Global Rank</p>
            <h3 className="text-3xl font-black text-emerald-500">{rank}</h3>
          </motion.div>
          <motion.div variants={item} className="glass p-6 rounded-2xl border-l-4 border-purple-500">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Status</p>
            <h3 className="text-3xl font-black text-purple-500">Active Duty</h3>
          </motion.div>
        </motion.div>

        {/* --- MISSION PACKS --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black">Available <span className="text-primary">Missions</span></h2>
            <div className="h-[2px] flex-1 mx-8 bg-white/5 hidden md:block" />
            <Link href="/states" className="text-primary font-bold hover:underline flex items-center gap-2">
              View All Content <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {MISSION_PACKS.map((mission, idx) => (
              <motion.div 
                key={idx}
                variants={item}
                className={`group relative glass rounded-3xl p-8 border ${mission.color} transition-all duration-500 overflow-hidden`}
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {mission.icon}
                </div>
                
                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                  {mission.icon}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-foreground/50 tracking-widest uppercase">
                    {mission.difficulty}
                  </span>
                  <span className="text-yellow-400 font-bold text-[10px] tracking-widest uppercase">
                    {mission.xp}
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">
                  {mission.title}
                </h3>
                
                <p className="text-foreground/60 mb-8 leading-relaxed">
                  {mission.desc}
                </p>

                <Link 
                  href={mission.href}
                  className="flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform"
                >
                  Launch Mission <ArrowRight className="w-4 h-4 text-primary" />
                </Link>

                {/* Bottom line ornament */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:w-full transition-all duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- FEATURES GRID --- */}
        <section className="glass rounded-[2.5rem] p-12 border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Master the <span className="text-primary">Electoral Ecosystem</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Live Insights</h4>
                    <p className="text-foreground/60">Real-time data on state governments, parties, and historical voting patterns.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Secure Journey</h4>
                    <p className="text-foreground/60">Guided path to voter registration, verification, and rights protection.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Community Led</h4>
                    <p className="text-foreground/60">Compare your progress with citizens across India and reach the top tier.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl glass border-primary/20 overflow-hidden pulse-border relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                     <Trophy className="w-24 h-24 text-yellow-500 mb-6 mx-auto animate-float" />
                     <p className="text-2xl font-black text-yellow-500">DEMOCRACY LEGEND</p>
                     <p className="text-foreground/40 font-bold tracking-widest uppercase">The Highest Honor</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
