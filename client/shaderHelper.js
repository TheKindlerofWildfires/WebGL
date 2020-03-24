'use strict';

export async function loadShader(gl, vertexShaderUrl, fragmentShaderUrl) {
  let [vertexShaderResponse, fragmentShaderResponse] = await Promise.all([fetch(vertexShaderUrl), fetch(fragmentShaderUrl)]);
  let [vertexShaderText, fragmentShaderText] = await Promise.all([vertexShaderResponse.text(), fragmentShaderResponse.text()]);

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.compileShader(vertexShader);

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  gl.compileShader(fragmentShader);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

export async function createUnlit(gl) {
  let shaderObject = Object.create();
  
  shaderObject.program = await loadShader(gl, "shaders/unlit.fs", "shaders/unlit.fs");
  shaderObject.positionLocation = gl.getAttribLocation(shaderObject.program, "position");
  gl.enableVertexAttribArray(shaderObject.positionLocation);
  shaderObject.uvLocation = gl.getAttribLocation(shaderObject.program, "uvCoord");
  gl.enableVertexAttribArray(shaderObject.uvLocation);

  shaderObject.projectionLocation = gl.getUniformLocation(shaderObject.program, "mProj");
  shaderObject.viewLocation = gl.getUniformLocation(shaderObject.program, "mView");
  shaderObject.worldLocation = gl.getUniformLocation(shaderObject.program, "mWorld");
  shaderObject.BaseColorLocation = gl.getUniformLocation(shaderObject.program, "baseColor");

  return shaderObject;
}
