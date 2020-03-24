'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";
import * as glMatrix from "/js/lib/glMatrix/common.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

export function createEmpty(entityMap) {
  let entity = Object.create(Object.prototype);
  entity.id = uuidv4();
  entity.needsRemoval = false;
  entity.transformComponent = Object.create(Object.prototype);
  entity.transformComponent.Location = vec3.create();
  entity.transformComponent.rotation = vec3.create();
  entity.transformComponent.scale = vec3.fromValues(1,1,1);

  entityMap.set(entity.id, entity);
  return entity;
}
