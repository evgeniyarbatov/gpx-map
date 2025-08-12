const urlParams = new URLSearchParams(window.location.search);

const rotationDegrees = parseFloat(urlParams.get('rotation')) || 0;
const rotationRadians = rotationDegrees * (Math.PI / 180);

const distance = parseFloat(urlParams.get('distance'))

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(renderMap, showError);
} else {
  document.getElementById('location').innerText = "Geolocation is not supported by this browser.";
}

function renderMap(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
            source: new ol.source.Vector({
                url: 'track.gpx',
                format: new ol.format.GPX()
            }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                  color: 'red',
                  width: 5
              })
          })
        }),
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 10,
        rotation: rotationRadians,
    }),
    controls: [
      new ol.control.ScaleLine({
        units: 'metric',
      })
    ]
  });

  // Create distance label overlay
  const distanceLabel = document.createElement('div');
  distanceLabel.innerHTML = `${distance}km`;
  distanceLabel.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 12px;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      border: 1px solid #ccc;
      z-index: 1000;
      pointer-events: none;
  `;
  // Add the label directly to the map container
  document.getElementById('map').appendChild(distanceLabel);


  const center = ol.proj.fromLonLat([lon, lat]);
  const view = map.getView();

  const extent = [
    center[0] - 1000,
    center[1] - 1000,
    center[0] + 1000,
    center[1] + 1000,
  ];
  const resolution = view.getResolutionForExtent(extent, [2000, 2000]);

  view.setResolution(resolution);
  view.setCenter(center);

  document.getElementById('map').mapInstance = map;
}

function showError(error) {
  let errorMsg = '';
  switch (error.code) {
      case error.PERMISSION_DENIED:
          errorMsg = "User denied the request for Geolocation.";
          break;
      case error.POSITION_UNAVAILABLE:
          errorMsg = "Location information is unavailable.";
          break;
      case error.TIMEOUT:
          errorMsg = "The request to get user location timed out.";
          break;
      case error.UNKNOWN_ERROR:
          errorMsg = "An unknown error occurred.";
          break;
  }
  alert(errorMsg);
}