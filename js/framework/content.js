"use strict";
import * as graphics from "/js/framework/graphics.js";

import * as objLoader from "/js/loaders/objLoader.js";
import * as pngLoader from "/js/loaders/pngLoader.js";

let contentMap = new Map();

export async function loadTexture(groupId, assetLocation, SRGB = true) {
  if (contentMap.has(assetLocation)) {
    let textureResource = contentMap.get(assetLocation);
    textureResource.groups.add(groupId);
    return;
  }
  let textureResource = Object.create(Object.prototype);
  textureResource.type = "textureResource";
  textureResource.isReady = false;
  textureResource.groups = [groupId];
  contentMap.set(assetLocation, textureResource);

  textureResource.asset = await pngLoader.load(assetLocation);
  textureResource.isReady = true;
}

export function loadMesh(groupId, assetLocation) {
  if (contentMap.has(assetLocation)) {
    let meshResource = contentMap.get(assetLocation);
    meshResource.groups.add(groupId);
    return;
  }
  let meshResource = Object.create(Object.prototype);
  meshResource.type = "meshResource";
  meshResource.isReady = false;
  meshResource.groups = [groupId];
  contentMap.set(assetLocation, meshResource);

  meshResource.asset = await objLoader.load(assetLocation);
  meshResource.isReady = true;
}

export function getAsset(assetLocation) {
  return contentMap.get(assetLocation).asset;
}

export function checkGroup(groupId) {
  for (let resource of contentMap.values()) {
    if (resource.groups.has(groupId) && !resource.isReady) {
      return false;
    }
  }

  return true;
}
