import { useAppStore } from '../state/store';
import { scaledOrbitDistance } from '../utils/astro';
import { getBodyById } from '../data/bodies';
import { Belt } from './Belt';

export function AsteroidBelt() {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const mars = getBodyById('mars')!;
  const jupiter = getBodyById('jupiter')!;
  const innerR = scaledOrbitDistance(mars.semiMajorAxisKm, scaleMode) + 1.6;
  const outerR = scaledOrbitDistance(jupiter.semiMajorAxisKm, scaleMode) - 3.2;

  return <Belt innerR={innerR} outerR={outerR} count={1500} color="#8f877a" yScale={0.6} />;
}
