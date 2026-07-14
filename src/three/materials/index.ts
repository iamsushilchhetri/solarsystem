import { extend } from '@react-three/fiber';
import { SunMaterial } from './SunMaterial';
import { GlowMaterial } from './GlowMaterial';
import { EarthMaterial } from './EarthMaterial';

extend({ SunMaterial, GlowMaterial, EarthMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    sunMaterial: any;
    glowMaterial: any;
    earthMaterial: any;
  }
}

export { SunMaterial, GlowMaterial, EarthMaterial };
