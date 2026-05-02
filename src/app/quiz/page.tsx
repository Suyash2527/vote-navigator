"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCcw } from "lucide-react";

const quizQuestions = [
  { id: 1, text: "Are you 18 years or older?" },
  { id: 2, text: "Are you a citizen of this country?" },
  { id: 3, text: "Do you have a valid government-issued ID?" },
  { id: 4, text: "Are you currently registered to vote in your state/district?" },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsFinished(false);
  };

  const getResult = () => {
    const allYes = Object.values(answers).every(a => a === true);
    if (allYes) {
      return { status: "Ready to Vote", icon: <CheckCircle2 className="w-16 h-16 text-green-500" />, desc: "You are fully prepared for the upcoming election!" };
    } else {
      return { status: "Action Required", icon: <AlertCircle className="w-16 h-16 text-yellow-500" />, desc: "You need to complete some prerequisites before you can vote. Please check your journey map." };
    }
  };

  const progress = isFinished ? 100 : (currentQuestion / quizQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-12 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Readiness Quiz</h1>
        <p className="text-lg text-foreground/70">Find out if you are prepared to vote in under a minute.</p>
      </div>

      <div className="w-full bg-border rounded-full h-2 mb-12 overflow-hidden">
        <motion.div
          className="bg-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass dark:glass-dark rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-10">
              {quizQuestions[currentQuestion].text}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleAnswer(true)}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg hover:bg-primary/90 transition-transform active:scale-95"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-xl text-lg hover:bg-secondary/80 transition-transform active:scale-95"
              >
                No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass dark:glass-dark rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="flex justify-center mb-6">
              {getResult().icon}
            </div>
            <h2 className="text-3xl font-bold mb-4">{getResult().status}</h2>
            <p className="text-lg text-foreground/70 mb-8">{getResult().desc}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 border border-border flex items-center justify-center gap-2 font-semibold rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <RefreshCcw className="w-5 h-5" /> Retake Quiz
              </button>
              <a
                href="/journey"
                className="px-6 py-3 bg-primary text-primary-foreground flex items-center justify-center gap-2 font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Journey <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
