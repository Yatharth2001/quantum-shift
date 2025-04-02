import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import { Player } from "@/components/game/Player";
import { Environment } from "@/components/game/Environment";
import { QuantumParticles } from "@/components/game/QuantumParticles";
import { EnergyMeter } from "@/components/ui/EnergyMeter";
import { SoundControls } from "@/components/ui/SoundControls";
import { PuzzleInput } from "@/components/ui/PuzzleInput";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

export const Game = () => {
  const { reality, energy } = useGameStore();
  useKeyboardControls();

  const canShiftReality = energy >= 10;
  const canReverseTime = energy >= 15;

  return (
    <>
      <div
        className={`w-full h-screen ${
          reality === "quantum" ? "reality-shift" : ""
        }`}
      >
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 75 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={reality === "normal" ? 0.5 : 0.2} />
          <pointLight position={[10, 10, 10]} />
          <Stars count={reality === "quantum" ? 5000 : 0} />
          {reality === "quantum" && <QuantumParticles />}
          <Player />
          <Environment />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* UI Components */}
      <EnergyMeter />
      <PuzzleInput />
      <SoundControls />

      {/* Controls Help */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-4 rounded-lg backdrop-blur-sm text-white text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Movement</h3>
            <p>WASD / Arrow Keys</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Actions</h3>
            <p
              className={`${canShiftReality ? "text-white" : "text-gray-500"}`}
            >
              Space - Switch Reality {!canShiftReality && "(Need 10 Energy)"}
            </p>
            <p className={`${canReverseTime ? "text-white" : "text-gray-500"}`}>
              Shift - Reverse Time {!canReverseTime && "(Need 15 Energy)"}
            </p>
            <p>V - Sound Controls</p>
            <p>Ctrl + R - Reset Game</p>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="fixed top-4 left-4 flex flex-col gap-2">
        <div
          className={`px-4 py-2 rounded-lg backdrop-blur-sm
          ${
            reality === "normal"
              ? "bg-cyan-500/20 text-cyan-300"
              : "bg-fuchsia-500/20 text-fuchsia-300"
          }`}
        >
          Reality: {reality.charAt(0).toUpperCase() + reality.slice(1)}
        </div>
        {(energy < 10 || energy < 15) && (
          <div className="px-4 py-2 rounded-lg backdrop-blur-sm bg-red-500/20 text-red-300">
            {!canShiftReality && (
              <p>Need {10 - energy} more energy to shift reality</p>
            )}
            {!canReverseTime && (
              <p>Need {15 - energy} more energy to reverse time</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};
