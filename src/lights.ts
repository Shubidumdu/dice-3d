import * as THREE from 'three';

const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820);
hemiLight.position.set(0, 20, 10);

const dirLight = new THREE.SpotLight(0x666666);
dirLight.position.set(-4, 100, 100);
dirLight.shadow.mapSize.set(4096, 4096);
dirLight.castShadow = true;

export default [hemiLight, dirLight];
