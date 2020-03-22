'use strict';

import * as glMatrix from "/js/glMatrix/common.js";
import * as mat4 from "/js/glMatrix/mat4.js";
var boxVertices = [ // X, Y, Z           R, G, B
	// Top
	-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
	-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
	1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
	1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

	// Left
	-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
	-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
	-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
	-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

	// Right
	1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
	1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
	1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
	1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

	// Front
	1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
	1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

	// Back
	1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
	1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

	// Bottom
	-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
	-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
	1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
	1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
];
var boxIndices = [
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];
init();
async function init() {
	//Load in the shader files
	let [testVertexShaderResponse, testFragmentShaderResponse] = await Promise.all([fetch("shaders/test.vs"), fetch("shaders/test.fs")]);
  let [testVertexShaderText, testFragmentShaderText] = await Promise.all([testVertexShaderResponse.text(), testFragmentShaderResponse.text()]);
	console.log('Loaded shaders');
  main(testVertexShaderText, testFragmentShaderText);
}

function main(testVertexShaderText, testFragmentShaderText){
	//Init gl
	let canvas = document.getElementById("home");
  let gl = canvas.getContext("webgl2");
	if (!gl) {
		console.log('WebGL2 not supported, falling back on webgl');
		gl = canvas.getContext('webgl');
	}
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
  console.log('Initialized webGL');
  let testShaderProgram = createShaderProgram(gl, testVertexShaderText, testFragmentShaderText);
  console.log('Compiled shaders');

	//Start of setting up shader for box
	let positionAttribLocation = gl.getAttribLocation(testShaderProgram, 'vertPosition');
	let colorAttribLocation = gl.getAttribLocation(testShaderProgram, 'vertColor');
  //verts and colors of the box
	let boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
  //indices of box
	let boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
  //set the attribtues
	gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,3 * Float32Array.BYTES_PER_ELEMENT);
  //enable the attributes
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	//set the shader program
  gl.useProgram(testShaderProgram);
	console.log('Set up shader for box');

	//Fancy moving cube stuff
	let drag = false;
  let old_x, old_y;
  let dX = 0, dY = 0;
  let THETA=0, PHI=0;

	let mouseDown = function(e) {
    drag = true;
    old_x = e.pageX, old_y = e.pageY;
    e.preventDefault();
    return false;
  };
	let mouseUp = function(e){
    drag = false;
  };
	let mouseMove = function(e) {
    if (!drag) return false;
    dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
    dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
    old_x = e.pageX, old_y = e.pageY;
    THETA += dX, PHI+=dY;
    e.preventDefault();
  };
	canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  console.log('Added mouse listener');
	//Matrix math for rendering
	let matWorldUniformLocation = gl.getUniformLocation(testShaderProgram, 'mWorld');
	let matViewUniformLocation = gl.getUniformLocation(testShaderProgram, 'mView');
	let matProjUniformLocation = gl.getUniformLocation(testShaderProgram, 'mProj');

	let worldMatrix = new Float32Array(16);
	let viewMatrix = new Float32Array(16);
	let projMatrix = new Float32Array(16);

	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	let rotationMatrix = new Float32Array(16);
  let identityMatrix = new Float32Array(16);

  mat4.identity(identityMatrix);
	let angle = 0;
  let sign = 1;

	let mainLoop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(rotationMatrix, identityMatrix, THETA, [0, 1, 0]);
		mat4.rotate(rotationMatrix, rotationMatrix, PHI, [sign, 0, 0]);
		mat4.mul(worldMatrix, identityMatrix, rotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.85, 0.65, 0.13, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(mainLoop);
	};
	console.log('Starting main loop');
	requestAnimationFrame(mainLoop);
}

function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('Vertex shader error: ', gl.getShaderInfoLog(vertexShader));
		return;
	}
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('Fragment shader error: ', gl.getShaderInfoLog(fragmentShader));
		return;
	}
  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}
  return shaderProgram;
}
