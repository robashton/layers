var Layer = function (depth, scaleFactor, sceneWidth, sceneHeight) {
  var self = this;
  var entities = [];

  self.addEntity = function (entity) {
    entities.push(entity);
    entity.setLayer(self);
  };

  self.render = function (context) {
    for (var i = 0; i < entities.length; i++)
      renderEntity(context, i);
  };

  self.getDepth = function() {
    return depth;
  };

  self.getWidth = function() {
    return sceneWidth / scaleFactor;
  };

  self.getHeight = function() {
    return sceneHeight / scaleFactor;
  };

  self.getScaleFactor = function() {
    return scaleFactor;
  };

  var renderEntity = function (context, i) {
    var entity = entities[i];
   // TODO: Bad, bad bad   
    entity.render(context);
  };
};

