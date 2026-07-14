import * as THREE from 'three';

/** Non-reactive registry of live scene objects per body id, so camera/UI code can look up
 * current world positions without threading refs through the whole component tree. */
const registry = new Map<string, THREE.Object3D>();

export function registerBody(id: string, obj: THREE.Object3D) {
  registry.set(id, obj);
}

export function unregisterBody(id: string) {
  registry.delete(id);
}

export function getBodyObject(id: string): THREE.Object3D | undefined {
  return registry.get(id);
}

const _v = new THREE.Vector3();
export function getBodyWorldPosition(id: string, target = _v): THREE.Vector3 | undefined {
  const obj = registry.get(id);
  if (!obj) return undefined;
  obj.getWorldPosition(target);
  return target;
}

export function getBodyDisplayRadius(id: string): number {
  const obj = registry.get(id);
  return (obj?.userData.displayRadius as number) ?? 1;
}
