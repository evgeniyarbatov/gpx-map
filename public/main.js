const urlParams = new URLSearchParams(window.location.search);
const rotation = parseFloat(urlParams.get('rotation')) || 0;

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

// Fit the view to the extent of the GPX track once it's loaded
const vectorLayer = map.getLayers().item(1);
vectorLayer.getSource().once('change', function (event) {
    if (vectorLayer.getSource().getState() === 'ready') {
        const extent = vectorLayer.getSource().getExtent();
        map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
});