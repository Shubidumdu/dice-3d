import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const floorShape = new CANNON.Plane();
const body = new CANNON.Body({ mass: 0 });
body.addShape(floorShape);
body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
const material = new THREE.MeshLambertMaterial({ color: 0xff9500 });
const floor = new THREE.Mesh(geometry, material);
floor.receiveShadow = true;
floor.userData = {
  body,
  sync: () => {
    floor.position.copy(body.position as unknown as THREE.Vector3);
    floor.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
  },
};

export { floor };
