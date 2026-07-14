import { useEffect } from 'react';
import { useAppStore } from '../state/store';
import { getBodyById } from '../data/bodies';
import type { DistanceUnit, ScaleMode } from '../utils/astro';

const VALID_UNITS: DistanceUnit[] = ['km', 'au', 'lightMin'];
const VALID_SCALES: ScaleMode[] = ['educational', 'realistic'];

/** Reads ?body=&scale=&unit=&tour= from the URL once on load, then keeps the URL in sync
 * with that state afterward so the current view can be bookmarked or shared as a link. */
export function useUrlSync() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bodyId = params.get('body');
    const scale = params.get('scale');
    const unit = params.get('unit');
    const { requestScaleMode, setDistanceUnit, setSelectedBody, startTour } =
      useAppStore.getState();

    if (scale && (VALID_SCALES as string[]).includes(scale)) {
      requestScaleMode(scale as ScaleMode);
    }
    if (unit && (VALID_UNITS as string[]).includes(unit)) {
      setDistanceUnit(unit as DistanceUnit);
    }
    if (params.get('tour') === '1') {
      startTour();
    } else if (bodyId && getBodyById(bodyId)) {
      setSelectedBody(bodyId);
    }
  }, []);

  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  const scaleMode = useAppStore((s) => s.scaleMode);
  const distanceUnit = useAppStore((s) => s.distanceUnit);
  const isTourActive = useAppStore((s) => s.isTourActive);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBodyId && !isTourActive) params.set('body', selectedBodyId);
    if (scaleMode !== 'educational') params.set('scale', scaleMode);
    if (distanceUnit !== 'km') params.set('unit', distanceUnit);
    if (isTourActive) params.set('tour', '1');

    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
    window.history.replaceState(null, '', url);
  }, [selectedBodyId, scaleMode, distanceUnit, isTourActive]);
}
