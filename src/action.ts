import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { marker } from './objects/marker';

export const raycaster = new THREE.Raycaster();

export const getHitPoint = (
  clientX: number,
  clientY: number,
  mesh: THREE.Object3D,
  camera: THREE.Camera
) => {
  // Get 3D point form the client x y
  const mouse = new THREE.Vector2();
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((clientY / window.innerHeight) * 2 - 1);

  raycaster.setFromCamera(mouse, camera);

  // Find out if there's a hit
  const hits = raycaster.intersectObject(mesh);

  // Return the closest hit or undefined
  return hits.length > 0 ? hits[0].point : undefined;
};

export const addJointConstraint = (position: THREE.Vector3, body: CANNON.Body) => {
  const vector = new CANNON.Vec3().copy(position as unknown as CANNON.Vec3).vsub(body.position);
  // Apply anti-quaternion to vector to tranform it into the local body coordinate system
  const antiRotation = body.quaternion.inverse();
  const pivot = antiRotation.vmult(vector); // pivot is not in local body coordinates

  // Move the cannon click marker body to the click position
  const jointBody = marker.userData.body;
  jointBody.position.copy(position);

  // Create a new constraint
  // The pivot for the jointBody is zero
  const constraint = new CANNON.PointToPointConstraint(
    body,
    pivot,
    jointBody,
    new CANNON.Vec3(0, 0, 0)
  );

  // Add the constraint to world
  return constraint;
};
