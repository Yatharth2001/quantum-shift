import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { soundManager } from "@/lib/sound/soundManager";

export const useGameSound = () => {
  const { reality, timeDirection } = useGameStore();

  useEffect(() => {
    // Switch background music when reality changes
    soundManager.switchBackgroundMusic(reality);
  }, [reality]);

  useEffect(() => {
    // Play time reverse sound when time direction changes
    if (timeDirection === -1) {
      soundManager.playSound("timeReverse");
    }
  }, [timeDirection]);

  return {
    playPuzzleSolved: () => soundManager.playSound("puzzleSolved"),
    playRealityShift: () => soundManager.playSound("realityShift"),
    playTimeReverse: () => soundManager.playSound("timeReverse"),
    setMusicVolume: soundManager.setMusicVolume.bind(soundManager),
    setSFXVolume: soundManager.setSFXVolume.bind(soundManager),
  };
};
