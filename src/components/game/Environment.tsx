import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { generateMathPuzzle } from "@/lib/math/puzzleGenerator";
import { Box, Float } from "@react-three/drei";
import { TimeEffect } from "./TimeEffect";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CustomText } from "./CustomText";

export const Environment = () => {
  const { reality, currentPuzzle, setPuzzle, timeDirection } = useGameStore();

  useEffect(() => {
    if (!currentPuzzle) {
      const puzzle = generateMathPuzzle(reality === "quantum");
      setPuzzle(puzzle.question, puzzle.answer);
    }
  }, [currentPuzzle, reality, setPuzzle]);

  return (
    <group>
      <TimeEffect />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color={reality === "normal" ? "#1a1a1a" : "#0a001a"}
          metalness={0.8}
          roughness={0.4}
          opacity={0.8}
          transparent
        />
      </mesh>

      {/* Puzzle Display */}
      {currentPuzzle && (
        <Float
          speed={timeDirection === 1 ? 1 : -1}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          position={[0, 2, -5]}
        >
          <group>
            <CustomText
              color={reality === "normal" ? "#ffffff" : "#ff00ff"}
              fontSize={0.5}
              maxWidth={10}
              lineHeight={1}
              letterSpacing={0.02}
              textAlign="center"
              font="JetBrains Mono"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor={reality === "normal" ? "#00ff88" : "#ff00ff"}
              renderOrder={1}
              frustumCulled={false}
            >
              {timeDirection === 1
                ? currentPuzzle.question
                : currentPuzzle.question.split("").reverse().join("")}
            </CustomText>
          </group>
        </Float>
      )}

      {/* Portal effects */}
      <group position={[0, 0, -10]}>
        <mesh>
          <torusGeometry args={[2, 0.2, 16, 100]} />
          <meshStandardMaterial
            color={reality === "normal" ? "#00ff88" : "#ff00ff"}
            emissive={reality === "normal" ? "#00332b" : "#330033"}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Portal glow */}
        <pointLight
          color={reality === "normal" ? "#00ff88" : "#ff00ff"}
          intensity={2}
          distance={5}
        />
      </group>

      {/* Grid floor for better spatial awareness */}
      <gridHelper
        args={[50, 50, reality === "normal" ? "#004422" : "#440044", "#000000"]}
        position={[0, -1.99, 0]}
      />
    </group>
  );
};
