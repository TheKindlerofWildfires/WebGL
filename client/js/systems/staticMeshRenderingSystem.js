'use strict';

export function update(gl, shaders, cameraObject, entityMap) {
  gl.useProgram(shaders.unlit.program);

  for(let currentEntity of entityMap.values()) {
    if ("staticMeshComponent" in currentEntity) {
      let staticMesh = currentEntity.staticMeshComponent;

      gl.bindBuffer(gl.ARRAY_BUFFER, staticMesh.vertexBuffer);
      gl.vertexAttribPointer(shaders.unlit.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, staticMesh.bufferLength);
    }
  }
}
