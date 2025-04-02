import { create } from "zustand";
import { generateMathPuzzle } from "@/lib/math/puzzleGenerator";
import { soundManager } from "@/lib/sound/soundManager";

interface GameState {
  reality: "normal" | "quantum";
  energy: number;
  position: { x: number; y: number };
  gravityDirection: 1 | -1;
  timeDirection: 1 | -1;
  score: number;
  currentPuzzle: {
    question: string;
    answer: number;
    solved: boolean;
  } | null;

  // Actions
  switchReality: () => void;
  movePlayer: (dx: number, dy: number) => void;
  flipGravity: () => void;
  reverseTime: () => void;
  generateNewPuzzle: () => void;
  solvePuzzle: (answer: number) => boolean;
  useEnergy: (amount: number) => boolean;
  resetGame: () => void;
  setPuzzle: (question: string, answer: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  reality: "normal",
  energy: 100,
  position: { x: 0, y: 0 },
  gravityDirection: 1,
  timeDirection: 1,
  score: 0,
  currentPuzzle: null,

  switchReality: () =>
    set((state) => {
      if (state.energy >= 10) {
        soundManager.playSound("realityShift");
        return {
          reality: state.reality === "normal" ? "quantum" : "normal",
          energy: state.energy - 10,
        };
      }
      return state;
    }),

  movePlayer: (dx, dy) =>
    set((state) => ({
      position: {
        x: state.position.x + dx,
        y: state.position.y + dy * state.gravityDirection,
      },
    })),

  flipGravity: () =>
    set((state) => {
      if (state.energy >= 5) {
        return {
          gravityDirection: (state.gravityDirection * -1) as 1 | -1,
          energy: state.energy - 5,
        };
      }
      return state;
    }),

  reverseTime: () =>
    set((state) => {
      if (state.energy >= 15) {
        soundManager.playSound("timeReverse");
        return {
          timeDirection: (state.timeDirection * -1) as 1 | -1,
          energy: state.energy - 15,
        };
      }
      return state;
    }),

  generateNewPuzzle: () =>
    set((state) => {
      const puzzle = generateMathPuzzle(
        state.reality === "quantum",
        state.score
      );
      return {
        currentPuzzle: {
          ...puzzle,
          solved: false,
        },
      };
    }),

  solvePuzzle: (answer) => {
    const state = get();
    if (!state.currentPuzzle) return false;
    const correct = Math.abs(answer - state.currentPuzzle.answer) < 0.001;
  
    if (correct) {
      soundManager.playSound("puzzleSolved");
      // Generate a new puzzle immediately when the current one is solved
      const newPuzzle = generateMathPuzzle(
        state.reality === "quantum",
        state.score + 100
      );
      set({
        score: state.score + 100,
        currentPuzzle: {
          ...newPuzzle,
          solved: false,
        },
        energy: Math.min(100, state.energy + 20),
      });
      return true;
    }
  
    return false;
  },

  useEnergy: (amount) => {
    const state = get();
    if (state.energy < amount) return false;
    set({ energy: state.energy - amount });
    return true;
  },

  resetGame: () =>
    set(() => ({
      reality: "normal",
      energy: 100,
      position: { x: 0, y: 0 },
      gravityDirection: 1,
      timeDirection: 1,
      score: 0,
      currentPuzzle: null,
    })),

  setPuzzle: (question, answer) =>
    set({
      currentPuzzle: { question, answer, solved: false },
    }),
}));

// Initialize the first puzzle
useGameStore.getState().generateNewPuzzle();
