"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, ChevronRight, Info, 
  AlertTriangle, Lightbulb, ArrowRight,
  ShieldCheck, Loader2, Sparkles, BookOpen, Zap,
  UserCheck, Globe, Medal
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

function JourneyContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "general";

  const [formData, setFormData] = useState({
    age: "",
    isRegistered: "",
    state: "",
    category: initialType,
    hasId: "yes"
  });
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const { addXP } = useGame();

  // Sync category with URL if it changes
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setFormData(prev => ({ ...prev, category: type }));
  }, [searchParams]);

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
    <div className="max-w-4xl mx-auto">
      {/* --- HEADER --- */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
        >
          <ShieldCheck className="w-4 h-4" /> Strategic Voter Mission
        </motion.div>
        <h1 className="text-5xl font-black mb-4 tracking-tighter">Your <span className="text-primary">Electoral Journey</span></h1>
        <p className="text-foreground/50 max-w-xl mx-auto text-lg">
          A precision-calibrated mission map for <span className="text-foreground font-black uppercase tracking-widest text-sm">{formData.category} Electors</span>.
        </p>
      </div>

      {steps.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Medal className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Voter Category</label>
                <select 
                  className="input-field w-full appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="general">General Elector (Resident)</option>
                  <option value="overseas">Overseas Elector (NRI)</option>
                  <option value="service">Service Elector (Armed Forces)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Registration Status</label>
                <select 
                  className="input-field w-full appearance-none"
                  value={formData.isRegistered}
                  onChange={e => setFormData({...formData, isRegistered: e.target.value})}
                >
                  <option value="">Select Status</option>
                  <option value="no">Not Registered</option>
                  <option value="yes">Already Registered</option>
                  <option value="unsure">Not Sure / Unverified</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Target State</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maharashtra"
                  className="input-field w-full"
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-1">Current Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 18"
                  className="input-field w-full"
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={generateJourney}
              disabled={loading}
              className="btn-premium w-full flex items-center justify-center gap-4 disabled:opacity-50 h-16 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> AUTHORIZING PROTOCOLS...
                </>
              ) : (
                <>
                  RECONSTRUCT MISSION MAP <Sparkles className="w-6 h-6 text-yellow-400" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* STICKY PROGRESS BAR */}
          <div className="sticky top-28 z-40 glass p-6 rounded-3xl border-primary/20 mb-12 shadow-2xl">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[11px] font-black tracking-[0.2em] uppercase text-foreground/60">Mission Compliance</span>
              </div>
              <span className="text-2xl font-black text-primary italic">{Math.round(progress)}%</span>
            </div>
            <div className="xp-bar-container !h-3">
              <motion.div 
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* STEPS LIST */}
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass rounded-[2rem] border transition-all duration-500 ${
                  step.completed ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_10px_30px_rgba(16,185,129,0.05)]" : "border-white/5 hover:border-white/10"
                }`}
                role="region"
                aria-label={`Step ${idx + 1}: ${step.title}`}
              >
                <div className="p-8">
                  <div className="flex items-start gap-8">
                    <button 
                      onClick={() => toggleStep(step.id)}
                      className={`mt-1 transition-all duration-500 hover:scale-125 ${
                        step.completed ? "text-emerald-500" : "text-foreground/10"
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-10 h-10" /> : <Circle className="w-10 h-10" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4 mb-3">
                         <h3 className={`text-2xl font-black tracking-tight ${step.completed ? "text-emerald-500" : ""}`}>
                           {step.title}
                         </h3>
                         <button 
                           onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                           className="p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                         >
                           <Info className={`w-5 h-5 ${expandedStep === step.id ? "text-primary" : "text-foreground/20"}`} />
                         </button>
                      </div>
                      
                      <p className="text-foreground/60 leading-relaxed mb-8 text-lg">
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5 mt-6">
                              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-2 text-primary mb-3">
                                  <Lightbulb className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Why it Matters</span>
                                </div>
                                <p className="text-xs text-foreground/50 leading-relaxed">{step.why_it_matters}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                <div className="flex items-center gap-2 text-danger mb-3">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Risk Factor</span>
                                </div>
                                <p className="text-xs text-foreground/50 leading-relaxed">{step.what_if_skipped}</p>
                              </div>
                              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                <div className="flex items-center gap-2 text-blue-500 mb-3">
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
                      <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <Zap className="w-6 h-6 text-primary animate-pulse" />
                          <div>
                             <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-1">Recommended Next Step</p>
                             <p className="font-black text-lg">{step.next_action}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TRUST & SOURCE SECTION */}
          <div className="mt-20 p-12 glass rounded-[3rem] border-white/5 text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10">
               <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/5">
                 <ShieldCheck className="w-10 h-10 text-primary" />
               </div>
               <h4 className="text-3xl font-black mb-4">Official ECI Protocol Verification</h4>
               <p className="text-foreground/40 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                 This mission map is dynamically generated using expert-tier AI calibrated against the **Representation of the People Act, 1951** and the latest **Election Commission of India (ECI)** procedural guidelines.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[11px] font-black tracking-widest uppercase">Direct Source: eci.gov.in</span>
                  </div>
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <span className="text-[11px] font-black tracking-widest uppercase">Last Verified: May 2024</span>
                  </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JourneyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 font-['Outfit']">
      <div className="mesh-gradient" />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
        <JourneyContent />
      </Suspense>
    </div>
  );
}
