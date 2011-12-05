var RenderTarget = function (target, nearestPoint) {
  var self = this;
  var colourBuffer = null;
  var depthBuffer = null;
  var depthTarget = null;

  self.colourTarget = function () { return target; }
  self.depthTarget = function () { return depthTarget; }

  self.fillRect = function (x, y, z, width, height, colour) {
    fillColourBuffer(x, y, width, height, colour);
    fillDepthBuffer(x, y, z, width, height, colour);
  };

  var fillColourBuffer = function (x, y, width, height, colour) {
    colourBuffer.setFillColor(colour);
    colourBuffer.fillRect(x, y, width, height);
  };

  var fillDepthBuffer = function (x, y, z, width, height, colour) {
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
