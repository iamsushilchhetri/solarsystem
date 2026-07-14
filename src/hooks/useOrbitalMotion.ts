import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RefObject } from 'react';
import { simClock } from '../state/store';
import { ellipsePosition, orbitAngle, rotationAngle } from '../utils/astro';

interface Options {
  positionGroupRef: RefObject<THREE.Object3D | null>;
  spinRef?: RefObject<THREE.Object3D | null>;
  orbitalPeriodDays?: number;
  rotationPeriodH: number;
  semiMajorAxisDisplay: number;
  eccentricity: number;
  phaseOffset: number;
}

/** Shared per-frame orbit + self-rotation driver for planets, moons, and the Sun's children. */
export function useOrbitalMotion({
  positionGroupRef,
  spinRef,
  orbitalPeriodDays,
  rotationPeriodH,
  semiMajorAxisDisplay,
  eccentricity,
  phaseOffset,
}: Options) {
  useFrame(() => {
    const days = simClock.daysElapsed;
    if (positionGroupRef.current && orbitalPeriodDays) {
      const angle = orbitAngle(days, orbitalPeriodDays, phaseOffset);
      const { x, z } = ellipsePosition(semiMajorAxisDisplay, eccentricity, angle);
      positionGroupRef.current.position.set(x, 0, z);
    }
    if (spinRef?.current) {
      spinRef.current.rotation.y = rotationAngle(days * 24, rotationPeriodH);
    }
  });
}

/** Deterministic pseudo-random phase (0..2π) per body id so bodies don't all start aligned. */
export function phaseForId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ((h % 1000) / 1000) * Math.PI * 2;
}
