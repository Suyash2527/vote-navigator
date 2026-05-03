"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, BookOpen, Briefcase, Map, Heart, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const personas = [
  { id: "first-time", title: "Pehli Baar Voter", icon: User, desc: "Register your EPIC (Voter ID) and learn every step of your first vote.", color: "from-violet-500/20 to-purple-500/10", border: "hover:border-violet-500/40" },
  { id: "student", title: "Student Voter", icon: BookOpen, desc: "Studying away from home? Learn about voter registration transfers and postal ballots.", color: "from-blue-500/20 to-cyan-500/10", border: "hover:border-blue-500/40" },
  { id: "professional", title: "Kaam Karne Wala Nagrik", icon: Briefcase, desc: "Busy professional? Find out how to vote quickly and use postal ballot facilities.", color: "from-emerald-500/20 to-teal-500/10", border: "hover:border-emerald-500/40" },
  { id: "rural", title: "Gramin Matdata", icon: Map, desc: "Village voter? Find your nearest polling booth and Booth Level Officer (BLO).", color: "from-amber-500/20 to-orange-500/10", border: "hover:border-amber-500/40" },
  { id: "senior", title: "Vrishtha Nagarik", icon: Heart, desc: "Senior or differently-abled? Learn about home voting (PwD/80+) and assisted voting.", color: "from-rose-500/20 to-pink-500/10", border: "hover:border-rose-500/40" },
];

const features = [
  { icon: Sparkles, title: "AI-Powered Guidance", desc: "Personalised journey powered by Gemini AI, built for Indian voters." },
  { icon: Shield, title: "ECI-Accurate Info", desc: "Based on Election Commission of India (ECI) guidelines and Indian law." },
  { icon: Zap, title: "Instant Answers", desc: "Ask anything about EPIC, voter registration, EVMs, NOTA, and more." },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSelectPersona = (id: string) => {
    localStorage.setItem("voterPersona", id);
    router.push("/journey");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-bold text-primary mb-8 border border-primary/30 neon-border tracking-widest uppercase"
        >
          <Sparkles className="w-4 h-4" />
          ⚡ Powered by Gemini AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none"
        >
          <span className="gradient-text text-glow neon-text">Aapka Vote.</span>
          <br />
          <span className="text-foreground/90">Aapki Awaaz.</span>
          <br />
          <span className="gradient-text neon-text-cyan">Aapka Safar.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          VoteNavigator is your AI-powered civic assistant for Indian elections — guiding you through EPIC registration, Lok Sabha/Vidhan Sabha processes, booth locations, and everything the ECI requires, step by step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {user ? (
            <Link href="/journey" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              Continue My Journey <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign In
              </Link>
            </>
          )}
        </motion.div>

        {/* Features row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mt-16"
        >
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 text-sm text-foreground/50">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground/80">{f.title}</div>
                <div className="text-xs text-foreground/40">{f.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Persona selection */}
      <section className="px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase mb-4">
            🎮 SELECT YOUR VOTER CLASS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aap Kaun Hain? <span className="gradient-text">Personalise Karen.</span>
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Select your voter profile and we&apos;ll create a custom step-by-step guide tailored to the Indian electoral process.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto"
        >
          {personas.map((persona) => (
            <motion.button
              key={persona.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectPersona(persona.id)}
              className={`group glass glass-hover rounded-2xl p-6 text-left flex flex-col gap-4 border border-border/40 ${persona.border} transition-all duration-300`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                <persona.icon className="w-7 h-7 text-foreground/80" />
              </div>
              <div>
                <h3 className="text-base font-bold mb-1 group-hover:text-primary transition-colors">{persona.title}</h3>
                <p className="text-xs text-foreground/50 leading-relaxed">{persona.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary font-medium mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                Start journey <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* States Power Map teaser */}
      <section className="px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass game-corner rounded-3xl p-8 md:p-12 border border-accent/20 neon-border-cyan text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="text-5xl mb-4">🗺️</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-widest uppercase mb-4">
            NEW ZONE UNLOCKED
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10">
            India&apos;s <span className="neon-text-cyan" style={{color: "var(--accent)"}}>State Power Map</span>
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto mb-8 relative z-10">
            Explore every Indian state — Chief Ministers, ruling parties, major political players, assembly seat counts, and upcoming election battles. All in one place.
          </p>
          <Link href="/states" className="btn-primary px-8 py-3 font-bold inline-flex items-center gap-2 relative z-10 neon-border">
            <Map className="w-5 h-5" /> Explore State Power Map <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
