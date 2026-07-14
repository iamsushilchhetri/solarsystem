import { useFrame } from '@react-three/fiber';
import { useAppStore, simClock } from '../state/store';

const BASE_DAYS_PER_SECOND = 1;

/** Advances the shared, non-reactive sim clock every frame. Renders nothing. */
export function SimClockDriver() {
  useFrame((_, delta) => {
    const { isPaused, speedMultiplier, isReversed } = useAppStore.getState();
    if (isPaused) return;
    const sign = isReversed ? -1 : 1;
    const dt = Math.min(delta, 0.1);
    simClock.daysElapsed += dt * BASE_DAYS_PER_SECOND * speedMultiplier * sign;
  });
  return null;
}
