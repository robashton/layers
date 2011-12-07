var CanvasRenderStage = function (colourElement, depthElement, nearestPoint) {
  var self = this;

  var colourBuffer = null;
  var depthBuffer = null;

  self.fillRect = function (x, y, z, width, height, material) {
    fillColourBuffer(x, y, z, width, height, material);
    fillDepthBuffer(x, y, z, width, height);
  };

  var fillColourBuffer = function (x, y, z, width, height, material) {
    var scale = 0.5 + (z / (nearestPoint * 2));
    material = material.scale(scale);
    colourBuffer.setFillColor(material.rgba());
    colourBuffer.fillRect(x, y, width, height);
  };

  var fillDepthBuffer = function (x, y, z, width, height) {
    var depthComponent = parseInt((z / nearestPoint) * 255);
    var depthColour = 'rgba(' + depthComponent + ', 0, 0, 255)';
    depthBuffer.setFillColor(depthColour);
    depthBuffer.fillRect(x, y, width, height);
  };

  var createBuffers = function () {
    colourBuffer = colourElement.getContext('2d');
    depthBuffer = depthElement.getContext('2d');
  };

  createBuffers();
};
