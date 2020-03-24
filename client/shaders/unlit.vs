#version 300 es

in vec4 position;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * position;
}
