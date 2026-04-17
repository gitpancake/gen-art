//Road = 0
//Water = 2

//williamsburg bridge
let makeTheWorldFeelSomethingDeep = ["#46321C", "#C58165", "#D9C9AD", "#E1E6D8", "#C17922", "#E3B975", "#1E150D", "#3F3F45", "#4F1302", "#73614B"];
//fidi from manhattan bridge
let moneyBleeds = ["#506571", "#CED9E1", "#32464A", "#2A3B4C", "#1A2A38", "#67727A", "#5385C0", "#84B1E6", "#8B8F94", "#709CCD"];
let bkBotanicalGardens = ["#6C6E58", "#C0AC47", "#786E33", "#BB9380", "#1E2505", "#95917F", "#D6C98F", "#7A8075", "#2E2E0B", "#546426"];
let thirdAve = ["#59748A", "#15232B", "#112A40", "#B0B39D", "#CBDDDD", "#6492C9", "#020B18"];
let trafficOfficer = ["#3E4347", "#D13731", "#583B30", "#D0EAAA", "#8FA9CD", "#EAFBD5", "#090F15", "#DFDFE1"];

let scale = 25;
let gridCellsData;
let randomCellData;
let palette = [];

let gridWidth, gridHeight;

const colors = [trafficOfficer, thirdAve, bkBotanicalGardens];

function preload() {
  // Load the JSON file from the assets folder
  gridCellsData = loadJSON("assets/grid_cells_data.json");
}

function getColorFromValue(value) {
  return palette[value];
}

function setup() {
  // Pick a random key from the loaded gridCellsData
  let keys = Object.keys(gridCellsData);
  let randomKey = keys[Math.floor(Math.random() * keys.length)];
  randomCellData = gridCellsData[randomKey];

  gridWidth = randomCellData[0].length * scale;
  gridHeight = randomCellData.length * scale;

  createCanvas(gridWidth, gridHeight);

  tileSize = scale;
  palette = colors[Math.floor(Math.random() * colors.length)];

  drawCell(randomCellData);

  // Save the canvas as an image file with the random key as the filename
  saveCanvas(`images/${randomKey}`, "png");
}

function drawCell(randomCellData) {
  background(255);

  for (let x = 0; x < gridWidth; x += tileSize) {
    for (let y = 0; y < gridHeight; y += tileSize) {
      rect(x, y, tileSize, tileSize);
    }
  }

  let invaderSizeX = gridWidth / scale;
  let invaderSizeY = gridHeight / scale;

  for (let i = 0; i < invaderSizeX; i++) {
    for (let j = 0; j < invaderSizeY; j++) {
      let x = i * tileSize;
      let y = j * tileSize;

      fill(getColorFromValue(randomCellData[j][i]));

      rect(x, y, tileSize, tileSize);
    }
  }

  noLoop();
}

function pickRandomCell() {
  // Pick a random key from the loaded gridCellsData
  let keys = Object.keys(gridCellsData);
  randomKey = keys[Math.floor(Math.random() * keys.length)];
  randomCellData = gridCellsData[randomKey];

  console.log("Randomly selected cell:", randomKey);
  console.log("Data for this cell:", randomCellData);

  // Draw the selected cell
  drawCell(randomCellData);

  saveCanvas(`images/${randomKey}`, "png");
}

function keyPressed() {
  if (keyCode === ENTER) {
    pickRandomCell(); // Pick and draw a new random cell when Enter is pressed
  }
}
