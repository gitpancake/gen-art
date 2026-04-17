# painting-splotches

An **fx(hash) generative-art piece** — layered gaussian paint splotches rendered on a p5 canvas. Unrelated to the Space Invader mosaic work; sits in this monorepo purely as an archived experiment.

## What it does

Paints overlapping gaussian "splotches" at random positions, building up a layered, textured painting over time. Each mint produces a unique piece from a deterministic hash seed via `$fx.rand()`.

## Parameters (fx(params))

Configured in `index.js`:

| Feature | Default | Meaning |
|---|---|---|
| `patch size` | 24 | Size of each paint patch |
| `gaussian layers` | 500 | Number of overlapping layers per patch |
| `max layers` | 75 | Ceiling on total patches |

Uses `$fx.features()` to expose these as on-chain traits and `$fx.rand_between()` for seeded randomization.

## Tech stack

- **p5.js 1.0.0** (CDN)
- **fxhash** SDK (`fxhash.min.js`, vendored)
- Plain HTML + CSS

## Structure

```
painting-splotches/
├── index.html       # p5.js + fxhash SDK bootstrap
├── index.js         # Main sketch — features, gaussian splotch renderer, loading UI
├── fxhash.min.js    # Vendored fxhash SDK
├── styles.css
└── LICENSE
```

## Status

Never published to fxhash — kept as a working prototype.

## Running

Open `index.html` in a browser, or serve with any static server:

```bash
cd painting-splotches
npx http-server .
```
