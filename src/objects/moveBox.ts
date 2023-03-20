import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({
  opacity: 0,
  transparent: true,
  visible: false,
});

export const moveBox = new THREE.Mesh(geometry, material);
moveBox.position.set(0, 10, 0);
