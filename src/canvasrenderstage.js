var CanvasRenderStage = function (colourElement, depthElement, nearestPoint) {
  var self = this;

  var colourBuffer = null;
  var depthBuffer = null;

  self.fillRect = function (x, y, z, width, height, material) {
    fillColourBuffer(x, y, z, width, height, material);
    fillDepthBuffer(x, y, z, width, height, material);
  };

  self.translate = function(x,  y) {
    colourBuffer.translate(x,y);
    if(depthBuffer)
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

  var fillDepthBuffer = function (x, y, z, width, height, material) {
    if(!depthBuffer) return;
    var depthComponent = (z / nearestPoint);
    depthBuffer.globalAlpha = depthComponent;    

    if(material.image()) {
      depthBuffer.drawImage(material.image(), x, y, width, height);
    } else {
      depthBuffer.fillRect(x, y, width, height);
    }
  };

  var createBuffers = function () {
    colourBuffer = colourElement.getContext('2d');
    if(depthElement)
      depthBuffer = depthElement.getContext('2d');
  };

  createBuffers();
};
