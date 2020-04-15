"use strict";
import * as state from "/js/framework/state.js";
import * as content from "/js/framework/content.js";

let timeOnSplash = 0;

export function init() {
  //load content for "menu";
  content.loadTexture("menu", "/assets/test/TestCube_BaseColor.png");
  content.loadMesh("menu", "/assets/test/TestCube.obj");
}

export function tick(deltaTime) {
  timeOnSplash += deltaTime;
  if (timeOnSplash > 2 && content.checkGroup("menu")) {
    state.goto("menu");
  }
}
