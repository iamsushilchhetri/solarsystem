import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COMETS } from '../data/moreBodies';
import type { CelestialBody } from '../types/body';
import { useAppStore } from '../state/store';
import { scaledRadius, scaledOrbitDistance } from '../utils/astro';
import { useOrbitalMotion, phaseForId } from '../hooks/useOrbitalMotion';
import { registerBody, unregisterBody } from './bodyRegistry';
import { OrbitPath } from './OrbitPath';

function CometBody({ body }: { body: CelestialBody }) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);

  const positionGroupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const phase = useMemo(() => phaseForId(body.id), [body.id]);
  const inclinationRad = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);

  // Comets' real nuclei are far too small to see at any of our scales, so we give them a
  // small fixed minimum visual size — a fuzzy coma, not a literal-scale speck.
  const radius = Math.max(scaledRadius(body.radiusKm, scaleMode), 0.045);
  const orbitDist = scaledOrbitDistance(body.semiMajorAxisKm, scaleMode);

  useOrbitalMotion({
    positionGroupRef,
    orbitalPeriodDays: body.orbitalPeriodDays,
    rotationPeriodH: body.rotationPeriodH,
    semiMajorAxisDisplay: orbitDist,
    eccentricity: body.eccentricity,
    phaseOffset: phase,
  });

  useEffect(() => {
    if (positionGroupRef.current) {
      positionGroupRef.current.userData.displayRadius = radius;
      registerBody(body.id, positionGroupRef.current);
    }
    return () => unregisterBody(body.id);
  }, [body.id, radius]);

  useFrame(() => {
    if (tailRef.current && positionGroupRef.current) {
      const worldPos = new THREE.Vector3();
      positionGroupRef.current.getWorldPosition(worldPos);
      const awayFromSun = worldPos.clone().normalize();
      tailRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), awayFromSun);
    }
  });

  const tailLength = radius * 16;
  const hitRadius = Math.max(radius * 3, 0.22);

  return (
    <group rotation={[inclinationRad, 0, 0]}>
      <group ref={positionGroupRef}>
        <mesh castShadow>
          <sphereGeometry args={[radius, 16, 16]} />
          <meshBasicMaterial color={body.color} />
        </mesh>
        <mesh
          visible={false}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(body.id); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
          onClick={(e) => { e.stopPropagation(); setSelected(body.id); }}
        >
          <sphereGeometry args={[hitRadius, 10, 10]} />
          <meshBasicMaterial />
        </mesh>
        <group ref={tailRef}>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, tailLength / 2, 0]}>
            <coneGeometry args={[radius * 3.5, tailLength, 12, 1, true]} />
            <meshBasicMaterial
              color={body.color}
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
        <OrbitPath semiMajorAxisDisplay={orbitDist} eccentricity={body.eccentricity} color="#9fb8c9" opacity={0.15} />
      </group>
    </group>
  );
}

export function Comets() {
  return (
    <>
      {COMETS.map((body) => (
        <CometBody key={body.id} body={body} />
      ))}
    </>
  );
}
