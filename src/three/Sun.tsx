import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import './materials';
import { SUN } from '../data/bodies';
import { useAppStore } from '../state/store';
import { scaledRadius } from '../utils/astro';
import { registerBody, unregisterBody } from './bodyRegistry';

function makeFlareTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,220,150,0.9)');
  grad.addColorStop(0.4, 'rgba(255,160,60,0.5)');
  grad.addColorStop(1, 'rgba(255,120,30,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

interface FlareSpec {
  theta: number;
  phi: number;
  baseScale: number;
  speed: number;
  phase: number;
}

export function Sun() {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const setHovered = useAppStore((s) => s.setHoveredBody);
  const setSelected = useAppStore((s) => s.setSelectedBody);

  const groupRef = useRef<THREE.Group>(null);
  const surfaceMatRef = useRef<any>(null);
  const coronaMatRef = useRef<any>(null);

  const map = useTexture(`/textures/${SUN.textureFile}`);
  const flareTex = useMemo(() => makeFlareTexture(), []);

  const radius = scaledRadius(SUN.radiusKm, scaleMode);

  const flares = useMemo<FlareSpec[]>(() => {
    return new Array(7).fill(0).map(() => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(2 * Math.random() - 1),
      baseScale: 0.35 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.displayRadius = radius;
      registerBody(SUN.id, groupRef.current);
    }
    return () => unregisterBody(SUN.id);
  }, [radius]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (surfaceMatRef.current) surfaceMatRef.current.time = t;
    if (coronaMatRef.current) coronaMatRef.current.time = t;
    if (groupRef.current) groupRef.current.userData.displayRadius = radius;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <pointLight
        color="#fff4dd"
        intensity={6}
        distance={0}
        decay={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(SUN.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelected(SUN.id);
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        {/* @ts-ignore */}
        <sunMaterial ref={surfaceMatRef} map={map} />
      </mesh>

      <mesh scale={1.15}>
        <sphereGeometry args={[radius, 32, 32]} />
        {/* @ts-ignore */}
        <glowMaterial
          ref={coronaMatRef}
          glowColor={new THREE.Color('#ffb35c')}
          power={2.2}
          intensity={1.4}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {flares.map((f, i) => (
        <Flare key={i} spec={f} radius={radius} texture={flareTex} />
      ))}
    </group>
  );
}

function Flare({ spec, radius, texture }: { spec: FlareSpec; radius: number; texture: THREE.Texture }) {
  const ref = useRef<THREE.Sprite>(null);
  const pos = useMemo(() => {
    const r = radius * 1.02;
    const x = r * Math.sin(spec.phi) * Math.cos(spec.theta);
    const y = r * Math.cos(spec.phi);
    const z = r * Math.sin(spec.phi) * Math.sin(spec.theta);
    return new THREE.Vector3(x, y, z);
  }, [radius, spec]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * spec.speed + spec.phase;
    const pulse = 0.7 + 0.3 * Math.sin(t);
    const s = radius * spec.baseScale * pulse;
    ref.current.scale.setScalar(s);
  });

  return (
    <sprite ref={ref} position={pos}>
      <spriteMaterial
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
