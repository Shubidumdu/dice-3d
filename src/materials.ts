import * as CANNON from 'cannon-es';

export const diceMaterial = new CANNON.Material('dice');
export const wallMaterial = new CANNON.Material('wall');
export const floorMaterial = new CANNON.Material('floor');

export const contactDiceAndWall = new CANNON.ContactMaterial(
  diceMaterial,
  wallMaterial,
  {
    friction: 0.05,
    restitution: 0.9,
  }
);

export const contactDiceAndFloor = new CANNON.ContactMaterial(
  diceMaterial,
  floorMaterial,
  {
    friction: 0.1,
    restitution: 0.4,
  }
);
