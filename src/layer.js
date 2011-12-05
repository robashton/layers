var Layer = function (depth, sceneWidth) {
  var self = this;
  var entities = [];

  self.addEntity = function (x, y, width, height, material) {
    entities.push({
      width: width * (depth / 5.0),
      height: height * (depth / 5.0),
      material: material,
      x: x,
      y: y
    });
  };

  self.doLogic = function () {
    for (var i = 0; i < entities.length; i++)
      doLogicForEntity(i);
  };

  var doLogicForEntity = function (i) {
    entities[i].x += 0.5 * depth;
    if (entities[i].x > sceneWidth) {
      entities[i].x = 0 - entities[i].width;
    }
  };

  self.render = function (context) {
    for (var i = 0; i < entities.length; i++)
      renderEntity(context, i);
  };

  var renderEntity = function (context, i) {
    var entity = entities[i];
    context.fillRect(entity.x, entity.y, depth, entity.width, entity.height, entity.material);
  };
};

