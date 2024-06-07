# GPX map for Garmin eTrex SE

Display GPX track on the map with the screen resolution of Garmin eTrex SE to allow studying route details. 

Useful for long and unfamiliar GPX tracks with details that are hard to see from the bird's eye view.

## How to use

- Add your GPX track to `public/track.gpx`
- Use `notebooks/GPX segments for rendering.ipynb` to split GPX track into segements
  - Adjust sampling depending on how many points you want to have in each segment
- Start server to render maps: `npm run start`
- Run tests to create screenshots: `npm test`

## Todo

- Rotate the track the way it will be rotated on the Garmin device
