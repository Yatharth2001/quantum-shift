import * as THREE from "three";

export interface PhysicsObject {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mass: number;
}

export const calculateGravity = (
  object: PhysicsObject,
  gravityDirection: 1 | -1,
  deltaTime: number
) => {
  const GRAVITY_CONSTANT = 9.81;
  object.velocity.y -= GRAVITY_CONSTANT * gravityDirection * deltaTime;
  object.position.add(object.velocity.multiplyScalar(deltaTime));
  return object;
};

export const calculateQuantumEffect = (
  object: PhysicsObject,
  isQuantumReality: boolean,
  timeDirection: 1 | -1
) => {
  if (isQuantumReality) {
    // In quantum reality, objects experience time dilation
    const timeDilation = 0.5;
    object.velocity.multiplyScalar(timeDilation * timeDirection);

    // Quantum uncertainty affects position
    const uncertainty = Math.random() * 0.1 - 0.05;
    object.position.x += uncertainty;
    object.position.y += uncertainty;
  }
  return object;
};

export const checkCollision = (
  object1: PhysicsObject,
  object2: PhysicsObject,
  minDistance: number
): boolean => {
  const distance = object1.position.distanceTo(object2.position);
  return distance < minDistance;
};

export const resolveCollision = (
  object1: PhysicsObject,
  object2: PhysicsObject
) => {
  // Calculate collision response using conservation of momentum
  const totalMass = object1.mass + object2.mass;
  const massRatio1 = object1.mass / totalMass;
  const massRatio2 = object2.mass / totalMass;

  const relativeVelocity = object1.velocity.clone().sub(object2.velocity);

  object1.velocity.sub(relativeVelocity.multiplyScalar(massRatio2));
  object2.velocity.add(relativeVelocity.multiplyScalar(massRatio1));

  return { object1, object2 };
};
