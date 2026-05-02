"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface JourneyStep {
  title: string;
  description: string;
  action_required: string;
}

export default function JourneyPage() {
  const [persona, setPersona] = useState<string | null>(null);
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("voterPersona");
    if (!p) {
      router.push("/");
      return;
    }
    setPersona(p);
    
    // Fetch journey steps from our API
    fetch("/api/generate-journey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: p }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.steps) {
          setSteps(data.steps);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to generate journey", err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-foreground/70 animate-pulse">Generating your personalized election journey...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">Your Election Journey</h1>
        <p className="text-lg text-foreground/70">
          Follow these personalized steps based on your profile to ensure you're ready for election day.
        </p>
      </motion.div>

      <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 space-y-8">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[11px] top-1 bg-background rounded-full">
                {activeStep === index ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-border" />
                )}
              </div>

              <div
                className={`glass dark:glass-dark rounded-xl p-6 cursor-pointer transition-all ${
                  activeStep === index ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
                }`}
                onClick={() => setActiveStep(activeStep === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <motion.div
                    animate={{ rotate: activeStep === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 text-foreground/50" />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border/50 text-foreground/80 space-y-4">
                        <p>{step.description}</p>
                        <div className="bg-primary/5 p-4 rounded-lg flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-sm font-semibold text-foreground">Action Required</strong>
                            <span className="text-sm">{step.action_required}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
