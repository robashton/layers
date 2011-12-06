var CanvasRenderStage = function (target, nearestPoint) {
  var self = this;
  var colourBuffer = null;
  var depthBuffer = null;
  var depthTarget = null;

  self.colourTarget = function () { return target; }
  self.depthTarget = function () { return depthTarget; }

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
    var scratchPad = $('#scratch');

    var depthPad = $('<canvas/>')
      .attr('width', target.width)
      .attr('height', target.height)
      .attr('id', 'depth');

    scratchPad.append(depthPad);

    colourBuffer = target.getContext('2d');
    depthTarget =  $('#depth').get(0);
    depthBuffer = depthTarget.getContext('2d');
  };

  createBuffers();
};