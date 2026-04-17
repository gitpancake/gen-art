// Christmas Cards 2025 - Generative Art
// Uses fxhash for deterministic randomness

// Create a wrapper for fx(hash) random function
const fxrand = () => window.$fx ? window.$fx.rand() : Math.random();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
const SIZE = Math.min(window.innerWidth, window.innerHeight);
canvas.width = SIZE;
canvas.height = SIZE;

// Snow accumulation system
const ACCUMULATION_RESOLUTION = Math.floor(SIZE / 20); // Grid resolution for snow height
const snowAccumulation = new Array(ACCUMULATION_RESOLUTION).fill(0);
const MAX_SNOW_HEIGHT = SIZE * 0.7; // Maximum snow accumulation height
const ACCUMULATION_RATE = 1.0; // How fast snow accumulates (increased 5x)

// Mouse interaction tracking
let mouseX = -1000;
let mouseY = -1000;
let prevMouseX = -1000;
let prevMouseY = -1000;
let mouseVelocityX = 0;
let mouseVelocityY = 0;
const MOUSE_INFLUENCE_RADIUS = SIZE * 0.1;
const SNOW_PUSH_FORCE = 15;

// Twinkling stars
const stars = [];
const STAR_COUNT = 50;
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: fxrand() * SIZE,
    y: fxrand() * SIZE * 0.4,
    size: fxrand() * 2 + 0.5,
    brightness: fxrand(),
    twinkleSpeed: 0.01 + fxrand() * 0.03,
    phase: fxrand() * Math.PI * 2
  });
}



// Day/night cycle
let timeOfDay = 0;
const DAY_NIGHT_SPEED = 0.0001;



// Color palettes for backgrounds
const palettes = [
  { name: "Midnight Blue", bg1: "#0a1929", bg2: "#1e3a5f" },
  { name: "Northern Sky", bg1: "#001219", bg2: "#005f73" },
  { name: "Purple Twilight", bg1: "#2c003e", bg2: "#512b58" },
  { name: "Winter Dawn", bg1: "#1a1a2e", bg2: "#3d5a80" },
  { name: "Arctic Night", bg1: "#0d1b2a", bg2: "#2c5f88" }
];

// Select palette based on hash
const paletteIndex = Math.floor(fxrand() * palettes.length);
const palette = palettes[paletteIndex];

// Determine features
const snowIntensityRand = fxrand();
const snowSizeRand = fxrand();
const windRand = fxrand();

// Features for fx(hash)
const features = {
  "Palette": palette.name,
  "Snow Intensity": snowIntensityRand > 0.7 ? "Blizzard" : snowIntensityRand > 0.4 ? "Heavy" : "Light",
  "Snow Size": snowSizeRand > 0.5 ? "Large Flakes" : "Small Flakes",
  "Wind": windRand > 0.7 ? "Strong" : windRand > 0.3 ? "Moderate" : "Calm",
  "Stars": STAR_COUNT
};

// Set features using the new fx(hash) API
if (window.$fx) {
  window.$fx.features(features);
} else {
  window.$fxhashFeatures = features;
}

// Background with day/night cycle
function drawBackground() {
  // Apply day/night cycle to colors
  const dayNightCycle = (Math.sin(timeOfDay) + 1) / 2; // 0 = night, 1 = day
  
  const adjustColor = (color, factor) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.floor(r + (255 - r) * factor * 0.3);
    const newG = Math.floor(g + (255 - g) * factor * 0.3);
    const newB = Math.floor(b + (255 - b) * factor * 0.4);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, adjustColor(palette.bg1, dayNightCycle));
  gradient.addColorStop(1, adjustColor(palette.bg2, dayNightCycle));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw twinkling stars
function drawStars() {
  stars.forEach(star => {
    star.phase += star.twinkleSpeed;
    const brightness = (Math.sin(star.phase) + 1) / 2 * star.brightness;
    
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    ctx.shadowBlur = star.size * 4;
    ctx.shadowColor = `rgba(255, 255, 255, ${brightness})`;
    
    // Draw star shape
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const x = star.x + Math.cos(angle) * star.size;
      const y = star.y + Math.sin(angle) * star.size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Draw center bright spot
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
}


// Snow particles with depth layers
class Snowflake {
  constructor(depth = 1) {
    this.depth = depth; // 0 = background, 1 = midground, 2 = foreground
    this.reset();
    this.y = fxrand() * canvas.height;
    this.opacity = (0.3 + fxrand() * 0.7) * (0.5 + this.depth * 0.25);
    this.sway = 0;
    this.swaySpeed = (0.01 + fxrand() * 0.02) * (1 + this.depth * 0.3);
  }
  
  reset() {
    this.x = fxrand() * canvas.width;
    this.y = -20;
    
    // Size variation based on features and depth
    const sizeMultiplier = features["Snow Size"] === "Large Flakes" ? 1.5 : 1;
    const depthScale = 0.3 + this.depth * 0.35; // background snow is smaller
    this.size = (fxrand() * 4 + 1) * sizeMultiplier * depthScale;
    
    // Speed based on size and depth (larger = slower fall, background = slower)
    this.speed = ((3 - this.size * 0.3) + fxrand() * 0.5) * (0.5 + this.depth * 0.25);
    
    // Wind effect based on features
    const windStrength = features["Wind"] === "Strong" ? 1.5 : 
                        features["Wind"] === "Moderate" ? 0.8 : 0.3;
    this.wind = (fxrand() * windStrength - windStrength/2) * (0.5 + this.depth * 0.25);
  }
  
  update() {
    // Mouse interaction with falling snow (only for foreground snow)
    if (this.depth >= 1) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
        // Push snow away from mouse based on mouse velocity
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * SNOW_PUSH_FORCE * (this.depth / 2);
        this.x += (dx / dist) * force + mouseVelocityX * 0.5;
        this.y += (dy / dist) * force * 0.3 + Math.abs(mouseVelocityY) * 0.2;
        
        // Add some turbulence
        this.x += (Math.random() - 0.5) * force;
        this.y += (Math.random() - 0.5) * force * 0.5;
      }
    }
    
    // Vertical movement
    this.y += this.speed;
    
    // Horizontal movement with sway effect
    this.sway += this.swaySpeed;
    this.x += this.wind + Math.sin(this.sway) * 0.5;
    
    // Check for collision with accumulated snow
    const gridX = Math.floor(this.x / (canvas.width / ACCUMULATION_RESOLUTION));
    const gridIndex = Math.max(0, Math.min(ACCUMULATION_RESOLUTION - 1, gridX));
    const snowHeight = snowAccumulation[gridIndex];
    const groundLevel = canvas.height - snowHeight;
    
    // If snowflake hits the accumulated snow (only foreground snow accumulates)
    if (this.y >= groundLevel - this.size) {
      if (this.depth === 2) { // Only foreground snow accumulates
        // Add to accumulation
        if (snowHeight < MAX_SNOW_HEIGHT) {
          snowAccumulation[gridIndex] += ACCUMULATION_RATE * this.size;
          
          // Smooth out neighboring cells for natural pile shape
          if (gridIndex > 0) {
            snowAccumulation[gridIndex - 1] += ACCUMULATION_RATE * this.size * 0.3;
          }
          if (gridIndex < ACCUMULATION_RESOLUTION - 1) {
            snowAccumulation[gridIndex + 1] += ACCUMULATION_RATE * this.size * 0.3;
          }
        }
      }
      this.reset();
    }
    
    // Wrap horizontally
    if (this.x > canvas.width + 10) {
      this.x = -10;
    }
    if (this.x < -10) {
      this.x = canvas.width + 10;
    }
  }
  
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    
    // Only add shadow effects for foreground snow to improve performance
    if (this.depth === 2 && this.size > 3) {
      ctx.save();
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Simple circle for background/small snow (much faster)
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Create snowflakes with depth layers (optimized for performance)
const intensityMap = {
  "Blizzard": 120,
  "Heavy": 70,
  "Light": 30
};
const snowIntensity = intensityMap[features["Snow Intensity"]];
const snowflakes = [
  ...Array.from({length: Math.floor(snowIntensity * 0.2)}, () => new Snowflake(0)), // background
  ...Array.from({length: Math.floor(snowIntensity * 0.3)}, () => new Snowflake(1)), // midground
  ...Array.from({length: snowIntensity}, () => new Snowflake(2)) // foreground
];


// Draw accumulated snow
function drawAccumulatedSnow() {
  if (Math.max(...snowAccumulation) < 1) return; // Don't draw if no accumulation
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.strokeStyle = "rgba(200, 220, 255, 0.3)";
  ctx.lineWidth = 2;
  
  // Create smooth curve through the accumulation points
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  
  for (let i = 0; i < ACCUMULATION_RESOLUTION; i++) {
    const x = (i / ACCUMULATION_RESOLUTION) * canvas.width;
    const nextX = ((i + 1) / ACCUMULATION_RESOLUTION) * canvas.width;
    const height = snowAccumulation[i];
    const nextHeight = i < ACCUMULATION_RESOLUTION - 1 ? snowAccumulation[i + 1] : snowAccumulation[i];
    
    // Use quadratic curves for smooth snow piles
    const cp1x = x + (nextX - x) * 0.5;
    const cp1y = canvas.height - height;
    
    ctx.quadraticCurveTo(x, canvas.height - height, cp1x, cp1y);
  }
  
  // Complete the shape
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  
  // Fill the snow
  ctx.fill();
  ctx.stroke();
  
  // Add subtle shading gradient
  const gradient = ctx.createLinearGradient(0, canvas.height - Math.max(...snowAccumulation), 0, canvas.height);
  gradient.addColorStop(0, "rgba(240, 248, 255, 0.2)");
  gradient.addColorStop(1, "rgba(200, 220, 255, 0.1)");
  ctx.fillStyle = gradient;
  ctx.fill();
}

// Animation loop
function animate() {
  // Update time of day
  timeOfDay += DAY_NIGHT_SPEED;
  
  // Update mouse velocity
  mouseVelocityX = mouseX - prevMouseX;
  mouseVelocityY = mouseY - prevMouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  
  // Draw background
  drawBackground();
  
  // Draw stars
  drawStars();
  
  // Draw background snow layer
  snowflakes.filter(s => s.depth === 0).forEach(snowflake => {
    snowflake.update();
    snowflake.draw();
  });
  
  // Draw midground snow layer
  snowflakes.filter(s => s.depth === 1).forEach(snowflake => {
    snowflake.update();
    snowflake.draw();
  });
  
  // Draw accumulated snow
  drawAccumulatedSnow();
  
  // Mouse interaction with accumulated snow
  const mouseGridX = Math.floor(mouseX / (canvas.width / ACCUMULATION_RESOLUTION));
  const mouseSnowHeight = canvas.height - mouseY;
  
  // If mouse is near accumulated snow, disturb it
  for (let i = 0; i < ACCUMULATION_RESOLUTION; i++) {
    const dist = Math.abs(i - mouseGridX);
    if (dist < 3 && snowAccumulation[i] > 0) {
      // Check if mouse is in the snow
      if (mouseSnowHeight < snowAccumulation[i] + 50) {
        // Push snow around based on mouse movement
        const influence = 1 - (dist / 3);
        const pushAmount = mouseVelocityX * influence * 0.5;
        
        // Move snow to neighboring cells
        if (pushAmount > 0 && i < ACCUMULATION_RESOLUTION - 1) {
          const transfer = Math.min(snowAccumulation[i] * 0.1, Math.abs(pushAmount));
          snowAccumulation[i] -= transfer;
          snowAccumulation[i + 1] += transfer;
        } else if (pushAmount < 0 && i > 0) {
          const transfer = Math.min(snowAccumulation[i] * 0.1, Math.abs(pushAmount));
          snowAccumulation[i] -= transfer;
          snowAccumulation[i - 1] += transfer;
        }
        
        // Flatten snow where mouse is pressing down
        if (Math.abs(mouseVelocityY) > 1 && mouseSnowHeight < snowAccumulation[i]) {
          snowAccumulation[i] *= 0.95;
        }
      }
    }
  }
  
  // Smooth out snow accumulation for natural settling
  for (let i = 1; i < ACCUMULATION_RESOLUTION - 1; i++) {
    const diff = (snowAccumulation[i - 1] + snowAccumulation[i + 1]) / 2 - snowAccumulation[i];
    snowAccumulation[i] += diff * 0.01; // Gentle smoothing
  }
  
  // Draw foreground snow layer (last for proper layering)
  snowflakes.filter(s => s.depth === 2).forEach(snowflake => {
    snowflake.update();
    snowflake.draw();
  });
  
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  const newSize = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = newSize;
  canvas.height = newSize;
});

// Handle preview trigger for fx(hash)
if (window.$fx) {
  // Set up preview trigger
  window.addEventListener('fxhash-preview', () => {
    // The preview is captured automatically
    console.log('Preview captured');
  });
  
  // Trigger preview after 2 seconds if in preview mode
  if (window.$fx.isPreview) {
    setTimeout(() => {
      window.$fx.preview();
    }, 2000);
  }
}

// Mouse event listeners
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouseX = -1000;
  mouseY = -1000;
});

// Touch event listeners for mobile
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  mouseX = touch.clientX - rect.left;
  mouseY = touch.clientY - rect.top;
});

canvas.addEventListener('touchend', () => {
  mouseX = -1000;
  mouseY = -1000;
});

// Start animation
animate();