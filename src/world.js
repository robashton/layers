var World = function (sceneWidth, sceneHeight, nearestPoint) {
  var self = this;
  var layers = [];

  self.render = function (context) {
    for (var i = 0; i < layers.length; i++)
      layers[i].render(context);
  };

  self.addLayer = function(distance) {
    var scaleFactor = distance / nearestPoint;
    var layer = new Layer(distance, scaleFactor, sceneWidth, sceneHeight);
    layers.push(layer);
    return layer;
  };
};

