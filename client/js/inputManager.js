'use strict';
import * as shaderManager from "/js/shaderManager.js";

let keyMap = new Map();
let mouseLocation = Object.create(Object.prototype);
mouseLocation.x = 0;
mouseLocation.y = 0;

export function initInput() {
  let gameCanvas = shaderManager.getGameCanvas();
  gameCanvas.addEventListener("keydown", onKeyDown);
  gameCanvas.addEventListener("keyup", onKeyUp);
  gameCanvas.addEventListener("mousedown", onMouseDown);
  gameCanvas.addEventListener("mouseup", onMouseUp);
  gameCanvas.addEventListener("mousemove", onMouseMove);
}

export function getKeyState(keyCode) {
  if (!keyMap.has(keyCode)) {
    return false
  }

  return keyMap.get(keyCode);
}

export function getMouseLocation() {
  return mouseLocation;
}

function onKeyDown(keyEvent) {
  keyMap.set(keyEvent.code, true);
}

function onKeyUp(keyEvent) {
  keyMap.set(keyEvent.code, false);
}

function onMouseDown(mouseEvent) {
  switch(mouseEvent.button) {
    case 0:
      keyMap.set("MouseLeft", true);
      break;
    case 1:
      keyMap.set("MouseMiddle", true);
      break;
    case 2:
      keyMap.set("MouseRight", true);
      break;
  }
}

function onMouseUp(mouseEvent) {
  switch(mouseEvent.button) {
    case 0:
      keyMap.set("MouseLeft", false);
      break;
    case 1:
      keyMap.set("MouseMiddle", false);
      break;
    case 2:
      keyMap.set("MouseRight", false);
      break;
  }
}

function onMouseMove(mouseEvent) {
  let screenSize = shaderManager.getClientScreenSize();
  mouseLocation.x = mouseEvent.x / screenSize.width;
  mouseLocation.y = mouseEvent.y / screenSize.height;
}
