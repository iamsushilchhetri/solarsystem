import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import './materials';

export function AtmosphereGlow({
  radius,
  color,
  scale = 1.1,
  intensity = 0.6,
  power = 3,
}: {
  radius: number;
  color: string;
  scale?: number;
  intensity?: number;
  power?: number;
}) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) ref.current.time = state.clock.elapsedTime;
  });

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 32, 32]} />
      {/* @ts-ignore */}
      <glowMaterial
        ref={ref}
        glowColor={new THREE.Color(color)}
        power={power}
        intensity={intensity}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
