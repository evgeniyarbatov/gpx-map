# GPX Map

Render GPX track segments on the map to allow studying route details.

Useful for long and unfamiliar GPX tracks when details that are hard to see from the bird's eye view.

## Make video

```
make video GPX=/path/to/track.gpx
```

Writes `osm.mp4`, `esri.mp4`, and `combined.mp4` to `$DATA_DIR/video` (default `~/Documents/data/gpx-map/video`).

`make run` serves the last ingested track at `http://localhost:3000`.

## Example

[https://youtu.be/ThqRhW5CKDw](https://youtu.be/ThqRhW5CKDw)
