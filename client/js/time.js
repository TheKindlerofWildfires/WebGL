'use strict';

let currentFrameTime = 0.00;
let lastFrameTime = 0.00;
let deltaTime = 0.00;

export function flow() {
  currentFrameTime = performance.now();
  deltaTime = (currentFrameTime - lastFrameTime) / 1000;
	lastFrameTime = currentFrameTime;
}

export function getDeltaTime() {
  return deltaTime;
}

export function getFromZero() {
  return currentFrameTime;
}
