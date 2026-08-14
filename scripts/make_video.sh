#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

if [ "${1:-}" = "" ]; then
  echo "usage: make video GPX=/path/to/track.gpx" >&2
  exit 2
fi

GPX="$1"
DATA_DIR="${DATA_DIR:-$HOME/Documents/data/gpx-map}"
VIDEO_DIR="$DATA_DIR/video"
DEST="$REPO_ROOT/public/track.gpx"

GPX_ABS="$(cd "$(dirname "$GPX")" && pwd)/$(basename "$GPX")"
if [ "$GPX_ABS" != "$DEST" ]; then
  cp "$GPX_ABS" "$DEST"
fi

echo "Segmenting $GPX_ABS"
uv run python scripts/segment_gpx.py "$DEST" tests/data.json

rm -rf tests/images/osm tests/images/esri
mkdir -p "$VIDEO_DIR"

node app.js &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; wait "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

until curl -sf "http://localhost:3000" >/dev/null; do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "map server exited before becoming ready" >&2
    exit 1
  fi
  sleep 0.1
done

echo "Capturing screenshots"
npm test

echo "Encoding video"
ffmpeg -y -framerate 1/3 -i tests/images/osm/img%04d.png \
  -c:v libx264 -pix_fmt yuv420p "$VIDEO_DIR/osm.mp4"
ffmpeg -y -framerate 1/3 -i tests/images/esri/img%04d.png \
  -c:v libx264 -pix_fmt yuv420p "$VIDEO_DIR/esri.mp4"
ffmpeg -y \
  -framerate 1/3 -i tests/images/osm/img%04d.png \
  -framerate 1/3 -i tests/images/esri/img%04d.png \
  -filter_complex "[0:v][1:v]hstack=inputs=2[v]" \
  -map "[v]" \
  -c:v libx264 \
  -pix_fmt yuv420p \
  "$VIDEO_DIR/combined.mp4"

echo "Chapters"
uv run python scripts/print_timestamps.py tests/data.json

echo "Wrote $VIDEO_DIR/osm.mp4"
echo "Wrote $VIDEO_DIR/esri.mp4"
echo "Wrote $VIDEO_DIR/combined.mp4"
