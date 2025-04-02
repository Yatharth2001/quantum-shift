import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "@/stores/gameStore";
import * as THREE from "three";

export const QuantumParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const { reality, timeDirection } = useGameStore();

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    colors[i * 3] = reality === "quantum" ? 1 : 0;
    colors[i * 3 + 1] = reality === "normal" ? 1 : 0;
    colors[i * 3 + 2] = 0.5;
  }

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const particles = particlesRef.current;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = particles.geometry.attributes.position.array[i3];
      const y = particles.geometry.attributes.position.array[i3 + 1];
      const z = particles.geometry.attributes.position.array[i3 + 2];

      particles.geometry.attributes.position.array[i3] =
        x + Math.sin(time + y) * 0.01 * timeDirection;
      particles.geometry.attributes.position.array[i3 + 1] =
        y + Math.cos(time + x) * 0.01 * timeDirection;
      particles.geometry.attributes.position.array[i3 + 2] =
        z + Math.sin(time + z) * 0.01 * timeDirection;
    }

    particles.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={reality === "quantum" ? 0.8 : 0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
