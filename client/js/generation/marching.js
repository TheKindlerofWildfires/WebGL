import * as noise from "/js/generation/noise.js";
import * as tables from "/js/generation/marchingTables.js";
import * as vec3 from "/js/lib/glMatrix/vec3.js";

//A starting position, an ending position, a detail option
export function mapArea(start, end, detail, surfaceLevel){
  //Create a bunch of cubes
  let cubeList = [];
  for (let i = start[0]; i < end[0]; i+=detail){
    for (let j = start[1]; j < end[1]; j+=detail){
      for (let k = start[2]; k < end[2]; k+=detail){
        cubeList.push(createCube(vec3.fromValues(i,j,k),detail));
      }
    }
  }
  //Turn the cubes into a vector array
  let vertList = [];
  let ntriang = 0;
  let i = 0;
  while(i<cubeList.length){
    let triangles = march(cubeList[i], surfaceLevel);
    if(triangles.ntriang!=0){
      for(let j = 0; j<triangles.triangles.length;j++){
        vertList.push(triangles.triangles[j]);
      }
      ntriang+=triangles.ntriang;
    }
    i++;
  }
  return {
    verts: vertList,
    n: ntriang
  };

}
// cube is the place in space I want to test
function march(cube, surfaceLevel){
  let vertList = [
    vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),
    vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),
    vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),
    vec3.fromValues(0,0,0),vec3.fromValues(0,0,0),vec3.fromValues(0,0,0)
  ];
  let triTable = tables.getTriTable();
  let edgeTable = tables.getEdgeTable();
  let cubeIndex = 0;
  //Figure out which cube to use
  for(let i=0;i<8;i++){
    if(cube.val[i] > surfaceLevel){
      cubeIndex |= 1<<i;
    }
  }
  //Edge case no cube
  if(edgeTable[cubeIndex]==0){
    return {
      triangles: undefined,
      ntriang: 0
    };
  }
  //Select vertices case by case
   if (edgeTable[cubeIndex] & 1){
     vertList[0] = interpolate(surfaceLevel, cube.point[0], cube.point[1], cube.val[0], cube.val[1])//interpolate
   }
   if (edgeTable[cubeIndex] & 2){
     vertList[1] = interpolate(surfaceLevel, cube.point[1], cube.point[2], cube.val[1], cube.val[2])//interpolate
   }
   if (edgeTable[cubeIndex] & 4){
     vertList[2] = interpolate(surfaceLevel, cube.point[2], cube.point[3], cube.val[2], cube.val[3])//interpolate
   }
   if (edgeTable[cubeIndex] & 8){
     vertList[3] = interpolate(surfaceLevel, cube.point[3], cube.point[0], cube.val[3], cube.val[0])//interpolate
   }
   if (edgeTable[cubeIndex] & 16){
     vertList[4] = interpolate(surfaceLevel, cube.point[4], cube.point[5], cube.val[4], cube.val[5])//interpolate
   }
   if (edgeTable[cubeIndex] & 32){
     vertList[5] = interpolate(surfaceLevel, cube.point[5], cube.point[6], cube.val[5], cube.val[6])//interpolate
   }
   if (edgeTable[cubeIndex] & 64){
     vertList[6] = interpolate(surfaceLevel, cube.point[6], cube.point[7], cube.val[6], cube.val[7])//interpolate
   }
   if (edgeTable[cubeIndex] & 128){
     vertList[7] = interpolate(surfaceLevel, cube.point[7], cube.point[4], cube.val[7], cube.val[4])//interpolate
   }
   if (edgeTable[cubeIndex] & 256){
     vertList[8] = interpolate(surfaceLevel, cube.point[0], cube.point[4], cube.val[0], cube.val[4])//interpolate
   }
   if (edgeTable[cubeIndex] & 512){
     vertList[9] = interpolate(surfaceLevel, cube.point[1], cube.point[5], cube.val[1], cube.val[5])//interpolate
   }
   if (edgeTable[cubeIndex] & 1024){
     vertList[10] = interpolate(surfaceLevel, cube.point[2], cube.point[6], cube.val[2], cube.val[6])//interpolate
   }
   if (edgeTable[cubeIndex] & 2048){
     vertList[11] = interpolate(surfaceLevel, cube.point[3], cube.point[7], cube.val[3], cube.val[7])//interpolate
   }
   //Make some triangles
   let ntriang = 0;
   //secretly this is a vertex array
   let triangles = [];
   for(let i=0; triTable[cubeIndex][i]!=-1;i+=3){
     triangles.push(vertList[triTable[cubeIndex][i]]);
     triangles.push(vertList[triTable[cubeIndex][i+1]]);
     triangles.push(vertList[triTable[cubeIndex][i+2]]);
     ntriang++;
   }
   return {
     triangles: triangles,
     ntriang: ntriang
   }
}

//float surface level, vectors P1, P2, float V1, V2
function interpolate(surfaceLevel, P1, P2, V1, V2){
  let limit = 0.0001;
  if(Math.abs(surfaceLevel-V1)<limit){
    return P1;
  }
  if(Math.abs(surfaceLevel-V2)<limit){
    return P2;
  }
  if(Math.abs(V1-V2)<limit){
    return P1;
  }
  let mu = (surfaceLevel-V1)/(V2-V1);
  return vec3.fromValues(
    P1[0]+mu * (P2[0] - P1[0]),
    P1[1]+mu * (P2[1] - P1[1]),
    P1[2]+mu * (P2[2] - P1[2])
  );
}
//Takes in basecoord, which is where to start
function createCube(baseCoord, size){
  let cube = {
    val: [0,0,0,0,0,0,0,0],
    point:   [vec3.fromValues(baseCoord[0]+size,baseCoord[1],baseCoord[2]),
          vec3.fromValues(baseCoord[0]+size,baseCoord[1],baseCoord[2]+size),
          vec3.fromValues(baseCoord[0],baseCoord[1],baseCoord[2]+size),
          vec3.fromValues(baseCoord[0],baseCoord[1],baseCoord[2]),
          vec3.fromValues(baseCoord[0]+size,baseCoord[1]+size,baseCoord[2]),
          vec3.fromValues(baseCoord[0]+size,baseCoord[1]+size,baseCoord[2]+size),
          vec3.fromValues(baseCoord[0],baseCoord[1]+size,baseCoord[2]+size),
          vec3.fromValues(baseCoord[0],baseCoord[1]+size,baseCoord[2])]
  }

  for(let i=0; i<8;i++){
      cube.val[i] = noise.test(cube.point[i]);
  }
  return cube;
}
