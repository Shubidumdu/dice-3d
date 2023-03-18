import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { loadDice } from './objects/dice';
import { floor } from './objects/floor';
import lights from './lights';
import camera from './camera';
import "./style/index.scss";

// Scene ~ THREE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff9500);

// World - Cannon
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Renderer
const canvas = document.querySelector('#c')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

scene.add(camera);
scene.add(...lights);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const start = async () => {
  const dice = await loadDice();
  scene.add(dice, floor);
  renderer.setSize(window.innerWidth, window.innerHeight);
  world.addBody(dice.userData.body);
  world.addBody(floor.userData.body);

  requestAnimationFrame(function animate(time: number) {
    world.fixedStep(1 / 60, time / 1000);
    dice.userData.sync();
    floor.userData.sync();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });
};

start();
