import { useEffect } from 'react';
import { useAppStore } from '../state/store';
import { TOUR_STOPS, TOUR_STEP_SECONDS } from '../data/tour';

/** Drives the guided tour: selecting each stop's body reuses CameraRig's existing fly-to
 * animation, and a timer auto-advances to the next stop while playing. */
export function useTourEngine() {
  const isTourActive = useAppStore((s) => s.isTourActive);
  const tourIndex = useAppStore((s) => s.tourIndex);
  const tourPlaying = useAppStore((s) => s.tourPlaying);
  const setSelectedBody = useAppStore((s) => s.setSelectedBody);
  const nextTourStep = useAppStore((s) => s.nextTourStep);

  useEffect(() => {
    if (!isTourActive) return;
    setSelectedBody(TOUR_STOPS[tourIndex]);
  }, [isTourActive, tourIndex, setSelectedBody]);

  useEffect(() => {
    if (!isTourActive || !tourPlaying) return;
    const id = setTimeout(nextTourStep, TOUR_STEP_SECONDS * 1000);
    return () => clearTimeout(id);
  }, [isTourActive, tourPlaying, tourIndex, nextTourStep]);
}
