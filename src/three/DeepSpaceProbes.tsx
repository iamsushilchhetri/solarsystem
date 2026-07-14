import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PROBES } from '../data/moreBodies';
import { getBodyById } from '../data/bodies';
import { useAppStore } from '../state/store';
import { scaledOrbitDistance } from '../utils/astro';
import { registerBody, unregisterBody } from './bodyRegistry';
import type { CelestialBody } from '../types/body';

const RADIUS = 0.12;

function ProbeBody({ body }: { body: CelestialBody }) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);
  const isSelected = useAppStore((s) => s.selectedBodyId === body.id);
  const groupRef = useRef<THREE.Group>(null);

  const neptune = getBodyById('neptune')!;
  const dist = scaledOrbitDistance(neptune.semiMajorAxisKm * (body.distanceMultiplierVsNeptune ?? 1.2), scaleMode);
  const headingRad = THREE.MathUtils.degToRad(body.headingDeg ?? 0);
  const tiltRad = THREE.MathUtils.degToRad(body.tiltDeg ?? 0);

  const position = useMemo(() => {
    return new THREE.Vector3(
      dist * Math.cos(headingRad) * Math.cos(tiltRad),
      dist * Math.sin(tiltRad),
      dist * Math.sin(headingRad) * Math.cos(tiltRad),
    );
  }, [dist, headingRad, tiltRad]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.displayRadius = RADIUS;
      registerBody(body.id, groupRef.current);
    }
    return () => unregisterBody(body.id);
  }, [body.id]);

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <octahedronGeometry args={[RADIUS, 0]} />
        <meshStandardMaterial color={body.color} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(body.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { e.stopPropagation(); setSelected(body.id); }}
      >
        <sphereGeometry args={[RADIUS * 4, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      {!isSelected && (
        <Html center occlude={false} style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] leading-none text-white/70 bg-black/50 px-1.5 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">
            {body.name}
          </div>
        </Html>
      )}
    </group>
  );
}

export function DeepSpaceProbes() {
  return (
    <>
      {PROBES.map((body) => (
        <ProbeBody key={body.id} body={body} />
      ))}
    </>
  );
}
