'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

export function update(entityMap) {
  let cameraObject = Object.create(Object.prototype);
  cameraObject.viewMatrix = mat4.create();
  cameraObject.projectionMatrix = mat4.create();
  for(let currentEntity of entityMap.values()) {
    if ("cameraComponent" in currentEntity && currentEntity.cameraComponent.isActive) {
      let cameraComponent = currentEntity.cameraComponent;
      let transformComponent = currentEntity.transformComponent;

      mat4.translate(cameraObject.viewMatrix, cameraObject.viewMatrix, transformComponent.location);
      mat4.lookAt(cameraObject.viewMatrix, transformComponent.location, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
      //mat4.rotateX(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[0]);
      //mat4.rotateY(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[1]);
      //mat4.rotateZ(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[2]);
      mat4.perspective(cameraObject.projectionMatrix, cameraComponent.fov * Math.PI/180, cameraComponent.aspectRatio, cameraComponent.clipNear, cameraComponent.clipFar);
      return cameraObject;
    }
  }
  return cameraObject;
}
