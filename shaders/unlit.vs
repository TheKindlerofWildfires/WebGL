#version 300 es

in vec4 position;
in vec2 uvCoord;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

out vec2 v_uvCoord;

void main() {
  gl_Position = mProj * mView * mWorld * position;
  v_uvCoord = uvCoord;
}
