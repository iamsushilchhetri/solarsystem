import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { useAppStore } from '../state/store';
import { getBodyWorldPosition, getBodyDisplayRadius } from './bodyRegistry';
import { getBodyById } from '../data/bodies';
import { scaledOrbitDistance } from '../utils/astro';

export function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const selectedBodyId = useAppStore((s) => s.selectedBodyId);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const scaleMode = useAppStore((s) => s.scaleMode);
  const isTweening = useRef(false);

  useEffect(() => {
    const id = selectedBodyId ?? 'sun';
    const controls = controlsRef.current;
    const bodyPos = getBodyWorldPosition(id)?.clone();
    if (!bodyPos || !controls) return;

    const radius = getBodyDisplayRadius(id);
    let dist: number;
    if (selectedBodyId) {
      dist = Math.max(radius * 5.5, radius + 3.5);
    } else if (scaleMode === 'realistic') {
      const neptune = getBodyById('neptune')!;
      dist = scaledOrbitDistance(neptune.semiMajorAxisKm, 'realistic') * 1.15;
    } else {
      dist = 70;
    }

    const dir = camera.position.clone().sub(controls.target);
    if (dir.lengthSq() < 1e-6) dir.set(0.5, 0.35, 0.8);
    dir.normalize();

    const startCam = camera.position.clone();
    const startTarget = controls.target.clone();
    const proxy = { t: 0 };

    isTweening.current = true;
    gsap.killTweensOf(proxy);
    gsap.to(proxy, {
      t: 1,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        const livePos = getBodyWorldPosition(id) ?? bodyPos;
        const endCam = livePos.clone().add(dir.clone().multiplyScalar(dist));
        camera.position.lerpVectors(startCam, endCam, proxy.t);
        controls.target.lerpVectors(startTarget, livePos, proxy.t);
        controls.update();
      },
      onComplete: () => {
        isTweening.current = false;
      },
    });

    return () => {
      gsap.killTweensOf(proxy);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBodyId, scaleMode]);

  useFrame(() => {
    if (isTweening.current || cameraMode !== 'orbit') return;
    const id = selectedBodyId ?? 'sun';
    const bodyPos = getBodyWorldPosition(id);
    if (bodyPos && controlsRef.current) {
      controlsRef.current.target.copy(bodyPos);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={0.12}
      maxDistance={9000}
      makeDefault
    />
  );
}
