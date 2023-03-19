import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { loadDice } from './objects/dice';
import { floor } from './objects/floor';
import lights from './lights';
import camera from './camera';
import './style/index.scss';
import { addJointConstraint, getHitPoint } from './action';
import { marker } from './objects/marker';
import { movePlane } from './objects/movePlane';
import { walls } from './objects/boundary';
import { contactDiceAndFloor, contactDiceAndWall } from './materials';

// Scene ~ THREE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9500);

// World - Cannon
const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

// Renderer
const canvas = document.querySelector('#c')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const helper = new THREE.CameraHelper(camera);

scene.add(helper);
scene.add(...lights);

window.addEventListener('resize', () => {
  // camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const start = async () => {
  let isDragging = false;
  const dice = await loadDice();
  scene.add(dice, floor, marker, movePlane, ...walls);
  renderer.setSize(window.innerWidth, window.innerHeight);
  world.addBody(dice.userData.body);
  world.addBody(floor.userData.body);
  walls.forEach((wall) => world.addBody(wall.userData.body));
  world.addContactMaterial(contactDiceAndWall);
  world.addContactMaterial(contactDiceAndFloor);

  window.addEventListener('pointerdown', (e) => {
    const hitPoint = getHitPoint(e.clientX, e.clientY, dice, camera);
    if (hitPoint) {
      marker.userData.show();
      marker.userData.move(hitPoint);

      const contraint = addJointConstraint(hitPoint, dice.userData.body);
      world.addConstraint(contraint);

      requestAnimationFrame(() => {
        isDragging = true;
      });
    }
  });

  window.addEventListener('pointermove', (event) => {
    if (!isDragging) {
      return;
    }

    // Project the mouse onto the movement plane
    const hitPoint = getHitPoint(
      event.clientX,
      event.clientY,
      movePlane,
      camera
    );

    if (hitPoint) {
      // Move marker mesh on the contact point
      marker.userData.show();

      // Move the cannon constraint on the contact point
      marker.userData.move(hitPoint);
    }
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;

    marker.userData.hide();
    const [contraint] = world.constraints;
    if (contraint) {
      world.removeConstraint(contraint);
    }
  });

  requestAnimationFrame(function animate(time: number) {
    world.fixedStep(1 / 60, time / 1000);
    dice.userData.sync();
    floor.userData.sync();
    walls.forEach((wall) => wall.userData.sync());
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });
};

start();
