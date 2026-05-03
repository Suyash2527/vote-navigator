"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Building2, Users, 
  History, Landmark, ArrowRight, ShieldCheck,
  Zap, Info, ExternalLink, Globe
} from "lucide-react";

const STATE_DATA = [
  {
    name: "Uttar Pradesh",
    capital: "Lucknow",
    government: "BJP",
    chiefMinister: "Yogi Adityanath",
    majorParties: ["BJP", "SP", "BSP", "INC"],
    totalSeats: 80,
    nextElection: "2027",
    color: "orange",
    desc: "India's most populous state and a key political battlefield."
  },
  {
    name: "Maharashtra",
    capital: "Mumbai",
    government: "Mahayuti (BJP + SS + NCP)",
    chiefMinister: "Eknath Shinde",
    majorParties: ["BJP", "Shiv Sena", "NCP", "INC", "SS (UBT)"],
    totalSeats: 48,
    nextElection: "2024",
    color: "blue",
    desc: "The financial powerhouse of India with a complex coalition landscape."
  },
  {
    name: "West Bengal",
    capital: "Kolkata",
    government: "AITC",
    chiefMinister: "Mamata Banerjee",
    majorParties: ["AITC", "BJP", "CPIM", "INC"],
    totalSeats: 42,
    nextElection: "2026",
    color: "green",
    desc: "A culturally rich state known for its passionate political discourse."
  },
  {
    name: "Tamil Nadu",
    capital: "Chennai",
    government: "DMK",
    chiefMinister: "M.K. Stalin",
    majorParties: ["DMK", "AIADMK", "BJP", "INC"],
    totalSeats: 39,
    nextElection: "2026",
    color: "red",
    desc: "A major player in regional politics with a strong Dravidian legacy."
  },
  {
    name: "Karnataka",
    capital: "Bengaluru",
    government: "INC",
    chiefMinister: "Siddaramaiah",
    majorParties: ["INC", "BJP", "JD(S)"],
    totalSeats: 28,
    nextElection: "2028",
    color: "yellow",
    desc: "India's tech hub with a history of swinging between major parties."
  }
];

export default function StatesPage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<typeof STATE_DATA[0] | null>(null);

  const filteredStates = STATE_DATA.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="mb-12">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full pl-12 py-4 text-lg font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- STATES LIST --- */}
          <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {filteredStates.map((state, idx) => (
              <motion.button
                key={state.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedState(state)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                  selectedState?.name === state.name 
                    ? "glass border-primary bg-primary/10" 
                    : "glass border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-xl mb-1">{state.name}</h3>
                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider">{state.capital}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <ArrowRight className={`w-5 h-5 transition-transform ${selectedState?.name === state.name ? "text-primary translate-x-1" : "text-foreground/20"}`} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* --- INTELLIGENCE DOSSIER --- */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedState ? (
                <motion.div
                  key={selectedState.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-[2rem] p-8 md:p-12 border-primary/20 relative overflow-hidden h-full"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Landmark className="w-48 h-48" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                             High Priority Sector
                           </div>
                           <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                             {selectedState.totalSeats} Seats
                           </div>
                        </div>
                        <h2 className="text-5xl font-black mb-2">{selectedState.name}</h2>
                        <p className="text-xl text-foreground/60 font-medium">Headquarters: {selectedState.capital}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2 justify-end">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="font-black text-emerald-500">MISSION ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-foreground/80 leading-relaxed mb-12 max-w-2xl">
                      {selectedState.desc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h4 className="font-black text-xs uppercase tracking-widest text-foreground/40">Current Government</h4>
                        </div>
                        <p className="text-2xl font-black">{selectedState.government}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="w-5 h-5 text-blue-500" />
                          <h4 className="font-black text-xs uppercase tracking-widest text-foreground/40">Chief Minister</h4>
                        </div>
                        <p className="text-2xl font-black">{selectedState.chiefMinister}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <h4 className="font-black text-xs uppercase tracking-widest text-foreground/40">Major Parties</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedState.majorParties.map(p => (
                            <span key={p} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 font-bold text-sm">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <Globe className="w-5 h-5 text-emerald-500" />
                          <h4 className="font-black text-xs uppercase tracking-widest text-foreground/40">Next Election</h4>
                        </div>
                        <p className="text-2xl font-black text-primary">{selectedState.nextElection}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="btn-primary flex-1 py-4 font-black tracking-widest uppercase text-sm flex items-center justify-center gap-2">
                        <History className="w-4 h-4" /> Political History
                      </button>
                      <button className="glass py-4 px-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-[2rem] p-12 border-dashed border-white/10 h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Globe className="w-20 h-20 text-foreground/20 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-black mb-2">Select a Sector</h3>
                  <p className="text-foreground/40 max-w-xs">Pick a state from the intelligence feed to view detailed political insights.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
