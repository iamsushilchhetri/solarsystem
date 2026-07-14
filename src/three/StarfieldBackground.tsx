import * as THREE from 'three';
import { Stars, useTexture } from '@react-three/drei';
import { assetUrl } from '../utils/assetUrl';

export function StarfieldBackground() {
  const milkyWay = useTexture(assetUrl('textures/2k_stars_milky_way.jpg'));

  return (
    <>
      <mesh>
        <sphereGeometry args={[9000, 48, 48]} />
        <meshBasicMaterial map={milkyWay} side={THREE.BackSide} toneMapped={false} fog={false} />
      </mesh>
      <Stars radius={400} depth={100} count={7000} factor={4} saturation={0} fade speed={0.4} />
    </>
  );
}
