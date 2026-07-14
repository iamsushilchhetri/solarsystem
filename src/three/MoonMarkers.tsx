import { getBodyById, getMoonsOf, PLANETS } from '../data/bodies';
import { useAppStore } from '../state/store';
import { BodyMarker } from './PlanetMarkers';

const PLANET_IDS = new Set(PLANETS.map((p) => p.id));

/** Locator labels for the moons of whichever planet is currently focused (selected directly,
 * or via one of its own moons) — shown regardless of scale mode, since moons are always
 * small relative to their planet. */
export function MoonMarkers() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  if (!selectedBodyId) return null;

  const body = getBodyById(selectedBodyId);
  if (!body) return null;

  const parentPlanetId = body.kind === 'planet' ? body.id : body.parentId;
  if (!parentPlanetId || !PLANET_IDS.has(parentPlanetId)) return null;

  const moons = getMoonsOf(parentPlanetId);
  if (moons.length === 0) return null;

  return (
    <>
      {moons.map((m) => (
        <BodyMarker key={m.id} body={m} />
      ))}
    </>
  );
}
