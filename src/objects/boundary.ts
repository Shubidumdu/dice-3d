import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { wallMaterial } from '../materials';

const eulers = [
  [0, Math.PI / 2, Math.PI / 2],
  [0, 0, Math.PI / 2],
  [0, -Math.PI / 2, Math.PI / 2],
  [0, Math.PI, -Math.PI / 2],
  [Math.PI / 2, 0, 0],
] as const;

const positions = [
  [-10, 10, 0],
  [0, 10, -10],
  [10, 10, 0],
  [0, 10, 10],
  [0, 20, 0],
];

const walls = [...new Array(5)].map((_, index) => {
  const wallShape = new CANNON.Plane();
  const body = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
  });
  body.addShape(wallShape);
  const [x1, y1, z1] = eulers[index];
  const [x2, y2, z2] = positions[index];
  body.position.set(x2, y2, z2);
  body.quaternion.setFromEuler(x1, y1, z1);

  const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x006EB3,
    transparent: false,
  });
  const wall = new THREE.Mesh(geometry, material);
  wall.receiveShadow = true;
  wall.userData = {
    body,
    sync: () => {
      wall.position.copy(body.position as unknown as THREE.Vector3);
      wall.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    },
  };

  return wall;
});

export { walls };
