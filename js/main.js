"use strict";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

import * as vec3 from "/js/lib/glMatrix/vec3.js";

init();
async function init() {
  graphics.init();
  input.init();

  content.loadTexture("test", "/assets/test/TestCube_BaseColor.png");
  content.loadMesh("test", "/assets/test/TestCube.obj");

  requestAnimationFrame(main);
}

function main() {
  graphics.clear();

  if (content.checkGroup("test")) {
    let baseColor = content.getAsset("/assets/test/TestCube_BaseColor.png");
    let mesh = content.getAsset("/assets/test/TestCube.obj");

    let transform = Object.create(Object.prototype);
    transform.location = vec3.fromValues(0,0,-5);
    transform.rotation = vec3.fromValues(50,160,0);
    transform.scale = vec3.fromValues(1,1,1);
    graphics.drawUnlit(mesh, baseColor, transform);
  }

  requestAnimationFrame(main);
}
