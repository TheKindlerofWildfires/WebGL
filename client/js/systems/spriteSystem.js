'use strict';
import * as mat4 from "/js/lib/glMatrix/mat4.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as vec2 from "/js/lib/glMatrix/vec2.js";

import * as shaderManager from "/js/shaderManager.js";
import * as resourceManager from "/js/resourceManager.js";
import * as world from "/js/world.js";

export function tick() {
  let gl = shaderManager.getWebglContext();
  let spriteShader = shaderManager.getShader("sprite");
  gl.useProgram(spriteShader.program);
  for (let currentEntity of world.getEntities()) {
    if ("sprite" in currentEntity) {
      let worldMatrix = mat4.create();

      mat4.translate(worldMatrix, worldMatrix, currentEntity.transform.location);
      mat4.rotateX(worldMatrix, worldMatrix, world.getActiveCamera().cameraRotation[0] * Math.PI/180);
      mat4.rotateY(worldMatrix, worldMatrix, world.getActiveCamera().cameraRotation[1] * Math.PI/180);
      mat4.rotateZ(worldMatrix, worldMatrix, world.getActiveCamera().cameraRotation[2] * Math.PI/180);

      gl.uniformMatrix4fv(spriteShader.worldLocation, false, worldMatrix);
      gl.uniformMatrix4fv(spriteShader.viewLocation, false, world.getActiveCamera().viewMatrix);
      gl.uniformMatrix4fv(spriteShader.projectionLocation, false, world.getActiveCamera().projectionMatrix);

      gl.uniform2fv(spriteShader.spriteSizeLocation, vec2.fromValues(currentEntity.sprite.spriteWidth, currentEntity.sprite.spriteHeight));
      gl.uniform2fv(spriteShader.spritePositionLocation, vec2.fromValues(currentEntity.sprite.spriteX, currentEntity.sprite.spriteY));

      let spriteMesh = resourceManager.getResource("/assets/sprite.obj");
      let spriteSheet = resourceManager.getResource(currentEntity.sprite.spriteSheet);

      gl.bindBuffer(gl.ARRAY_BUFFER, spriteMesh.positionBuffer);
      gl.vertexAttribPointer(spriteShader.positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, spriteMesh.uvBuffer);
      gl.vertexAttribPointer(spriteShader.uvLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, spriteSheet.texture);
      gl.uniform1i(spriteShader.spriteSheetLocation, 0);

      gl.drawArrays(gl.TRIANGLES, 0, spriteMesh.polyCount);
    }
  }
}
