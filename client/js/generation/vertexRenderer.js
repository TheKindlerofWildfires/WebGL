//Temp script to load in vertices and display them to the screen.
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

import * as shaderManager from "/js/shaderManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";

let terrain = {
  vert: 0,
  uv:0,
  baseColor: 0,
  polyCount: 0
};

export function tick() {
  let gl = shaderManager.getWebglContext();
  let unlit = shaderManager.getShader("unlit");
  gl.useProgram(unlit.program);
  let worldMatrix = mat4.create();
  gl.uniformMatrix4fv(unlit.worldLocation, false, worldMatrix);
  gl.uniformMatrix4fv(unlit.viewLocation, false, world.getActiveCamera().viewMatrix);
  gl.uniformMatrix4fv(unlit.projectionLocation, false, world.getActiveCamera().projectionMatrix);


  gl.bindBuffer(gl.ARRAY_BUFFER, terrain.vert);
  gl.vertexAttribPointer(unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, terrain.uv);
  gl.vertexAttribPointer(unlit.uvLocation, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, terrain.color);
  gl.uniform1i(unlit.baseColorLocation, 0);

  gl.drawArrays(gl.TRIANGLES, 0, terrain.polyCount);
}

export function setTerrain(vert, color, polyCount){
  let gl = shaderManager.getWebglContext();
  terrain.vert = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, terrain.vert);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert), gl.STATIC_DRAW);
  let tmpuv = [];
  for(let i=0;i<polyCount*2;i++){
    tmpuv.push([0,0]);
  }
  terrain.uv = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, terrain.uv);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmpuv), gl.STATIC_DRAW);
  terrain.color = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, terrain.color);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
  terrain.polyCount = polyCount;
}
