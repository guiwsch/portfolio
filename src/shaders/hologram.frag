uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uTint;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  float scan = 0.85 + 0.15 * sin(vUv.y * 200.0 + uTime * 5.0);

  float glitch = step(0.998, sin(uTime * 30.0)) * 0.02;
  vec2 uvShift = vUv + vec2(glitch, 0.0);
  vec4 shifted = texture2D(uTexture, uvShift);

  vec3 color = mix(tex.rgb, shifted.rgb, glitch * 50.0);
  color = mix(color, color * uTint, 0.3);
  color *= scan;

  float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(0.0, 0.05, vUv.y) *
               smoothstep(0.0, 0.05, 1.0 - vUv.x) * smoothstep(0.0, 0.05, 1.0 - vUv.y);

  gl_FragColor = vec4(color, tex.a * edge * 0.85);
}
