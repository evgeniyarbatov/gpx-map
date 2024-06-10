# GPX Map

Render GPX track segments on the map to allow studying route details. 

Useful for long and unfamiliar GPX tracks when details that are hard to see from the bird's eye view.

## How to use

- Add your GPX track to `public/track.gpx`
- Use `notebooks/GPX Segments.ipynb` to split GPX track into segments

## Run

- Install dependencies: `npm i`
- Start server to render maps: `npm run start`
- Run tests to create screenshots: `npm test`

## Make video

```
cd tests/images
ffmpeg \
-framerate 1/3 \
-i 'img%04d.png' \
-c:v libx264 \
-pix_fmt yuv420p \
../../video/gpx.mp4
```

## Example

[https://youtu.be/ThqRhW5CKDw](https://youtu.be/ThqRhW5CKDw)
