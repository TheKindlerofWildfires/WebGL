'use strict';
import * as mat4 from "/js/lib/glMatrix/mat4.js";

export function update(entityMap) {
  let cameraObject = Object.create(Object.prototype);
  cameraObject.viewMatrix = mat4.create();
  cameraObject.projectionMatrix = mat4.create();
  for(let currentEntity of entityMap.values()) {
    if ("cameraComponent" in currentEntity) {
      
    }
  }
  return cameraObject;
}
