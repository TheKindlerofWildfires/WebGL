'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as time from "/js/time.js";
import * as shaderManager from "/js/shaderManager.js";
import * as inputManager from "/js/inputManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";

let currentState = "init";

let cube0 = null;
let cube1 = null;
let pawn = null;

init();
async function init() {
	await shaderManager.initWebgl();
	inputManager.initInput();

	resourceManager.load("/assets/sprite.obj");
	resourceManager.load("/assets/test/TestCube.obj");
	resourceManager.load("/assets/test/TestCube_BaseColor.png");

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
			if (resourceManager.checkReady()) {
				currentState = "testScene";
			}
			break;
		case "testScene":
      world.setCurrentEntity(pawn);
			//Move commands
			let speed = 0.05;
			//A lot like vy, vx from previous
			let target = {
				x: Math.sin(world.getRotation()[1]*Math.PI/180),
				y: Math.cos(world.getRotation()[1]*Math.PI/180)
			}
			let xPlane = inputManager.getKeyState("KeyA")-inputManager.getKeyState("KeyD");
			let yPlane = inputManager.getKeyState("KeyW")-inputManager.getKeyState("KeyS");
      world.addLocation(vec3.fromValues(
				-xPlane*target.y*speed+yPlane*target.x*speed,
				0,
				-xPlane*target.x*speed-yPlane*target.y*speed
			));
			console.log(world.getRotation()[1]);

			//Look at commands
			world.addRotation(vec3.fromValues(0, inputManager.getKeyState("MouseLeft") * time.getDeltaTime() * 30, 0))
			world.addRotation(vec3.fromValues(0, inputManager.getKeyState("MouseRight") * time.getDeltaTime() * -30, 0))

			world.tick();
			break;
	}

	requestAnimationFrame(main);
}
