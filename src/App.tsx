import { SolarSystemCanvas } from './three/SolarSystemCanvas';
import { TopBar } from './ui/TopBar';
import { TimeControls } from './ui/TimeControls';
import { InfoPanel } from './ui/InfoPanel';
import { ScaleWarningModal } from './ui/ScaleWarningModal';
import { TourBar } from './ui/TourBar';
import { LoadingScreen } from './ui/LoadingScreen';
import { SoundToggle } from './ui/SoundToggle';
import { OnboardingHint } from './ui/OnboardingHint';
import { useUrlSync } from './hooks/useUrlSync';
import { useTourEngine } from './hooks/useTourEngine';
import { useSelectSound } from './hooks/useSelectSound';

function App() {
  useUrlSync();
  useTourEngine();
  useSelectSound();

  return (
    <div className="relative w-full h-full">
      <SolarSystemCanvas />
      <TopBar />
      <TimeControls />
      <TourBar />
      <InfoPanel />
      <ScaleWarningModal />
      <SoundToggle />
      <OnboardingHint />
      <LoadingScreen />
      <div className="pointer-events-none fixed bottom-2 left-3 z-10 text-[10px] text-slate-500">
        Planet textures © Solar System Scope (CC BY 4.0)
      </div>
    </div>
  );
}

export default App;
