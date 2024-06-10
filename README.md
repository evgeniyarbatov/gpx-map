# GPX Map

Display GPX track on the map to allow studying route details. 

Useful for long and unfamiliar GPX tracks with details that are hard to see from the bird's eye view.

Rendering of maps is implemented with https://openlayers.org

## How to use

- Add your GPX track to `public/track.gpx`
- Use `notebooks/GPX segments for rendering.ipynb` to split GPX track into segments

## Run

- Install dependencies: `npm i`
- Start server to render maps: `npm run start`
- Run tests to create screenshots: `npm test`

# Make video

```
cd tests/images
ffmpeg \
-framerate 1/3 \
-i 'img%04d.png' \
-c:v libx264 \
-pix_fmt yuv420p \
../../video/gpx.mp4
```