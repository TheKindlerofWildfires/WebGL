"use strict";
let previousFrameTime = 0;
let totalTime = 0;
let deltaTime = 0;

export function tick() {
  totalTime = performance.now();
  deltaTime = (totalTime - previousFrameTime) / 1000;
  previousFrameTime = totalTime;
}

export function getDeltaTime() {
  return deltaTime;
}

export function getTotalTime() {
  return totalTime;
}
