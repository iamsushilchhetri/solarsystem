import { create } from 'zustand';
import type { ScaleMode, DistanceUnit } from '../utils/astro';
import { TOUR_STOPS } from '../data/tour';

export type CameraMode = 'orbit' | 'free';

interface AppState {
  selectedBodyId: string | null;
  hoveredBodyId: string | null;
  cameraMode: CameraMode;

  isPaused: boolean;
  speedMultiplier: number;
  isReversed: boolean;

  scaleMode: ScaleMode;
  pendingScaleMode: ScaleMode | null;

  distanceUnit: DistanceUnit;
  searchQuery: string;

  compareList: string[];
  isCompareOpen: boolean;

  activeConceptId: string | null;
  showPhysicsVectors: boolean;

  isTourActive: boolean;
  tourIndex: number;
  tourPlaying: boolean;

  setSelectedBody: (id: string | null) => void;
  setHoveredBody: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;

  togglePause: () => void;
  setSpeed: (n: number) => void;
  toggleReverse: () => void;

  requestScaleMode: (mode: ScaleMode) => void;
  confirmScaleMode: () => void;
  cancelScaleMode: () => void;

  setDistanceUnit: (unit: DistanceUnit) => void;
  setSearchQuery: (q: string) => void;

  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  setCompareOpen: (open: boolean) => void;

  setActiveConcept: (id: string | null) => void;
  toggleShowPhysicsVectors: () => void;

  startTour: () => void;
  exitTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  toggleTourPlaying: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedBodyId: null,
  hoveredBodyId: null,
  cameraMode: 'orbit',

  isPaused: false,
  speedMultiplier: 1,
  isReversed: false,

  scaleMode: 'realistic',
  pendingScaleMode: null,

  distanceUnit: 'km',
  searchQuery: '',

  compareList: [],
  isCompareOpen: false,

  activeConceptId: null,
  showPhysicsVectors: false,

  isTourActive: false,
  tourIndex: 0,
  tourPlaying: true,

  setSelectedBody: (id) =>
    set((s) => {
      // Any manual selection that isn't the tour's own current stop (clicking a planet,
      // searching, closing the panel) implicitly ends the guided tour so the TourBar
      // never drifts out of sync with what's actually focused.
      if (s.isTourActive && id !== TOUR_STOPS[s.tourIndex]) {
        return { selectedBodyId: id, isTourActive: false, tourPlaying: false };
      }
      return { selectedBodyId: id };
    }),
  setHoveredBody: (id) => set({ hoveredBodyId: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),

  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  setSpeed: (n) => set({ speedMultiplier: n, isPaused: false }),
  toggleReverse: () => set((s) => ({ isReversed: !s.isReversed })),

  requestScaleMode: (mode) => {
    if (mode === 'realistic' && get().scaleMode !== 'realistic') {
      set({ pendingScaleMode: mode });
    } else {
      set({ scaleMode: mode, pendingScaleMode: null });
    }
  },
  confirmScaleMode: () =>
    set((s) => ({ scaleMode: s.pendingScaleMode ?? s.scaleMode, pendingScaleMode: null })),
  cancelScaleMode: () => set({ pendingScaleMode: null }),

  setDistanceUnit: (unit) => set({ distanceUnit: unit }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  toggleCompare: (id) =>
    set((s) => {
      const has = s.compareList.includes(id);
      const next = has ? s.compareList.filter((x) => x !== id) : [...s.compareList, id].slice(0, 4);
      return { compareList: next, isCompareOpen: has ? s.isCompareOpen : true };
    }),
  removeCompare: (id) => set((s) => ({ compareList: s.compareList.filter((x) => x !== id) })),
  clearCompare: () => set({ compareList: [], isCompareOpen: false }),
  setCompareOpen: (open) => set({ isCompareOpen: open }),

  setActiveConcept: (id) => set({ activeConceptId: id }),
  toggleShowPhysicsVectors: () => set((s) => ({ showPhysicsVectors: !s.showPhysicsVectors })),

  startTour: () => set({ isTourActive: true, tourIndex: 0, tourPlaying: true }),
  exitTour: () => set({ isTourActive: false, tourPlaying: false, selectedBodyId: null }),
  nextTourStep: () => set((s) => ({ tourIndex: (s.tourIndex + 1) % TOUR_STOPS.length })),
  prevTourStep: () =>
    set((s) => ({ tourIndex: (s.tourIndex - 1 + TOUR_STOPS.length) % TOUR_STOPS.length })),
  toggleTourPlaying: () => set((s) => ({ tourPlaying: !s.tourPlaying })),
}));

/** Mutable, non-reactive simulation clock — read/written every frame outside React state
 * to avoid re-rendering the component tree 60x/sec. */
export const simClock = { daysElapsed: 0 };
