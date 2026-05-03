"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Unlock, Shield, Star, Zap, Target, Trophy,
  ChevronDown, MapPin, Calendar, Clock, Loader2,
  CheckCircle2, Flame, Swords, ScrollText, Rocket, Flag
} from "lucide-react";
import { useGame } from "@/lib/GameContext";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  why_it_matters: string;
  next_action: string;
}

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi (NCT)","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

const ELECTION_TYPES = [
  "Lok Sabha (General Election)",
  "Vidhan Sabha (State Legislative Assembly)",
  "Rajya Sabha (By-election)",
  "Municipal Corporation",
  "Gram Panchayat",
  "By-election (Upchunav)"
];

const YEARS = ["2024","2025","2026","2027","2028","2029"];

// Mission config per step index
const MISSION_META = [
  { icon: <Flag className="w-5 h-5" />, label: "INITIATION", color: "from-orange-500 to-red-600", glow: "shadow-orange-500/40", ring: "ring-orange-500/60", xp: 150, badge: "🚩" },
  { icon: <ScrollText className="w-5 h-5" />, label: "REGISTRATION", color: "from-blue-600 to-indigo-700", glow: "shadow-blue-500/40", ring: "ring-blue-500/60", xp: 200, badge: "📜" },
  { icon: <Shield className="w-5 h-5" />, label: "VERIFICATION", color: "from-emerald-600 to-green-700", glow: "shadow-emerald-500/40", ring: "ring-emerald-500/60", xp: 250, badge: "🛡️" },
  { icon: <Target className="w-5 h-5" />, label: "AWARENESS", color: "from-amber-500 to-yellow-600", glow: "shadow-amber-500/40", ring: "ring-amber-500/60", xp: 300, badge: "🎯" },
  { icon: <Trophy className="w-5 h-5" />, label: "THE VOTE", color: "from-primary to-danger", glow: "shadow-primary/40", ring: "ring-primary/60", xp: 500, badge: "🏆" },
];

export default function TimelinePage() {
  const [state, setState] = useState("");
  const [electionType, setElectionType] = useState("");
  const [year, setYear] = useState("");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlockedIdx, setUnlockedIdx] = useState<number>(-1); // which mission is open
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const { addXP, completeMission: markMissionDone } = useGame();

  const generateTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTimeline([]);
    setUnlockedIdx(-1);
    setCompletedSet(new Set());
    setLoading(true);
    try {
      const res = await fetch("/api/generate-timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, electionType, year }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.events && Array.isArray(data.events)) {
        setTimeline(data.events);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch {
      setError("Unable to generate timeline. Please check your internet connection or try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMissionClick = (idx: number) => {
    if (unlockedIdx === idx) {
      setUnlockedIdx(-1);
    } else {
      setUnlockedIdx(idx);
    }
  };

  const completeMission = (idx: number) => {
    if (completedSet.has(idx)) return;
    const meta = MISSION_META[idx % MISSION_META.length];
    setCompletedSet(prev => new Set([...prev, idx]));
    
    // Award global XP and mark mission done
    addXP(meta.xp);
    markMissionDone(`timeline_${state}_${electionType}_${idx}`);
    setUnlockedIdx(-1);
  };

  const totalPossibleXP = timeline.reduce((sum, _, i) => sum + MISSION_META[i % MISSION_META.length].xp, 0);
  const earnedInSession = Array.from(completedSet).reduce((sum, idx) => sum + MISSION_META[idx % MISSION_META.length].xp, 0);
  const xpPercent = totalPossibleXP > 0 ? Math.round((earnedInSession / totalPossibleXP) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5 border border-primary/20 tracking-wider">
          <Rocket className="w-4 h-4" /> ELECTION QUEST · भारत चुनाव
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          Your Election <span className="gradient-text">Mission Map</span>
        </h1>
        <p className="text-foreground/60 max-w-lg mx-auto text-lg">
          Choose your state, election type & year. Unlock missions, collect XP, and master the Indian electoral process.
        </p>
      </motion.div>

      {/* ── FORM ── */}
      <motion.form
        onSubmit={generateTimeline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative glass rounded-2xl p-6 md:p-8 mb-12 border border-primary/20"
      >
        {/* game corner ornament */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-primary/50 rounded-tl" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-primary/50 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-primary/50 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-primary/50 rounded-br" />

        <p className="text-xs font-bold text-primary/60 tracking-widest uppercase mb-5 text-center">— SELECT YOUR MISSION PARAMETERS —</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* State */}
          <div>
            <label className="block text-xs font-bold mb-2 text-foreground/60 tracking-wider uppercase">
              <MapPin className="inline w-3.5 h-3.5 mr-1 text-primary" />Region
            </label>
            <div className="relative">
              <select
                required value={state} onChange={e => setState(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer font-semibold"
                aria-label="State or Union Territory"
              >
                <option value="">Select State / UT</option>
                {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Election Type */}
          <div>
            <label className="block text-xs font-bold mb-2 text-foreground/60 tracking-wider uppercase">
              <Calendar className="inline w-3.5 h-3.5 mr-1 text-primary" />Election Type
            </label>
            <div className="relative">
              <select
                required value={electionType} onChange={e => setElectionType(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer font-semibold"
                aria-label="Election Type"
              >
                <option value="">Select Type</option>
                {ELECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-bold mb-2 text-foreground/60 tracking-wider uppercase">
              <Clock className="inline w-3.5 h-3.5 mr-1 text-primary" />Year
            </label>
            <div className="relative">
              <select
                required value={year} onChange={e => setYear(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer font-semibold"
                aria-label="Election Year"
              >
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary px-10 py-3 font-bold tracking-widest flex items-center gap-2 uppercase text-sm"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating missions…</>
            ) : (
              <><Zap className="w-5 h-5" /> Launch Mission Map</>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* ── ERROR ── */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl px-6 py-4 mb-10"
          role="alert"
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* ── MISSION MAP ── */}
      <AnimatePresence>
        {timeline.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* XP Header bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-primary/20 rounded-2xl p-4 mb-10 flex flex-wrap items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 font-bold tracking-wider uppercase">Mission Zone</p>
                  <p className="font-bold text-sm">{state} · {electionType} · {year}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-foreground/50 font-bold tracking-wider uppercase">Missions</p>
                  <p className="font-bold text-lg">{completedSet.size}<span className="text-foreground/40 text-sm">/{timeline.length}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/50 font-bold tracking-wider uppercase">Total XP</p>
                  <p className="font-bold text-lg text-yellow-400">{earnedInSession} <span className="text-xs text-foreground/50">/ {totalPossibleXP}</span></p>
                </div>
                <div className="w-24">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground/40">Progress</span>
                    <span className="text-primary font-bold">{xpPercent}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission path */}
            <div className="relative">
              {/* Dashed path line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 hidden md:block"
                style={{
                  background: "repeating-linear-gradient(to bottom, rgba(108,99,255,0.4) 0px, rgba(108,99,255,0.4) 8px, transparent 8px, transparent 16px)"
                }}
              />

              <div className="space-y-6">
                {timeline.map((event, index) => {
                  const meta = MISSION_META[index % MISSION_META.length];
                  const isCompleted = completedSet.has(index);
                  const isOpen = unlockedIdx === index;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12, duration: 0.4 }}
                      className="relative md:pl-20"
                    >
                      {/* Step node */}
                      <motion.div
                        className={`hidden md:flex absolute left-0 top-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} items-center justify-center text-white shadow-lg ${meta.glow} flex-col gap-0.5 z-10`}
                        animate={isCompleted ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        {isCompleted
                          ? <CheckCircle2 className="w-7 h-7" />
                          : meta.icon}
                        <span className="text-[9px] font-black tracking-widest opacity-80">
                          {isCompleted ? "DONE" : `+${meta.xp}XP`}
                        </span>
                      </motion.div>

                      {/* Mission card */}
                      <motion.div
                        layout
                        className={`
                          relative rounded-2xl border transition-all duration-300 overflow-hidden
                          ${isCompleted
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : isOpen
                              ? `border-primary/60 bg-primary/5 ring-2 ${meta.ring}`
                              : "glass border-border/40"}
                        `}
                      >
                        {/* Completed ribbon */}
                        {isCompleted && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold tracking-wider">
                              ✓ COMPLETE
                            </span>
                          </div>
                        )}

                        {/* Card header */}
                        <button
                          onClick={() => handleMissionClick(index)}
                          className="w-full text-left p-5 focus-visible:outline-none"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-start gap-4">
                            {/* Mobile badge */}
                            <div className={`md:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : meta.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black tracking-widest text-primary/70 uppercase">{meta.label}</span>
                                <span className="text-[10px] text-foreground/40">·</span>
                                <span className="text-[10px] font-bold text-yellow-400/80 tracking-wider">+{meta.xp} XP</span>
                              </div>
                              <h3 className={`font-black text-base md:text-lg leading-tight transition-colors ${isOpen ? "text-primary" : "text-foreground/90"}`}>
                                {event.title}
                              </h3>
                              <p className="text-sm font-semibold text-accent mt-1">📅 {event.date}</p>
                            </div>

                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="shrink-0 mt-1"
                            >
                              {isCompleted
                                ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                : <ChevronDown className="w-5 h-5 text-foreground/40" />}
                            </motion.div>
                          </div>
                        </button>

                        {/* Expanded mission briefing */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              id={`timeline-desc-${index}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 border-t border-border/30 pt-4">
                                {/* Briefing box */}
                                <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-4">
                                  <p className="text-xs font-bold text-foreground/40 tracking-widest uppercase mb-2">📋 Mission Briefing</p>
                                  <p className="text-sm text-foreground/80 leading-relaxed">{event.description}</p>
                                </div>

                                {/* Why it matters */}
                                <div className="bg-accent/8 border border-accent/20 rounded-xl p-4 mb-4">
                                  <p className="text-xs font-bold text-accent tracking-widest uppercase mb-2">⚡ Intel — Why This Matters</p>
                                  <p className="text-sm text-foreground/80 leading-relaxed">{event.why_it_matters}</p>
                                </div>

                                {/* Next action */}
                                <div className={`bg-gradient-to-r ${meta.color} bg-opacity-10 border border-white/10 rounded-xl p-4 mb-5`}>
                                  <p className="text-xs font-bold text-white/60 tracking-widest uppercase mb-2">🎯 Your Objective</p>
                                  <p className="text-sm text-white/90 font-semibold leading-relaxed">{event.next_action}</p>
                                </div>

                                {/* Complete mission button */}
                                {!isCompleted && (
                                  <motion.button
                                    onClick={() => completeMission(index)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase bg-gradient-to-r ${meta.color} text-white flex items-center justify-center gap-2 shadow-lg ${meta.glow}`}
                                  >
                                    <Flame className="w-4 h-4" />
                                    Mark Mission Complete · +{meta.xp} XP
                                  </motion.button>
                                )}

                                {isCompleted && (
                                  <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-bold text-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Mission Complete! +{meta.xp} XP earned
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── COMPLETION SCREEN ── */}
            <AnimatePresence>
              {completedSet.size === timeline.length && timeline.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180 }}
                  className="mt-12 relative glass border border-yellow-500/30 rounded-3xl p-8 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
                  <div className="text-7xl mb-4">🏆</div>
                  <h2 className="text-3xl font-black mb-2 text-yellow-400">All Missions Complete!</h2>
                  <p className="text-foreground/60 mb-6">You've mastered the election timeline for <span className="text-white font-bold">{state}</span>. You're ready to be a civic champion.</p>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-black text-yellow-400">{earnedInSession}</p>
                      <p className="text-xs text-foreground/50 uppercase tracking-wider">Total XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-emerald-400">{timeline.length}</p>
                      <p className="text-xs text-foreground/50 uppercase tracking-wider">Missions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-black text-cyan-400">100%</p>
                      <p className="text-xs text-foreground/50 uppercase tracking-wider">Complete</p>
                    </div>
                  </div>
                  <a href="/journey" className="btn-primary px-8 py-3 font-bold inline-flex items-center gap-2">
                    <Rocket className="w-5 h-5" /> Start Your Voter Journey
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
