"use strict";
import * as graphics from "/js/framework/graphics.js";

export async function load(urlOBJ) {
  console.log("Loading mesh: " + urlOBJ);
  let objResponse = await fetch(urlOBJ);
  let objText = await objResponse.text();

  let indexedPositions = [];
  let indexedNormals = [];
  let indexedUvs = [];
  let positionArray = [];
  let uvArray = [];
  let normalArray = [];

  let lineArray = objText.split('\n');
  for (let currentLine = 0; currentLine < lineArray.length; currentLine++) {
    let elements = lineArray[currentLine].trimRight().split(' ');
    if (elements.length > 0) {
      switch(elements[0]) {
        case 'v':
          indexedPositions.push(parseFloat(elements[1]));
          indexedPositions.push(parseFloat(elements[2]));
          indexedPositions.push(parseFloat(elements[3]));
          break;
        case 'vn':
          indexedNormals.push(parseFloat(elements[1]));
          indexedNormals.push(parseFloat(elements[2]));
          indexedNormals.push(parseFloat(elements[3]));
          break;
        case 'vt':
          indexedUvs.push(parseFloat(elements[1]));
          indexedUvs.push(parseFloat(elements[2]));
          break;
        case 'f':
          for (let currentElement = 1; currentElement < 4; currentElement++) {
            let subElements = elements[currentElement].split('/');
            positionArray.push( indexedPositions[(parseInt(subElements[0]) - 1) * 3 + 0] );
            positionArray.push( indexedPositions[(parseInt(subElements[0]) - 1) * 3 + 1] );
            positionArray.push( indexedPositions[(parseInt(subElements[0]) - 1) * 3 + 2] );

            uvArray.push( indexedUvs[(parseInt(subElements[1]) - 1) * 2 + 0] );
            uvArray.push( indexedUvs[(parseInt(subElements[1]) - 1) * 2 + 1] );

            normalArray.push( indexedNormals[(parseInt(subElements[2]) - 1) * 3 + 0] );
            normalArray.push( indexedNormals[(parseInt(subElements[2]) - 1) * 3 + 1] );
            normalArray.push( indexedNormals[(parseInt(subElements[2]) - 1) * 3 + 2] );
          }
          break;
      }
    }
  }
  let gl = graphics.getContext();
  let mesh = Object.create(Object.prototype);
  mesh.type = "mesh";
  mesh.polyCount = positionArray.length / 3;
  mesh.positionBuffer = gl.createBuffer();
  mesh.uvBuffer = gl.createBuffer();
  mesh.normalBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvArray), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);

  return mesh;
}
