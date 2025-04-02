import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useGameSound } from "./useGameSound";

export const usePuzzleInteraction = () => {
  const [input, setInput] = useState("");
  const [showFeedback, setShowFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const {
    currentPuzzle,
    solvePuzzle,
    generateNewPuzzle,
    reality,
    timeDirection,
  } = useGameStore();
  const { playPuzzleSolved } = useGameSound();

  useEffect(() => {
    // Generate new puzzle if there isn't one
    if (!currentPuzzle) {
      generateNewPuzzle();
    }
  }, [currentPuzzle, generateNewPuzzle]);

  const handleSubmit = useCallback(
    (answer: number) => {
      if (!isNaN(answer)) {
        // If time is reversed, we need to reverse the number
        const adjustedAnswer =
          timeDirection === -1
            ? Number(answer.toString().split("").reverse().join(""))
            : answer;

        const correct = solvePuzzle(adjustedAnswer);
        setShowFeedback(correct ? "correct" : "incorrect");

        if (correct) {
          playPuzzleSolved();
          // Generate a new puzzle after a short delay
          setTimeout(generateNewPuzzle, 1500);
        }

        setInput("");
        setTimeout(() => setShowFeedback(null), 1500);
        return correct;
      }
      return false;
    },
    [solvePuzzle, playPuzzleSolved, generateNewPuzzle, timeDirection]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      // In reversed time, show the input reversed visually
      setInput(
        timeDirection === -1 ? value.split("").reverse().join("") : value
      );
    },
    [timeDirection]
  );

  useEffect(() => {
    setInput("");
    setShowFeedback(null);
  }, [timeDirection, currentPuzzle]);

  return {
    input,
    showFeedback,
    handleSubmit,
    handleInputChange,
    currentPuzzle,
    reality,
    timeDirection,
  };
};
