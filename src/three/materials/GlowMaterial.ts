import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

/** Fresnel rim-glow shader shared by the Sun's corona and planetary atmosphere shells. */
export const GlowMaterial = shaderMaterial(
  {
    glowColor: new THREE.Color('#ffcc66'),
    time: 0,
    power: 2.5,
    intensity: 1.0,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 glowColor;
    uniform float time;
    uniform float power;
    uniform float intensity;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), power);
      float flicker = 0.9 + 0.1 * sin(time * 2.2);
      gl_FragColor = vec4(glowColor, fresnel * intensity * flicker);
    }
  `,
);
