"use strict";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

import * as vec3 from "/js/lib/glMatrix/vec3.js";

let baseColor = null;
let mesh = null;

export function init() {
  //this is ok as splash already loaded these.
  baseColor = content.getAsset("/assets/test/TestCube_BaseColor.png");
  mesh = content.getAsset("/assets/test/TestCube.obj");
}

export function tick(deltaTime) {
  graphics.drawUnlit(mesh, baseColor, vec3.fromValues(0,0,-5), vec3.fromValues(0,-45,0));
  graphics.drawUnlit(mesh, baseColor, vec3.fromValues(3,0,-5));
}
