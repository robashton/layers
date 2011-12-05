var World = function (sceneWidth, sceneHeight) {
  var self = this;
  var layers = [];

  layers.push(new Layer(1.0, sceneWidth));
  layers.push(new Layer(3.0, sceneWidth));
  layers.push(new Layer(5.0, sceneWidth));
  layers.push(new Layer(8.0, sceneWidth));

  self.doLogic = function () {
    for (var i = 0; i < layers.length; i++)
      layers[i].doLogic();
  };

  self.render = function (context) {
    for (var i = 0; i < layers.length; i++)
      layers[i].render(context);
  };

  self.addEntity = function (layer, width, height, x, y, material) {
    layers[layer].addEntity(width, height, x, y, material);
  };
};

