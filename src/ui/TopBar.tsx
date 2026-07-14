import { useMemo, useState } from 'react';
import { useAppStore } from '../state/store';
import { ALL_BODIES } from '../data/bodies';

export function TopBar() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setSelectedBody = useAppStore((s) => s.setSelectedBody);
  const scaleMode = useAppStore((s) => s.scaleMode);
  const requestScaleMode = useAppStore((s) => s.requestScaleMode);
  const distanceUnit = useAppStore((s) => s.distanceUnit);
  const setDistanceUnit = useAppStore((s) => s.setDistanceUnit);
  const isTourActive = useAppStore((s) => s.isTourActive);
  const startTour = useAppStore((s) => s.startTour);
  const exitTour = useAppStore((s) => s.exitTour);
  const compareList = useAppStore((s) => s.compareList);
  const setCompareOpen = useAppStore((s) => s.setCompareOpen);
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_BODIES.filter((b) => b.kind !== 'star' && b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  const selectResult = (id: string) => {
    setSelectedBody(id);
    setSearchQuery('');
    setFocused(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable (e.g. insecure context) — nothing sensible to do
    }
  };

  return (
    <div className="pointer-events-auto fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-5 py-4 flex-wrap">
      <div className="relative w-64">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) selectResult(results[0].id);
          }}
          placeholder="Search planets, moons..."
          className="w-full glass-panel rounded-full px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:ring-1 focus:ring-cyan-400/50"
        />
        {focused && results.length > 0 && (
          <div className="absolute mt-2 w-full glass-panel rounded-xl overflow-hidden">
            {results.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => selectResult(r.id)}
                className="w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-white/10 transition flex justify-between"
              >
                <span>{r.name}</span>
                <span className="text-slate-500 text-xs capitalize">{r.kind}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {compareList.length > 0 && (
          <button
            onClick={() => setCompareOpen(true)}
            className="glass-panel rounded-full px-3 py-2.5 text-xs text-slate-300 hover:text-white transition"
          >
            ⚖ Compare ({compareList.length})
          </button>
        )}

        <button
          onClick={() => (isTourActive ? exitTour() : startTour())}
          className={`glass-panel rounded-full px-3 py-2.5 text-xs transition ${
            isTourActive ? 'text-cyan-200 bg-cyan-400/20' : 'text-slate-300 hover:text-white'
          }`}
        >
          {isTourActive ? 'Exit Tour' : '🔭 Tour'}
        </button>

        <button
          onClick={copyLink}
          title="Copy shareable link"
          className="glass-panel rounded-full px-3 py-2.5 text-xs text-slate-300 hover:text-white transition"
        >
          {copied ? 'Copied!' : '🔗 Share'}
        </button>

        <div className="glass-panel rounded-full p-1 flex text-xs">
          <button
            onClick={() => requestScaleMode('educational')}
            className={`px-3 py-1.5 rounded-full transition ${
              scaleMode === 'educational' ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Educational
          </button>
          <button
            onClick={() => requestScaleMode('realistic')}
            className={`px-3 py-1.5 rounded-full transition ${
              scaleMode === 'realistic' ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Realistic
          </button>
        </div>

        <div className="glass-panel rounded-full p-1 flex text-xs">
          {(['km', 'au', 'lightMin'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setDistanceUnit(u)}
              className={`px-3 py-1.5 rounded-full transition ${
                distanceUnit === u ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400 hover:text-white'
              }`}
            >
              {u === 'km' ? 'km' : u === 'au' ? 'AU' : 'light-min'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
