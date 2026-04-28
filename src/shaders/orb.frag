uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorRim;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);

  float pulse = 0.5 + 0.5 * sin(uTime * 1.5);
  vec3 core = uColorCore * (0.6 + 0.4 * pulse);
  vec3 rim = uColorRim * fresnel;

  vec3 finalColor = core + rim;
  gl_FragColor = vec4(finalColor, 1.0);
}
