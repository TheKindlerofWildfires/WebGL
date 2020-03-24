'use strict';
import * as glMatrix from "/js/glMatrix/common.js";
import * as mat4 from "/js/glMatrix/mat4.js";
import * as objLoader from "/js/objLoader.js";
import * as shaderHelper from "/js/shaderHelper.js";
import * as webglHelper from "/js/webglHelper.js";

let canvas = null;
let gl = null;
let shaders = Object.create(Object.prototype);

let tmpObj = {};

init();

async function init() {
	canvas = document.getElementById("gameCanvas");
	gl = webglHelper.getContext(canvas);
  console.log('Initialized webGL');

	shaders.unlit = await shaderHelper.createUnlit(gl);
	console.log("Shaders ready");

	tmpObj = await objLoader.loadOBJ(gl, "/assets/test/TestCube.obj", "/assets/test/TestCube_BaseColor.png");

	console.log("Starting main loop.");
	requestAnimationFrame(main);
}

function main(deltaTime) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(shaders.unlit.program);


	gl.bindBuffer(gl.ARRAY_BUFFER, tmpObj.vertexBuffer);
	gl.vertexAttribPointer(shaders.unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, tmpObj.bufferLength);
	requestAnimationFrame(main);
}
