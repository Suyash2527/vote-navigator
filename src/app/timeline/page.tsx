"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Building2, Info, 
  ArrowRight, ShieldCheck, Loader2, Sparkles,
  AlertTriangle, Lightbulb, Zap, HelpCircle
} from "lucide-react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  why_it_matters: string;
  what_if_skipped: string;
  real_world_example: string;
  next_action: string;
}

export default function TimelinePage() {
  const [formData, setFormData] = useState({
    state: "",
    electionType: "Lok Sabha",
    year: "2024"
  });
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-timeline", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 font-['Outfit']">
      <div className="mesh-gradient" />
      
      <div className="max-w-5xl mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Calendar className="w-4 h-4" /> Constitutional Schedule
          </motion.div>
          <h1 className="text-5xl font-black mb-4">Election <span className="text-primary">Intelligence Map</span></h1>
          <p className="text-foreground/50 max-w-xl mx-auto text-lg">
            High-fidelity timeline of constitutional milestones and procedural deadlines.
          </p>
        </div>

        {/* --- CONFIG PANEL --- */}
        <div className="glass p-8 rounded-[2.5rem] border-white/5 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-2">Sector (State/UT)</label>
              <input 
                type="text"
                placeholder="e.g. Uttar Pradesh"
                className="input-field w-full"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-2">Mission Type</label>
              <select 
                className="input-field w-full appearance-none"
                value={formData.electionType}
                onChange={e => setFormData({...formData, electionType: e.target.value})}
              >
                <option value="Lok Sabha">Lok Sabha</option>
                <option value="Vidhan Sabha">Vidhan Sabha</option>
                <option value="Panchayat">Panchayat / Local</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest pl-2">Temporal Window (Year)</label>
              <input 
                type="text"
                className="input-field w-full"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={fetchTimeline}
            disabled={loading}
            className="btn-premium w-full flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING WITH ECI...
              </>
            ) : (
              <>
                RECONSTRUCT TIMELINE <Sparkles className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* --- TIMELINE DISPLAY --- */}
        {events.length > 0 && (
          <div className="space-y-12 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-[1px] before:bg-white/5 before:hidden md:before:block">
            {events.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative md:pl-20"
                role="region"
                aria-label={`Milestone: ${event.title}`}
              >
                {/* DATE BADGE */}
                <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 rounded-2xl glass border-primary/20 items-center justify-center text-center p-2 z-10 shadow-xl">
                   <p className="text-[10px] font-black leading-tight text-primary uppercase">
                     {event.date.split(" ")[0]}<br/>
                     <span className="text-foreground/40">{event.date.split(" ")[1] || ""}</span>
                   </p>
                </div>

                <div className="glass rounded-[2rem] p-8 md:p-10 border-white/5 relative overflow-hidden group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <span className="text-[10px] font-black text-primary tracking-widest uppercase mb-2 block">Milestone {idx + 1}</span>
                        <h3 className="text-3xl font-black">{event.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all text-xs font-black uppercase tracking-widest"
                           aria-expanded={expandedIdx === idx}
                         >
                           <HelpCircle className="w-4 h-4 text-primary" /> Explainability
                         </button>
                      </div>
                   </div>

                   <p className="text-foreground/60 text-lg leading-relaxed mb-8 max-w-3xl">
                     {event.description}
                   </p>

                   <AnimatePresence>
                     {expandedIdx === idx && (
                       <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                       >
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5 mt-8">
                            <div className="space-y-3">
                               <div className="flex items-center gap-2 text-primary">
                                 <Lightbulb className="w-5 h-5" />
                                 <span className="font-black text-[10px] uppercase tracking-widest">Why it Matters</span>
                               </div>
                               <p className="text-sm text-foreground/50 leading-relaxed italic">"{event.why_it_matters}"</p>
                            </div>
                            <div className="space-y-3">
                               <div className="flex items-center gap-2 text-danger">
                                 <AlertTriangle className="w-5 h-5" />
                                 <span className="font-black text-[10px] uppercase tracking-widest">Risk Analysis</span>
                               </div>
                               <p className="text-sm text-foreground/50 leading-relaxed italic">"{event.what_if_skipped}"</p>
                            </div>
                            <div className="space-y-3">
                               <div className="flex items-center gap-2 text-blue-500">
                                 <Building2 className="w-5 h-5" />
                                 <span className="font-black text-[10px] uppercase tracking-widest">Historical Precedent</span>
                               </div>
                               <p className="text-sm text-foreground/50 leading-relaxed italic">"{event.real_world_example}"</p>
                            </div>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   {/* SMART NEXT ACTION ENGINE */}
                   <div className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg">
                           <Zap className="w-6 h-6 text-primary animate-pulse" />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">Recommended Next Action</h4>
                            <p className="font-bold text-lg">{event.next_action}</p>
                         </div>
                      </div>
                      <button className="btn-premium !py-3 !px-6 text-xs flex items-center gap-2 shrink-0">
                         EXECUTE <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}

            {/* DISCLAIMER */}
            <div className="mt-20 p-8 glass rounded-[2rem] border-white/5 text-center">
               <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
               <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">Official Disclaimer</p>
               <p className="text-sm text-foreground/50 leading-relaxed max-w-2xl mx-auto">
                 Information presented here is for educational assistance only. Always refer to the official **Election Commission of India (ECI)** announcements for legally binding dates and procedures.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
