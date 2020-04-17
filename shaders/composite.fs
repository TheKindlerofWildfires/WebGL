#version 300 es
precision highp float;

in vec2 vertex_uv;
uniform sampler2D bufferTexture;
out vec4 fragColor;

void main() {
  vec4 texel = texture(bufferTexture, vertex_uv);
  if (texel.a < 0.2)
    discard;
  fragColor = texel;
}
