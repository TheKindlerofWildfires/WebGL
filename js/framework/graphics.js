"use strict";
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import vector from "/js/util/vector.js";
import rotator from "/js/util/rotator.js";

let gameCanvas = null;
let gl = null;

const bufferWidth = 1280;
const bufferHeight = 720;
let compositeBuffer = Object.create(Object.prototype);
let sceneBuffer = null;
let sceneDepth = null;
let sceneTexture = null;
let hudBuffer = null;
let hudDepth = null;
let hudTexture = null;

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

  compositeBuffer.positionBuffer = gl.createBuffer();
  compositeBuffer.uvBuffer = gl.createBuffer();
  {
    let data = [-1,1, -1,-1, 1,-1, 1,-1, 1,1, -1,1];
    gl.bindBuffer(gl.ARRAY_BUFFER, compositeBuffer.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    data = [0,1, 0,0, 1,0, 1,0, 1,1, 0,1];
    gl.bindBuffer(gl.ARRAY_BUFFER, compositeBuffer.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }

  //2d hud layer
  sceneTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bufferWidth, bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  sceneDepth = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, sceneDepth);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, bufferWidth, bufferHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  sceneBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTexture, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, sceneDepth, 0);

  //the important layer
  hudTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, hudTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bufferWidth, bufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  hudDepth = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, hudDepth);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, bufferWidth, bufferHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  hudBuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, hudBuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, hudTexture, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, hudDepth, 0);

  let composite = Object.create(Object.prototype);
  composite.program = await loadShader("/shaders/composite.vs", "/shaders/composite.fs");
  composite.positionLocation = gl.getAttribLocation(composite.program, "position");
  gl.enableVertexAttribArray(composite.positionLocation);
  composite.uvLocation = gl.getAttribLocation(composite.program, "uv");
  gl.enableVertexAttribArray(composite.uvLocation);
  composite.depthLocation = gl.getUniformLocation(composite.program, "depth");
  composite.bufferTexture = gl.getUniformLocation(composite.program, "bufferTexture");
  shaders.set("composite", composite);

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

export function bindBuffer(buffer) {
  switch (buffer) {
    case "scene":
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
      gl.viewport(0,0,bufferWidth, bufferHeight);
      break;
    case "hud":
      gl.bindFramebuffer(gl.FRAMEBUFFER, hudBuffer);
      gl.viewport(0,0,bufferWidth, bufferHeight);
      break;
    default:
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
      break;
  }
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

export function setCameraRotation(rotation) {
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
  gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
  gl.viewport(0,0,bufferWidth, bufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindFramebuffer(gl.FRAMEBUFFER, hudBuffer);
  gl.viewport(0,0,bufferWidth, bufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0,0,bufferWidth, bufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function present() {
  bindBuffer("");
  let composite = shaders.get("composite");
  gl.useProgram(composite.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, compositeBuffer.positionBuffer);
  gl.vertexAttribPointer(composite.positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, compositeBuffer.uvBuffer);
  gl.vertexAttribPointer(composite.uvLocation, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(composite.bufferTexture, 0);

  gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
  gl.uniform1f(composite.depthLocation, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindTexture(gl.TEXTURE_2D, hudTexture);
  gl.uniform1f(composite.depthLocation, -0.5);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function drawUnlit(mesh, texture, location = new vector(), rotation = new rotator(), scale = new vector(1,1,1)) {
  let worldMatrix = mat4.create();
  mat4.scale(worldMatrix, worldMatrix, scale.convert());
  mat4.translate(worldMatrix, worldMatrix, location.convert());
  mat4.rotateX(worldMatrix, worldMatrix, rotation.pitch * Math.PI/180);
  mat4.rotateY(worldMatrix, worldMatrix, rotation.yaw * Math.PI/180);
  mat4.rotateZ(worldMatrix, worldMatrix, rotation.roll * Math.PI/180);

  bindBuffer("scene");

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
