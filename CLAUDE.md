# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Renders a GPX track on an interactive OpenLayers map (`public/index.html` + `public/main.js`, served by the Express app in `app.js`) so route details can be studied segment by segment. Also generates per-segment screenshot videos.

## Key files

- `app.js` — Express server, serves `public/` and injects the `basemap` query param (`osm` or `esri`) into `index.html`
- `public/main.js` — OpenLayers map rendering logic
- `public/track.gpx` — last ingested GPX (overwritten by `make video`)
- `scripts/make_video.sh` — GPX-to-video pipeline
- `scripts/segment_gpx.py` — splits a GPX track into segments (`tests/data.json`)
- `notebooks/` — optional inspection of segmenting and chapter timestamps
- `tests/screenshot.test.js` — Puppeteer/Mocha tests that screenshot each segment (`BASEMAP=osm` or `BASEMAP=esri`)

## How to run

- `make video GPX=/path/to/track.gpx` — segment, screenshot (osm + esri), encode videos
- `make run` — installs npm deps and starts the server at `http://localhost:3000`
- `make lab` — `uv sync --dev` then launches Jupyter Lab for the notebooks

## Conventions / gotchas

- Two dependency stacks: Node (npm, the app + screenshot tests) and Python/uv (segmenting).
- Generated videos go outside the repo to `$DATA_DIR/video` (default `~/Documents/data/gpx-map/video`).
- `make clean` removes screenshot images, generated video, and `.venv`.
