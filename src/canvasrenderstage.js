var CanvasRenderStage = function (colourElement, depthElement, nearestPoint) {
  var self = this;

  var colourBuffer = null;
  var depthBuffer = null;

  self.fillRect = function (x, y, z, width, height, material) {
    fillColourBuffer(x, y, z, width, height, material);
    fillDepthBuffer(x, y, z, width, height);
  };

  self.translate = function(x,  y) {
    colourBuffer.translate(x,y);
    depthBuffer.translate(x,y);
  };

  var fillColourBuffer = function (x, y, z, width, height, material) {
    colourBuffer.setFillColor(material.rgba());

    if(material.image()) {
      colourBuffer.drawImage(material.image(), x, y, width, height);
    } else {
      colourBuffer.fillRect(x, y, width, height);
    }

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
