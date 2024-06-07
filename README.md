# GPX map for Garmin eTrex SE

Display GPX track on the map with the screen resolution of Garmin eTrex SE to allow studying route details. 

Useful for long and unfamiliar GPX tracks with details that are hard to see from the bird's eye view.

Rendering of maps is implemented with https://openlayers.org

## How to use

- Add your GPX track to `public/track.gpx`
- Use `notebooks/GPX segments for rendering.ipynb` to split GPX track into segements
  - Adjust sampling depending on how many points you want to have in each segment
- Start server to render maps: `npm run start`
- Run tests to create screenshots: `npm test`

## Use with other devices or screen sizes

- You will want to adjust these parameters in `public/main.js`

```
// This determines how big of an area we are going to render
const extent = [
  center[0] - 450,  // 0.9 km / 2 = 450 meters in y direction
  center[1] - 525,  // 1.05 km / 2 = 525 meters in x direction
  center[0] + 450,
  center[1] + 525,
];

// 900x1050 is the approximate size of the view rendered by Garmin eTrex with default zoom
const resolution = view.getResolutionForExtent(extent, [900, 1050]); 
```

## Todo

- Rotate the track the way it will be rotated on the Garmin device
