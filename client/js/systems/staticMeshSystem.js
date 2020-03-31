'use strict';
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

import * as shaderManager from "/js/shaderManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";

export function tick() {
  let gl = shaderManager.getWebglContext();
  let unlit = shaderManager.getShader("unlit");
  gl.useProgram(unlit.program);
  for (let currentEntity of world.getEntities()) {
    if ("staticMesh" in currentEntity) {
      let worldMatrix = mat4.create();
      mat4.translate(worldMatrix, worldMatrix, currentEntity.transform.location);
      mat4.scale(worldMatrix, worldMatrix, currentEntity.transform.scale);
      mat4.rotateX(worldMatrix, worldMatrix, currentEntity.transform.rotation[0] * Math.PI/180);
      mat4.rotateY(worldMatrix, worldMatrix, currentEntity.transform.rotation[1] * Math.PI/180);
      mat4.rotateZ(worldMatrix, worldMatrix, currentEntity.transform.rotation[2] * Math.PI/180);
      gl.uniformMatrix4fv(unlit.worldLocation, false, worldMatrix);
      gl.uniformMatrix4fv(unlit.viewLocation, false, world.getActiveCamera().viewMatrix);
      gl.uniformMatrix4fv(unlit.projectionLocation, false, world.getActiveCamera().projectionMatrix);

      let mesh = resourceManager.getResource(currentEntity.staticMesh.mesh);
      let baseColor = resourceManager.getResource(currentEntity.staticMesh.baseColor);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
      gl.vertexAttribPointer(unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
      gl.vertexAttribPointer(unlit.uvLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, baseColor.texture);
      gl.uniform1i(unlit.baseColorLocation, 0);

      gl.drawArrays(gl.TRIANGLES, 0, mesh.polyCount);
    }
  }
}
