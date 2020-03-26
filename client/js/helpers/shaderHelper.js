'use strict';

export async function loadShader(gl, vertexShaderUrl, fragmentShaderUrl) {
  let [vertexShaderResponse, fragmentShaderResponse] = await Promise.all([fetch(vertexShaderUrl), fetch(fragmentShaderUrl)]);
  let [vertexShaderText, fragmentShaderText] = await Promise.all([vertexShaderResponse.text(), fragmentShaderResponse.text()]);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('Vertex shader error: ', gl.getShaderInfoLog(vertexShader));
	}

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('Fragment shader error: ', gl.getShaderInfoLog(fragmentShader));
	}

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
	}

  return shaderProgram;
}

export async function initShaders(gl) {
  let shaders = Object.create(Object.prototype);
  [shaders.unlit, ] = await Promise.all([createUnlit(gl), ]);

  return shaders;
}

export async function createUnlit(gl) {
  let shaderObject = Object.create(Object.prototype);

  shaderObject.program = await loadShader(gl, "shaders/unlit.vs", "shaders/unlit.fs");

  shaderObject.positionLocation = gl.getAttribLocation(shaderObject.program, "position");
  gl.enableVertexAttribArray(shaderObject.positionLocation);
  shaderObject.uvLocation = gl.getAttribLocation(shaderObject.program, "uv");
  gl.enableVertexAttribArray(shaderObject.uvLocation);

  shaderObject.projectionLocation = gl.getUniformLocation(shaderObject.program, "projectionMatrix");
  shaderObject.viewLocation = gl.getUniformLocation(shaderObject.program, "viewMatrix");
  shaderObject.worldLocation = gl.getUniformLocation(shaderObject.program, "worldMatrix");
  shaderObject.baseColorLocation = gl.getUniformLocation(shaderObject.program, "baseColor");

  return shaderObject;
}
