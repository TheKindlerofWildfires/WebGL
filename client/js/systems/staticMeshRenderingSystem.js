'use strict';
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

export function update(gl, shaders, cameraObject, entityMap) {
  gl.useProgram(shaders.unlit.program);

  for(let currentEntity of entityMap.values()) {
    if ("staticMeshComponent" in currentEntity) {
      let staticMesh = currentEntity.staticMeshComponent;
      let transform = currentEntity.transformComponent;

      let worldMatrix = mat4.create();
      mat4.translate(worldMatrix, worldMatrix, transform.location)
      mat4.scale(worldMatrix, worldMatrix, transform.scale);
      gl.uniformMatrix4fv(shaders.unlit.worldLocation, false, worldMatrix);

      gl.uniformMatrix4fv(shaders.unlit.viewLocation, false, cameraObject.viewMatrix);

      gl.uniformMatrix4fv(shaders.unlit.projectionLocation, false, cameraObject.projectionMatrix);

      gl.bindBuffer(gl.ARRAY_BUFFER, staticMesh.positionBuffer);
      gl.vertexAttribPointer(shaders.unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, staticMesh.uvBuffer);
      gl.vertexAttribPointer(shaders.unlit.uvLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, staticMesh.polyCount);
    }
  }
}
