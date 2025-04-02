import { motion, AnimatePresence } from "framer-motion";
import { usePuzzleInteraction } from "@/hooks/usePuzzleInteraction";
import { useGameStore } from "@/stores/gameStore";

export const PuzzleInput = () => {
  const {
    input,
    showFeedback,
    handleSubmit,
    handleInputChange,
    currentPuzzle,
    reality,
    timeDirection,
  } = usePuzzleInteraction();

  const score = useGameStore((state) => state.score);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(parseFloat(input));
  };

  if (!currentPuzzle) return null;

  const reverseText = (text: string) => text.split("").reverse().join("");

  return (
    <>
      {/* Score Display */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-4 right-4 text-2xl font-bold 
          ${
            reality === "normal"
              ? "text-cyan-500 glow-cyan"
              : "text-fuchsia-500 glow-fuchsia"
          }
          bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm`}
      >
        Score: {timeDirection === 1 ? score : reverseText(score.toString())}
      </motion.div>

      {/* Puzzle Question */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`fixed top-20 left-1/2 transform -translate-x-1/2 
          text-white text-xl font-bold text-center
          bg-black/50 px-6 py-3 rounded-lg backdrop-blur-sm max-w-xl
          ${
            reality === "normal"
              ? "border-cyan-500/30"
              : "border-fuchsia-500/30"
          } border-2`}
      >
        {timeDirection === 1
          ? currentPuzzle.question
          : reverseText(currentPuzzle.question)}
      </motion.div>

      {/* Input Form */}
      <form
        onSubmit={onFormSubmit}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 items-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative"
        >
          <input
            type="number"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`bg-gray-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg border-2 
              transition-all duration-300 w-48 text-center font-mono text-lg
              ${
                reality === "normal"
                  ? "border-cyan-500 focus:border-cyan-300 focus:glow-cyan"
                  : "border-fuchsia-500 focus:border-fuchsia-300 focus:glow-fuchsia"
              }`}
            placeholder="Enter answer..."
          />

          {/* Feedback animation */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 
                  font-bold ${
                    showFeedback === "correct" ? "glow-green" : "glow-red"
                  }`}
              >
                {showFeedback === "correct" ? "Correct!" : "Try again"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
    </>
  );
};
