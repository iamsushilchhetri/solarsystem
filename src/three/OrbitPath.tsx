import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { ellipsePosition } from '../utils/astro';

export function OrbitPath({
  semiMajorAxisDisplay,
  eccentricity,
  color = '#5b6b8c',
  opacity = 0.35,
}: {
  semiMajorAxisDisplay: number;
  eccentricity: number;
  color?: string;
  opacity?: number;
}) {
  const points = useMemo(() => {
    const segments = 256;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const { x, z } = ellipsePosition(semiMajorAxisDisplay, eccentricity, angle);
      pts.push(new THREE.Vector3(x, 0, z));
    }
    return pts;
  }, [semiMajorAxisDisplay, eccentricity]);

  return <Line points={points} color={color} transparent opacity={opacity} lineWidth={1} />;
}
