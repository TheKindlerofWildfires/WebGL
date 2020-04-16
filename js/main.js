"use strict";
import * as time from "/js/util/time.js";
import * as state from "/js/framework/state.js";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

init();
async function init() {
  await graphics.init();
  input.init();
  state.init();

  requestAnimationFrame(main);
}

function main() {
  graphics.clear();
  time.tick();
  input.tick();
  state.tick();
  graphics.present();
  requestAnimationFrame(main);
}
