#version 300 es
precision highp float;

in vec2 v_uvCoord;
uniform sampler2D baseColor;
out vec4 fragColor;

void main() {
  fragColor = texture(baseColor, v_uvCoord);
}
