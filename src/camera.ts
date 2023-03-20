import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(20, 10, 90);

export default camera;
