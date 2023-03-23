import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { loadDice } from './objects/dice';
import { floor } from './objects/floor';
import lights from './lights';
import camera from './camera';
import './style/index.scss';
import { addJointConstraint, getHitPoint } from './action';
import { marker } from './objects/marker';
import { moveBox } from './objects/moveBox';
import { walls } from './objects/walls';
import { contactDiceAndFloor, contactDiceAndWall } from './materials';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { state } from './state';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9500);

const world = new CANNON.World();
world.gravity.set(0, -12, 0);

const canvas = document.querySelector('#canvas')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);

scene.add(camera);
scene.add(...lights);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const start = async () => {
  const dice = await loadDice();
  document.getElementById('loading')!.remove();
  document.getElementById('copyright')!.style.display = 'block';
  scene.add(dice, floor, marker, moveBox, ...walls);
  renderer.setSize(window.innerWidth, window.innerHeight);
  world.addBody(dice.userData.body);
  world.addBody(floor.userData.body);
  walls.forEach((wall) => world.addBody(wall.userData.body));
  world.addContactMaterial(contactDiceAndWall);
  world.addContactMaterial(contactDiceAndFloor);
  controls.target = new THREE.Vector3(0, 6, 0);

  window.addEventListener('pointerdown', (e) => {
    const hitPoint = getHitPoint(e.clientX, e.clientY, dice, camera);
    if (hitPoint) {
      marker.userData.show();
      marker.userData.move(hitPoint);
      controls.enabled = false;

      const contraint = addJointConstraint(hitPoint, dice.userData.body);
      world.addConstraint(contraint);

      requestAnimationFrame(() => {
        state.isDragging = true;
      });
    }
  });

  window.addEventListener('pointermove', (event) => {
    if (!state.isDragging) {
      return;
    }

    const hitPoint = getHitPoint(event.clientX, event.clientY, moveBox, camera);

    if (hitPoint) {
      marker.userData.show();
      marker.userData.move(hitPoint);
    }
  });

  window.addEventListener('pointerup', () => {
    state.isDragging = false;
    controls.enabled = true;
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
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });
};

start();
