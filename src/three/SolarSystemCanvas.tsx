import { Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { PLANETS, SUN } from '../data/bodies';
import { useAppStore } from '../state/store';
import { scaledOrbitDistance, scaledRadius } from '../utils/astro';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { EarthPlanet } from './EarthPlanet';
import { OrbitPath } from './OrbitPath';
import { AsteroidBelt } from './AsteroidBelt';
import { KuiperBelt } from './KuiperBelt';
import { Comets } from './Comets';
import { DeepSpaceProbes } from './DeepSpaceProbes';
import { MoonGroup } from './MoonGroup';
import { StarfieldBackground } from './StarfieldBackground';
import { CameraRig } from './CameraRig';
import { DistanceLine } from './DistanceLine';
import { SimClockDriver } from './SimClockDriver';
import { PlanetMarkers } from './PlanetMarkers';
import { MoonMarkers } from './MoonMarkers';
import { PhysicsVectors } from './PhysicsVectors';

function SceneContents() {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const sunRadius = scaledRadius(SUN.radiusKm, scaleMode);

  return (
    <>
      <SimClockDriver />
      <ambientLight intensity={0.1} />
      <hemisphereLight args={['#3a4a6b', '#0a0a12', 0.12]} />
      <StarfieldBackground />

      <Sun />

      {PLANETS.map((body) => (
        <group key={`orbit-${body.id}`} rotation={[THREE.MathUtils.degToRad(body.inclinationDeg ?? 0), 0, 0]}>
          <OrbitPath
            semiMajorAxisDisplay={scaledOrbitDistance(body.semiMajorAxisKm, scaleMode)}
            eccentricity={body.eccentricity}
          />
        </group>
      ))}

      {PLANETS.map((body) =>
        body.id === 'earth' ? (
          <EarthPlanet key={body.id} body={body} />
        ) : (
          <Planet key={body.id} body={body} />
        ),
      )}

      {/* Dwarf planets + Parker Solar Probe reuse the Sun-orbiting "moon" pipeline */}
      <MoonGroup planetId="sun" planetDisplayRadius={sunRadius} />

      <AsteroidBelt />
      <KuiperBelt />
      <Comets />
      <DeepSpaceProbes />

      <PlanetMarkers />
      <MoonMarkers />
      <PhysicsVectors />
      <DistanceLine />
      <CameraRig />

      <EffectComposer multisampling={4}>
        <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

export function SolarSystemCanvas() {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      camera={{ position: [0, 35, 80], fov: 50, near: 0.01, far: 40000 }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
