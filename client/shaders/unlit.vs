#version 300 es

in vec4 position;
in vec2 uv;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out vec2 vertex_uv;

void main() {
  vertex_uv = vec2(uv.x, 1.0 - uv.y);
  gl_Position = projectionMatrix * viewMatrix * worldMatrix * position;
}
