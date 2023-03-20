import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  opacity: 0,
  transparent: true,
});

export const movePlane = new THREE.Mesh(geometry, material);

movePlane.position.set(0, 10, 0);
movePlane.visible = true; // Hide it..
