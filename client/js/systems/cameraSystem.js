'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";
import * as mat4 from "/js/lib/glMatrix/mat4.js";

import * as world from "/js/world.js";

export function tick() {
  let cameraObject = world.getActiveCamera();
  cameraObject.viewMatrix = mat4.create();
  cameraObject.projectionMatrix = mat4.create();
  for(let currentEntity of world.getEntities()) {
    if ("camera" in currentEntity && currentEntity.camera.isActive) {
      mat4.translate(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transform.location);
      mat4.lookAt(cameraObject.viewMatrix, currentEntity.transform.location, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
      //mat4.rotateX(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[0]);
      //mat4.rotateY(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[1]);
      //mat4.rotateZ(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transformComponent.rotation[2]);
      mat4.perspective(cameraObject.projectionMatrix, currentEntity.camera.fov * Math.PI/180, currentEntity.camera.aspectRatio, currentEntity.camera.clipNear, currentEntity.camera.clipFar);
      return;
    }
  }
}
