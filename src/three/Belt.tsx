import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { simClock } from '../state/store';

interface Rock {
  r: number;
  theta: number;
  y: number;
  speed: number;
  scale: number;
}

export function Belt({
  innerR,
  outerR,
  count,
  color,
  yScale = 0.6,
}: {
  innerR: number;
  outerR: number;
  count: number;
  color: string;
  yScale?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const rocks = useMemo<Rock[]>(() => {
    const span = Math.max(outerR - innerR, 0.1);
    return new Array(count).fill(0).map(() => ({
      r: innerR + Math.random() * span,
      theta: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * yScale,
      speed: 0.15 + Math.random() * 0.25,
      scale: 0.015 + Math.random() * 0.05,
    }));
  }, [innerR, outerR, count, yScale]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = simClock.daysElapsed;
    for (let i = 0; i < rocks.length; i++) {
      const d = rocks[i];
      const angle = d.theta + t * d.speed * 0.002;
      dummy.position.set(Math.cos(angle) * d.r, d.y, Math.sin(angle) * d.r);
      dummy.rotation.set(angle * 3, angle * 2, angle);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </instancedMesh>
  );
}
