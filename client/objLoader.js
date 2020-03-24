'use strict';

export async function loadOBJ(gl, urlOBJ, urlBaseColor) {
  console.log("loading mesh: " + urlOBJ);
  console.log("loading texture: " + urlBaseColor);
  let [objResponse, baseColorResponse] = await Promise.all([fetch(urlOBJ), fetch(urlBaseColor)]);
  let [objText, baseColorBlob] = await Promise.all([objResponse.text(), baseColorResponse.blob()]);

  let renderComponent = {};

  let vertexPositions = [];
  let vertexNormals = [];
  let vertexUvs = [];
  let bufferedPositions = [];

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
            let subElements = elements[currentElement].split('n');
            bufferedPositions.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 0] );
            bufferedPositions.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 1] );
            bufferedPositions.push( vertexPositions[(parseInt(subElements[0]) - 1) * 3 + 2] );
          }
          break;
      }
    }
  }

  console.log(vertexPositions);
  return renderComponent;
}
