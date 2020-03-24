'use strict';

export function getContext(canvas) {
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

  return gl;
}
