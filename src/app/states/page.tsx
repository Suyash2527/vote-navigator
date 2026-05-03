"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Crown, Users, Trophy, ChevronDown, Shield, Star, Zap, Flag } from "lucide-react";

interface StateData {
  name: string;
  capital: string;
  cm: string;
  rulingParty: string;
  alliance: string;
  allColor: string;
  majorParties: string[];
  lastElection: number;
  nextElection: number;
  seats: number;
  emoji: string;
  region: string;
}

const STATES: StateData[] = [
  { name: "Andhra Pradesh", capital: "Amaravati", cm: "N. Chandrababu Naidu", rulingParty: "TDP", alliance: "NDA (TDP+BJP+JSP)", allColor: "from-yellow-500 to-amber-600", majorParties: ["TDP", "BJP", "JSP", "YSRCP", "Congress"], lastElection: 2024, nextElection: 2029, seats: 175, emoji: "🌴", region: "South" },
  { name: "Arunachal Pradesh", capital: "Itanagar", cm: "Pema Khandu", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "JD(U)", "NPP", "Congress"], lastElection: 2024, nextElection: 2029, seats: 60, emoji: "🏔️", region: "Northeast" },
  { name: "Assam", capital: "Dispur", cm: "Himanta Biswa Sarma", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "AGP", "UPPL", "Congress", "AIUDF"], lastElection: 2021, nextElection: 2026, seats: 126, emoji: "🍵", region: "Northeast" },
  { name: "Bihar", capital: "Patna", cm: "Nitish Kumar", rulingParty: "JD(U)", alliance: "NDA (JD(U)+BJP)", allColor: "from-orange-500 to-red-600", majorParties: ["JD(U)", "BJP", "RJD", "Congress", "HAM"], lastElection: 2020, nextElection: 2025, seats: 243, emoji: "🕌", region: "East" },
  { name: "Chhattisgarh", capital: "Raipur", cm: "Vishnu Deo Sai", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "Janata Congress"], lastElection: 2023, nextElection: 2028, seats: 90, emoji: "🌿", region: "Central" },
  { name: "Goa", capital: "Panaji", cm: "Pramod Sawant", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "Goa Forward", "MGP", "AAP"], lastElection: 2022, nextElection: 2027, seats: 40, emoji: "🏖️", region: "West" },
  { name: "Gujarat", capital: "Gandhinagar", cm: "Bhupendra Patel", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "AAP", "Samajwadi Party"], lastElection: 2022, nextElection: 2027, seats: 182, emoji: "🦁", region: "West" },
  { name: "Haryana", capital: "Chandigarh", cm: "Nayab Singh Saini", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "JJP", "INLD", "AAP"], lastElection: 2024, nextElection: 2029, seats: 90, emoji: "🌾", region: "North" },
  { name: "Himachal Pradesh", capital: "Shimla", cm: "Sukhvinder Singh Sukhu", rulingParty: "Congress", alliance: "INDIA Alliance", allColor: "from-blue-500 to-indigo-600", majorParties: ["Congress", "BJP", "CPI(M)"], lastElection: 2022, nextElection: 2027, seats: 68, emoji: "🏔️", region: "North" },
  { name: "Jharkhand", capital: "Ranchi", cm: "Hemant Soren", rulingParty: "JMM", alliance: "INDIA Alliance (JMM+Congress+RJD)", allColor: "from-blue-500 to-indigo-600", majorParties: ["JMM", "Congress", "RJD", "BJP", "AJSU"], lastElection: 2024, nextElection: 2029, seats: 81, emoji: "⛏️", region: "East" },
  { name: "Karnataka", capital: "Bengaluru", cm: "Siddaramaiah", rulingParty: "Congress", alliance: "INDIA Alliance", allColor: "from-blue-500 to-indigo-600", majorParties: ["Congress", "BJP", "JD(S)"], lastElection: 2023, nextElection: 2028, seats: 224, emoji: "🏯", region: "South" },
  { name: "Kerala", capital: "Thiruvananthapuram", cm: "Pinarayi Vijayan", rulingParty: "CPI(M)", alliance: "LDF (Left Democratic Front)", allColor: "from-red-600 to-rose-700", majorParties: ["CPI(M)", "CPI", "Congress", "IUML", "BJP"], lastElection: 2021, nextElection: 2026, seats: 140, emoji: "🌴", region: "South" },
  { name: "Madhya Pradesh", capital: "Bhopal", cm: "Mohan Yadav", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "SP", "BSP"], lastElection: 2023, nextElection: 2028, seats: 230, emoji: "🐯", region: "Central" },
  { name: "Maharashtra", capital: "Mumbai", cm: "Devendra Fadnavis", rulingParty: "BJP", alliance: "Mahayuti (BJP+Shiv Sena(S)+NCP(AP))", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Shiv Sena (S)", "NCP (AP)", "Congress", "Shiv Sena (UBT)", "NCP (SP)"], lastElection: 2024, nextElection: 2029, seats: 288, emoji: "🏙️", region: "West" },
  { name: "Manipur", capital: "Imphal", cm: "N. Biren Singh", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "NPF", "Congress", "NPP"], lastElection: 2022, nextElection: 2027, seats: 60, emoji: "🌺", region: "Northeast" },
  { name: "Meghalaya", capital: "Shillong", cm: "Conrad Sangma", rulingParty: "NPP", alliance: "MDA Coalition", allColor: "from-green-500 to-teal-600", majorParties: ["NPP", "UDP", "BJP", "VPP", "Congress"], lastElection: 2023, nextElection: 2028, seats: 60, emoji: "☁️", region: "Northeast" },
  { name: "Mizoram", capital: "Aizawl", cm: "Lalduhoma", rulingParty: "ZPM", alliance: "ZPM", allColor: "from-purple-500 to-violet-600", majorParties: ["ZPM", "MNF", "Congress", "BJP"], lastElection: 2023, nextElection: 2028, seats: 40, emoji: "🌄", region: "Northeast" },
  { name: "Nagaland", capital: "Kohima", cm: "Neiphiu Rio", rulingParty: "NDPP", alliance: "NDA (NDPP+BJP)", allColor: "from-orange-500 to-red-600", majorParties: ["NDPP", "BJP", "NPF", "NPPF"], lastElection: 2023, nextElection: 2028, seats: 60, emoji: "🦅", region: "Northeast" },
  { name: "Odisha", capital: "Bhubaneswar", cm: "Mohan Majhi", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "BJD", "Congress", "CPI(M)"], lastElection: 2024, nextElection: 2029, seats: 147, emoji: "🛕", region: "East" },
  { name: "Punjab", capital: "Chandigarh", cm: "Bhagwant Mann", rulingParty: "AAP", alliance: "AAP", allColor: "from-cyan-500 to-blue-600", majorParties: ["AAP", "Congress", "BJP", "SAD", "BSP"], lastElection: 2022, nextElection: 2027, seats: 117, emoji: "🌾", region: "North" },
  { name: "Rajasthan", capital: "Jaipur", cm: "Bhajanlal Sharma", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "RLP", "BSP"], lastElection: 2023, nextElection: 2028, seats: 200, emoji: "🏜️", region: "North" },
  { name: "Sikkim", capital: "Gangtok", cm: "Prem Singh Tamang", rulingParty: "SKM", alliance: "SKM+NDA", allColor: "from-orange-500 to-red-600", majorParties: ["SKM", "SDF", "BJP"], lastElection: 2024, nextElection: 2029, seats: 32, emoji: "🏔️", region: "Northeast" },
  { name: "Tamil Nadu", capital: "Chennai", cm: "M.K. Stalin", rulingParty: "DMK", alliance: "INDIA Alliance (DMK+Congress+others)", allColor: "from-blue-500 to-indigo-600", majorParties: ["DMK", "Congress", "AIADMK", "BJP", "PMK", "MDMK"], lastElection: 2021, nextElection: 2026, seats: 234, emoji: "🏛️", region: "South" },
  { name: "Telangana", capital: "Hyderabad", cm: "A. Revanth Reddy", rulingParty: "Congress", alliance: "INDIA Alliance", allColor: "from-blue-500 to-indigo-600", majorParties: ["Congress", "BRS", "BJP", "AIMIM", "CPI"], lastElection: 2023, nextElection: 2028, seats: 119, emoji: "💎", region: "South" },
  { name: "Tripura", capital: "Agartala", cm: "Manik Saha", rulingParty: "BJP", alliance: "NDA (BJP+TIPRA)", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "TIPRA Motha", "CPI(M)", "Congress"], lastElection: 2023, nextElection: 2028, seats: 60, emoji: "🌿", region: "Northeast" },
  { name: "Uttar Pradesh", capital: "Lucknow", cm: "Yogi Adityanath", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "SP", "BSP", "Congress", "RLD"], lastElection: 2022, nextElection: 2027, seats: 403, emoji: "🕌", region: "North" },
  { name: "Uttarakhand", capital: "Dehradun", cm: "Pushkar Singh Dhami", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "Congress", "BSP", "AAP"], lastElection: 2022, nextElection: 2027, seats: 70, emoji: "🏔️", region: "North" },
  { name: "West Bengal", capital: "Kolkata", cm: "Mamata Banerjee", rulingParty: "TMC", alliance: "TMC", allColor: "from-emerald-500 to-green-600", majorParties: ["TMC", "BJP", "Congress", "CPI(M)"], lastElection: 2021, nextElection: 2026, seats: 294, emoji: "🐯", region: "East" },
  // UTs with legislatures
  { name: "Delhi (NCT)", capital: "New Delhi", cm: "Rekha Gupta", rulingParty: "BJP", alliance: "NDA", allColor: "from-orange-500 to-red-600", majorParties: ["BJP", "AAP", "Congress"], lastElection: 2025, nextElection: 2030, seats: 70, emoji: "🏛️", region: "North" },
  { name: "Jammu & Kashmir", capital: "Srinagar / Jammu", cm: "Omar Abdullah", rulingParty: "NC", alliance: "INDIA Alliance (NC+Congress)", allColor: "from-blue-500 to-indigo-600", majorParties: ["NC", "Congress", "BJP", "PDP", "Apni Party"], lastElection: 2024, nextElection: 2029, seats: 90, emoji: "❄️", region: "North" },
  { name: "Puducherry", capital: "Puducherry", cm: "N. Rangasamy", rulingParty: "AINRC", alliance: "NDA (AINRC+BJP)", allColor: "from-orange-500 to-red-600", majorParties: ["AINRC", "BJP", "Congress", "DMK"], lastElection: 2021, nextElection: 2026, seats: 30, emoji: "🌊", region: "South" },
];

const REGIONS = ["All", "North", "South", "East", "West", "Central", "Northeast"];

const ALLIANCE_COLORS: Record<string, string> = {
  "NDA": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "INDIA Alliance": "text-blue-400 bg-blue-400/10 border-blue-400/30",
  "LDF": "text-red-400 bg-red-400/10 border-red-400/30",
  "TMC": "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  "AAP": "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  "ZPM": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  "SKM": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "NPP": "text-teal-400 bg-teal-400/10 border-teal-400/30",
};

function getAllianceStyle(alliance: string) {
  for (const key of Object.keys(ALLIANCE_COLORS)) {
    if (alliance.includes(key)) return ALLIANCE_COLORS[key];
  }
  return "text-foreground/60 bg-white/5 border-border/30";
}

export default function StatesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = STATES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.cm.toLowerCase().includes(search.toLowerCase()) ||
      s.rulingParty.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "All" || s.region === region;
    return matchSearch && matchRegion;
  });

  const ndaCount = STATES.filter(s => s.alliance.includes("NDA")).length;
  const indiaCount = STATES.filter(s => s.alliance.includes("INDIA")).length;
  const otherCount = STATES.length - ndaCount - indiaCount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-5 border border-primary/20 tracking-wider">
          <Flag className="w-4 h-4" /> POLITICAL MAP OF INDIA · राज्य अन्वेषण
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          State <span className="gradient-text">Power Map</span>
        </h1>
        <p className="text-foreground/60 max-w-xl mx-auto text-lg">
          Explore every Indian state — who governs, which parties dominate, and when the next election battle is.
        </p>
      </motion.div>

      {/* Alliance Scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-10"
      >
        {[
          { label: "NDA Governed", count: ndaCount, color: "from-orange-500/20 to-red-600/10", border: "border-orange-500/30", text: "text-orange-400", icon: "🏵️" },
          { label: "INDIA Alliance", count: indiaCount, color: "from-blue-500/20 to-indigo-600/10", border: "border-blue-500/30", text: "text-blue-400", icon: "🤝" },
          { label: "Independent / Others", count: otherCount, color: "from-emerald-500/20 to-teal-600/10", border: "border-emerald-500/30", text: "text-emerald-400", icon: "⚡" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`glass rounded-2xl p-4 text-center border ${s.border} bg-gradient-to-br ${s.color}`}
          >
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className={`text-3xl font-black ${s.text}`}>{s.count}</div>
            <div className="text-xs text-foreground/50 font-bold tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search state, CM, or party..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                region === r
                  ? "bg-primary text-white border-primary"
                  : "glass border-border/40 text-foreground/60 hover:border-primary/40"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-foreground/40 font-bold tracking-wider mb-6">
        SHOWING {filtered.length} STATES / UTs
      </p>

      {/* State cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((state, i) => {
            const isOpen = expanded === state.name;
            const allianceStyle = getAllianceStyle(state.alliance);
            return (
              <motion.div
                key={state.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className={`glass rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? "border-primary/50 ring-1 ring-primary/20" : "border-border/40 hover:border-primary/30"}`}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setExpanded(isOpen ? null : state.name)}
                  className="w-full text-left p-5 focus-visible:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    {/* Emoji badge */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${state.allColor} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                      {state.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-base">{state.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${allianceStyle}`}>
                          {state.rulingParty}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span className="text-sm text-foreground/70 truncate">{state.cm}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-foreground/30 shrink-0" />
                        <span className="text-xs text-foreground/40">{state.capital}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-foreground/40 mb-1">Next Election</div>
                      <div className="font-black text-accent text-sm">{state.nextElection}</div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="mt-2 flex justify-end">
                        <ChevronDown className="w-4 h-4 text-foreground/40" />
                      </motion.div>
                    </div>
                  </div>
                </button>

                {/* Expanded panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/20 pt-4 space-y-4">
                        {/* Alliance banner */}
                        <div className={`text-xs font-bold px-3 py-2 rounded-lg border ${allianceStyle} text-center tracking-wider`}>
                          ⚑ {state.alliance}
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Assembly Seats", value: state.seats, icon: <Users className="w-3.5 h-3.5" /> },
                            { label: "Last Election", value: state.lastElection, icon: <Star className="w-3.5 h-3.5" /> },
                            { label: "Next Election", value: state.nextElection, icon: <Zap className="w-3.5 h-3.5" /> },
                          ].map(stat => (
                            <div key={stat.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
                              <div className="flex justify-center text-primary mb-1">{stat.icon}</div>
                              <div className="font-black text-sm">{stat.value}</div>
                              <div className="text-[10px] text-foreground/40 mt-0.5">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Major parties */}
                        <div>
                          <p className="text-[10px] font-bold text-foreground/40 tracking-widest uppercase mb-2 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Major Political Parties
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {state.majorParties.map((party, pi) => (
                              <span
                                key={party}
                                className={`text-xs px-2.5 py-1 rounded-lg font-bold border ${pi === 0 ? "border-primary/40 text-primary bg-primary/10" : "border-border/30 text-foreground/60 bg-white/3"}`}
                              >
                                {pi === 0 && "👑 "}{party}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Region tag */}
                        <div className="flex items-center gap-2 text-xs text-foreground/40">
                          <MapPin className="w-3 h-3" />
                          <span className="font-bold">{state.region} India</span>
                          <span>·</span>
                          <span>Capital: <span className="text-foreground/60">{state.capital}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-foreground/40">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-bold">No states found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
