'use strict';

export async function loadPng(url) {
  console.log("Loading texture: " + url);
  let imageResponse = await fetch(url);
  let imageBlob = await imageResponse.blob();
  let image = await createImageBitmap(imageBlob);

  return image;
}
