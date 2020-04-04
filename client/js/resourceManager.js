'use strict';
import * as objLoader from "/js/loaders/objLoader.js";
import * as pngLoader from "/js/loaders/pngLoader.js";

import * as shaderManager from "/js/shaderManager.js";

let resourceMap = new Map();

export async function load(url, group) {
  if (resourceMap.has(url)) {
    let resource = resourceMap.get(url);
    resource.groups.add(group);
    return;
  }
  let resource = Object.create(Object.prototype);
  resourceMap.set(url, resource);
  resource.isReady = false;
  resource.groups = new Set();
  resource.groups.add(group);

  let gl = shaderManager.getWebglContext();

  resource.fileType = url.slice(url.length - 3, url.length);
  let rawResource = null;
  switch(resource.fileType) {
    case "png":
      rawResource = await pngLoader.loadPng(url);
      resource.type = "textureResource";
      resource.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, resource.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rawResource);
      break;
    case "obj":
      rawResource = await objLoader.loadOBJ(url);
      resource.type = "meshResource";
      resource.polyCount = rawResource.positionArray.length / 3;
      resource.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, resource.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rawResource.positionArray), gl.STATIC_DRAW);
      resource.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, resource.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rawResource.uvArray), gl.STATIC_DRAW);
      break;
  }
  resource.isReady = true;
}

export function getResource(url) {
  return resourceMap.get(url);
}

export function checkReady(group) {
  for (let resource of resourceMap.values()) {
    if (resource.groups.has(group) && !resource.isReady) {
      return false;
    }
  }

  return true;
}
