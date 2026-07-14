import { useAppStore } from '../state/store';

export function SoundToggle() {
  const isSoundOn = useAppStore((s) => s.isSoundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={isSoundOn ? 'Mute ambient sound' : 'Enable ambient sound'}
      className="pointer-events-auto fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-lg text-slate-300 hover:text-white transition"
    >
      {isSoundOn ? '🔊' : '🔇'}
    </button>
  );
}
