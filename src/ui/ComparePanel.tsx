import type { CelestialBody } from '../types/body';
import { useAppStore } from '../state/store';
import { getBodyById } from '../data/bodies';
import { formatNumber, formatScientific, formatDistance, formatDuration } from '../utils/astro';

const MAX_DIAMETER_PX = 150;

export function ComparePanel() {
  const compareList = useAppStore((s) => s.compareList);
  const isCompareOpen = useAppStore((s) => s.isCompareOpen);
  const removeCompare = useAppStore((s) => s.removeCompare);
  const clearCompare = useAppStore((s) => s.clearCompare);
  const setCompareOpen = useAppStore((s) => s.setCompareOpen);
  const distanceUnit = useAppStore((s) => s.distanceUnit);

  if (!isCompareOpen) return null;

  const bodies = compareList
    .map((id) => getBodyById(id))
    .filter((b): b is CelestialBody => b !== undefined);
  if (bodies.length === 0) return null;

  const maxRadius = Math.max(...bodies.map((b) => b.radiusKm));

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto no-scrollbar p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Compare</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setCompareOpen(false)}
              className="text-slate-400 hover:text-white text-xl leading-none px-2 py-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex items-end justify-center gap-6 mb-6 flex-wrap" style={{ minHeight: MAX_DIAMETER_PX + 50 }}>
          {bodies.map((b) => {
            const diameter = Math.max(4, (b.radiusKm / maxRadius) * MAX_DIAMETER_PX);
            return (
              <div key={b.id} className="flex flex-col items-center gap-2">
                <div className="flex items-end justify-center" style={{ height: MAX_DIAMETER_PX }}>
                  <div
                    className="rounded-full"
                    style={{ width: diameter, height: diameter, background: b.color, boxShadow: `0 0 20px ${b.color}55` }}
                  />
                </div>
                <span className="text-sm text-white font-medium">{b.name}</span>
                <button
                  type="button"
                  onClick={() => removeCompare(b.id)}
                  className="text-[10px] text-slate-500 hover:text-red-300 transition"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-2 pr-4 font-semibold">Metric</th>
                {bodies.map((b) => (
                  <th key={b.id} className="py-2 px-3 font-semibold text-slate-200 whitespace-nowrap">
                    {b.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Radius" bodies={bodies} value={(b) => `${formatNumber(b.radiusKm, { maximumFractionDigits: 0 })} km`} />
              <CompareRow label="Mass" bodies={bodies} value={(b) => `${formatScientific(b.massKg)} kg`} />
              <CompareRow label="Surface Gravity" bodies={bodies} value={(b) => `${b.gravityMs2.toFixed(2)} m/s²`} />
              <CompareRow label="Mean Temperature" bodies={bodies} value={(b) => `${b.meanTempC.toFixed(0)} °C`} />
              <CompareRow
                label="Orbital Period"
                bodies={bodies}
                value={(b) => (b.orbitalPeriodDays !== undefined ? formatDuration(b.orbitalPeriodDays) : '—')}
              />
              <CompareRow
                label="Distance from Sun"
                bodies={bodies}
                value={(b) => (!b.parentId && b.semiMajorAxisKm > 0 ? formatDistance(b.semiMajorAxisKm, distanceUnit) : '—')}
              />
              <CompareRow label="Number of Moons" bodies={bodies} value={(b) => String(b.numMoons)} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  bodies,
  value,
}: {
  label: string;
  bodies: CelestialBody[];
  value: (b: CelestialBody) => string;
}) {
  return (
    <tr className="border-t border-white/5">
      <td className="py-2 pr-4 text-slate-400">{label}</td>
      {bodies.map((b) => (
        <td key={b.id} className="py-2 px-3 text-slate-100 font-medium whitespace-nowrap">
          {value(b)}
        </td>
      ))}
    </tr>
  );
}
