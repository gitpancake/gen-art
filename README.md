# gen-art

An archived monorepo of personal **generative-art experiments** — mostly built around processing Space Invader mosaic photography, plus a few standalone fxhash pieces, onchain NFT projects, and web-art clones.

This is a **frozen snapshot** of the work, kept for reference. Each subdirectory is an independent experiment; they don't share dependencies or build pipelines.

## Projects

### Space Invader mosaic pipeline

These four pieces form a loose pipeline for converting photos of Space Invader street-art mosaics into quantized color grids and re-rendering them:

| Subdir | Stack | Role |
|---|---|---|
| [`python-image-processor/`](./python-image-processor) | Python + OpenCV + scikit-learn + PIL | The main image-processing engine — fetches invader photos, clusters colors with KMeans, quantizes to grids, outputs JSON color maps |
| [`mosaics-two/`](./mosaics-two) | Python + OpenCV + NumPy | Earlier / simpler version — loads an image, grayscale-quantizes to a 0-10 range, outputs `map.json` as a 2D array |
| [`p5-template/`](./p5-template) | p5.js | Renders a hardcoded Space Invader color-grid as a p5 sketch — sandbox for visualization layouts |
| [`mosaics/`](./mosaics) | Next.js 16 + React 19 + TypeScript | Web UI scaffold (currently just create-next-app boilerplate) intended to host a browser-based mosaic viewer |

### Standalone pieces

| Subdir | Stack | What it is |
|---|---|---|
| [`painting-splotches/`](./painting-splotches) | p5.js + fxhash SDK | fx(hash) generative-art piece — layered gaussian paint splotches with configurable patch size, layer count, and palette features |
| [`christmas-cards-2025/`](./christmas-cards-2025) | Solidity 0.8.20 + Hardhat + p5.js | Onchain ERC-721 NFT collection for Christmas Cards 2025 — fully on-chain HTML rendering variant + simpler `tokenURI`-based variant, Base-targeted (100 max supply) |
| [`web-art/`](./web-art) | HTML + ASCII | A local archive of `papertoilet.com` by Rafael Rozendaal (2006) — a piece of web-native art where you endlessly scroll toilet paper |

## Why this exists

Each subdirectory was originally a separate folder on my filesystem (none of them ever had a git remote except [`flow`](https://github.com/gitpancake/flow), which lives separately as its own archived repo). Consolidated here so the work is preserved in one place.

Each subdirectory keeps its original source files (scripts, sketches, assets) intact. Large build artifacts (`node_modules/`, `venv/`, `__pycache__/`, `.next/`, `artifacts/`, `cache/`) have been stripped — reinstall with the usual tools if you want to run anything.

## Related

- [`flow`](https://github.com/gitpancake/flow) — the second fxhash release (lives as its own archived repo, not consolidated here)
- [`entanglement`](https://github.com/gitpancake/entanglement) — the first fxhash release (also archived as its own repo)
