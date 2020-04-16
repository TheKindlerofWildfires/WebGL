#version 300 es

in vec2 position;
in vec2 uv;
uniform float depth;

out vec2 vertex_uv;

void main() {
  vertex_uv = uv;
  gl_Position = vec4(position.x, position.y, depth, 1);
}
