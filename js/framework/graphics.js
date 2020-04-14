"use strict";
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

let gameCanvas = null;
let gl = null;

let shaders = new Map();

let camera = Object.create(Object.prototype);
camera.location = vec3.create();
camera.rotation = vec3.create();
camera.viewMatrix = mat4.create();
camera.projectionMatrix = mat4.create();
mat4.perspective(camera.projectionMatrix, 90 * Math.PI/180, 640 / 480, 0.01, 100);

export async function init() {
  gameCanvas = document.getElementById("gameCanvas");
  gl = gameCanvas.getContext("webgl2");
  if (!gl) {
    alert("Unable to get webgl2 context");
  }
  gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);
  console.log("Acquired webgl context successfully!");

  let unlit = Object.create(Object.prototype);
  unlit.program = await loadShader("/shaders/unlit.vs", "/shaders/unlit.fs");
  unlit.positionLocation = gl.getAttribLocation(unlit.program, "position");
  gl.enableVertexAttribArray(unlit.positionLocation);
  unlit.uvLocation = gl.getAttribLocation(unlit.program, "uv");
  gl.enableVertexAttribArray(unlit.uvLocation);
  unlit.projectionLocation = gl.getUniformLocation(unlit.program, "projectionMatrix");
  unlit.viewLocation = gl.getUniformLocation(unlit.program, "viewMatrix");
  unlit.worldLocation = gl.getUniformLocation(unlit.program, "worldMatrix");
  unlit.baseColorLocation = gl.getUniformLocation(unlit.program, "baseColor");
  shaders.set("unlit", unlit);
}

export function getCanvas() {
  return gameCanvas;
}

export function getContext() {
  return gl;
}

export function setCameraLocation(location) {
  camera.location = location;
  updateCamera();
}

export function setCameraRotation(roation) {
  camera.rotation = rotation;
  updateCamera();
}

function updateCamera() {
  camera.viewMatrix = mat4.create();
  mat4.rotateX(camera.viewMatrix, camera.viewMatrix, camera.rotation[0] * Math.PI/180);
  mat4.rotateY(camera.viewMatrix, camera.viewMatrix, camera.rotation[1] * Math.PI/180);
  mat4.rotateZ(camera.viewMatrix, camera.viewMatrix, camera.rotation[2] * Math.PI/180);

  let cameraPosition = vec3.create();
  vec3.subtract(cameraPosition, cameraPosition, camera.location);
  mat4.translate(camera.viewMatrix, camera.viewMatrix, cameraPosition);
}

export function clear() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function present() {
  //Buffers not yet implemented
}

export function drawUnlit(mesh, texture, location = vec3.fromValues(0,0,0), rotation = vec3.fromValues(0,0,0), scale = vec3.fromValues(1,1,1)) {
  let worldMatrix = mat4.create();
  mat4.scale(worldMatrix, worldMatrix, scale);
  mat4.translate(worldMatrix, worldMatrix, location);
  mat4.rotateX(worldMatrix, worldMatrix, rotation[0] * Math.PI/180);
  mat4.rotateY(worldMatrix, worldMatrix, rotation[1] * Math.PI/180);
  mat4.rotateZ(worldMatrix, worldMatrix, rotation[2] * Math.PI/180);

  let unlit = shaders.get("unlit");
  gl.useProgram(unlit.program);
  gl.uniformMatrix4fv(unlit.worldLocation, false, worldMatrix);
  gl.uniformMatrix4fv(unlit.viewLocation, false, camera.viewMatrix);
  gl.uniformMatrix4fv(unlit.projectionLocation, false, camera.projectionMatrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
  gl.vertexAttribPointer(unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
  gl.vertexAttribPointer(unlit.uvLocation, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.texture);
  gl.uniform1i(unlit.baseColorLocation, 0);

  gl.drawArrays(gl.TRIANGLES, 0, mesh.polyCount);
}

export function drawHud(texture, todo) {

}

async function loadShader(vertexShaderUrl, fragmentShaderUrl) {
  let [vertexShaderResponse, fragmentShaderResponse] = await Promise.all([fetch(vertexShaderUrl), fetch(fragmentShaderUrl)]);
  let [vertexShaderText, fragmentShaderText] = await Promise.all([vertexShaderResponse.text(), fragmentShaderResponse.text()]);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('VertexShader did not compile: ', gl.getShaderInfoLog(vertexShader));
	}

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('FragmentShader did not compile: ', gl.getShaderInfoLog(fragmentShader));
	}

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('Failed to link program: ', gl.getProgramInfoLog(shaderProgram));
	}

  return shaderProgram;
}
