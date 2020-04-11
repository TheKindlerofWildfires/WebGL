"use strict";

let gameCanvas = null;
let gl = null;
let shaders = new Map();

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
