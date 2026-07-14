import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { CelestialBody } from '../types/body';
import { useAppStore } from '../state/store';
import { scaledRadius, scaledOrbitDistance } from '../utils/astro';
import { assetUrl } from '../utils/assetUrl';
import { useOrbitalMotion, phaseForId } from '../hooks/useOrbitalMotion';
import { registerBody, unregisterBody } from './bodyRegistry';
import { Rings } from './Rings';
import { AtmosphereGlow } from './AtmosphereGlow';
import { MoonGroup } from './MoonGroup';

const ATMOSPHERE_COLORS: Record<string, string> = {
  venus: '#e8c98a',
  earth: '#6db3ff',
  jupiter: '#e0c896',
  saturn: '#e8dcb0',
  uranus: '#a8e8e8',
  neptune: '#6c8cff',
};

/** Rocky bodies with no dedicated normal map get their own diffuse texture reused as a cheap bump map. */
const BUMP_SCALE: Record<string, number> = {
  mercury: 0.03,
  mars: 0.025,
};

/** Generic renderer for every planet except Earth (which needs the day/night shader). */
export function Planet({ body }: { body: CelestialBody }) {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);

  const positionGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Mesh>(null);

  const radius = scaledRadius(body.radiusKm, scaleMode);
  const orbitDist = scaledOrbitDistance(body.semiMajorAxisKm, scaleMode);
  const phase = useMemo(() => phaseForId(body.id), [body.id]);
  const tiltRad = THREE.MathUtils.degToRad(body.axialTiltDeg);
  const inclinationRad = THREE.MathUtils.degToRad(body.inclinationDeg ?? 0);

  const map = useTexture(assetUrl(`textures/${body.textureFile}`));
  const cloudMap = body.cloudTextureFile ? useTexture(assetUrl(`textures/${body.cloudTextureFile}`)) : undefined;
  const bumpScale = BUMP_SCALE[body.id];

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

  const glowColor = ATMOSPHERE_COLORS[body.id];
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
            <sphereGeometry args={[radius, 48, 48]} />
            <meshStandardMaterial
              map={map}
              bumpMap={bumpScale ? map : undefined}
              bumpScale={bumpScale}
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>

          {/* invisible larger hit-target so tiny (e.g. Realistic-scale) planets stay easy to click */}
          <mesh visible={false} {...pointerHandlers}>
            <sphereGeometry args={[hitRadius, 12, 12]} />
            <meshBasicMaterial />
          </mesh>

          {cloudMap && (
            <mesh scale={1.015}>
              <sphereGeometry args={[radius, 48, 48]} />
              <meshStandardMaterial
                map={cloudMap}
                transparent
                opacity={0.55}
                depthWrite={false}
              />
            </mesh>
          )}

          {glowColor && (
            <AtmosphereGlow
              radius={radius}
              color={glowColor}
              intensity={['jupiter', 'saturn', 'uranus', 'neptune'].includes(body.id) ? 0.35 : 0.55}
            />
          )}

          {body.rings && <Rings rings={body.rings} planetRadius={radius} bodyRadiusKm={body.radiusKm} />}
        </group>

        <MoonGroup planetId={body.id} planetDisplayRadius={radius} />
      </group>
    </group>
  );
}
