import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useAppStore, simClock } from '../state/store';
import { getBodyById } from '../data/bodies';
import { phaseForId } from '../hooks/useOrbitalMotion';
import { orbitAngle, formatDistance } from '../utils/astro';
import { getBodyWorldPosition } from './bodyRegistry';

export function DistanceLine() {
  const hoveredId = useAppStore((s) => s.hoveredBodyId);
  const distanceUnit = useAppStore((s) => s.distanceUnit);
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const labelGroupRef = useRef<THREE.Group>(null);
  const [label, setLabel] = useState('');

  const body = hoveredId ? getBodyById(hoveredId) : undefined;
  const show = !!body && body.kind === 'planet' && !body.parentId;

  useFrame(() => {
    if (!show || !body) return;
    const pos = getBodyWorldPosition(body.id);
    if (!pos || !geomRef.current || !labelGroupRef.current) return;
    geomRef.current.setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
    geomRef.current.computeBoundingSphere();
    labelGroupRef.current.position.copy(pos).multiplyScalar(0.5);

    const phase = phaseForId(body.id);
    const angle = orbitAngle(simClock.daysElapsed, body.orbitalPeriodDays ?? 1, phase);
    const realDistKm = body.semiMajorAxisKm * (1 - body.eccentricity * Math.cos(angle));
    setLabel(formatDistance(realDistKm, distanceUnit));
  });

  if (!show) return null;

  return (
    <>
      <line>
        <bufferGeometry ref={geomRef} />
        <lineBasicMaterial color="#ffe27a" transparent opacity={0.75} />
      </line>
      <group ref={labelGroupRef}>
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="glass-panel px-3 py-1 rounded-full text-xs text-amber-200 whitespace-nowrap">
            {label}
          </div>
        </Html>
      </group>
    </>
  );
}
