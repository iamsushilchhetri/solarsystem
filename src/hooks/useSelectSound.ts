import { useEffect, useRef } from 'react';
import { useAppStore } from '../state/store';
import { playSelectBlip } from '../audio/ambientEngine';

/** Plays a soft chime whenever a body becomes selected, skipping the initial mount/deep-link
 * restore so it only fires on actual user-driven selections. */
export function useSelectSound() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  const isSoundOn = useAppStore((s) => s.isSoundOn);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (selectedBodyId && isSoundOn) playSelectBlip();
  }, [selectedBodyId, isSoundOn]);
}
