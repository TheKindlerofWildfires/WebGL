'use strict';
import * as objLoader from "/js/loaders/objLoader.js";
import * as pngLoader from "/js/loaders/pngLoader.js";

import * as shaderManager from "/js/shaderManager.js";

let resourceMap = new Map();
let inProgress = new Map();

export async function load(url) {
  if (resourceMap.has(url) || inProgress.has(url)) {
    return;
  }
  let gl = shaderManager.getWebglContext();

  let currentRequest = Object.create(Object.prototype);
  currentRequest.fileType = url.slice(url.length - 3, url.length);
  inProgress.set(url, currentRequest);
  let rawResource = null;
  switch(currentRequest.fileType) {
    case "png":
      rawResource = await pngLoader.loadPng(url);
      currentRequest.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, currentRequest.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rawResource);
      //console.log(currentRequest);
      break;
    case "obj":
      rawResource = await objLoader.loadOBJ(url);
      currentRequest.polyCount = rawResource.positionArray.length / 3;
      currentRequest.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, currentRequest.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rawResource.positionArray), gl.STATIC_DRAW);
      currentRequest.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, currentRequest.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rawResource.uvArray), gl.STATIC_DRAW);
      break;
  }
  resourceMap.set(url, currentRequest);
  inProgress.delete(url);
}

export function getResource(url) {
  return resourceMap.get(url);
}

export function checkReady() {
  return !inProgress.size > 0;
}
