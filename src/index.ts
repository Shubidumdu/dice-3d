import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const axeGltf = require('./axe.glb');

const gltfLoader = new GLTFLoader();

const canvas = document.querySelector('#c')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 500, 1000);
scene.background = new THREE.Color(0xff9500);

// Light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
const dirLight = new THREE.DirectionalLight(0x666666);
dirLight.position.set(-4, 10, -10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(hemiLight);
scene.add(dirLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(5, 5, 1, 1);
floorGeometry.rotateX(-Math.PI / 2);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xff9500 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
scene.add(floor);

gltfLoader.load(axeGltf, (gltf) => {
  console.log(gltf);
  const root = gltf.scene;
  const [camera] = gltf.cameras;
  const mixer = new THREE.AnimationMixer(root);
  root.traverse((child) => {
    child.castShadow = true;
  });
  scene.add(root);
  renderer.render(scene, camera);
  requestAnimationFrame(function animate(time: number) {
    mixer.update(time);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });
});
