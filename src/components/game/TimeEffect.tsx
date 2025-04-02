import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useGameStore } from "@/stores/gameStore";
import { vertexShader, fragmentShader } from "@/lib/shaders/timeShader";
import * as THREE from "three";

const TimeShaderMaterial = shaderMaterial(
  {
    time: 0,
    timeDirection: 1,
  },
  vertexShader,
  fragmentShader
);

// Register the material with @react-three/fiber
extend({ TimeShaderMaterial });

// Add type declaration
declare module "@react-three/fiber" {
  interface ThreeElements {
    timeShaderMaterial: Partial<ThreeElements["meshStandardMaterial"]> & {
      time?: number;
      timeDirection?: number;
    };
  }
}

export const TimeEffect = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<
    THREE.ShaderMaterial & { time: number; timeDirection: number }
  >(null);
  const { timeDirection } = useGameStore();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.timeDirection = timeDirection;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[20, 20, 1]}>
      <planeGeometry />
      <timeShaderMaterial ref={materialRef} transparent />
    </mesh>
  );
};
