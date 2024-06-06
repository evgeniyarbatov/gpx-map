const urlParams = new URLSearchParams(window.location.search);

const rotation = parseFloat(urlParams.get('rotation')) || 0;
const lat = parseFloat(urlParams.get('lat'));
const lon = parseFloat(urlParams.get('lon'));

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
          })
      })
  ],
  view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 10,
      rotation: rotation
  })
});

if (lat && lon) {
  const center = ol.proj.fromLonLat([lon, lat]);
  const view = map.getView();

  const extent = [
    center[0] - 450,  // 0.9 km / 2 = 450 meters in y direction
    center[1] - 525,  // 1.05 km / 2 = 525 meters in x direction
    center[0] + 450,
    center[1] + 525,
  ];
  const resolution = view.getResolutionForExtent(extent, [1050, 900]);
  view.setCenter(center);
  view.setResolution(resolution);
} else {
  // Fit the view to the extent of the GPX track once it's loaded
  const vectorLayer = map.getLayers().item(1);
  vectorLayer.getSource().once('change', function (event) {
      if (vectorLayer.getSource().getState() === 'ready') {
          const extent = vectorLayer.getSource().getExtent();
          map.getView().fit(extent, { padding: [50, 50, 50, 50] });
      }
  });
}