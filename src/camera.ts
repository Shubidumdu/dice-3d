import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.set(57, 40, 100);
camera.rotation.set(-0.15, 0.5, 0);

export default camera;
