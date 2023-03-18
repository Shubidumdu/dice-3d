import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const diceGltf: string = require('../dice.glb');
const gltfLoader = new GLTFLoader();

const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
const body = new CANNON.Body({ mass: 8 });
body.addShape(shape);
body.position.set(0, 1, 0);

export const loadDice = async () => {
  const dice = (await gltfLoader.loadAsync(diceGltf)).scene.children[0];
  dice.castShadow = true;
  dice.receiveShadow = true;
  dice.userData = {
    body,
    sync: () => {
      dice.position.copy(body.position as unknown as THREE.Vector3);
      dice.quaternion.copy(body.quaternion as unknown as THREE.Quaternion);
    }
  }
  return dice;
};