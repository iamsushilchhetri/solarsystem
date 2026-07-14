import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const EarthMaterial = shaderMaterial(
  {
    dayMap: null as THREE.Texture | null,
    nightMap: null as THREE.Texture | null,
    cloudsMap: null as THREE.Texture | null,
    sunDirection: new THREE.Vector3(1, 0, 0),
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform sampler2D cloudsMap;
    uniform vec3 sunDirection;
    varying vec2 vUv;
    varying vec3 vWorldNormal;

    void main() {
      vec3 day = texture2D(dayMap, vUv).rgb;
      vec3 night = texture2D(nightMap, vUv).rgb;
      float cloud = texture2D(cloudsMap, vUv).r;

      float ndotl = dot(normalize(vWorldNormal), normalize(sunDirection));
      float mixFactor = smoothstep(-0.2, 0.15, ndotl);

      vec3 surface = mix(night * vec3(1.4, 1.2, 0.8), day, mixFactor);
      surface = mix(surface, vec3(1.0), cloud * mixFactor * 0.8);
      surface += night * (1.0 - mixFactor) * cloud * 0.05;

      gl_FragColor = vec4(surface, 1.0);
    }
  `,
);
