'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as webglHelper from "/js/helpers/webglHelper.js";
import * as shaderHelper from "/js/helpers/shaderHelper.js";
import * as entityHelper from "/js/helpers/entityHelper.js";

//import * as physicsSystem from "/js/systems/physicsSystem.js";
import * as staticMeshRenderingSystem from "/js/systems/staticMeshRenderingSystem.js";
import * as cameraSystem from "/js/systems/cameraSystem.js";

import * as shaderManager from "/js/shaderManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";

let gl = null;
let currentState = "init";
let lastFrameTime = 0;

init();

async function init() {
	await shaderManager.initWebgl();
	gl = shaderManager.getWebglContext();

	resourceManager.load("/assets/test/TestCube.obj");
	resourceManager.load("/assets/test/TestCube_BaseColor.png");

	world.createEntity();
	world.createEntity(vec3.fromValues(5,5,5));
	world.addCamera();
	world.createEntity();
	world.addStaticMesh("/assets/test/TestCube.obj", "/assets/test/TestCube_BaseColor.png");
	world.createEntity(vec3.fromValues(0,2,0), vec3.fromValues(0, -180, 90), vec3.fromValues(0.5, 0.5, 0.5));
	world.addStaticMesh("/assets/test/TestCube.obj", "/assets/test/TestCube_BaseColor.png");

	console.log("Starting main loop.");
	requestAnimationFrame(main);
}

function main(currentFrameTime) {
	let deltaTime = (currentFrameTime - lastFrameTime) / 1000;
	lastFrameTime = currentFrameTime;

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	switch (currentState) {
		case "init":
			if (resourceManager.checkReady()) {
				currentState = "testScene";
			}
			break;
		case "testScene":
			cameraSystem.tick();
			staticMeshRenderingSystem.tick();
			break;
	}

	requestAnimationFrame(main);
}
