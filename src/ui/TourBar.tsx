import { useAppStore } from '../state/store';
import { getBodyById } from '../data/bodies';
import { TOUR_STOPS } from '../data/tour';

export function TourBar() {
  const isTourActive = useAppStore((s) => s.isTourActive);
  const tourIndex = useAppStore((s) => s.tourIndex);
  const tourPlaying = useAppStore((s) => s.tourPlaying);
  const nextTourStep = useAppStore((s) => s.nextTourStep);
  const prevTourStep = useAppStore((s) => s.prevTourStep);
  const toggleTourPlaying = useAppStore((s) => s.toggleTourPlaying);
  const exitTour = useAppStore((s) => s.exitTour);

  if (!isTourActive) return null;

  const body = getBodyById(TOUR_STOPS[tourIndex]);

  return (
    <div className="pointer-events-auto fixed bottom-24 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-full px-2 py-2 flex items-center gap-1">
      <button
        onClick={prevTourStep}
        title="Previous stop"
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition"
      >
        ‹
      </button>
      <button
        onClick={toggleTourPlaying}
        title={tourPlaying ? 'Pause tour' : 'Resume tour'}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm bg-white/10 hover:bg-white/20 text-white transition"
      >
        {tourPlaying ? '⏸' : '▶'}
      </button>
      <button
        onClick={nextTourStep}
        title="Next stop"
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 transition"
      >
        ›
      </button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      <span className="px-2 text-sm text-slate-100 font-medium whitespace-nowrap">
        {body?.name ?? ''}
        <span className="text-slate-500">
          {' '}
          · {tourIndex + 1}/{TOUR_STOPS.length}
        </span>
      </span>
      <button
        onClick={exitTour}
        title="Exit tour"
        className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition ml-1"
      >
        ✕
      </button>
    </div>
  );
}
