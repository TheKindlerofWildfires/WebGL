"use strict";
import * as graphics from "/js/framework/graphics.js";

export async function load(assetLocation) {
  console.log("Loading texture: " + assetLocation);
  let imageResponse = await fetch(assetLocation);
  let imageBlob = await imageResponse.blob();
  let image = await createImageBitmap(imageBlob);

  let texture = Object.create(Object.prototype);
  texture.type = "texture";
  let gl = graphics.getContext();
  texture.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture.texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
}
