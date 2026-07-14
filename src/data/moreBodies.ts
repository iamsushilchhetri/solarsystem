import type { CelestialBody } from '../types/body';
import { AU_KM } from '../utils/constants';

function withGeometry(
  b: Omit<CelestialBody, 'diameterKm' | 'surfaceAreaKm2' | 'volumeKm3'>,
): CelestialBody {
  const r = b.radiusKm;
  return {
    ...b,
    diameterKm: r * 2,
    surfaceAreaKm2: 4 * Math.PI * r * r,
    volumeKm3: (4 / 3) * Math.PI * r * r * r,
  };
}

/** Dwarf planets — rendered via the same Sun-orbiting pipeline as moons (parentId: 'sun'). */
export const DWARF_PLANETS: CelestialBody[] = [
  withGeometry({
    id: 'pluto', name: 'Pluto', kind: 'dwarf', parentId: 'sun', procedural: true, color: '#cbb191',
    radiusKm: 1188.3, massKg: 1.303e22, densityKgM3: 1854, gravityMs2: 0.62, escapeVelocityKmS: 1.21,
    meanTempC: -225, orbitalSpeedKmS: 4.74, rotationPeriodH: 153.3, orbitalPeriodDays: 90_560,
    semiMajorAxisKm: 39.482 * AU_KM, eccentricity: 0.2488, axialTiltDeg: 122.53, numMoons: 5,
    atmosphere: 'Thin, seasonal: nitrogen, methane, carbon monoxide (partially freezes out as it recedes from the Sun)',
    magneticField: 'None known',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 1930 by Clyde Tombaugh',
    habitability: 'Not habitable — frozen surface averaging -225°C with only a wisp of atmosphere.',
    funFacts: [
      'Pluto was classified as the ninth planet from 1930 until being reclassified as a dwarf planet in 2006.',
      'Its largest moon, Charon, is over half Pluto’s size — the two are tidally locked, always showing the same face to each other.',
      'NASA’s New Horizons spacecraft gave humanity its first close-up images of Pluto in July 2015, revealing a heart-shaped nitrogen-ice plain.',
    ],
  }),
  withGeometry({
    id: 'ceres', name: 'Ceres', kind: 'dwarf', parentId: 'sun', textureFile: '2k_ceres_fictional.jpg', color: '#9c9488',
    radiusKm: 469.7, massKg: 9.3839e20, densityKgM3: 2162, gravityMs2: 0.284, escapeVelocityKmS: 0.516,
    meanTempC: -105, orbitalSpeedKmS: 17.92, rotationPeriodH: 9.074, orbitalPeriodDays: 1681.63,
    semiMajorAxisKm: 2.7675 * AU_KM, eccentricity: 0.0758, axialTiltDeg: 4, numMoons: 0,
    atmosphere: 'Trace water vapor, occasionally vented from surface ice',
    magneticField: 'None known',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 1801 by Giuseppe Piazzi — the first asteroid/dwarf planet ever found',
    habitability: 'Not habitable, but harbors a subsurface layer of briny water — of interest to astrobiology.',
    funFacts: [
      'Ceres is the largest object in the asteroid belt and the only dwarf planet located in the inner Solar System.',
      'It was originally classified as a planet, then an asteroid, and finally a dwarf planet in 2006.',
      'NASA’s Dawn mission orbited Ceres from 2015-2018, finding bright salt deposits in Occator crater.',
    ],
  }),
  withGeometry({
    id: 'eris', name: 'Eris', kind: 'dwarf', parentId: 'sun', textureFile: '2k_eris_fictional.jpg', color: '#d8d2c8',
    radiusKm: 1163, massKg: 1.6466e22, densityKgM3: 2520, gravityMs2: 0.81, escapeVelocityKmS: 1.38,
    meanTempC: -231, orbitalSpeedKmS: 3.63, rotationPeriodH: 25.9, orbitalPeriodDays: 203_830,
    semiMajorAxisKm: 68.0 * AU_KM, eccentricity: 0.44, axialTiltDeg: 78, numMoons: 1,
    atmosphere: 'Extremely thin, likely frozen onto the surface for most of its orbit',
    magneticField: 'None known',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 2005 by Mike Brown, Chad Trujillo & David Rabinowitz',
    habitability: 'Not habitable — one of the coldest, most distant known worlds in the Solar System.',
    funFacts: [
      'Eris is slightly smaller than Pluto in diameter but about 27% more massive.',
      'Its discovery directly triggered the 2006 IAU debate that created the "dwarf planet" category and demoted Pluto.',
      'Eris is named after the Greek goddess of strife and discord — fittingly, given the controversy it caused.',
    ],
  }),
  withGeometry({
    id: 'haumea', name: 'Haumea', kind: 'dwarf', parentId: 'sun', textureFile: '2k_haumea_fictional.jpg', color: '#e6e2da',
    radiusKm: 780, massKg: 4.006e21, densityKgM3: 1885, gravityMs2: 0.44, escapeVelocityKmS: 0.83,
    meanTempC: -241, orbitalSpeedKmS: 4.52, rotationPeriodH: 3.9155, orbitalPeriodDays: 103_774,
    semiMajorAxisKm: 43.13 * AU_KM, eccentricity: 0.191, axialTiltDeg: 126, numMoons: 2,
    atmosphere: 'None known',
    magneticField: 'None known',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 2004/2005 by teams led by Mike Brown and José Luis Ortiz',
    habitability: 'Not habitable — an icy, egg-shaped world at the edge of the Solar System.',
    funFacts: [
      'Haumea spins so fast (one "day" is under 4 hours) that it has been stretched into an elongated, egg-like shape.',
      'It has a thin ring system, discovered in 2017 — the first ring ever found around a trans-Neptunian object.',
      'Haumea is named after the Hawaiian goddess of childbirth, matching its two moons named after her daughters.',
    ],
  }),
  withGeometry({
    id: 'makemake', name: 'Makemake', kind: 'dwarf', parentId: 'sun', textureFile: '2k_makemake_fictional.jpg', color: '#c9a988',
    radiusKm: 715, massKg: 3.1e21, densityKgM3: 1700, gravityMs2: 0.4, escapeVelocityKmS: 0.76,
    meanTempC: -239, orbitalSpeedKmS: 4.46, rotationPeriodH: 22.48, orbitalPeriodDays: 111_845,
    semiMajorAxisKm: 45.79 * AU_KM, eccentricity: 0.159, axialTiltDeg: 0, numMoons: 1,
    atmosphere: 'None known (methane/nitrogen frost coats the surface)',
    magneticField: 'None known',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 2005 by Mike Brown and team',
    habitability: 'Not habitable — a frozen, reddish world coated in methane ice.',
    funFacts: [
      'Makemake is the second-brightest trans-Neptunian object in our sky after Pluto.',
      'It is named after the creator deity of the Rapa Nui people of Easter Island.',
      'Its single known moon is nicknamed "MK 2" and is much darker than Makemake itself.',
    ],
  }),
];

/** Human-made objects. ISS/JWST/Parker reuse the Sun/Earth "moon" orbit pipeline
 * (parentId 'earth' or 'sun'); Voyager 1/2 are on escape trajectories and are
 * rendered separately at a fixed illustrative position (see DeepSpaceProbes). */
export const SPACECRAFT: CelestialBody[] = [
  withGeometry({
    id: 'iss', name: 'International Space Station', kind: 'probe', parentId: 'earth', procedural: true, color: '#d8dee3',
    isArtificial: true, launchDate: 'First module launched Nov 20, 1998', missionStatus: 'Active — continuously crewed since Nov 2, 2000',
    radiusKm: 0.055, massKg: 419_725, densityKgM3: 0, gravityMs2: 0, escapeVelocityKmS: 0,
    meanTempC: 0, orbitalSpeedKmS: 7.66, rotationPeriodH: 0, orbitalPeriodDays: 0.0646,
    semiMajorAxisKm: 6779, eccentricity: 0.0003, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'N/A — pressurized habitat inside, vacuum outside', magneticField: 'N/A',
    ageByr: 'N/A', discovery: 'A joint NASA/Roscosmos/ESA/JAXA/CSA program',
    funFacts: [
      'The ISS orbits Earth roughly every 93 minutes — astronauts on board see about 16 sunrises and sunsets a day.',
      'It is the largest human-made structure ever assembled in space, about the size of a football field.',
      'It travels at roughly 7.66 km/s (over 27,000 km/h) to stay in orbit.',
    ],
  }),
  withGeometry({
    id: 'jwst', name: 'James Webb Space Telescope', kind: 'probe', parentId: 'earth', procedural: true, color: '#f2d98a',
    isArtificial: true, launchDate: 'Launched Dec 25, 2021 (NASA/ESA/CSA, Ariane 5)', missionStatus: 'Active — science operations since July 2022',
    radiusKm: 0.02, massKg: 6200, densityKgM3: 0, gravityMs2: 0, escapeVelocityKmS: 0,
    meanTempC: -223, orbitalSpeedKmS: 0.02, rotationPeriodH: 0, orbitalPeriodDays: 180,
    semiMajorAxisKm: 1_500_000, eccentricity: 0.02, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'N/A', magneticField: 'N/A',
    ageByr: 'N/A', discovery: 'The largest and most powerful space telescope ever built',
    funFacts: [
      'JWST orbits the Sun-Earth L2 Lagrange point, about 1.5 million km beyond Earth (four times farther than the Moon).',
      'Its 6.5m gold-coated mirror and infrared instruments can see some of the first galaxies formed after the Big Bang.',
      'It operates at about -223°C, kept cold by a tennis-court-sized five-layer sunshield.',
    ],
  }),
  withGeometry({
    id: 'parker', name: 'Parker Solar Probe', kind: 'probe', parentId: 'sun', procedural: true, color: '#8f8f96',
    isArtificial: true, launchDate: 'Launched Aug 12, 2018', missionStatus: 'Active — closest human-made object ever to the Sun',
    radiusKm: 0.0015, massKg: 685, densityKgM3: 0, gravityMs2: 0, escapeVelocityKmS: 0,
    meanTempC: 0, orbitalSpeedKmS: 192, rotationPeriodH: 0, orbitalPeriodDays: 88,
    semiMajorAxisKm: 57_300_000, eccentricity: 0.8935, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'N/A', magneticField: 'N/A',
    ageByr: 'N/A', discovery: 'NASA’s mission to "touch the Sun"',
    funFacts: [
      'At closest approach it is protected by an 11.5cm carbon-composite heat shield facing temperatures over 1,370°C.',
      'It is the fastest human-made object ever built, reaching about 192 km/s (690,000 km/h) at closest approach to the Sun.',
      'It uses repeated Venus gravity assists to gradually tighten its orbit closer and closer to the Sun.',
    ],
  }),
];

/** Comets — highly eccentric Sun-orbiting bodies, rendered with a dedicated tail effect. */
export const COMETS: CelestialBody[] = [
  withGeometry({
    id: 'halley', name: "Halley's Comet", kind: 'comet', parentId: 'sun', procedural: true, color: '#dce8f0',
    radiusKm: 5.5, massKg: 2.2e14, densityKgM3: 600, gravityMs2: 0.0000089, escapeVelocityKmS: 0.001,
    meanTempC: -196, orbitalSpeedKmS: 2.9, rotationPeriodH: 52.8, orbitalPeriodDays: 27_740,
    semiMajorAxisKm: 17.8 * AU_KM, eccentricity: 0.967, inclinationDeg: 162.3, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'Transient coma of gas and dust when near the Sun (sublimating ice)',
    magneticField: 'None',
    ageByr: '4.5 billion years',
    discovery: 'Recorded since at least 240 BC; recognized as periodic by Edmond Halley in 1705',
    funFacts: [
      'Halley’s Comet returns to the inner Solar System roughly every 76 years — last seen in 1986, next due in 2061.',
      'It orbits retrograde (backwards) and steeply tilted compared to the planets.',
      'Its tail always points away from the Sun, pushed by solar wind and radiation pressure — not trailing behind its motion.',
    ],
  }),
  withGeometry({
    id: 'encke', name: 'Comet Encke', kind: 'comet', parentId: 'sun', procedural: true, color: '#e0d8c8',
    radiusKm: 2.4, massKg: 9.2e13, densityKgM3: 400, gravityMs2: 0.0000043, escapeVelocityKmS: 0.0005,
    meanTempC: -150, orbitalSpeedKmS: 15, rotationPeriodH: 15.1, orbitalPeriodDays: 1204,
    semiMajorAxisKm: 2.22 * AU_KM, eccentricity: 0.848, inclinationDeg: 11.8, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'Transient coma when near the Sun',
    magneticField: 'None',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 1786; orbit computed by Johann Franz Encke in 1819',
    funFacts: [
      'Comet Encke has the shortest orbital period of any known comet, at just 3.3 years.',
      'It has been observed on over 60 return trips since its discovery.',
      'It is the namesake of the Encke Gap, a division in Saturn’s rings caused by a similarly-named moon, Pan — an unrelated coincidence.',
    ],
  }),
  withGeometry({
    id: 'halebopp', name: 'Hale-Bopp', kind: 'comet', parentId: 'sun', procedural: true, color: '#f0ede0',
    radiusKm: 60, massKg: 2.1e16, densityKgM3: 400, gravityMs2: 0.0000315, escapeVelocityKmS: 0.0019,
    meanTempC: -190, orbitalSpeedKmS: 1, rotationPeriodH: 11.35, orbitalPeriodDays: 925_000,
    semiMajorAxisKm: 186 * AU_KM, eccentricity: 0.995, inclinationDeg: 89.4, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'Enormous coma and dual dust/ion tails when near the Sun',
    magneticField: 'None',
    ageByr: '4.5 billion years',
    discovery: 'Discovered 1995 by Alan Hale and Thomas Bopp',
    funFacts: [
      'Hale-Bopp was visible to the naked eye for a record 18 months in 1996-97.',
      'Its nucleus is unusually large — roughly 60km across, far bigger than most comets.',
      'It will not return to the inner Solar System for about 2,500 years.',
    ],
  }),
];

/** Voyager 1 & 2 are on one-way interstellar escape trajectories, not closed orbits,
 * so they are positioned at a fixed illustrative heading/distance rather than animated
 * along an orbit (see DeepSpaceProbes.tsx). Real current distances are stated in text. */
export const PROBES: CelestialBody[] = [
  withGeometry({
    id: 'voyager1', name: 'Voyager 1', kind: 'probe', procedural: true, color: '#c7c9cc',
    isArtificial: true, launchDate: 'Launched Sep 5, 1977', missionStatus: 'Active — most distant human-made object, in interstellar space since Aug 2012',
    headingDeg: 35, tiltDeg: 22, distanceMultiplierVsNeptune: 1.2,
    radiusKm: 0.002, massKg: 722, densityKgM3: 0, gravityMs2: 0, escapeVelocityKmS: 0,
    meanTempC: 0, orbitalSpeedKmS: 17.0, rotationPeriodH: 0,
    semiMajorAxisKm: 0, eccentricity: 0, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'N/A', magneticField: 'N/A', ageByr: 'N/A',
    discovery: 'As of 2026, roughly 166 AU (~24.8 billion km) from the Sun — shown here far closer in for visibility',
    funFacts: [
      'Voyager 1 carries the Golden Record, a phonograph disc with sounds and images meant to represent humanity to any spacefaring civilization that finds it.',
      'It is moving away from the Sun at about 17 km/s and will not make a close approach to another star for roughly 40,000 years.',
      'Its radio signals now take over 22 hours to reach Earth.',
    ],
  }),
  withGeometry({
    id: 'voyager2', name: 'Voyager 2', kind: 'probe', procedural: true, color: '#b8babe',
    isArtificial: true, launchDate: 'Launched Aug 20, 1977', missionStatus: 'Active — in interstellar space since Nov 2018',
    headingDeg: 200, tiltDeg: -30, distanceMultiplierVsNeptune: 1.1,
    radiusKm: 0.002, massKg: 722, densityKgM3: 0, gravityMs2: 0, escapeVelocityKmS: 0,
    meanTempC: 0, orbitalSpeedKmS: 15.4, rotationPeriodH: 0,
    semiMajorAxisKm: 0, eccentricity: 0, axialTiltDeg: 0, numMoons: 0,
    atmosphere: 'N/A', magneticField: 'N/A', ageByr: 'N/A',
    discovery: 'As of 2026, roughly 139 AU (~20.8 billion km) from the Sun — shown here far closer in for visibility',
    funFacts: [
      'Voyager 2 is the only spacecraft to have ever visited Uranus and Neptune, flying past both in the late 1980s.',
      'Despite its number, Voyager 2 launched slightly before Voyager 1, on a slower trajectory.',
      'It carries the same Golden Record as Voyager 1.',
    ],
  }),
];
