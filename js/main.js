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

    graphics.drawUnlit(mesh, baseColor, vec3.fromValues(0,0,-5), vec3.fromValues(0,-45,0));
    graphics.drawUnlit(mesh, baseColor, vec3.fromValues(3,0,-5));
  }
  
  requestAnimationFrame(main);
}
