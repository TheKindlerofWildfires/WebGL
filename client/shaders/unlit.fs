#version 300 es
precision highp float;

in vec2 vertex_uv;
out vec4 fragColor;

void main() {
  fragColor = vec4(vertex_uv.x, vertex_uv.y, 0, 1);
}
