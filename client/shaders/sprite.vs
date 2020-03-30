#version 300 es

in vec4 position;
in vec2 uv;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 spriteSize;
uniform vec2 spritePosition;

out vec2 vertex_uv;

void main() {
  vec2 spriteCoords = vec2(uv.x, 1.0 - uv.y);
  vec2 spriteDimensions = vec2(float(1.0) / spriteSize.x, float(1.0) / spriteSize.y);
  vec2 spriteOffset = spritePosition * spriteDimensions;
  spriteCoords = spriteDimensions * spriteCoords;
  vertex_uv = spriteCoords + spriteOffset;
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * position;
}
