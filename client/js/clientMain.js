'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as time from "/js/time.js";
import * as shaderManager from "/js/shaderManager.js";
import * as inputManager from "/js/inputManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";
import * as pawnController from "/js/pawnController.js";

let currentState = "init";

let cube0 = null;
let cube1 = null;
let pawn = null;

init();
async function init() {
	await shaderManager.initWebgl();
	inputManager.initInput();

	resourceManager.load("/assets/sprite.obj", "required");
	resourceManager.load("/assets/test/TestCube.obj", "required");
	resourceManager.load("/assets/test/TestCube_BaseColor.png", "required");

	world.createEntity(vec3.fromValues(2, 0, 0));
	world.addSprite("/assets/test/TestCube_BaseColor.png", 1, 1, 0, 0);
	world.createEntity(vec3.fromValues(3, 0, 0));
	world.addSprite("/assets/test/TestCube_BaseColor.png", 2, 2, 1, 1);
	world.createEntity(vec3.fromValues(4, 0, 0));
	world.addSprite("/assets/test/TestCube_BaseColor.png", 2, 2, 0, 0);
	pawn = world.createEntity(vec3.fromValues(0, 5, 5), vec3.fromValues(45, 0, 0));
	world.addCamera();
	cube0 = world.createEntity();
	world.addStaticMesh("/assets/test/TestCube.obj", "/assets/test/TestCube_BaseColor.png");
	cube1 = world.createEntity(vec3.fromValues(0,-2,0), vec3.fromValues(0, -180, 90), vec3.fromValues(5, 1, 10));
	world.addStaticMesh("/assets/test/TestCube.obj", "/assets/test/TestCube_BaseColor.png");

	console.log("Starting main loop.");
	requestAnimationFrame(main);
}

function main(currentFrameTime) {
	time.flow();

	let gl = shaderManager.getWebglContext();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	switch (currentState) {
		case "init":
			if (resourceManager.checkReady("required")) {
				currentState = "testScene";
			}
			break;
		case "testScene":
      world.setCurrentEntity(pawn);
			let movement = {
				w: inputManager.getKeyState("KeyW"),
				a: inputManager.getKeyState("KeyA"),
				s: inputManager.getKeyState("KeyS"),
				d: inputManager.getKeyState("KeyD")
			}
			pawnController.update(world.getRotation(), movement, inputManager.getMouseLocation(), time.getDeltaTime());
			world.addLocation(pawnController.getTickLocation());
			world.addRotation(pawnController.getTickRotation());
			world.tick();
			break;
	}

	requestAnimationFrame(main);
}
