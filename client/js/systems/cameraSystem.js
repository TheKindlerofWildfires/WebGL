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
      mat4.rotateX(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transform.rotation[0] * Math.PI/180);
      mat4.rotateY(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transform.rotation[1] * Math.PI/180);
      mat4.rotateZ(cameraObject.viewMatrix, cameraObject.viewMatrix, currentEntity.transform.rotation[2] * Math.PI/180);

      let cameraPosition = vec3.create();
      vec3.subtract(cameraPosition, cameraPosition, currentEntity.transform.location)
      mat4.translate(cameraObject.viewMatrix, cameraObject.viewMatrix, cameraPosition);
      
      mat4.perspective(cameraObject.projectionMatrix, currentEntity.camera.fov * Math.PI/180, currentEntity.camera.aspectRatio, currentEntity.camera.clipNear, currentEntity.camera.clipFar);
      return;
    }
  }
}
