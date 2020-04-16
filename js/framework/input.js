"use strict";
import * as graphics from "/js/framework/graphics.js";
import * as time from "/js/util/time.js";

let keyMap = new Map();
let inputObject = Object.create(Object.prototype);
let gameCanvas = null;
let mouseLocation = Object.create(Object.prototype);
let previousMouseLocation = Object.create(Object.prototype);
let mouseDelta = Object.create(Object.prototype);

export function init() {
  gameCanvas = graphics.getCanvas();
  gameCanvas.addEventListener("keydown", onKeyDown);
  gameCanvas.addEventListener("keyup", onKeyUp);
  gameCanvas.addEventListener("mousedown", onMouseDown);
  gameCanvas.addEventListener("mouseup", onMouseUp);
  gameCanvas.addEventListener("mousemove", onMouseMove);
  previousMouseLocation.x = 0.5;
  previousMouseLocation.y = 0.5;
}

export function tick() {
  let deltaTime = time.getDeltaTime();
  mouseDelta.x = (mouseLocation.x - previousMouseLocation.x) * deltaTime;
  mouseDelta.y = (mouseLocation.y - previousMouseLocation.y) * deltaTime;

  previousMouseLocation.x = mouseLocation.x;
  previousMouseLocation.y = mouseLocation.y;

  //todo keybindings
  inputObject.up = getKeyState("KeyW");
  inputObject.down = getKeyState("KeyS");
  inputObject.left = getKeyState("KeyA");
  inputObject.right = getKeyState("KeyD");
}

export function getMouseDelta() {
  return mouseDelta;
}

export function getInput() {
  return inputObject;
}

function onKeyDown(keyEvent) {
  keyMap.set(keyEvent.code, true);
}

function onKeyUp(keyEvent) {
  keyMap.set(keyEvent.code, false);
}

function getKeyState(keyCode) {
  if (!keyMap.has(keyCode)) {
    return false
  }

  return keyMap.get(keyCode);
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
  mouseLocation.x = mouseEvent.x / gameCanvas.clientWidth;
  mouseLocation.y = mouseEvent.y / gameCanvas.clientHeight;
}
