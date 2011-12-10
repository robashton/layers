var Renderable = function(x, y, width, height, material) {
  var self = this;

  var rx = 0;
  var ry = 0;
  var z = 0;
  var rwidth = 0;
  var rheight = 0;
  var layer = null;

  self.setLayer = function(nlayer) {
    layer = nlayer;
    updateRenderCoords();
    updateRenderSize();
  };  

  self.position = function(nx, ny) {
    x = nx;
    y = ny;
    updateRenderCoords();
  };

  self.render = function(context) {
    context.fillRect(rx, ry, layer.getDepth(), rwidth, rheight, material)
  };

  var updateRenderCoords = function() {
    rx = x * layer.getRenderScaleFactor();
    ry = y * layer.getRenderScaleFactor();
  };

  var updateRenderSize = function() {
    rwidth = width * layer.getRenderScaleFactor();
    rheight = height * layer.getRenderScaleFactor();
  };
};