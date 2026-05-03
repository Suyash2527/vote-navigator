"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface GameState {
  xp: number;
  level: number;
  rank: string;
  missionsCompleted: string[];
  badges: string[];
}

interface GameContextType {
  gameState: GameState;
  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  resetGame: () => void;
}

const INITIAL_STATE: GameState = {
  xp: 0,
  level: 1,
  rank: "Voter Intern",
  missionsCompleted: [],
  badges: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const RANKS = [
  { minLevel: 1, name: "Civic Learner" },
  { minLevel: 5, name: "Voter Apprentice" },
  { minLevel: 10, name: "Election Scout" },
  { minLevel: 20, name: "Democracy Guard" },
  { minLevel: 50, name: "Civic Champion" },
  { minLevel: 100, name: "Democracy Legend" },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("voteNavigator_gameState");
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load game state", e);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem("voteNavigator_gameState", JSON.stringify(gameState));
  }, [gameState]);

  const addXP = (amount: number) => {
    setGameState((prev) => {
      const newXP = prev.xp + amount;
      // Level up logic: Level = floor(sqrt(XP / 100)) + 1
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      
      const newRank = RANKS.reduce((acc, curr) => {
        if (newLevel >= curr.minLevel) return curr.name;
        return acc;
      }, prev.rank);

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        rank: newRank,
      };
    });
  };

  const completeMission = (missionId: string) => {
    setGameState((prev) => {
      if (prev.missionsCompleted.includes(missionId)) return prev;
      return {
        ...prev,
        missionsCompleted: [...prev.missionsCompleted, missionId],
      };
    });
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    localStorage.removeItem("voteNavigator_gameState");
  };

  return (
    <GameContext.Provider value={{ gameState, addXP, completeMission, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
