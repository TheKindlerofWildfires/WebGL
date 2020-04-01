'use strict';

let gameCanvas = null;
let gl = null;
let shaders = new Map();

export async function initWebgl() {
  gameCanvas = document.getElementById("gameCanvas");
  gl = gameCanvas.getContext("webgl2");

  if (!gl) {
    console.log('WebGL2 not supported, falling back on webgl');
    gl = gameCanvas.getContext("webgl");
  }
  if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = gameCanvas.getContext("experimental-webgl");
  }
  if (!gl) {
		alert('Your browser does not support WebGL');
    return;
	}
  console.log("Acquired webgl context successfully!");

  gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

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

  let sprite = Object.create(Object.prototype);
  sprite.program = await loadShader("shaders/sprite.vs", "shaders/sprite.fs");
  sprite.positionLocation = gl.getAttribLocation(sprite.program, "position");
  gl.enableVertexAttribArray(sprite.positionLocation);
  sprite.uvLocation = gl.getAttribLocation(sprite.program, "uv");
  gl.enableVertexAttribArray(sprite.uvLocation);
  sprite.projectionLocation = gl.getUniformLocation(sprite.program, "projectionMatrix");
  sprite.viewLocation = gl.getUniformLocation(sprite.program, "viewMatrix");
  sprite.worldLocation = gl.getUniformLocation(sprite.program, "worldMatrix");
  sprite.spriteSheetLocation = gl.getUniformLocation(sprite.program, "spriteSheet");
  sprite.spriteSizeLocation = gl.getUniformLocation(sprite.program, "spriteSize");
  sprite.spritePositionLocation = gl.getUniformLocation(sprite.program, "spritePosition");
  shaders.set("sprite", sprite);

  console.log("Shaders OK!")
}

export function getWebglContext() {
  return gl;
}

export function getGameCanvas() {
  return gameCanvas;
}

export function getAspectRatio() {
  return gameCanvas.clientWidth / gameCanvas.clientHeight;
}

export function getShader(key) {
  return shaders.get(key);
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
