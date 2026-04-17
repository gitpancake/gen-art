// demonstrate seed reset
// for (let i = 0; i < 10; i++) {
//   console.log(i, $fx.rand(), $fx.randminter())
//   $fx.rand.reset();
//   $fx.randminter.reset();
// }

const config = {
  maxLayers: 75,
  gaussianLayers: 500,
  patchSize: 24,
};

const calculateFeatures = ({ maxLayers, gaussianLayers, patchSize }) => {
  const features = {};

  // this is how features can be defined
  $fx.features({
    "patch size": patchSize,
    "gaussian layers": gaussianLayers,
    "max layers": maxLayers,
  });

  console.table($fx.getFeatures());
  console.log($fx.rand_between(50, 70));
  return $fx.getFeatures();
};

const sp = new URLSearchParams(window.location.search);
//  console.log(sp);

let grid = [];

let canvasWidth = 800;
let canvasHeight = 800;

let loading = true;
let loader = 0;

let loadingTexts = [
  "Mixing Colors...",
  "Stirring Creativity...",
  "Blending Brushstrokes...",
  "Crafting the Canvas...",
  "Creating Masterpiece...",
  "Dipping the Brush...",
  "Shading Shadows...",
  "Layering Hues...",
  "Detailing Artwork...",
  "Illuminating Vision...",
];

function generateWatercolor(x, y) {
  const [r, g, b] = [360, 100, 100].map((x) => Math.round($fx.rand() * x));

  const patchWidth = window.innerWidth / config.patchSize;
  const patchHeight = window.innerHeight / config.patchSize;

  const pWidth = x + patchWidth / 2;
  const pHeight = y + patchHeight / 2;
  const pRadius = patchWidth / 2;

  const opacity = Math.min(1, $fx.rand() + 0.9);

  watercolorWash(pWidth, pHeight, pRadius, color(r, g, b, opacity));
}

function watercolorWash(x, y, radius, col) {
  for (let i = 0; i < config.maxLayers; i++) {
    let layerRadius = radius * (noise(1.2) * i * 0.6);

    let layerColor = color(hue(col), saturation(col), brightness(col), alpha(col) / (i + 1));

    fill(layerColor);
    noStroke();

    for (let j = 0; j < config.gaussianLayers; j++) {
      let offsetX = randomGaussian() * (layerRadius / 10);
      let offsetY = randomGaussian() * (layerRadius / 10);

      // Start drawing the shape.
      beginShape();

      // Add vertices.
      vertex(x + offsetX + 7.5, y + offsetY + 5);
      vertex(x + offsetX + 25, y + offsetY + 5);
      vertex(x + offsetX + 25, y + offsetY + 15);
      vertex(x + offsetX + 7.5, y + offsetY + 15);

      endShape(CLOSE);
    }
  }
}

let loadingText = loadingTexts[0];

function loaderProcess() {
  background(0);
  fill("white");
  stroke("white");
  textAlign(CENTER, CENTER);
  text(loadingText, width / 2, height / 2);

  if (loader % 50 === 0) {
    loadingText = loadingTexts[Math.floor($fx.rand() * loadingTexts.length)];
  }

  loader += 2;
}

// Setup Canvas
window.setup = () => {
  createCanvas(canvasWidth, canvasHeight);

  frameRate(60);
  colorMode(HSB);

  let patchWidth = width / config.patchSize;
  let patchHeight = height / config.patchSize;

  for (let i = 0; i < config.patchSize; i++) {
    for (let j = 0; j < config.patchSize; j++) {
      grid.push({ x: j * patchWidth, y: i * patchHeight });
    }
  }

  setTimeout(() => {
    loading = false;
    loop();
  }, 1000);
};

window.draw = () => {
  if (loading) {
    loaderProcess();
    return;
  } else {
    clear();
  }

  grid.forEach((patch) => {
    generateWatercolor(patch.x, patch.y);
  });

  noLoop();
};

calculateFeatures(config);
