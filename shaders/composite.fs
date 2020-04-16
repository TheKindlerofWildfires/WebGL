#version 300 es
precision highp float;

in vec2 vertex_uv;
uniform sampler2D bufferTexture;
out vec4 fragColor;

void main() {
  fragColor = texture(bufferTexture, vertex_uv);
}
