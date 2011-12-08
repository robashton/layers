var World = function (sceneWidth, sceneHeight, nearestPoint, renderScaleFactor) {
  var self = this;
  var layers = [];

  self.render = function (context) {
    for (var i = 0; i < layers.length; i++)
      layers[i].render(context);
  };

  self.addLayer = function(distance) {
    var distanceScaleFactor = distance / nearestPoint;

    var layer = new Layer({
      distance: distance,
      distanceScaleFactor: distanceScaleFactor,
      renderScaleFactor: distanceScaleFactor * renderScaleFactor,
      sceneWidth: sceneWidth,
      sceneHeight: sceneHeight
    });

    layers.push(layer);
    return layer;
  };
};

