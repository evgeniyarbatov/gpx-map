# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Renders a GPX track on an interactive OpenLayers map (`public/index.html` + `public/main.js`, served by the Express app in `app.js`) so route details can be studied segment by segment. Also supports generating per-segment screenshot videos.

## Key files

- `app.js` — Express server, serves `public/` and injects the `basemap` query param (`osm` or `esri`) into `index.html`
- `public/main.js` — OpenLayers map rendering logic
- `public/track.gpx` — the GPX track being visualized (replace with your own)
- `notebooks/GPX Segments.ipynb` — splits a GPX track into segments
- `notebooks/Video Timestamps.ipynb` — video timestamp helper
- `tests/screenshot.test.js` — Puppeteer/Mocha tests that screenshot each segment (`BASEMAP=osm` or `BASEMAP=esri`)

## How to run

- `make run` — installs npm deps and starts the server at `http://localhost:3000`
- `npm test` — runs `test:osm` and `test:esri`, producing screenshots under `tests/images/{osm,esri}/`
- `make lab` — `uv sync --dev` then launches Jupyter Lab for the notebooks

## Conventions / gotchas

- Two dependency stacks: Node (npm, the app + screenshot tests) and Python/uv (Jupyter notebooks only).
- Generated videos go outside the repo to `$DATA_DIR/video` (default `~/data/gpx-map/video`); see README for the `ffmpeg` commands.
- `make clean` removes screenshot images, generated video, and `.venv`.
