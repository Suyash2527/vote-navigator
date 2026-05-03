"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Zap, RefreshCcw, ArrowRight, CheckCircle2,
  XCircle, Clock, Flame, Target, Award, ChevronRight, Lock
} from "lucide-react";
import Link from "next/link";
import { useGame } from "@/lib/GameContext";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const ALL_QUESTIONS: Question[] = [
  {
    id: 1, category: "Basics", difficulty: "Easy", points: 10,
    question: "What is the minimum age to vote in Indian elections?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "The Constitution of India (Article 326) grants the right to vote to every Indian citizen who is 18 years of age or above."
  },
  {
    id: 2, category: "Documents", difficulty: "Easy", points: 10,
    question: "What is the full form of EPIC in Indian elections?",
    options: [
      "Election Photo Identity Card",
      "Electoral Polling Identity Certificate",
      "Election Process Identity Code",
      "Eligible Persons Identity Card"
    ],
    correct: 0,
    explanation: "EPIC stands for Electoral Photo Identity Card, commonly known as the Voter ID card issued by the Election Commission of India."
  },
  {
    id: 3, category: "Process", difficulty: "Medium", points: 20,
    question: "Which form is used for new voter registration in India?",
    options: ["Form 4", "Form 6", "Form 8", "Form 10"],
    correct: 1,
    explanation: "Form 6 is used for fresh enrollment or inclusion of name in the electoral roll. Form 8 is used for corrections to existing entries."
  },
  {
    id: 4, category: "ECI", difficulty: "Medium", points: 20,
    question: "What does MCC stand for during Indian elections?",
    options: [
      "Model Code of Conduct",
      "Mandatory Civic Commitment",
      "Multi-party Campaign Convention",
      "Minimum Candidate Criteria"
    ],
    correct: 0,
    explanation: "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI for political parties and candidates prior to elections."
  },
  {
    id: 5, category: "Technology", difficulty: "Medium", points: 20,
    question: "What is the purpose of VVPAT in Indian elections?",
    options: [
      "To count votes electronically",
      "To let voters verify their vote was correctly recorded",
      "To identify fraudulent voters",
      "To store voter data digitally"
    ],
    correct: 1,
    explanation: "Voter Verifiable Paper Audit Trail (VVPAT) is attached to EVMs and displays a paper slip showing the party symbol and candidate name for the voter to verify their choice."
  },
  {
    id: 6, category: "Rights", difficulty: "Easy", points: 10,
    question: "Which article of the Indian Constitution provides universal adult suffrage?",
    options: ["Article 324", "Article 326", "Article 329", "Article 332"],
    correct: 1,
    explanation: "Article 326 of the Indian Constitution provides for elections to the House of the People and to the Legislative Assemblies of States based on adult suffrage."
  },
  {
    id: 7, category: "Process", difficulty: "Hard", points: 30,
    question: "What is the voter helpline number in India?",
    options: ["100", "1800", "1950", "1100"],
    correct: 2,
    explanation: "1950 is the National Voter Service Portal helpline number, where citizens can get information about voter registration, polling booths, and election-related queries."
  },
  {
    id: 8, category: "ECI", difficulty: "Hard", points: 30,
    question: "Who appoints the Chief Election Commissioner of India?",
    options: [
      "The Prime Minister",
      "The President of India",
      "The Parliament",
      "The Supreme Court"
    ],
    correct: 1,
    explanation: "The Chief Election Commissioner and other Election Commissioners are appointed by the President of India under Article 324 of the Constitution."
  },
  {
    id: 9, category: "Technology", difficulty: "Medium", points: 20,
    question: "What does NOTA stand for on the EVM ballot?",
    options: [
      "No Official Territorial Alliance",
      "None of The Above",
      "Not On The Agenda",
      "National Open Tally Arrangement"
    ],
    correct: 1,
    explanation: "NOTA (None of The Above) was introduced in India in 2013 following a Supreme Court order, allowing voters to reject all candidates on the ballot."
  },
  {
    id: 10, category: "Basics", difficulty: "Hard", points: 30,
    question: "How many Lok Sabha constituencies are there in India?",
    options: ["442", "500", "543", "545"],
    correct: 2,
    explanation: "The Lok Sabha (House of the People) has 543 elected seats, representing constituencies from all states and union territories of India."
  },
  {
    id: 11, category: "Documents", difficulty: "Medium", points: 20,
    question: "Which document can be used as alternative ID proof at polling booths if Voter ID is lost?",
    options: [
      "Only Aadhaar Card",
      "Only Passport",
      "Any of the 12 alternative documents approved by ECI (like Passport, Aadhaar, PAN card)",
      "No alternative is allowed"
    ],
    correct: 2,
    explanation: "The ECI allows 12 alternative photo identity documents including Aadhaar, Passport, PAN Card, Driving Licence, MNREGS Job Card, etc. at polling booths."
  },
  {
    id: 12, category: "Rights", difficulty: "Hard", points: 30,
    question: "What is a Booth Level Officer (BLO) responsible for?",
    options: [
      "Operating the EVM machine",
      "Maintaining and updating the electoral roll for a specific polling booth area",
      "Providing security at polling booths",
      "Counting votes at the counting center"
    ],
    correct: 1,
    explanation: "A Booth Level Officer (BLO) is a government employee responsible for updating and verifying the electoral roll for a specific polling booth, typically covering 800-1200 voters."
  },
];

const DIFFICULTY_COLORS = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const CATEGORY_ICONS: Record<string, string> = {
  Basics: "🗳️",
  Documents: "📄",
  Process: "⚙️",
  ECI: "🏛️",
  Technology: "💻",
  Rights: "⚖️",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const QUIZ_DURATION = 30; // seconds per question

export default function QuizPage() {
  const [phase, setPhase] = useState<"start" | "playing" | "result">("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [timeBonus, setTimeBonus] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; timeTaken: number; points: number }[]>([]);
  const { addXP } = useGame();

  // Award XP on completion
  useEffect(() => {
    if (phase === "result") {
      addXP(score);
    }
  }, [phase, score, addXP]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || confirmed) return;
    if (timeLeft <= 0) {
      handleConfirm(true); // auto-submit on timeout
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, confirmed, timeLeft]);

  const startQuiz = () => {
    const shuffled = shuffle(ALL_QUESTIONS).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setTimeLeft(QUIZ_DURATION);
    setResults([]);
    setPhase("playing");
  };

  const handleConfirm = useCallback((timedOut = false) => {
    if (confirmed) return;
    setConfirmed(true);

    const q = questions[currentIdx];
    const isCorrect = !timedOut && selected === q.correct;
    const timeTaken = QUIZ_DURATION - timeLeft;
    const speedBonus = isCorrect ? Math.max(0, Math.floor((timeLeft / QUIZ_DURATION) * 10)) : 0;
    const newStreak = isCorrect ? streak + 1 : 0;
    const streakBonus = isCorrect && newStreak >= 2 ? (newStreak - 1) * 5 : 0;
    const earned = isCorrect ? q.points + speedBonus + streakBonus : 0;

    setTimeBonus(speedBonus + streakBonus);
    setStreak(newStreak);
    setMaxStreak(ms => Math.max(ms, newStreak));
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setScore(s => s + earned);
      if (newStreak >= 2) setShowStreak(true);
    } else {
      setStreak(0);
      setShowStreak(false);
    }
    setResults(r => [...r, { correct: isCorrect, timeTaken, points: earned }]);
  }, [confirmed, selected, questions, currentIdx, timeLeft, streak]);

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setConfirmed(false);
      setTimeLeft(QUIZ_DURATION);
      setShowStreak(false);
    } else {
      setPhase("result");
    }
  };

  const q = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx + (confirmed ? 1 : 0)) / questions.length) * 100 : 0;
  const maxScore = questions.reduce((s, q) => s + q.points + 10 + 15, 0);
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const getRank = () => {
    if (percentage >= 90) return { label: "Election Expert 🏆", color: "text-yellow-400" };
    if (percentage >= 70) return { label: "Civic Champion 🥇", color: "text-cyan-400" };
    if (percentage >= 50) return { label: "Informed Voter 📚", color: "text-green-400" };
    return { label: "Budding Citizen 🌱", color: "text-purple-400" };
  };

  const timerPct = (timeLeft / QUIZ_DURATION) * 100;
  const timerColor = timeLeft > 15 ? "var(--accent)" : timeLeft > 8 ? "var(--warning)" : "var(--danger)";

  // ─── START SCREEN ───
  if (phase === "start") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-8xl mb-6">🗳️</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text">Election Quiz</h1>
          <p className="text-foreground/60 text-lg mb-10 max-w-lg mx-auto">
            Test your knowledge of Indian elections, ECI processes, voter rights & more. Beat the clock. Build streaks. Earn bonus points!
          </p>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: "❓", label: "8 Questions" },
              { icon: "⏱️", label: "30s Per Q" },
              { icon: "🏆", label: "Score & Rank" },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 border border-border/30">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-sm font-semibold text-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Difficulty legend */}
          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            {(["Easy", "Medium", "Hard"] as const).map(d => (
              <span key={d} className={`text-xs font-bold px-3 py-1 rounded-full border ${DIFFICULTY_COLORS[d]}`}>{d}</span>
            ))}
            <span className="text-xs text-foreground/50">• Speed bonuses • Streak multipliers</span>
          </div>

          <motion.button
            onClick={startQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary px-12 py-4 text-lg font-bold gap-2 inline-flex items-center"
          >
            <Zap className="w-5 h-5" /> Start Quiz
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── RESULT SCREEN ───
  if (phase === "result") {
    const rank = getRank();
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Trophy header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {percentage >= 90 ? "🏆" : percentage >= 70 ? "🥇" : percentage >= 50 ? "📚" : "🌱"}
            </motion.div>
            <h2 className={`text-4xl font-black mb-2 ${rank.color}`}>{rank.label}</h2>
            <p className="text-foreground/60">Quiz Complete!</p>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Score", value: score, icon: <Star className="w-5 h-5 text-yellow-400" /> },
              { label: "Correct", value: `${correctCount}/${questions.length}`, icon: <CheckCircle2 className="w-5 h-5 text-green-400" /> },
              { label: "Accuracy", value: `${percentage}%`, icon: <Target className="w-5 h-5 text-cyan-400" /> },
              { label: "Max Streak", value: `🔥 ${maxStreak}`, icon: <Flame className="w-5 h-5 text-orange-400" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-4 text-center border border-border/30"
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-foreground/50 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Per-question breakdown */}
          <div className="glass rounded-2xl p-5 border border-border/30 mb-8">
            <h3 className="font-bold mb-4 text-sm text-foreground/70 uppercase tracking-wider">Question Breakdown</h3>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/5 shrink-0">{i + 1}</span>
                  {results[i]?.correct
                    ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span className="flex-1 truncate text-foreground/80">{q.question}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[q.difficulty]}`}>{q.difficulty}</span>
                  <span className="font-bold text-primary w-12 text-right">+{results[i]?.points ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={startQuiz}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 glass border border-border/40 rounded-xl font-semibold hover:border-primary/40 transition-colors"
            >
              <RefreshCcw className="w-5 h-5" /> Play Again
            </motion.button>
            <Link href="/journey">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center justify-center gap-2 px-6 py-3 font-semibold"
              >
                Start My Journey <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── PLAYING SCREEN ───
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
      {/* Top bar: progress + score + streak */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground/60">
            Q {currentIdx + 1}/{questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-orange-400 text-sm font-bold"
            >
              <Flame className="w-4 h-4" /> {streak}x
            </motion.div>
          )}
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star className="w-4 h-4" />
            <span className="text-sm">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden">
        <motion.div
          className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Timer */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-4 h-4 text-foreground/40 shrink-0" />
        <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-2 rounded-full transition-colors duration-500"
            style={{ backgroundColor: timerColor }}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>
        <span
          className="text-sm font-mono font-bold w-6 text-right"
          style={{ color: timerColor }}
        >
          {timeLeft}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category + difficulty badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">{CATEGORY_ICONS[q.category] ?? "❓"}</span>
            <span className="text-sm text-foreground/60 font-medium">{q.category}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ml-auto ${DIFFICULTY_COLORS[q.difficulty]}`}>
              {q.difficulty} · {q.points}pts
            </span>
          </div>

          {/* Question text */}
          <h2 className="text-xl md:text-2xl font-bold mb-6 leading-tight">{q.question}</h2>

          {/* Options */}
          <div className="grid gap-3 mb-6">
            {q.options.map((opt, i) => {
              let state: "default" | "selected" | "correct" | "wrong" | "reveal" = "default";
              if (confirmed) {
                if (i === q.correct) state = "correct";
                else if (i === selected) state = "wrong";
                else state = "reveal";
              } else if (selected === i) {
                state = "selected";
              }

              const stateStyles = {
                default: "glass border-border/40 hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
                selected: "border-primary bg-primary/10 cursor-pointer",
                correct: "border-green-500 bg-green-500/15",
                wrong: "border-red-500 bg-red-500/15",
                reveal: "glass border-border/20 opacity-50",
              };

              return (
                <motion.button
                  key={i}
                  onClick={() => !confirmed && setSelected(i)}
                  whileHover={!confirmed ? { scale: 1.01 } : {}}
                  whileTap={!confirmed ? { scale: 0.98 } : {}}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${stateStyles[state]}`}
                  disabled={confirmed}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    state === "correct" ? "bg-green-500 text-white"
                    : state === "wrong" ? "bg-red-500 text-white"
                    : state === "selected" ? "bg-primary text-white"
                    : "bg-white/10 text-foreground/60"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium">{opt}</span>
                  {state === "correct" && <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto shrink-0" />}
                  {state === "wrong" && <XCircle className="w-5 h-5 text-red-400 ml-auto shrink-0" />}
                </motion.button>
              );
            })}
          </div>

          {/* Confirm / Next */}
          <AnimatePresence>
            {!confirmed ? (
              <motion.button
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: selected !== null ? 1 : 0.5, y: 0 }}
                onClick={() => selected !== null && handleConfirm()}
                disabled={selected === null}
                className="w-full btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Answer <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Points earned */}
                <div className={`text-center p-3 rounded-xl font-bold text-lg ${
                  results[results.length - 1]?.correct
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {results[results.length - 1]?.correct ? (
                    <>
                      ✅ Correct! +{results[results.length - 1].points} pts
                      {timeBonus > 0 && <span className="text-sm ml-2 opacity-70">(incl. {timeBonus} bonus)</span>}
                    </>
                  ) : (
                    "❌ Wrong answer!"
                  )}
                </div>

                {/* Streak animation */}
                <AnimatePresence>
                  {showStreak && streak >= 2 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-center text-orange-400 font-black text-xl"
                    >
                      🔥 {streak}x STREAK! +{(streak - 1) * 5} bonus
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explanation */}
                <div className="glass border border-accent/20 rounded-xl p-4 text-sm text-foreground/80 leading-relaxed">
                  <span className="font-semibold text-accent">💡 Did you know? </span>
                  {q.explanation}
                </div>

                {/* Next button */}
                <motion.button
                  onClick={nextQuestion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-4 font-bold text-lg flex items-center justify-center gap-2"
                >
                  {currentIdx < questions.length - 1 ? (
                    <>Next Question <ChevronRight className="w-5 h-5" /></>
                  ) : (
                    <>See Results <Trophy className="w-5 h-5" /></>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
