import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const cupGlft = require('./discoBall.glb');

const canvas = document.querySelector('#c')!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();

gltfLoader.load(cupGlft, (gltf) => {
  const root = gltf.scene;
  const [camera] = gltf.cameras;
  const mixer = new THREE.AnimationMixer(root);
  const clips = gltf.animations;
  scene.add(root);
  renderer.render(scene, camera);
  clips.forEach((clip) => {
    mixer.clipAction(clip).play();
  });
  requestAnimationFrame(function animate(time: number) {
    mixer.update(time);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  });
});
