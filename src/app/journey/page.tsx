"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface JourneyStep {
  title: string;
  description: string;
  why_it_matters: string;
  next_action: string;
}

export default function JourneyPage() {
  const [persona, setPersona] = useState<string | null>(null);
  const [steps, setSteps] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError("Unable to connect to our civic assistant. Please check your internet connection or try again later.");
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" aria-hidden="true" />
        <p className="mt-4 text-foreground/70 animate-pulse">Generating your personalized election journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl max-w-lg text-center" role="alert">
          <h2 className="text-xl font-bold mb-2">We ran into a problem</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress
  const progress = steps.length > 0 ? ((activeStep !== null ? activeStep + 1 : 0) / steps.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4" id="journey-title">Your Election Journey</h1>
        <p className="text-lg text-foreground/70 mb-8">
          Follow these personalized steps based on your profile to ensure you're ready for election day. Click each step to learn more.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-background/50 rounded-full h-3 border border-border/30 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Journey progress">
          <motion.div 
            className="bg-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 space-y-8" role="list" aria-labelledby="journey-title">
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
                {activeStep === index || (activeStep !== null && index < activeStep) ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" aria-hidden="true" />
                ) : (
                  <Circle className="w-6 h-6 text-border" aria-hidden="true" />
                )}
              </div>

              <div
                role="listitem"
                className={`glass dark:glass-dark rounded-xl p-6 cursor-pointer transition-all ${
                  activeStep === index ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                tabIndex={0}
                aria-expanded={activeStep === index}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveStep(activeStep === index ? null : index);
                  }
                }}
                onClick={() => setActiveStep(activeStep === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    <span className="text-primary text-sm font-bold mr-2">Step {index + 1}</span> 
                    {step.title}
                  </h3>
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
                        <p className="text-foreground/90">{step.description}</p>
                        
                        <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg mt-4">
                          <strong className="block text-sm font-semibold text-accent mb-1">Why this matters:</strong>
                          <p className="text-sm">{step.why_it_matters}</p>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-lg flex items-start space-x-3 mt-4">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-sm font-semibold text-foreground">Next Action</strong>
                            <span className="text-sm">{step.next_action}</span>
                          </div>
                        </div>

                        {index < steps.length - 1 && (
                          <button 
                            className="mt-6 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStep(index + 1);
                            }}
                          >
                            Proceed to Next Step <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
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
