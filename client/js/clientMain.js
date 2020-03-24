'use strict';
import * as glMatrix from "/js/lib/glMatrix/common.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as webglHelper from "/js/helpers/webglHelper.js";
import * as shaderHelper from "/js/helpers/shaderHelper.js";
import * as entityHelper from "/js/helpers/entityHelper.js";

import * as staticMeshRenderingSystem from "/js/systems/staticMeshRenderingSystem.js";
import * as cameraSystem from "/js/systems/cameraSystem.js";

let canvas = null;
let gl = null;
let cameraObject = null;
let shaders = Object.create(Object.prototype);

let entityMap = new Map();

init();

async function init() {
	canvas = document.getElementById("gameCanvas");
	gl = webglHelper.getContext(canvas);
  console.log('Initialized webGL');

	shaders.unlit = await shaderHelper.createUnlit(gl);
	console.log("Shaders ready");

	let currentEntity = entityHelper.createEmpty(entityMap);
	entityHelper.addStaticMeshComponent(gl, currentEntity, "/assets/test/TestCube.obj");
	console.log(entityMap);

	console.log("Starting main loop.");
	requestAnimationFrame(main);
}

function main(deltaTime) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	cameraObject = cameraSystem.update(entityMap);
	staticMeshRenderingSystem.update(gl, shaders, cameraObject, entityMap);
	requestAnimationFrame(main);
}
