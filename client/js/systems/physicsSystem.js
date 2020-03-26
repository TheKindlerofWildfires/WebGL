'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";

export function update(entityMap, deltaTime) {
  for (let currentEntity of entityMap.values()) {
    if ("velocityComponent" in currentEntity) {
      let rotation = currentEntity.transformComponent.rotation;
      let angularVeloctiy = currentEntity.velocityComponent.angularVelocity;
      rotation = vec3.fromValues(rotation[0] + angularVeloctiy[0] * deltaTime, rotation[1] + angularVeloctiy[1] * deltaTime, rotation[2]  + angularVeloctiy[2] * deltaTime);
      currentEntity.transformComponent.rotation = rotation;
    }
  }
}
