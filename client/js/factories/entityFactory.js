'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

import * as transformFactory from "/js/factories/transformFactory.js";

export function createEntity(location, rotation, scale) {
  entity = Object.create(Object.prototype);
  entity.type = "entity";
  entity.id = uuidv4();
  entity.flags = [];
  entity.transform = transformFactory.createTransform(location, rotation, scale);
  entity.components = [];
}
