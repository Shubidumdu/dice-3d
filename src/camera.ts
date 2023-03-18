import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.set(0, 2, 10);

export default camera;
