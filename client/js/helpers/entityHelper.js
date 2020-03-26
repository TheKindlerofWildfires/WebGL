'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";
import * as glMatrix from "/js/lib/glMatrix/common.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as objLoader from "/js/loaders/objLoader.js";
import * as pngLoader from "/js/loaders/pngLoader.js";

export function createEmpty(entityMap) {
  let entity = Object.create(Object.prototype);
  entity.id = uuidv4();
  entity.needsRemoval = false;
  entity.transformComponent = Object.create(Object.prototype);
  entity.transformComponent.location = vec3.create();
  entity.transformComponent.rotation = vec3.create();
  entity.transformComponent.scale = vec3.fromValues(1,1,1);

  entityMap.set(entity.id, entity);
  return entity;
}

export function setLocation(entity, newLocation) {
  entity.transformComponent.location = newLocation;
}

export function setScale(entity, newScale) {
  entity.transformComponent.scale = newScale;
}

export function setRotation(entity, newRotation) {
  entity.transformComponent.rotation = newRotation;
}

export async function addStaticMeshComponent(gl, entity, objUrl, baseColorUrl) {
  let staticMesh = Object.create(Object.prototype);
  let [parsedObj, baseColorBitmap] = await Promise.all([objLoader.loadOBJ(objUrl), pngLoader.loadPng(baseColorUrl)]);

  staticMesh.polyCount = parsedObj.polyCount;
  staticMesh.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, staticMesh.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedObj.positionArray), gl.STATIC_DRAW);
  staticMesh.uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, staticMesh.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parsedObj.uvArray), gl.STATIC_DRAW);

  staticMesh.baseColorTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, staticMesh.baseColorTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, baseColorBitmap);

  entity.staticMeshComponent = staticMesh;
}

export function addCameraComponent(entity) {
  entity.cameraComponent = Object.create(Object.prototype);
  entity.cameraComponent.isActive = true;
  entity.cameraComponent.fov = 60;
}
