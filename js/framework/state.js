"use strict";
import * as time from "/js/util/time.js";

import * as splash from "/js/states/splash.js";
import * as menu from "/js/states/menu.js";

let currentState = "splash";
let stateMap = new Map();

export function init() {
  stateMap.set("splash", splash);
  stateMap.set("menu", menu);

  splash.init();
}

export function tick() {
  if (!stateMap.has(currentState)) {
    console.warn("state was set to an invalid value, returning to menu.");
    gotoMenu();
  }

  let deltaTime = time.getDeltaTime();

  stateMap.get(currentState).tick(deltaTime);
}

export function goto(newState) {
  console.log("setting state to: " + newState);
  if (!stateMap.has(newState)) {
    console.warn("tried to goto non existant state, aborting.");
    gotoMenu();
    return;
  }
  currentState = newState;
  stateMap.get(newState).init();
}

//resume menu state
export function gotoMenu() {
  currentState = "menu";
}
