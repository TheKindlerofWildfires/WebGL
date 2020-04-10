import * as vec3 from "/js/lib/glMatrix/vec3.js";

let speed = 5;
let sensitivity = 1;

let tickLocation = vec3.fromValues(0,0,0);
let tickRotation = vec3.fromValues(0,0,0);

//Math.cos(delta.x)*Math.cos(delta.y)*sensitivity,
//Math.sin(delta.x)*Math.cos(delta.y)*sensitivity,
//Math.sin(delta.y)*sensitivity
export function update(pawnRotation, keys, mouseDelta, mouseLocation,scale){
    let target = {
			x: Math.sin(pawnRotation[1]*Math.PI/180),
			y: Math.cos(pawnRotation[1]*Math.PI/180)
		}
		let front = keys.w-keys.s;
		let back = keys.a-keys.d;
    tickLocation = vec3.fromValues(
			+front*target.x*speed*scale-back*target.y*speed*scale,
			0,
			-front*target.y*speed*scale-back*target.x*speed*scale
		);
		//Look at commands
		//Set the delta based on mouse location (Goes -pi/2 to pi/2)
    //console.log(mouseDelta)
    //If the mouse delta and location are in the same direction this should be large, if oposite should be small
		/*let delta = {
			x: mouseDelta.x*Math.abs((mouseDelta.x+mouseLocation.x-0.5)^2),
			y: mouseDelta.y*Math.abs((mouseDelta.y+mouseLocation.y-0.5)^2)
		}*/
    let delta = {
      x: (mouseLocation.x-0.5)*mouseDelta.x,
      y: (mouseLocation.y-0.5)*mouseDelta.y
    }
		target.x = target.x+Math.cos(delta.x)*Math.cos(delta.y);
		target.y = target.y+Math.sin(delta.x)*Math.cos(delta.y);
		tickRotation = vec3.fromValues(
			0,
			Math.sin(delta.x)*Math.cos(delta.y)*sensitivity,
			0
		);
}
export function getTickLocation(){
  //Moves the target about a unit sphere around the player
  return tickLocation;
}
export function getTickRotation(){
  return tickRotation;
}
/*
//Step 1: Set the point in space that we are looking at!
//x,y,z
//when x or x = 90, -90 y must be 1
let target = vec3.fromValues(
  Math.cos(pawnRotation[0]*Math.PI/180)*Math.cos(pawnRotation[1]*Math.PI/180),
  (Math.sin(pawnRotation[0]*Math.PI/180)+Math.sin(pawnRotation[2]*Math.PI/180))/Math.PI*2,
  Math.cos(pawnRotation[2]*Math.PI/180)*Math.sin(pawnRotation[1]*Math.PI/180)
)
//console.log(target) //[.7, .7, 0]
//[1, .85, .85]
//Which way do we want to go
let front = keys.w-keys.s;
let side = keys.a-keys.d;
tickLocation = vec3.fromValues(
  speed*scale*(-front*target[2] -side*target[0]),
  0,
  speed*scale*(-front*target[0] +side*target[2]),
); //Left y blank intentionally
let delta = {
  x: (mouseCoords.x-0.5)*Math.PI,
  y: (mouseCoords.y-0.5)*Math.PI
};
//now we are looking in a new direction (probably with a dx rather then an absolute value)
target = vec3.fromValues(
Math.cos(delta.x)*Math.cos(delta.y),
Math.sin(delta.y),
Math.sin(delta.y)*Math.cos(delta.y),
);
//target[0] = cos(x)*cos(y)
//target[1] = sin(x)+sin(z)
//target[2] = cos(z)*sin(y)
let x = vec3.fromValues(1,0,0);
let y = vec3.fromValues(0,1,0);
let z = vec3.fromValues(0,0,1);
tickRotation = vec3.fromValues(
  Math.acos(vec3.dot(target,x)/vec3.length(target))*180/Math.PI,
  Math.acos(vec3.dot(target,y)/vec3.length(target))*180/Math.PI,
  Math.acos(vec3.dot(target,z)/vec3.length(target))*180/Math.PI
);
tickRotation = vec3.scale(tickRotation, tickRotation, sensitivity*scale)
*/
