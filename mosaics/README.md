# mosaics

A **Next.js 16 + React 19 + TypeScript** web UI scaffold intended to host a browser-based viewer for Space Invader mosaic color grids (the output of [`../python-image-processor/`](../python-image-processor)).

**Status: scaffold only.** Currently just the create-next-app default page — no mosaic-rendering code has been written yet.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- ESLint + PostCSS

## Structure

```
app/
├── page.tsx        # Home (currently the Next.js starter content)
├── layout.tsx
└── globals.css
```

## Intent (for future me, if I pick this up)

Read the JSON color-grid output from `python-image-processor` (the `maps/` directory), render each invader as a responsive grid of colored cells, let users browse the full catalog. Nothing here yet — start by wiring up a file-reading API route + a grid renderer component.

## Dev

```bash
npm install
npm run dev
```
