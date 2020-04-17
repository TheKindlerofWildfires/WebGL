"use strict";
import * as vec3 from "/js/lib/glMatrix/vec3.js";
//represents a Euler angle in degrees
class rotator {
  constructor(pitch = 0, yaw = 0, roll = 0) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }

  convert() {
    return vec3.fromValues(this.pitch, this.yaw, this.roll);
  }

  add(pitch, yaw, roll) {
    if (yaw == undefined) {
      this.roll += roll.roll;
      this.yaw += roll.yaw;
      this.pitch += roll.pitch;
    } else {
      this.roll += roll;
      this.yaw += yaw;
      this.pitch += pitch;
    }
  }

  sub(pitch, yaw, roll) {
    if (yaw == undefined) {
      this.roll -= roll.roll;
      this.yaw -= roll.yaw;
      this.pitch -= roll.pitch;
    } else {
      this.roll -= roll;
      this.yaw -= yaw;
      this.pitch -= pitch;
    }
  }
}

export default rotator;
