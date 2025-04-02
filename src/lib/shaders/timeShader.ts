export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float time;
uniform float timeDirection;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(vUv, center);
  
  float wave = sin(dist * 10.0 - time * timeDirection) * 0.5 + 0.5;
  vec3 color = timeDirection > 0.0 
    ? vec3(0.0, wave * 1.0, wave * 0.5)  // Forward time: green
    : vec3(wave * 1.0, 0.0, wave * 0.5);  // Reversed time: red
    
  gl_FragColor = vec4(color, wave * 0.3);
}`;
