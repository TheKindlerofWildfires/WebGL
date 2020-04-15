"use strict";
import * as time from "/js/util/time.js";
import * as state from "/js/framework/state.js";
import * as input from "/js/framework/input.js";
import * as graphics from "/js/framework/graphics.js";
import * as content from "/js/framework/content.js";

init();
async function init() {
  graphics.init();
  input.init();
  state.init();

  requestAnimationFrame(main);
}

function main() {
  time.tick();
  state.tick();

  requestAnimationFrame(main);
}
