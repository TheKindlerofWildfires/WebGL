'use strict';
import {v4 as uuidv4} from "/js/lib/uuidjs/index.js";

import * as transformFactory from "/js/factories/transformFactory.js";

let entityMap = new Map();

export function createEntity() {
  let entity = Object.create(Object.prototype);
  entity.type = "entity";
  entity.id = uuidv4();
  entity.transform = transformFactory.createTransform(location, rotation, scale);
  entity.flags = [];
  entity.components = [];

  entityMap.set(entity.id, entity);
  return entity.id;
}

export function addComponent(id, newComponent) {
  let entity = entityMap.get(id);
  newComponent.parentId = id;
  entity.components.push(newComponent);
}

function getComponents(id, componentType) {
  let entity = entityMap.get(id);

  if (componentType == undefined) {
    return entity.components;
  }

  let componentArray = [];
  for (component in entity.components) {
    if (component.type == componentType) {
      componentArray.push(component);
    }
  }
  return componentArray;
}

export function getLocation(id) {
  let entity = entityMap.get(id);
  return entity.transform.location;
}

export function setLocation(id, newLocation) {
  let entity = entityMap.get(id);
  entity.transform.location = newLocation;
}

export function getRotation(id) {
  let entity = entityMap.get(id);
  return entity.transform.rotation;
}

export function setRotation(id, newRotation) {
  let entity = entityMap.get(id);
  entity.transform.rotation = newRotation;
}

export function getScale(id) {
  let entity = entityMap.get(id);
  return entity.transform.scale;
}

export function setScale(id, newScale) {
  let entity = entityMap.get(id);
  entity.transform.scale = newScale;
}
