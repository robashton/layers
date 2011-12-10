var Layer = function (config) {
  var self = this;
  var items = [];

  var depth = config.depth,
      distanceScaleFactor = config.distanceScaleFactor, 
      renderScaleFactor = config.renderScaleFactor,
      sceneWidth = config.sceneWidth,
      sceneHeight = config.sceneHeight,
      transformX = 0;

  self.addRenderable = function (renderable) {
    items.push(renderable);
    renderable.setLayer(self);
  };

  self.removeRenderable = function(renderable) {
    var newItems = [];
    for(var i = 0; i < items.length; i++) {
        if(renderable !== items[i])
          newItems.push(items[i]);
    }
    items = newItems;
  };

  self.render = function (context) {
    for (var i = 0; i < items.length; i++)
      renderItem(context, i);
  };

  self.getDepth = function() {
    return depth;
  };

  self.getRight = function() {
    return self.getWidth() - transformX;
  };

  self.getLeft = function() {
    return -transformX;
  };

  self.getWidth = function() {
    return sceneWidth / distanceScaleFactor;
  };

  self.getHeight = function() {
    return sceneHeight / distanceScaleFactor;
  };

  self.getRenderScaleFactor = function() {
    return renderScaleFactor;
  };

  self.transformX = function(x) {
    transformX = x;
  };

  var renderItem = function (context, i) {
    var item = items[i];
    
    context.translate(transformX * renderScaleFactor, 0);
    item.render(context);
    context.translate(-transformX * renderScaleFactor, 0);
  };
};

