"use strict";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

import vector from "/js/util/vector.js";
import rotator from "/js/util/rotator.js";

let baseColor = null;
let mesh = null;

let cubeLocation = new vector(0,0,-4);
let cubeRotation = new rotator();

export function init() {
  //this is ok as splash already loaded these.
  baseColor = content.getAsset("/assets/test/TestCube_BaseColor.png");
  mesh = content.getAsset("/assets/test/TestCube.obj");
}

export function tick(deltaTime) {
  cubeRotation.add(0, deltaTime * 90, deltaTime * 10);
  graphics.drawUnlit(mesh, baseColor, cubeLocation, cubeRotation);
  //graphics.drawUnlit(mesh, baseColor, vec3.fromValues(3,0,-5));
}
