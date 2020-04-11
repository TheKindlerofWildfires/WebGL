"use strict";

import * as graphics from "/js/framework/graphics.js";

let keyMap = new Map();

export function init() {
  let gameCanvas = graphics.getCanvas();
  gameCanvas.addEventListener("keydown", onKeyDown);
  gameCanvas.addEventListener("keyup", onKeyUp);
  gameCanvas.addEventListener("mousedown", onMouseDown);
  gameCanvas.addEventListener("mouseup", onMouseUp);
  //gameCanvas.addEventListener("mousemove", onMouseMove);
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

/*
function onMouseMove(mouseEvent) {
  let screenSize = shaderManager.getClientScreenSize();
  mouseLocation.x = mouseEvent.x / screenSize.width;
  mouseLocation.y = mouseEvent.y / screenSize.height;
  mouseDelta.x = 1;
  mouseDelta.y = 1;
  clearTimeout(timeout1);
  clearTimeout(timeout2);
  timeout1 = setTimeout(function(){
    mouseDelta.x = 0.5; mouseDelta.y = 0.5;
    ;}, 500);
  timeout2 = setTimeout(function(){
    mouseDelta.x = 0; mouseDelta.y = 0;
    ;}, 2000);
}
*/
