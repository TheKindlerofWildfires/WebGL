'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";

import * as transformFactory from "/js/factories/transformFactory.js";

function createComponent(location, rotation, scale) {
  let component = Object.create(Object.prototype);
  component.type = "component";
  component.id = uuidv4();
  //component.parentId = LARGE TODO
  component.transform = transformFactory.create(location, rotation, scale);

  return component;
}

export function createStaticMeshComponent(meshUrl, baseColorUrl, location, rotation, scale) {
  let component = createComponent(location, rotation, scale);
  component.type = "staticMeshComponent";
  component.meshResource = meshUrl;
  component.baseColorResource = baseColorUrl;

  return component;
}

export function createCameraComponent(fov = 60, clipNear = 0.01, clipFar = 30, location, rotation, scale) {
  let component = createComponent(location, rotation, scale);
  component.type = "cameraComponent";
  component.cameraFov = fov;
  component.cameraClipNear = clipNear;
  component.cameraClipFar = clipFar;

  return component;
}
