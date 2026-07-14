import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      const fadeTimer = setTimeout(() => setFading(true), 300);
      const removeTimer = setTimeout(() => setVisible(false), 1000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-20 h-20">
        <div
          className="absolute rounded-full bg-amber-300 shadow-[0_0_40px_12px_rgba(251,191,36,0.35)]"
          style={{ width: 26, height: 26, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
        <div className="absolute inset-0" style={{ animation: 'orbit-spin 2.2s linear infinite' }}>
          <div
            className="absolute rounded-full bg-cyan-300"
            style={{
              width: 9,
              height: 9,
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 8px rgba(103,232,249,0.8)',
            }}
          />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold text-white text-glow tracking-wide">Solar System Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">Loading textures…</p>
      </div>

      <div className="w-56 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-amber-300 rounded-full transition-[width] duration-200"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="text-[11px] text-slate-500 tabular-nums">{Math.round(progress)}%</div>
    </div>
  );
}
