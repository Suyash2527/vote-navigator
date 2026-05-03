"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, ChevronRight, Info, 
  AlertTriangle, Lightbulb, ArrowRight,
  ShieldCheck, Loader2, Sparkles, BookOpen
} from "lucide-react";
import { useGame } from "@/lib/GameContext";

interface Step {
  id: string;
  title: string;
  description: string;
  why_it_matters: string;
  what_if_skipped: string;
  real_world_example: string;
  next_action: string;
  completed?: boolean;
}

export default function JourneyPage() {
  const [formData, setFormData] = useState({
    age: "",
    isRegistered: "",
    state: "",
    hasId: ""
  });
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const { addXP } = useGame();

  const generateJourney = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-journey", {
        method: "POST",
        body: JSON.stringify({ formData }),
      });
      const data = await res.json();
      setSteps(data.steps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === id) {
        if (!s.completed) addXP(150);
        return { ...s, completed: !s.completed };
      }
      return s;
    }));
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 font-['Outfit']">
      <div className="mesh-gradient" />
      
      <div className="max-w-4xl mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <ShieldCheck className="w-4 h-4" /> Personal Voter Mission
          </motion.div>
          <h1 className="text-5xl font-black mb-4">Your <span className="text-primary">Electoral Journey</span></h1>
          <p className="text-foreground/50 max-w-xl mx-auto text-lg">
            A precise, AI-guided protocol tailored to your specific status.
          </p>
        </div>

        {steps.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-10 rounded-[2.5rem] border-white/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-foreground/40 uppercase tracking-widest pl-1">Current Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 18"
                  className="input-field w-full"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-foreground/40 uppercase tracking-widest pl-1">Registration Status</label>
                <select 
                  className="input-field w-full appearance-none"
                  value={formData.isRegistered}
                  onChange={e => setFormData({...formData, isRegistered: e.target.value})}
                >
                  <option value="">Select Status</option>
                  <option value="no">Not Registered</option>
                  <option value="yes">Already Registered</option>
                  <option value="unsure">Not Sure</option>
                </select>
              </div>
            </div>

            <button 
              onClick={generateJourney}
              disabled={loading}
              className="btn-premium w-full flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> ANALYZING PROTOCOLS...
                </>
              ) : (
                <>
                  GENERATE MISSION MAP <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* STICKY PROGRESS BAR */}
            <div className="sticky top-28 z-40 glass p-6 rounded-2xl border-primary/20 mb-12 shadow-2xl">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black tracking-widest uppercase text-foreground/60">Mission Progress</span>
                </div>
                <span className="text-lg font-black text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="xp-bar-container">
                <motion.div 
                  className="xp-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* STEPS LIST */}
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`glass rounded-3xl border transition-all duration-300 ${
                    step.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5"
                  }`}
                  role="region"
                  aria-label={`Step ${idx + 1}: ${step.title}`}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-6">
                      <button 
                        onClick={() => toggleStep(step.id)}
                        className={`mt-1 transition-all duration-500 hover:scale-110 ${
                          step.completed ? "text-emerald-500" : "text-foreground/20"
                        }`}
                        aria-label={step.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {step.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4 mb-2">
                           <h3 className={`text-xl font-black ${step.completed ? "text-emerald-500" : ""}`}>
                             {step.title}
                           </h3>
                           <button 
                             onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                             className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                             aria-expanded={expandedStep === step.id}
                           >
                             <Info className={`w-5 h-5 ${expandedStep === step.id ? "text-primary" : "text-foreground/30"}`} />
                           </button>
                        </div>
                        
                        <p className="text-foreground/60 leading-relaxed mb-6">
                          {step.description}
                        </p>

                        <AnimatePresence>
                          {expandedStep === step.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5 mt-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-primary">
                                    <Lightbulb className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Why it Matters</span>
                                  </div>
                                  <p className="text-xs text-foreground/50 leading-relaxed">{step.why_it_matters}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-danger">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Risk Factor</span>
                                  </div>
                                  <p className="text-xs text-foreground/50 leading-relaxed">{step.what_if_skipped}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-blue-500">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Case Study</span>
                                  </div>
                                  <p className="text-xs text-foreground/50 leading-relaxed">{step.real_world_example}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* NEXT ACTION ENGINE */}
                        <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <Zap className="w-4 h-4 text-primary animate-pulse" />
                            <div>
                               <p className="text-[9px] font-black text-primary tracking-widest uppercase">Target Next Action</p>
                               <p className="font-bold text-sm">{step.next_action}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* TRUST & SOURCE SECTION */}
            <div className="mt-20 p-10 glass rounded-[2rem] border-white/5 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
               <div className="relative z-10">
                 <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
                 <h4 className="text-2xl font-black mb-4">Official Verification Info</h4>
                 <p className="text-foreground/40 text-sm max-w-xl mx-auto mb-8">
                   This mission map is generated using expert-tier AI calibrated against the **Representation of the People Act, 1951** and latest **Election Commission of India (ECI)** guidelines.
                 </p>
                 <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase">Source: eci.gov.in</span>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black tracking-widest uppercase">Verified: May 2024</span>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
