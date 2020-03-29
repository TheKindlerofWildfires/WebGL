'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

let entityMap = new Map();
let selectedEntity = null;

let activeCamera = Object.create(Object.prototype);

export function createEntity(location, rotation, scale) {
  selectedEntity = Object.create(Object.prototype);
  selectedEntity.id = uuidv4();
  selectedEntity.needsRemoval = false;
  selectedEntity.transform = Object.create(Object.prototype);
  if (location == undefined) {
    location = vec3.create();
  }
  selectedEntity.transform.location = location;
  if (rotation == undefined) {
    rotation = vec3.create();
  }
  selectedEntity.transform.rotation = rotation;
  if (scale == undefined) {
    scale = vec3.fromValues(1,1,1);
  }
  selectedEntity.transform.scale = scale;

  entityMap.set(selectedEntity.id, selectedEntity);
}

export function selectEntity(id) {
  selectedEntity = entityMap.get(id);
}

export function addStaticMesh(mesh, baseColor) {
  selectedEntity.staticMesh = Object.create(Object.prototype);
  selectedEntity.staticMesh.mesh = mesh;
  selectedEntity.staticMesh.baseColor = baseColor;
}

export function addCamera(fov, clipNear, clipFar) {
  selectedEntity.camera = Object.create(Object.prototype);
  selectedEntity.camera.isActive = true;
  if (fov == undefined) {
    fov = 90;
  }
  selectedEntity.camera.fov = fov;
  selectedEntity.camera.aspectRatio = 1.77777;
  if (clipNear == undefined) {
    clipNear = 0.1;
  }
  selectedEntity.camera.clipNear = clipNear;
  if(clipFar == undefined) {
    clipFar = 10;
  }
  selectedEntity.camera.clipFar = clipFar;
}

export function getEntities() {
  return entityMap.values();
}

export function getActiveCamera() {
  return activeCamera;
}
