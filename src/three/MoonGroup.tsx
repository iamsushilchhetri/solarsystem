import { getMoonsOf } from '../data/bodies';
import { Moon } from './Moon';

export function MoonGroup({ planetId, planetDisplayRadius }: { planetId: string; planetDisplayRadius: number }) {
  const moons = getMoonsOf(planetId);
  if (moons.length === 0) return null;
  return (
    <>
      {moons.map((m) => (
        <Moon key={m.id} body={m} parentDisplayRadius={planetDisplayRadius} />
      ))}
    </>
  );
}
