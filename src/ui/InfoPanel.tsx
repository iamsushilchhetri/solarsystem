import { useAppStore } from '../state/store';
import { getBodyById, getMoonsOf } from '../data/bodies';
import {
  formatDistance,
  formatDuration,
  formatHours,
  formatNumber,
  formatScientific,
} from '../utils/astro';

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-white/5 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 text-right font-medium">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase tracking-wider text-cyan-300/80 mb-1.5 font-semibold">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export function InfoPanel() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  const distanceUnit = useAppStore((s) => s.distanceUnit);
  const setSelectedBody = useAppStore((s) => s.setSelectedBody);
  const compareList = useAppStore((s) => s.compareList);
  const toggleCompare = useAppStore((s) => s.toggleCompare);

  const body = selectedBodyId ? getBodyById(selectedBodyId) : undefined;
  if (!body) return null;

  const inCompare = compareList.includes(body.id);

  const moons = body.kind === 'planet' ? getMoonsOf(body.id) : [];
  const parent = body.parentId ? getBodyById(body.parentId) : undefined;

  return (
    <div className="pointer-events-auto fixed right-0 top-0 h-full w-full sm:w-[400px] glass-panel sm:border-l sm:border-t-0 sm:border-r-0 sm:border-b-0 overflow-y-auto no-scrollbar z-20 animate-[fadeIn_0.3s_ease]">
      <div className="p-5 pt-24">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">
              {body.kind === 'star' ? 'Star' : body.kind === 'moon' ? `Moon of ${parent?.name ?? ''}` : 'Planet'}
            </div>
            <h2 className="text-2xl font-semibold text-white text-glow" style={{ color: body.color }}>
              {body.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCompare(body.id)}
              title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                inCompare ? 'bg-cyan-400/20 text-cyan-200' : 'bg-white/5 text-slate-300 hover:bg-white/15'
              }`}
            >
              {inCompare ? '✓ Comparing' : '⚖ Compare'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedBody(null)}
              className="text-slate-400 hover:text-white text-xl leading-none px-2 py-1 rounded-full hover:bg-white/10 transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <Section title="Physical Characteristics">
          <DataRow label="Radius" value={`${formatNumber(body.radiusKm, { maximumFractionDigits: 0 })} km`} />
          <DataRow label="Diameter" value={`${formatNumber(body.diameterKm, { maximumFractionDigits: 0 })} km`} />
          <DataRow label="Mass" value={`${formatScientific(body.massKg)} kg`} />
          <DataRow label="Density" value={`${formatNumber(body.densityKgM3)} kg/m³`} />
          <DataRow label="Surface Gravity" value={`${body.gravityMs2.toFixed(2)} m/s²`} />
          <DataRow label="Escape Velocity" value={`${body.escapeVelocityKmS.toFixed(2)} km/s`} />
          <DataRow label="Surface Area" value={`${formatScientific(body.surfaceAreaKm2)} km²`} />
          <DataRow label="Volume" value={`${formatScientific(body.volumeKm3)} km³`} />
          <DataRow label="Mean Temperature" value={`${body.meanTempC.toFixed(0)} °C`} />
          {body.axialTiltDeg !== undefined && <DataRow label="Axial Tilt" value={`${body.axialTiltDeg.toFixed(2)}°`} />}
        </Section>

        <Section title="Motion">
          <DataRow label="Orbital Speed" value={`${body.orbitalSpeedKmS.toFixed(2)} km/s`} />
          <DataRow label="Rotation Period" value={formatHours(body.rotationPeriodH)} />
          {body.orbitalPeriodDays !== undefined && (
            <DataRow label="Orbital Period" value={formatDuration(body.orbitalPeriodDays)} />
          )}
          {!body.parentId && body.semiMajorAxisKm > 0 && (
            <DataRow label="Distance from Sun" value={formatDistance(body.semiMajorAxisKm, distanceUnit)} />
          )}
          {body.parentId && (
            <DataRow label={`Distance from ${parent?.name ?? 'parent'}`} value={formatDistance(body.semiMajorAxisKm, distanceUnit)} />
          )}
          {body.avgDistanceFromEarthKm && (
            <DataRow label="Avg. Distance from Earth" value={formatDistance(body.avgDistanceFromEarthKm, distanceUnit)} />
          )}
          <DataRow label="Eccentricity" value={body.eccentricity.toFixed(4)} />
        </Section>

        <Section title="Environment">
          <DataRow label="Number of Moons" value={String(body.numMoons)} />
          <DataRow label="Atmosphere" value={body.atmosphere} />
          <DataRow label="Magnetic Field" value={body.magneticField} />
          <DataRow label="Age" value={body.ageByr} />
          <DataRow label="Discovery" value={body.discovery} />
          {body.luminosityW && <DataRow label="Luminosity" value={`${formatScientific(body.luminosityW)} W`} />}
          {body.coreTempC && <DataRow label="Core Temperature" value={`${formatNumber(body.coreTempC)} °C`} />}
          {body.composition && <DataRow label="Composition" value={body.composition} />}
        </Section>

        {moons.length > 0 && (
          <Section title="Moons">
            <div className="flex flex-wrap gap-2">
              {moons.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedBody(m.id)}
                  className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/15 border border-white/10 text-slate-100 transition"
                >
                  {m.name}
                </button>
              ))}
            </div>
          </Section>
        )}

        <Section title="Fun Facts">
          <ul className="space-y-2">
            {body.funFacts.map((f, i) => (
              <li key={i} className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-400/30">
                {f}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
