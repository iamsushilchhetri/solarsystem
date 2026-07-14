import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { CelestialBody } from '../types/body';
import { useAppStore } from '../state/store';
import { scaledRadius, scaledMoonDistance, scaledOrbitDistance } from '../utils/astro';
import { assetUrl } from '../utils/assetUrl';
import { useOrbitalMotion, phaseForId } from '../hooks/useOrbitalMotion';
import { registerBody, unregisterBody } from './bodyRegistry';
import { OrbitPath } from './OrbitPath';
import { getProceduralMoonTextures } from './proceduralMoonTexture';

interface MoonProps {
  body: CelestialBody;
  parentDisplayRadius: number;
}

function useMoonMotion(body: CelestialBody, parentDisplayRadius: number, radius: number) {
  const positionGroupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => phaseForId(body.id), [body.id]);
  const scaleMode = useAppStore.getState().scaleMode;
  // Bodies orbiting the Sun directly (dwarf planets, Parker Solar Probe) use the same
  // spacing formula as the 8 planets, so they land at a sensible distance relative to them.
  const orbitDist =
    body.parentId === 'sun'
      ? scaledOrbitDistance(body.semiMajorAxisKm, scaleMode)
      : scaledMoonDistance(body.semiMajorAxisKm, parentDisplayRadius, scaleMode);

  useOrbitalMotion({
    positionGroupRef,
    spinRef,
    orbitalPeriodDays: Math.abs(body.orbitalPeriodDays ?? 0),
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

  return { positionGroupRef, spinRef, orbitDist };
}

function usePointerHandlers(bodyId: string) {
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);
  return {
    onPointerOver: (e: any) => { e.stopPropagation(); setHovered(bodyId); document.body.style.cursor = 'pointer'; },
    onPointerOut: (e: any) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; },
    onClick: (e: any) => { e.stopPropagation(); setSelected(bodyId); },
  };
}

export function Moon(props: MoonProps) {
  return props.body.textureFile ? <MoonTextured {...props} /> : <MoonProcedural {...props} />;
}

function MoonTextured({ body, parentDisplayRadius }: MoonProps) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const radius = scaledRadius(body.radiusKm, scaleMode);
  const { positionGroupRef, spinRef, orbitDist } = useMoonMotion(body, parentDisplayRadius, radius);
  const map = useTexture(assetUrl(`textures/${body.textureFile}`));
  const pointerHandlers = usePointerHandlers(body.id);
  const hitRadius = Math.max(radius * 3, 0.22);

  return (
    <group ref={positionGroupRef}>
      <mesh ref={spinRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={map} bumpMap={map} bumpScale={0.02} roughness={1} />
      </mesh>
      <mesh visible={false} {...pointerHandlers}>
        <sphereGeometry args={[hitRadius, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      <OrbitPath semiMajorAxisDisplay={orbitDist} eccentricity={body.eccentricity} color="#8899bb" opacity={0.25} />
    </group>
  );
}

function MoonProcedural({ body, parentDisplayRadius }: MoonProps) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const radius = scaledRadius(body.radiusKm, scaleMode);
  const { positionGroupRef, spinRef, orbitDist } = useMoonMotion(body, parentDisplayRadius, radius);
  const pointerHandlers = usePointerHandlers(body.id);
  const hitRadius = Math.max(radius * 3, 0.22);

  // Natural bodies get a generated crater/surface texture so they read as 3D worlds up close;
  // artificial/probe/comet markers (rendered via this same pipeline) stay plain.
  const hasSurface = body.kind === 'moon' || body.kind === 'dwarf';
  const surface = useMemo(
    () => (hasSurface ? getProceduralMoonTextures(body.id, body.color) : null),
    [hasSurface, body.id, body.color],
  );

  return (
    <group ref={positionGroupRef}>
      <mesh ref={spinRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        {surface ? (
          <meshStandardMaterial map={surface.map} bumpMap={surface.bumpMap} bumpScale={0.03} roughness={1} metalness={0} />
        ) : (
          <meshStandardMaterial color={body.color} roughness={1} metalness={0} />
        )}
      </mesh>
      <mesh visible={false} {...pointerHandlers}>
        <sphereGeometry args={[hitRadius, 10, 10]} />
        <meshBasicMaterial />
      </mesh>
      <OrbitPath semiMajorAxisDisplay={orbitDist} eccentricity={body.eccentricity} color="#8899bb" opacity={0.2} />
    </group>
  );
}
