//This should be perlin noise eventually, if I get the chance
//For the time being this will just spit out a random value

export function test(point){
  return point[0]^2-point[2]+Math.exp(-point[1]);
}
