import { useState, useEffect } from "react";
import { soundManager } from "@/lib/sound/soundManager";
import { motion, AnimatePresence } from "framer-motion";

export const SoundControls = () => {
  const [showControls, setShowControls] = useState(false);
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [failedSounds, setFailedSounds] = useState<string[]>([]);

  useEffect(() => {
    const checkSoundStatus = async () => {
      await soundManager.waitForInitialization();
      setFailedSounds(soundManager.getFailedSounds());
    };
    checkSoundStatus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "v") {
        setShowControls((prev) => !prev);
      }
      // Volume controls
      if (showControls) {
        if (e.key === "ArrowUp") {
          setMusicVolume((prev) => Math.min(100, prev + 10));
        } else if (e.key === "ArrowDown") {
          setMusicVolume((prev) => Math.max(0, prev - 10));
        } else if (e.key === "ArrowRight") {
          setSfxVolume((prev) => Math.min(100, prev + 10));
        } else if (e.key === "ArrowLeft") {
          setSfxVolume((prev) => Math.max(0, prev - 10));
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showControls]);

  useEffect(() => {
    soundManager.setMusicVolume(musicVolume / 100);
  }, [musicVolume]);

  useEffect(() => {
    soundManager.setSFXVolume(sfxVolume / 100);
  }, [sfxVolume]);

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 p-4 bg-black/80 rounded-lg backdrop-blur-sm text-white"
        >
          <h3 className="text-lg font-bold mb-2">Sound Controls</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm">
                Music Volume ({musicVolume}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm">SFX Volume ({sfxVolume}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          {failedSounds.length > 0 && (
            <div className="mt-2 text-xs text-yellow-500">
              <p>Some sounds failed to load:</p>
              <ul className="list-disc list-inside">
                {failedSounds.map((sound) => (
                  <li key={sound}>{sound}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            Press V to toggle controls
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
