import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PLANETS } from '../data/bodies';
import { DWARF_PLANETS } from '../data/moreBodies';
import { useAppStore } from '../state/store';
import { getBodyWorldPosition } from './bodyRegistry';
import type { CelestialBody } from '../types/body';

/** Small always-on-top locator dot + name label, reused for planets, dwarf planets, and moons. */
export function BodyMarker({ body }: { body: CelestialBody }) {
  const groupRef = useRef<THREE.Group>(null);
  const setSelected = useAppStore((s) => s.setSelectedBody);
  const isSelected = useAppStore((s) => s.selectedBodyId === body.id);

  useFrame(() => {
    const pos = getBodyWorldPosition(body.id);
    if (pos && groupRef.current) groupRef.current.position.copy(pos);
  });

  // Once a body is selected the camera flies right up to it, so its own
  // marker would just clutter the close-up view — hide it while focused.
  if (isSelected) return null;

  return (
    <group ref={groupRef}>
      <Html center occlude={false} style={{ pointerEvents: 'none' }}>
        <button
          type="button"
          onClick={() => setSelected(body.id)}
          className="group flex flex-col items-center gap-1"
          style={{ pointerEvents: 'auto', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          <span
            className="block rounded-full transition-transform group-hover:scale-125"
            style={{
              width: 8,
              height: 8,
              border: `1.5px solid ${body.color}`,
              boxShadow: `0 0 8px ${body.color}, 0 0 2px ${body.color}`,
            }}
          />
          <span className="text-[10px] leading-none text-white/80 group-hover:text-white bg-black/50 px-1.5 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">
            {body.name}
          </span>
        </button>
      </Html>
    </group>
  );
}

/** Always-visible locator labels so planets and dwarf planets stay findable even when
 * their true scaled size is sub-pixel (Realistic scale mode). */
export function PlanetMarkers() {
  const scaleMode = useAppStore((s) => s.scaleMode);
  if (scaleMode !== 'realistic') return null;

  return (
    <>
      {PLANETS.map((body) => (
        <BodyMarker key={body.id} body={body} />
      ))}
      {DWARF_PLANETS.map((body) => (
        <BodyMarker key={body.id} body={body} />
      ))}
    </>
  );
}
