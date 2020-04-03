'use strict';

let mouseState = 0;
let coords = {
  x:0,
  y:0,
};
let keyMap = new Map(); //Keys can be 0 for up, 1 for down
export function initInput(canvas){
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("keydown", keyDown, false);
  canvas.addEventListener("keyup", keyUp, false)
  //document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
    alert('Undo!')
  }
});
  //
}

function mouseDown(e){
  mouseState = 1;
}

function mouseUp(e){
  mouseState = -1;
}

function mouseMove(e){
  coords = {
  x:e.pageX,
  y:e.pageY,
  }
}

function keyDown(e){
  keyMap.set(e.code, "1");
}

function keyUp(e){
  keyMap.set(e.code, "0");
}

export function getKey(keyCode){
  return keyMap.get(keyCode);
}

export function getMouseState(){
  return mouse;
}

export function getMouseCoord(canvas){
  return coords;
}
