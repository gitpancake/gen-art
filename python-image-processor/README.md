# python-image-processor

The main image-processing engine of the **Space Invader mosaic pipeline**. Takes photos of real-world invader street art, normalizes them, clusters the colors, and outputs structured 2D color grids for downstream rendering (see [`../mosaics/`](../mosaics), [`../p5-template/`](../p5-template)).

More capable than [`../mosaics-two/`](../mosaics-two) — this one does **color-based** clustering (KMeans) rather than grayscale quantization.

## Scripts

| Script | What it does |
|---|---|
| `invaders.py` | Fetches an invader image from a URL, resizes to a target grid (default 20×20), runs KMeans to find the dominant colors, returns the color grid + palette codes |
| `process.py` | Local-file version of the pipeline — reads from `images/`, quantizes, writes JSON grids into `maps/` (creates the directory if missing) |
| `grid_cells.py` | Slices an input image into individual grid-cell images (writes to `grid_cells/`) for per-cell processing |
| `stitch.py` | Reverse operation — stitches a collection of cells/slices back into a single composed image |
| `main.py` | Main orchestration script (currently contains commented reference pipeline in situ — use as the entry point for experiments) |

## Dependencies

```python
opencv-python       # Image I/O + resize + color conversion
numpy               # Array math
scikit-learn        # KMeans color clustering
Pillow (PIL)        # Alternate image loader
matplotlib          # Visualization
requests            # Fetching images by URL
```

## Directories

```
images/        # Input images (~19 MB of invader photos)
assets/        # Reference assets
grid_cells/    # Output of grid_cells.py — individual cell images
invader/       # Per-invader working artifacts
maps/          # JSON color-grid outputs (the final, exportable format)
map.png        # A composite reference map
index.html     # Simple browser viewer
```

## Running

```bash
python3 -m venv venv
source venv/bin/activate
pip install opencv-python numpy scikit-learn pillow matplotlib requests
python process.py      # or invaders.py, grid_cells.py, stitch.py
```

## Output format

`maps/*.json` — a 2D integer array where each cell is a color-palette index (0 to `n_clusters - 1`). Consume in [`../p5-template/`](../p5-template) or [`../mosaics/`](../mosaics) for rendering.
