'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as webglHelper from "/js/helpers/webglHelper.js";
import * as shaderHelper from "/js/helpers/shaderHelper.js";
import * as entityHelper from "/js/helpers/entityHelper.js";

import * as physicsSystem from "/js/systems/physicsSystem.js";
import * as staticMeshRenderingSystem from "/js/systems/staticMeshRenderingSystem.js";
import * as cameraSystem from "/js/systems/cameraSystem.js";

import * as resourceManager from "/js/resourceManager.js";

let canvas = null;
let gl = null;
let cameraObject = null;
let lastFrameTime = 0;
let shaders = Object.create(Object.prototype);

let entityMap = new Map();

init();

async function init() {
	canvas = document.getElementById("gameCanvas");
	gl = webglHelper.getContext(canvas);
  console.log('Initialized webGL');

	shaders = await shaderHelper.initShaders(gl);
	console.log("Shaders ready");

	resourceManager.setGLContext(gl);
	resourceManager.load("/assets/test/TestCube.obj");
	resourceManager.load("/assets/test/TestCube_BaseColor.png");

	let currentEntity = entityHelper.createEmpty(entityMap);
	//dont do this
	await entityHelper.addStaticMeshComponent(gl, currentEntity, "/assets/test/TestCube.obj", "assets/test/TestCube_BaseColor.png");
	entityHelper.setScale(currentEntity, vec3.fromValues(0.5, 0.5, 0.5));
	entityHelper.setLocation(currentEntity, vec3.fromValues(0, 0, 0));
	entityHelper.addVelocityComponent(currentEntity, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 10, 60));
	currentEntity = entityHelper.createEmpty(entityMap);
	entityHelper.addCameraComponent(currentEntity, 45, 0.1, 10);
	entityHelper.setLocation(currentEntity, vec3.fromValues(5, 5, -5));
	console.log(entityMap);

	console.log("Starting main loop.");
	requestAnimationFrame(main);
}

function main(currentFrameTime) {
	let deltaTime = (currentFrameTime - lastFrameTime) / 1000;
	lastFrameTime = currentFrameTime;

	physicsSystem.update(entityMap, deltaTime);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	cameraObject = cameraSystem.update(entityMap);
	staticMeshRenderingSystem.update(gl, shaders, cameraObject, entityMap);

	requestAnimationFrame(main);
}
