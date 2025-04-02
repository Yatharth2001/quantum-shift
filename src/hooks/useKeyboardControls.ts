import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useGameSound } from "./useGameSound";

export const useKeyboardControls = () => {
  const { energy, timeDirection, reality } = useGameStore();
  const { playRealityShift, playTimeReverse } = useGameSound();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const { movePlayer, switchReality, reverseTime, resetGame } =
        useGameStore.getState();

      // Prevent handling if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Game reset with R key when holding Ctrl
      if (e.ctrlKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetGame();
        return;
      }

      // Time manipulation with Shift
      if (e.key === "Shift" && energy >= 15) {
        e.preventDefault();
        reverseTime();
        playTimeReverse();
        return;
      }

      // Reality shift with Space
      if (e.code === "Space" && energy >= 10) {
        e.preventDefault();
        switchReality();
        playRealityShift();
        return;
      }

      // Movement based on current time direction and reality
      const moveAmount = reality === "quantum" ? 1.5 : 1;
      const effectiveDirection = timeDirection;

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          movePlayer(0, moveAmount * effectiveDirection);
          break;
        case "s":
        case "arrowdown":
          movePlayer(0, -moveAmount * effectiveDirection);
          break;
        case "a":
        case "arrowleft":
          movePlayer(-moveAmount * effectiveDirection, 0);
          break;
        case "d":
        case "arrowright":
          movePlayer(moveAmount * effectiveDirection, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [energy, timeDirection, reality, playRealityShift, playTimeReverse]);
};
