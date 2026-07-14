import { SolarSystemCanvas } from './three/SolarSystemCanvas';
import { TopBar } from './ui/TopBar';
import { TimeControls } from './ui/TimeControls';
import { InfoPanel } from './ui/InfoPanel';
import { ScaleWarningModal } from './ui/ScaleWarningModal';
import { TourBar } from './ui/TourBar';
import { useUrlSync } from './hooks/useUrlSync';
import { useTourEngine } from './hooks/useTourEngine';

function App() {
  useUrlSync();
  useTourEngine();

  return (
    <div className="relative w-full h-full">
      <SolarSystemCanvas />
      <TopBar />
      <TimeControls />
      <TourBar />
      <InfoPanel />
      <ScaleWarningModal />
      <div className="pointer-events-none fixed bottom-2 left-3 z-10 text-[10px] text-slate-500">
        Planet textures © Solar System Scope (CC BY 4.0)
      </div>
    </div>
  );
}

export default App;
