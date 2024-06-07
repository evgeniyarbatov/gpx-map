const urlParams = new URLSearchParams(window.location.search);

const rotationDegrees = parseFloat(urlParams.get('rotation')) || 0;
const rotationRadians = rotationDegrees * (Math.PI / 180);

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
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 10,
        rotation: rotationRadians,
    }),
    controls: [],
  });
  
  const center = ol.proj.fromLonLat([lon, lat]);
  const view = map.getView();

  const extent = [
    center[0] - 450,  // 0.9 km / 2 = 450 meters in y direction
    center[1] - 525,  // 1.05 km / 2 = 525 meters in x direction
    center[0] + 450,
    center[1] + 525,
  ];
  const resolution = view.getResolutionForExtent(extent, [900, 1050]);

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