import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppStore, simClock } from '../state/store';
import { getBodyById } from '../data/bodies';
import { phaseForId } from '../hooks/useOrbitalMotion';
import { orbitAngle, ellipsePosition, scaledOrbitDistance, scaledRadius } from '../utils/astro';
import { getBodyWorldPosition } from './bodyRegistry';

const G = 6.674e-11;
const M_SUN = 1.989e30;
const EARTH_A_GRAV = (G * M_SUN) / (1.496e11 * 1.496e11); // ~0.00593 m/s^2
const EARTH_ORBIT_SPEED = 29.78; // km/s

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

interface Sample {
  origin: THREE.Vector3;
  dir: THREE.Vector3;
}

function ArrowVector({ compute, length, color }: { compute: () => Sample | null; length: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const sample = compute();
    if (!sample) {
      g.visible = false;
      return;
    }
    g.visible = true;
    g.position.copy(sample.origin);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sample.dir);
  });

  const shaftLen = length * 0.75;
  const headLen = length * 0.25;

  return (
    <group ref={groupRef}>
      <mesh position={[0, shaftLen / 2, 0]}>
        <cylinderGeometry args={[length * 0.02, length * 0.02, shaftLen, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, shaftLen + headLen / 2, 0]}>
        <coneGeometry args={[length * 0.06, headLen, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

/** Animated gravity (toward Sun, red) and orbital velocity (tangential, cyan) vectors
 * on the currently selected planet — toggleable, to help show why orbits stay stable. */
export function PhysicsVectors() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  const show = useAppStore((s) => s.showPhysicsVectors);
  const scaleMode = useAppStore((s) => s.scaleMode);

  const body = selectedBodyId ? getBodyById(selectedBodyId) : undefined;
  const eligible = show && body && body.kind === 'planet' && !body.parentId;
  if (!eligible || !body) return null;

  const phase = phaseForId(body.id);
  const orbitDist = scaledOrbitDistance(body.semiMajorAxisKm, scaleMode);
  const displayRadius = scaledRadius(body.radiusKm, scaleMode);
  const inclinationRad = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);

  const rMeters = body.semiMajorAxisKm * 1000;
  const aGrav = (G * M_SUN) / (rMeters * rMeters);
  const gravLen = clamp(Math.cbrt(aGrav / EARTH_A_GRAV) * 1.3, 0.5, 2.6);
  const velLen = clamp(Math.cbrt(body.orbitalSpeedKmS / EARTH_ORBIT_SPEED) * 1.3, 0.5, 2.6);

  const computeGravity = (): Sample | null => {
    const pos = getBodyWorldPosition(body.id);
    if (!pos) return null;
    const dir = pos.clone().multiplyScalar(-1).normalize();
    const origin = pos.clone().add(dir.clone().multiplyScalar(displayRadius * 1.3));
    return { origin, dir };
  };

  const computeVelocity = (): Sample | null => {
    const pos = getBodyWorldPosition(body.id);
    if (!pos) return null;
    const angle = orbitAngle(simClock.daysElapsed, body.orbitalPeriodDays ?? 1, phase);
    const eps = 0.002;
    const p1 = ellipsePosition(orbitDist, body.eccentricity, angle);
    const p2 = ellipsePosition(orbitDist, body.eccentricity, angle + eps);
    const dir = new THREE.Vector3(p2.x - p1.x, 0, p2.z - p1.z)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), inclinationRad)
      .normalize();
    const origin = pos.clone().add(dir.clone().multiplyScalar(displayRadius * 1.3));
    return { origin, dir };
  };

  return (
    <>
      <ArrowVector compute={computeGravity} length={gravLen} color="#ff5566" />
      <ArrowVector compute={computeVelocity} length={velLen} color="#4dd8ff" />
    </>
  );
}
