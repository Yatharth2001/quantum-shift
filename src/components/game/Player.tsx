import { useRef, useMemo } from "react";
import { useFrame, extend, ThreeElements } from "@react-three/fiber";
import { useGameStore } from "@/stores/gameStore";
import * as THREE from "three";
import {
  calculateGravity,
  calculateQuantumEffect,
  PhysicsObject,
} from "@/lib/physics/physicsUtils";
import { TrailPass } from "@/lib/effects/TrailPass";

// Register TrailPass with @react-three/fiber
extend({ TrailPass });

// Add type declaration
declare module "@react-three/fiber" {
  interface ThreeElements {
    trailPass: Partial<ThreeElements["mesh"]> & {
      length?: number;
      decay?: number;
      color?: string;
      attach?: string;
      attachArray?: string;
    };
  }
}

export const Player = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position, reality, gravityDirection, timeDirection } = useGameStore();

  const physicsObject = useMemo<PhysicsObject>(
    () => ({
      position: new THREE.Vector3(position.x, position.y, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      mass: 1,
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Update physics object position based on game state
    physicsObject.position.set(position.x, position.y, 0);

    // Apply physics calculations
    calculateGravity(physicsObject, gravityDirection, delta);
    calculateQuantumEffect(physicsObject, reality === "quantum", timeDirection);

    // Smooth position updates with physics interpolation
    meshRef.current.position.lerp(physicsObject.position, 0.1);

    // Reality shift effect
    const scale = reality === "quantum" ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

    // Rotation based on gravity direction and time flow
    const targetRotation = gravityDirection === 1 ? 0 : Math.PI;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      targetRotation * timeDirection,
      0.1
    );
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={reality === "normal" ? "#00ff88" : "#ff00ff"}
        emissive={reality === "normal" ? "#00332b" : "#330033"}
        metalness={0.5}
        roughness={0.2}
        // Add trail effect in quantum reality
        transparent={reality === "quantum"}
        opacity={reality === "quantum" ? 0.8 : 1}
      >
        {/* Only render trail in quantum reality */}
        {reality === "quantum" && (
          <trailPass
            attachArray="onBeforeRender"
            length={timeDirection === 1 ? 20 : -20}
            decay={0.1}
            color="#ff00ff"
          />
        )}
      </meshStandardMaterial>
    </mesh>
  );
};
