import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { diceMaterial } from '../materials';
import { state } from '../state';

export type CollisionEvent = {
  type: 'collide';
  body: CANNON.Body;
  contact: CANNON.ContactEquation;
  target: CANNON.Body;
};

const DENSITY = 700;

const diceGltf: string = require('../assets/dice.glb');
const soundEffect = new Audio(require('../assets/collision.wav'));
const gltfLoader = new GLTFLoader();

const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
const body = new CANNON.Body({
  mass: DENSITY * shape.volume(),
  material: diceMaterial,
  position: new CANNON.Vec3(0, 1, -2),
});

body.addShape(shape);

body.addEventListener('collide', ({ contact }: CollisionEvent) => {
  const velocity = contact.getImpactVelocityAlongNormal();
  if (velocity > 1 && !state.isDragging) {
    soundEffect.volume = Math.max(0.1, Math.min(100, velocity) / 100);
    soundEffect.play();
  }
});

export const loadDice = async () => {
  const dice = (await gltfLoader.loadAsync(diceGltf)).scene.children[0];
  dice.castShadow = true;
  dice.userData = {
    body,
    sync: () => {
      dice.position.copy(body.position as unknown as THREE.Vector3);
      dice.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    },
  };
  return dice;
};
