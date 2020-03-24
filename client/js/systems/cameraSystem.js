'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

export function update(entityMap) {
  let cameraObject = Object.create(Object.prototype);
  cameraObject.viewMatrix = mat4.create();
  cameraObject.projectionMatrix = mat4.create();
  for(let currentEntity of entityMap.values()) {
    if ("cameraComponent" in currentEntity && currentEntity.cameraComponent.isActive) {
      mat4.translate(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.location);
      mat4.lookAt(cameraObject.viewMatrix, currentEntity.transformComponent.location, vec3.fromValues(0,0,0), vec3.fromValues(0,0,1))
      //mat4.rotateX(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[0]);
      //mat4.rotateY(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[1]);
      //mat4.rotateZ(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[2]);

      mat4.perspective(cameraObject.projectionMatrix, 60 * Math.PI/180, 1, 0.1, 10);
      //mat4.ortho(cameraObject.projectionMatrix, -2, 2, -2, 2, 4, 8);
    }
  }
  return cameraObject;
}
