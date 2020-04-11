"use strict";

export async function loadOBJ(urlOBJ) {
  console.log("Loading mesh: " + urlOBJ);
  let objResponse = await fetch(urlOBJ);
  let objText = await objResponse.text();

  let parsedObj = Object.create(Object.prototype);

  let vertexPositions = [];
  let vertexNormals = [];
  let vertexUvs = [];

  let positionArray = [];
  let uvArray = [];
  let normalArray = [];

  let lineArray = objText.split('\n');
  for (let currentLine = 0; currentLine < lineArray.length; currentLine++) {
    let elements = lineArray[currentLine].trimRight().split(' ');
    if (elements.length > 0) {
      switch(elements[0]) {
        case 'v':
          vertexPositions.push(parseFloat(elements[1]));
          vertexPositions.push(parseFloat(elements[2]));
          vertexPositions.push(parseFloat(elements[3]));
          break;
        case 'vn':
          vertexNormals.push(parseFloat(elements[1]));
          vertexNormals.push(parseFloat(elements[2]));
          vertexNormals.push(parseFloat(elements[3]));
          break;
        case 'vt':
          vertexUvs.push(parseFloat(elements[1]));
          vertexUvs.push(parseFloat(elements[2]));
          break;
        case 'f':
          for (let currentElement = 1; currentElement < 4; currentElement++) {
            let subElements = elements[currentElement].split('/');
            positionArray.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 0] );
            positionArray.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 1] );
            positionArray.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 2] );

            uvArray.push( vertexUvs[(parseInt(subElements[1]) - 1) * 2 + 0] );
            uvArray.push( vertexUvs[(parseInt(subElements[1]) - 1) * 2 + 1] );

            normalArray.push( vertexNormals[(parseInt(subElements[2]) - 1) * 3 + 0] );
            normalArray.push( vertexNormals[(parseInt(subElements[2]) - 1) * 3 + 1] );
            normalArray.push( vertexNormals[(parseInt(subElements[2]) - 1) * 3 + 2] );
          }
          break;
      }
    }
  }

  parsedObj.polyCount = positionArray.length / 3;
  parsedObj.positionArray = positionArray;
  parsedObj.uvArray = uvArray;
  parsedObj.normalArray = normalArray;

  return parsedObj;
}
