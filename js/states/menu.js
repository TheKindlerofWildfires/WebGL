"use strict";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

import * as vec3 from "/js/lib/glMatrix/vec3.js";

let baseColor = null;
let mesh = null;

let cameraRotation = vec3.create();
let cubeRotation = vec3.create();

export function init() {
  //this is ok as splash already loaded these.
  baseColor = content.getAsset("/assets/test/TestCube_BaseColor.png");
  mesh = content.getAsset("/assets/test/TestCube.obj");
}

export function tick(deltaTime) {
  let inputDelta = input.getMouseDelta();
  let deltaRotation = vec3.fromValues(inputDelta.y * 500, inputDelta.x * 500, 0);
  vec3.add(cameraRotation, cameraRotation, deltaRotation);
  graphics.setCameraRotation(cameraRotation);

  vec3.add(cubeRotation, cubeRotation, vec3.fromValues(0,deltaTime * 50,0));
  graphics.drawUnlit(mesh, baseColor, vec3.fromValues(0,0,-5), cubeRotation);
  graphics.drawUnlit(mesh, baseColor, vec3.fromValues(3,0,-5));
}
