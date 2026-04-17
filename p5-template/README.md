# p5-template

A p5.js rendering sandbox for Space Invader color-grids. Contains a hardcoded invader grid (`spaceInvader` — a 2D array of integer color indices from the mosaic processing pipeline) and renders it as a grid of colored rectangles at a configurable tile size.

Used as the visual-layout template that informs what [`../mosaics/`](../mosaics) will eventually render in React.

## What it does

- Hardcoded `spaceInvader[][]` array (each cell = a color-index from 0-9)
- Maps indices to colors via a palette
- Renders the full mosaic as a p5 canvas with `tileSize`-sized cells
- `noLoop()` — one-shot render, no animation

## Structure

```
index.html          # p5.js bootstrap
sketch.js           # The renderer + hardcoded invader grid
maps/               # (Historical) alternate grid definitions
outputs/            # (Historical) rendered outputs
```

## Running

Open `index.html` in a browser (no build step). For live-reload during editing, serve the directory with any static server:

```bash
npx http-server .
# or: python3 -m http.server
```
