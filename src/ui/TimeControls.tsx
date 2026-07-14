import { useAppStore } from '../state/store';

const SPEEDS = [1, 10, 100, 1000, 10000];

export function TimeControls() {
  const isPaused = useAppStore((s) => s.isPaused);
  const togglePause = useAppStore((s) => s.togglePause);
  const speedMultiplier = useAppStore((s) => s.speedMultiplier);
  const setSpeed = useAppStore((s) => s.setSpeed);
  const isReversed = useAppStore((s) => s.isReversed);
  const toggleReverse = useAppStore((s) => s.toggleReverse);

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-full px-2 py-2 flex items-center gap-1">
      <button
        onClick={toggleReverse}
        title="Reverse time direction"
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition ${
          isReversed ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-300 hover:bg-white/10'
        }`}
      >
        ⏪
      </button>
      <button
        onClick={togglePause}
        title={isPaused ? 'Play' : 'Pause'}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm bg-white/10 hover:bg-white/20 text-white transition"
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      <div className="w-px h-6 bg-white/10 mx-1" />
      {SPEEDS.map((s) => (
        <button
          key={s}
          onClick={() => setSpeed(s)}
          className={`px-3 h-9 rounded-full text-xs transition ${
            !isPaused && speedMultiplier === s ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          {s}×
        </button>
      ))}
    </div>
  );
}
