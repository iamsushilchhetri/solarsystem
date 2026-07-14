import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import './materials';
import type { CelestialBody } from '../types/body';
import { useAppStore } from '../state/store';
import { scaledRadius, scaledOrbitDistance } from '../utils/astro';
import { assetUrl } from '../utils/assetUrl';
import { useOrbitalMotion, phaseForId } from '../hooks/useOrbitalMotion';
import { registerBody, unregisterBody } from './bodyRegistry';
import { AtmosphereGlow } from './AtmosphereGlow';
import { MoonGroup } from './MoonGroup';

export function EarthPlanet({ body }: { body: CelestialBody }) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);

  const positionGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Mesh>(null);
  const cloudsSpinRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);

  const radius = scaledRadius(body.radiusKm, scaleMode);
  const orbitDist = scaledOrbitDistance(body.semiMajorAxisKm, scaleMode);
  const phase = useMemo(() => phaseForId(body.id), [body.id]);
  const tiltRad = THREE.MathUtils.degToRad(body.axialTiltDeg);
  const inclinationRad = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);

  const dayMap = useTexture(assetUrl(`textures/${body.textureFile}`));
  const nightMap = useTexture(assetUrl(`textures/${body.nightTextureFile}`));
  const cloudsMap = useTexture(assetUrl(`textures/${body.cloudTextureFile}`));

  useOrbitalMotion({
    positionGroupRef,
    spinRef,
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
    if (matRef.current && positionGroupRef.current) {
      const worldPos = new THREE.Vector3();
      positionGroupRef.current.getWorldPosition(worldPos);
      matRef.current.sunDirection = worldPos.multiplyScalar(-1).normalize();
    }
    if (cloudsSpinRef.current && spinRef.current) {
      cloudsSpinRef.current.rotation.y = spinRef.current.rotation.y * 1.1;
    }
  });

  const hitRadius = Math.max(radius * 2.2, 0.35);
  const pointerHandlers = {
    onPointerOver: (e: any) => {
      e.stopPropagation();
      setHovered(body.id);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: (e: any) => {
      e.stopPropagation();
      setHovered(null);
      document.body.style.cursor = 'auto';
    },
    onClick: (e: any) => {
      e.stopPropagation();
      setSelected(body.id);
    },
  };

  return (
    <group rotation={[inclinationRad, 0, 0]}>
      <group ref={positionGroupRef}>
        <group ref={tiltGroupRef} rotation={[0, 0, tiltRad]}>
          <mesh ref={spinRef} castShadow receiveShadow>
            <sphereGeometry args={[radius, 64, 64]} />
            {/* @ts-ignore */}
            <earthMaterial ref={matRef} dayMap={dayMap} nightMap={nightMap} cloudsMap={cloudsMap} />
          </mesh>

          <mesh visible={false} {...pointerHandlers}>
            <sphereGeometry args={[hitRadius, 12, 12]} />
            <meshBasicMaterial />
          </mesh>

          <mesh ref={cloudsSpinRef} scale={1.015} castShadow>
            <sphereGeometry args={[radius, 48, 48]} />
            <meshStandardMaterial map={cloudsMap} transparent opacity={0.4} depthWrite={false} />
          </mesh>

          <AtmosphereGlow radius={radius} color="#6db3ff" intensity={0.55} />
        </group>

        <MoonGroup planetId={body.id} planetDisplayRadius={radius} />
      </group>
    </group>
  );
}
