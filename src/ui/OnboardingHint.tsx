import { useEffect, useState } from 'react';

const STORAGE_KEY = 'solarsystem:seenIntro';

export function OnboardingHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="pointer-events-auto fixed top-24 left-5 z-40 glass-panel rounded-2xl p-4 max-w-xs animate-[fadeIn_0.4s_ease]">
      <p className="text-sm text-slate-200 leading-relaxed">
        <span className="font-semibold text-white">Welcome aboard.</span> Drag to orbit, scroll to zoom, and click
        any planet or moon to explore it. Try the <span className="text-cyan-300">🔭 Tour</span> for a guided
        flythrough.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 px-3 py-1.5 rounded-full text-xs bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/30 transition"
      >
        Got it
      </button>
    </div>
  );
}
