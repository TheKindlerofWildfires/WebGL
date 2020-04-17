"use strict";
import * as vec3 from "/js/lib/glMatrix/vec3.js";
//TODO investigate javascript operator overloading
class vector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  convert() {
    return vec3.fromValues(this.x, this.y, this.z);
  }

  //add another vector to this vector
  //looking into if overloading operators in javascript is a good idea.
  add(x, y, z) {
    if (y == undefined) {
      //user passed vector
      this.x += x.x;
      this.y += x.y;
      this.z += x.z;
    } else {
      //user passed three numbers
      this.x += x;
      this.y += y;
      this.z += z;
    }
  }

  sub(x, y, z) {
    if (y == undefined) {
      this.x -= x.x;
      this.y -= x.y;
      this.z -= x.z;
    } else {
      this.x -= x;
      this.y -= y;
      this.z -= z;
    }
  }

  mul(x, y, z) {
    if (y == undefined) {
      this.x *= x.x;
      this.y *= x.y;
      this.z *= x.z;
    } else {
      this.x *= x;
      this.y *= y;
      this.z *= z;
    }
  }

  div(x, y, z) {
    if (y == undefined) {
      this.x /= x.x;
      this.y /= x.y;
      this.z /= x.z;
    } else {
      this.x /= x;
      this.y /= y;
      this.z /= z;
    }
  }

}

export default vector;
