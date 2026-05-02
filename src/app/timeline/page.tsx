"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Loader2, MapPin, ChevronDown, ChevronRight, Clock } from "lucide-react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal",
  // Union Territories
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

const stepColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

export default function TimelinePage() {
  const [state, setState] = useState("");
  const [electionType, setElectionType] = useState("");
  const [year, setYear] = useState("");
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const generateTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTimeline([]);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-accent mb-6 border border-accent/20">
          <Calendar className="w-4 h-4" /> भारत चुनाव टाइमलाइन · Election Timeline
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Key Dates, <span className="gradient-text">Your State / UT.</span>
        </h1>
        <p className="text-foreground/60 max-w-lg mx-auto">
          Select your Indian state or Union Territory and election type to instantly generate a personalised election calendar with key ECI milestones.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={generateTimeline}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 md:p-8 mb-14"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* State */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground/80">
              <MapPin className="inline w-4 h-4 mr-1 text-primary" />State / Union Territory
            </label>
            <div className="relative">
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select State / UT</option>
                {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Election Type */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground/80">
              <Calendar className="inline w-4 h-4 mr-1 text-primary" />Election Type
            </label>
            <div className="relative">
              <select
                required
                value={electionType}
                onChange={(e) => setElectionType(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select type</option>
                {ELECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground/80">
              <Clock className="inline w-4 h-4 mr-1 text-primary" />Year
            </label>
            <div className="relative">
              <select
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="input-field appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select year</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary w-full md:w-auto px-10 flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating timeline…</>
          ) : (
            <><Calendar className="w-5 h-5" /> Generate My Timeline</>
          )}
        </motion.button>
      </motion.form>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl px-6 py-4 mb-10"
        >
          {error}
        </motion.div>
      )}

      {/* Timeline */}
      <AnimatePresence>
        {timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-muted-foreground mb-8"
            >
              Showing election timeline for <span className="text-primary font-semibold">{state}</span> · {electionType} · {year}
            </motion.p>

            {/* Vertical timeline */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/60 via-accent/30 to-transparent hidden md:block" />

              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="relative mb-5 md:pl-16"
                >
                  {/* Dot */}
                  <div
                    className={`hidden md:flex absolute left-0 top-5 w-12 h-12 rounded-xl bg-gradient-to-br ${stepColors[index % stepColors.length]} items-center justify-center text-white font-bold text-sm shadow-lg`}
                  >
                    {index + 1}
                  </div>

                  {/* Card */}
                  <button
                    onClick={() => setExpandedIdx(expandedIdx === index ? null : index)}
                    className="w-full text-left glass glass-hover rounded-2xl p-5 border border-border/40 group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Mobile number badge */}
                        <div className={`md:hidden w-10 h-10 rounded-xl bg-gradient-to-br ${stepColors[index % stepColors.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-base md:text-lg text-foreground/90 group-hover:text-primary transition-colors">{event.title}</h3>
                          <p className="text-sm font-semibold text-accent mt-0.5">{event.date}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${expandedIdx === index ? "rotate-90" : ""}`}
                      />
                    </div>

                    <AnimatePresence>
                      {expandedIdx === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border/30 text-sm text-foreground/70 leading-relaxed">
                            {event.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
