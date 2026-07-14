export type BodyKind = 'star' | 'planet' | 'moon' | 'dwarf' | 'probe' | 'comet';

export interface RingData {
  innerRadiusKm: number;
  outerRadiusKm: number;
  textureFile?: string;
  color: string;
  opacity: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  kind: BodyKind;
  parentId?: string;

  /** filename in /textures, or undefined if procedural */
  textureFile?: string;
  /** base color used for procedural shading / fallback / point light tint */
  color: string;
  procedural?: boolean;

  radiusKm: number;
  diameterKm: number;
  massKg: number;
  densityKgM3: number;
  gravityMs2: number;
  escapeVelocityKmS: number;
  surfaceAreaKm2: number;
  volumeKm3: number;
  meanTempC: number;
  orbitalSpeedKmS: number;
  /** hours; negative = retrograde rotation */
  rotationPeriodH: number;
  /** days; not present for the Sun */
  orbitalPeriodDays?: number;
  /** semi-major axis in km: distance from Sun for planets, from parent for moons */
  semiMajorAxisKm: number;
  eccentricity: number;
  /** orbital plane tilt relative to the ecliptic, in degrees (0 for the Sun and, for simplicity, moons) */
  inclinationDeg?: number;
  axialTiltDeg: number;
  numMoons: number;
  atmosphere: string;
  magneticField: string;
  ageByr: string;
  discovery: string;
  funFacts: string[];
  rings?: RingData;
  hasClouds?: boolean;
  cloudTextureFile?: string;
  hasNightLights?: boolean;
  nightTextureFile?: string;
  /** approximate average distance from Earth in km (planets only) */
  avgDistanceFromEarthKm?: number;
  /** short habitability blurb (planets only) */
  habitability?: string;

  // Sun-only extras
  luminosityW?: number;
  coreTempC?: number;
  composition?: string;

  // Human-made objects (ISS, JWST, Parker Solar Probe): the InfoPanel shows a leaner
  // "Mission" section instead of natural-body stats like density/gravity/escape velocity.
  isArtificial?: boolean;
  launchDate?: string;
  missionStatus?: string;

  // 'probe' kind only: fixed illustrative heading/distance for bodies on an escape
  // trajectory (Voyager 1/2) rather than a closed orbit.
  headingDeg?: number;
  tiltDeg?: number;
  distanceMultiplierVsNeptune?: number;
}
