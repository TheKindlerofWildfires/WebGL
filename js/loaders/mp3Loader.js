"use strict";
import * as audio from "/js/framework/audio.js";

export async function load(assetLocation) {
  let audioContext = audio.getContext();
  let audio = Object.create(Object.prototype);
  audio.type = "audio";

  let response = await fetch(assetLocation);
  let arrayBuffer = await response.arrayBuffer();
  audio.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audio;
}
