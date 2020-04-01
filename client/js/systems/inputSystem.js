'use strict';

let mouse = false;
export function initInput(canvas){
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
}

function mouseDown(e){
  mouse = 1;
}

function mouseUp(e){
  mouse = -1;
}

export function getMouseState(){
  return mouse;
}
