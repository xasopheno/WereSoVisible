export function fragmentShader() {
  return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      // varying vec3 vUv;
      uniform float time;
      
      void main() {
          vec3 p = mod(
            gl_FragCoord.xyz, 100.0
          ); 
          float r = fract(
            sin(
              dot(
                p.xyz ,
                vec3(12.9898,78.233, 24.3421)
              )
            ) * 43758.5453
          );
          gl_FragColor = vec4(
            sin(colorA.r + r), 
            sin(colorA.g + r) - 0.05, 
            // sin(colorA.g + r) - 0.25, 
            sin(colorA.b + r), 0.03
          );
      }
  `;
}

export function vertexShader() {
  return `
    // varying vec3 vUv; 
    uniform float time;

    void main() {
      // vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0) * vec4(1.0, 1.0 + sin(time * position.y), 1.0, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;
}
