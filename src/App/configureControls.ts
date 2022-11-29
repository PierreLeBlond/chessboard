import { Viewer } from '@s0rt/3d-viewer';

export default function configureControls(viewer: Viewer) {
  const { controls } = viewer;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.maxPolarAngle = 1.5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
}
