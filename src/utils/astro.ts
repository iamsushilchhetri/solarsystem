import { AU_KM, LIGHT_MINUTE_KM, REALISTIC_KM_PER_UNIT, EDU_REFERENCE_RADIUS_KM } from './constants';

export type ScaleMode = 'educational' | 'realistic';
export type DistanceUnit = 'km' | 'au' | 'lightMin';

/** Display radius (scene units) for a body's real radius, in the given scale mode. */
export function scaledRadius(radiusKm: number, mode: ScaleMode): number {
  if (mode === 'realistic') {
    return radiusKm / REALISTIC_KM_PER_UNIT;
  }
  const ratio = radiusKm / EDU_REFERENCE_RADIUS_KM;
  return clamp(Math.cbrt(ratio) * 0.9, 0.32, 2.3);
}

/** Display distance (scene units) from the Sun for a planet's real semi-major axis. */
export function scaledOrbitDistance(semiMajorAxisKm: number, mode: ScaleMode): number {
  if (mode === 'realistic') {
    return semiMajorAxisKm / REALISTIC_KM_PER_UNIT;
  }
  const au = semiMajorAxisKm / AU_KM;
  return 8 + Math.sqrt(au) * 6;
}

/** Display distance (scene units) from a parent planet for a moon's real semi-major axis. */
export function scaledMoonDistance(
  distanceKm: number,
  parentDisplayRadius: number,
  mode: ScaleMode,
): number {
  if (mode === 'realistic') {
    return parentDisplayRadius + distanceKm / REALISTIC_KM_PER_UNIT;
  }
  return parentDisplayRadius + 0.9 + Math.sqrt(Math.abs(distanceKm) / 50_000) * 0.9;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * Angle (radians) of a body along its orbit at simulated time `daysElapsed`, using a simple
 * elliptical (Keplerian, uniform mean-motion approximation) orbit — accurate enough visually
 * while keeping the math cheap per-frame.
 */
export function orbitAngle(daysElapsed: number, orbitalPeriodDays: number, phaseOffset = 0): number {
  if (!orbitalPeriodDays) return phaseOffset;
  const fraction = daysElapsed / orbitalPeriodDays;
  return phaseOffset + fraction * Math.PI * 2;
}

/** Position on an ellipse (focus at origin) for a given true-anomaly-ish angle. */
export function ellipsePosition(
  semiMajorAxisDisplay: number,
  eccentricity: number,
  angle: number,
): { x: number; z: number } {
  const a = semiMajorAxisDisplay;
  const b = a * Math.sqrt(1 - eccentricity * eccentricity);
  const c = a * eccentricity; // focus offset so the Sun sits at a focus, not the center
  return {
    x: a * Math.cos(angle) - c,
    z: b * Math.sin(angle),
  };
}

/** Self-rotation angle (radians) at simulated time, from a rotation period in hours. */
export function rotationAngle(hoursElapsed: number, rotationPeriodH: number): number {
  if (!rotationPeriodH) return 0;
  const fraction = hoursElapsed / rotationPeriodH;
  return fraction * Math.PI * 2;
}

export function formatDistance(km: number, unit: DistanceUnit): string {
  switch (unit) {
    case 'au':
      return `${(km / AU_KM).toLocaleString(undefined, { maximumFractionDigits: 3 })} AU`;
    case 'lightMin':
      return `${(km / LIGHT_MINUTE_KM).toLocaleString(undefined, { maximumFractionDigits: 3 })} light-min`;
    default:
      return `${Math.round(km).toLocaleString()} km`;
  }
}

export function formatNumber(n: number, opts?: Intl.NumberFormatOptions): string {
  return n.toLocaleString(undefined, opts);
}

export function formatScientific(n: number, digits = 3): string {
  if (n === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mantissa = n / 10 ** exp;
  const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const expStr = String(exp)
    .split('')
    .map((c) => (c === '-' ? '⁻' : supers[Number(c)]))
    .join('');
  return `${mantissa.toFixed(digits)} × 10${expStr}`;
}

export function formatDuration(days: number): string {
  const abs = Math.abs(days);
  if (abs >= 365.25) return `${(days / 365.25).toFixed(2)} years`;
  return `${days.toFixed(2)} days`;
}

export function formatHours(hours: number): string {
  const abs = Math.abs(hours);
  const sign = hours < 0 ? '(retrograde) ' : '';
  if (abs >= 24) {
    const d = Math.floor(abs / 24);
    const h = Math.round(abs % 24);
    return `${sign}${d}d ${h}h`;
  }
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `${sign}${h}h ${m}m`;
}
