import { useAppStore } from '../state/store';
import { scaledOrbitDistance } from '../utils/astro';
import { getBodyById } from '../data/bodies';
import { Belt } from './Belt';

export function KuiperBelt() {
  const scaleMode = useAppStore((s) => s.scaleMode);
  const neptune = getBodyById('neptune')!;
  const innerR = scaledOrbitDistance(neptune.semiMajorAxisKm * 1.05, scaleMode);
  const outerR = scaledOrbitDistance(neptune.semiMajorAxisKm * 1.8, scaleMode);

  return <Belt innerR={innerR} outerR={outerR} count={2200} color="#a9c2cf" yScale={2.5} />;
}
