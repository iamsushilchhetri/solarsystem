import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const SunMaterial = shaderMaterial(
  { map: null as THREE.Texture | null, time: 0 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform sampler2D map;
    uniform float time;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = vUv;
      float n = noise(uv * 14.0 + vec2(time * 0.06, time * 0.09));
      float n2 = noise(uv * 34.0 - vec2(time * 0.11, time * 0.04));
      vec2 warped = uv + vec2(n, n2) * 0.012;
      vec3 base = texture2D(map, warped).rgb;
      float turbulence = n * 0.5 + n2 * 0.35;
      vec3 hot = vec3(1.0, 0.62, 0.22);
      vec3 color = mix(base, hot, clamp(turbulence * 0.4, 0.0, 1.0));
      color *= 1.4;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
);
