# mosaics-two

An early / simpler pass at the Space Invader mosaic image-processing pipeline. Loads a photo of an invader, grayscales + quantizes it into a 0-10 value range, resizes to a configurable grid, and outputs a `map.json` 2D array.

Superseded by [`../python-image-processor/`](../python-image-processor) — which does richer color-based processing with KMeans clustering. This version is grayscale-only.

## What it does

- Load `images/slice_0_0.png` (or whichever slice)
- Convert to grayscale
- Quantize 0-255 pixel values into a 0-10 range (divide by 42.5)
- Resize to a target grid (default 75×100) using nearest-neighbor
- Emit `map.json` — the 2D array representation

## Files

```
main.py           # Main processing script — load, quantize, resize, emit
slicer.py         # Image slicing utility (splits a source image into tiles)
images/           # Input / intermediate images
map.json          # Latest quantized output
map.png, mappy.png  # Reference / visualization images
```

## Dependencies

- Python 3
- `opencv-python`
- `numpy`

## Running

```bash
python3 -m venv venv
source venv/bin/activate
pip install opencv-python numpy
python main.py
```
