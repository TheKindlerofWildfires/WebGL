#version 300 es
precision highp float;

in vec2 vertex_uv;
uniform sampler2D baseColor;
out vec4 fragColor;

void main() {
  fragColor = texture(baseColor, vertex_uv);
}
