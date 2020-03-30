#version 300 es
precision highp float;

in vec2 vertex_uv;
uniform sampler2D spriteSheet;
out vec4 fragColor;

void main() {
  fragColor = texture(spriteSheet, vertex_uv);
}
