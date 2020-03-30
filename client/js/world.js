'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

let entityMap = new Map();
let activeEntity = null;

let activeCamera = Object.create(Object.prototype);

export function createEntity(location, rotation, scale) {
  activeEntity = Object.create(Object.prototype);
  activeEntity.id = uuidv4();
  activeEntity.needsRemoval = false;
  activeEntity.transform = Object.create(Object.prototype);
  if (location == undefined) {
    location = vec3.create();
  }
  activeEntity.transform.location = location;
  if (rotation == undefined) {
    rotation = vec3.create();
  }
  activeEntity.transform.rotation = rotation;
  if (scale == undefined) {
    scale = vec3.fromValues(1,1,1);
  }
  activeEntity.transform.scale = scale;

  entityMap.set(activeEntity.id, activeEntity);
  return activeEntity.id;
}

export function setCurrentEntity(id) {
  activeEntity = entityMap.get(id);
}

export function setLocation(newLocation) {
  activeEntity.transform.location = newLocation;
}

export function getLocation() {
  return selectEntity.transform.location;
}

export function addLocation(addVector) {
  vec3.add(activeEntity.transform.location, activeEntity.transform.location, addVector);
}

export function setRotation(newRotation) {
  activeEntity.transform.rotation = newRotation;
}

export function getRotation() {
  return activeEntity.transform.rotation;
}

export function addRotation(addVector) {
  vec3.add(activeEntity.transform.rotation, activeEntity.transform.rotation, addVector);
}

export function setScale(newScale) {
  activeEntity.transform.scale = newScale;
}

export function getScale() {
  return activeEntity.transform.scale;
}

export function addScale(addVector) {
  vec3.add(activeEntity.transform.scale, activeEntity.transform.scale, addVector);
}

export function addStaticMesh(mesh, baseColor) {
  activeEntity.staticMesh = Object.create(Object.prototype);
  activeEntity.staticMesh.mesh = mesh;
  activeEntity.staticMesh.baseColor = baseColor;
}

export function addSprite(spriteSheet, spriteWidth, spriteHeight, spriteX, spriteY) {
  activeEntity.sprite = Object.create(Object.prototype);
  activeEntity.sprite.spriteSheet = spriteSheet;
  activeEntity.sprite.spriteWidth = spriteWidth;
  activeEntity.sprite.spriteHeight = spriteHeight;
  activeEntity.sprite.spriteX = spriteX;
  activeEntity.sprite.spriteY = spriteY;
}

export function addCamera(fov, clipNear, clipFar) {
  activeEntity.camera = Object.create(Object.prototype);
  activeEntity.camera.isActive = true;
  if (fov == undefined) {
    fov = 90;
  }
  activeEntity.camera.fov = fov;
  activeEntity.camera.aspectRatio = 1.77777;
  if (clipNear == undefined) {
    clipNear = 0.1;
  }
  activeEntity.camera.clipNear = clipNear;
  if(clipFar == undefined) {
    clipFar = 10;
  }
  activeEntity.camera.clipFar = clipFar;
}

export function getEntities() {
  return entityMap.values();
}

export function getActiveCamera() {
  return activeCamera;
}
