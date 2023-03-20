import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { wallMaterial } from '../materials';

type WallInfos = {
  eulers: [number, number, number];
  positions: [number, number, number];
};

const infos: WallInfos[] = [
  { eulers: [0, Math.PI / 2, Math.PI / 2], positions: [-10, 10, 0] },
  { eulers: [0, 0, Math.PI / 2], positions: [0, 10, -10] },
  { eulers: [0, -Math.PI / 2, Math.PI / 2], positions: [10, 10, 0] },
  { eulers: [0, Math.PI, -Math.PI / 2], positions: [0, 10, 10] },
  { eulers: [Math.PI / 2, 0, 0], positions: [0, 20, 0] },
];

const walls = infos.map(({ eulers, positions }) => {
  const wallShape = new CANNON.Plane();
  const body = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
  });
  const [ex, ey, ez] = eulers;
  const [px, py, pz] = positions;
  body.addShape(wallShape);
  body.quaternion.setFromEuler(ex, ey, ez);
  body.position.set(px, py, pz);

  const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x006eb3,
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
