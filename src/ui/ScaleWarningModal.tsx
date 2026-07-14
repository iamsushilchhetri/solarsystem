import { useAppStore } from '../state/store';

export function ScaleWarningModal() {
  const pendingScaleMode = useAppStore((s) => s.pendingScaleMode);
  const confirmScaleMode = useAppStore((s) => s.confirmScaleMode);
  const cancelScaleMode = useAppStore((s) => s.cancelScaleMode);

  if (!pendingScaleMode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto">
      <div className="glass-panel rounded-2xl max-w-md p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Switching to Realistic Scale</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          At true-to-life scale, planets are almost imperceptibly small compared to the distances
          between them — Earth becomes a speck roughly 150 million km from the Sun. Inner planets
          will be tiny and far apart, and you may need to zoom and pan a lot to find them. This mode
          is great for appreciating how empty space really is, but Educational scale is easier for
          browsing and learning.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={cancelScaleMode}
            className="px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirmScaleMode}
            className="px-4 py-2 rounded-full text-sm bg-cyan-400/20 text-cyan-200 hover:bg-cyan-400/30 transition"
          >
            Switch anyway
          </button>
        </div>
      </div>
    </div>
  );
}
