uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorAtmosphere;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

void main() {
  float n = noise(vPosition * 2.5 + uTime * 0.05);
  n += 0.5 * noise(vPosition * 5.0 + uTime * 0.03);
  n += 0.25 * noise(vPosition * 10.0);
  n = clamp(n / 1.75, 0.0, 1.0);

  vec3 surface = mix(uColorBase * 0.6, uColorBase, n);

  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
  vec3 atmosphere = uColorAtmosphere * fresnel;

  vec3 finalColor = surface + atmosphere;

  gl_FragColor = vec4(finalColor, 1.0);
}
