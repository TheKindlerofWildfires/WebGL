"use strict";
//useful
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
let audioContext = null;
let isMuted = true;
let masterGain = 1.0;

export function init() {
  audioContext = new audioContext();


}

export function getContext() {
  return audioContext;
}

export function playAudio(audio, gain, panner) {
  //todo
}
