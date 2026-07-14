import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { RingData } from '../types/body';

function buildRingGeometry(inner: number, outer: number): THREE.RingGeometry {
  const geometry = new THREE.RingGeometry(inner, outer, 128, 1);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const d = v.length();
    const u = (d - inner) / (outer - inner);
    uv.setXY(i, u, 1);
  }
  uv.needsUpdate = true;
  return geometry;
}

type RingsProps = { rings: RingData; planetRadius: number; bodyRadiusKm: number };

export function Rings(props: RingsProps) {
  return props.rings.textureFile ? <RingsTextured {...props} /> : <RingsProcedural {...props} />;
}

function RingsTextured({ rings, planetRadius, bodyRadiusKm }: RingsProps) {
  const inner = planetRadius * (rings.innerRadiusKm / bodyRadiusKm);
  const outer = planetRadius * (rings.outerRadiusKm / bodyRadiusKm);
  const geometry = useMemo(() => buildRingGeometry(inner, outer), [inner, outer]);
  const tex = useTexture(`/textures/${rings.textureFile}`);

  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial
        map={tex}
        alphaMap={tex}
        color={rings.color}
        transparent
        opacity={rings.opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function RingsProcedural({ rings, planetRadius, bodyRadiusKm }: RingsProps) {
  const inner = planetRadius * (rings.innerRadiusKm / bodyRadiusKm);
  const outer = planetRadius * (rings.outerRadiusKm / bodyRadiusKm);
  const geometry = useMemo(() => buildRingGeometry(inner, outer), [inner, outer]);

  return (
    <mesh geometry={geometry} rotation-x={-Math.PI / 2} receiveShadow>
      <meshStandardMaterial
        color={rings.color}
        transparent
        opacity={rings.opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
