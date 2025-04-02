import { useGameStore } from "@/stores/gameStore";
import { motion } from "framer-motion";

export const EnergyMeter = () => {
  const { energy, reality } = useGameStore();

  return (
    <div className="fixed bottom-4 left-4 w-48">
      <div className="mb-2 text-white text-sm font-bold">Quantum Energy</div>
      <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            reality === "normal" ? "bg-cyan-500" : "bg-fuchsia-500"
          }`}
          initial={{ width: 0 }}
          animate={{
            width: `${energy}%`,
            transition: { type: "spring", stiffness: 100 },
          }}
        />
      </div>
      {energy < 20 && (
        <motion.div
          className="text-red-500 text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Low Energy Warning!
        </motion.div>
      )}
    </div>
  );
};
