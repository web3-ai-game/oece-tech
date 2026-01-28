// Cyberpunk pixelated globe shader
export const pixelGlobeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const pixelGlobeFragmentShader = `
  uniform float time;
  uniform float pixelSize;
  uniform vec3 neonColor;
  uniform vec3 matrixColor;
  uniform vec3 shadowColor;
  uniform float glitchIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Pixelation function
  vec2 pixelate(vec2 uv, float size) {
    return floor(uv * size) / size;
  }
  
  // Noise function for glitch effect
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Scanline effect
  float scanline(vec2 uv, float lines, float speed) {
    return sin((uv.y + time * speed) * lines) * 0.5 + 0.5;
  }
  
  // Glow effect
  float fresnel(vec3 normal, vec3 viewDir) {
    return pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
  }
  
  void main() {
    // Pixelate UV coordinates
    vec2 pixelUv = pixelate(vUv, pixelSize);
    
    // Base grid pattern
    vec2 grid = fract(pixelUv * 20.0);
    float gridLine = step(0.95, max(grid.x, grid.y));
    
    // Glitch effect
    float glitch = random(vec2(floor(time * 10.0), pixelUv.y)) * glitchIntensity;
    vec2 glitchedUv = pixelUv + vec2(glitch * 0.1, 0.0);
    
    // Latitude lines (cyberpunk grid)
    float latLines = step(0.98, fract(pixelUv.y * 10.0));
    float lngLines = step(0.98, fract(pixelUv.x * 20.0));
    
    // Combine grid effects
    float grid_pattern = max(latLines, lngLines) * 0.5 + gridLine * 0.3;
    
    // Scanline effect
    float scan = scanline(vUv, 100.0, 0.5) * 0.1;
    
    // Fresnel glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float glow = fresnel(vNormal, viewDir);
    
    // Color mixing
    vec3 baseColor = mix(shadowColor, neonColor, pixelUv.y);
    vec3 gridColor = neonColor * grid_pattern;
    vec3 glowColor = matrixColor * glow * 0.5;
    
    // Final color composition
    vec3 finalColor = baseColor * 0.3 + gridColor + glowColor + vec3(scan);
    
    // Add glitch color distortion
    if (glitch > 0.5) {
      finalColor.r += 0.2;
      finalColor.g -= 0.1;
    }
    
    // Output with alpha for glow edges
    float alpha = 0.8 + glow * 0.2;
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// Node marker shader
export const nodeMarkerVertexShader = `
  varying vec2 vUv;
  uniform float time;
  uniform float pulseSpeed;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Pulse animation
    float pulse = sin(time * pulseSpeed) * 0.1 + 1.0;
    pos *= pulse;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const nodeMarkerFragmentShader = `
  uniform vec3 color;
  uniform float opacity;
  uniform float time;
  
  varying vec2 vUv;
  
  void main() {
    // Radial gradient
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    
    // Pulse effect
    float pulse = sin(time * 3.0) * 0.3 + 0.7;
    
    // Outer glow
    float glow = smoothstep(0.5, 0.3, dist) * 0.5;
    
    vec3 finalColor = color + vec3(glow);
    gl_FragColor = vec4(finalColor, alpha * opacity * pulse);
  }
`
