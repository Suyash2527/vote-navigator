"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Building2, Users, 
  History, Landmark, ArrowRight, ShieldCheck,
  Zap, Info, ExternalLink, Globe, FileText
} from "lucide-react";
import { ALL_STATES } from "@/data/states";

export default function StatesPage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<typeof ALL_STATES[0] | null>(null);

  const filteredStates = ALL_STATES.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 font-['Outfit']">
      <div className="mesh-gradient" />
      
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-bold mb-4 tracking-widest uppercase text-sm"
          >
            <ShieldCheck className="w-4 h-4" /> State Intelligence Briefing
          </motion.div>
          <h1 className="text-5xl font-black mb-6">Regional <span className="text-primary">Political Intel</span></h1>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text"
              placeholder="Search for a state or union territory..."
              aria-label="Search states"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-12 py-4 text-lg font-medium focus-ring"
            />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8" role="main">
          {/* --- STATES LIST --- */}
          <nav 
            className="lg:col-span-4 space-y-3 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar"
            aria-label="States list"
          >
            {filteredStates.map((state, idx) => (
              <motion.button
                key={state.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => setSelectedState(state)}
                aria-pressed={selectedState?.name === state.name}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 focus-ring ${
                  selectedState?.name === state.name 
                    ? "glass border-primary bg-primary/10 shadow-[0_0_20px_rgba(255,107,53,0.1)]" 
                    : "glass border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg mb-0.5">{state.name}</h3>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Hq: {state.capital}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${selectedState?.name === state.name ? "text-primary translate-x-1" : "text-foreground/20"}`} />
                </div>
              </motion.button>
            ))}
          </nav>

          {/* --- INTELLIGENCE DOSSIER --- */}
          <section className="lg:col-span-8" aria-live="polite">
            <AnimatePresence mode="wait">
              {selectedState ? (
                <motion.div
                  key={selectedState.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-[2.5rem] p-8 md:p-12 border-primary/20 relative overflow-hidden h-full shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Landmark className="w-64 h-64" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-6 mb-12">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                           <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
                             High Priority Sector
                           </span>
                           <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
                             {selectedState.seats} Lok Sabha Seats
                           </span>
                        </div>
                        <h2 className="text-6xl font-black mb-2 tracking-tighter">{selectedState.name}</h2>
                        <p className="text-2xl text-foreground/60 font-medium">Headquarters: {selectedState.capital}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-1">Dossier Status</p>
                        <div className="flex items-center gap-2 justify-end">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="font-black text-emerald-500 text-xs tracking-widest">LIVE DATA FEED</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-foreground/40">Next General Election</h4>
                        </div>
                        <p className="text-4xl font-black text-primary">{selectedState.next}</p>
                      </div>
                      <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-blue-500/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="w-5 h-5 text-blue-500" />
                          <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-foreground/40">Total LS Constituencies</h4>
                        </div>
                        <p className="text-4xl font-black">{selectedState.seats}</p>
                      </div>
                      <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-yellow-500/30 transition-colors md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-foreground/40">Major Political Entities</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {selectedState.parties.map(p => (
                            <span key={p} className="px-6 py-3 rounded-2xl bg-white/10 border border-white/10 font-black text-xs tracking-[0.1em] uppercase">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="btn-premium flex-1 !py-5 font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3">
                        <History className="w-4 h-4" /> RECONSTRUCT HISTORY
                      </button>
                      <button className="glass py-5 px-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-all hover:scale-105" aria-label="Official Website">
                        <ExternalLink className="w-6 h-6" />
                      </button>
                    </div>

                    {/* SOURCE SECTION */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-3 opacity-40">
                       <FileText className="w-4 h-4" />
                       <span className="text-[10px] font-black tracking-widest uppercase">Source: ECI Statistical Reports 2024 • Verified by AI Guide</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-[2.5rem] p-12 border-dashed border-white/10 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-8 border border-primary/10">
                    <Globe className="w-12 h-12 text-primary/40 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Initialize Sector Scan</h3>
                  <p className="text-foreground/40 max-w-sm leading-relaxed text-lg">Select a state from the intelligence feed to authorize deep-dive data retrieval.</p>
                </div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 53, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 53, 0.4);
        }
      `}</style>
    </div>
  );
}
