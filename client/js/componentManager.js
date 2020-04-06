'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";

import * as transformFactory from "/js/factories/transformFactory.js";

let componentMap = new Map();

function createComponent() {
  let component = Object.create(Object.prototype);
  component.type = "component";
  component.id = uuidv4();
  component.parrent = null;
  component.transform = transformFactory.createTransform();

  componentMap.set(component.id, component);
  return component;
}

export function createStaticMeshComponent(meshResource, baseColorResource) {
  let component = createComponent();
  component.type = "staticMeshComponent";
  component.meshResource = meshResource;
  component.baseColorResource = baseColorResource;

  return component.id;
}

export function createCameraComponent(fov = 60, clipNear = 0.01, clipFar = 30) {
  let component = createComponent();
  component.type = "cameraComponent";
  component.fov = fov;
  component.clipNear = clipNear;
  component.clipFar = clipFar;

  return component.id;
}

export function setComponentTransform(componentId, location, rotation, scale) {
  let component = componentMap.get(componentId);
  component.transform = transformFactory.createTransform(location, rotation, scale);
}
