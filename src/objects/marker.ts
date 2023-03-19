import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const shape = new CANNON.Sphere(0.1);
const body = new CANNON.Body({ mass: 0 });
body.addShape(shape);
body.collisionFilterGroup = 0;
body.collisionFilterMask = 0;

const geometry = new THREE.SphereGeometry(0.2, 8, 8);
const material = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
const marker = new THREE.Mesh(geometry, material);
marker.visible = false; // Hide it..
marker.userData = {
  body,
  show: () => {
    marker.visible = true;
  },
  hide: () => {
    marker.visible = false;
  },
  move: (point: THREE.Vector3) => {
    marker.position.copy(point);
    body.position.copy(point as any);
  },
};

export { marker };
