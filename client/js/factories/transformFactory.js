'use strict';
import * as vec3 from "/js/lib/glMatrix/vec3.js";

export function createTransform(location = vec3.create(), rotation = vec3.create(), scale = vec3.fromValues(1, 1, 1)) {
  let transform = Object.create(Object.prototype);
  transform.location = location;
  transform.rotation = rotation;
  transform.scale = scale;

  return transform;
}

export function getChildAbsolute(parentTransform, childTransform) {
  let transform = Object.create(Object.prototype);
  transform.location = vec3.create();
  transform.rotation = vec3.create();
  transform.scale = vec3.create();

  vec3.add(transform.location, parentTransform.location, childTransform.location);
  vec3.add(transform.rotation, parentTransform.rotation, childTransform.rotation);
  vec3.multiply(transform.scale, parentTransform.scale, childTransform.scale);

  return transform;
}
