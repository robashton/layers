var Engine = function(config) {     
  var self = this;

  var baseScaleFactor = config.colourElement.width / config.sceneWidth;
     
  var world = new World(config.sceneWidth, config.sceneHeight, config.nearestPoint, baseScaleFactor);
  var canvasRenderStage = new CanvasRenderStage(config.colourElement, config.depthElement, config.nearestPoint);
  var webglRenderStage = new WebglRenderStage(config.glElement);

  self.render = function() {
    canvasRenderStage.fillRect(0, 0, 0, config.colourElement.width, config.colourElement.height, new Material(0,0,0));
    world.render(canvasRenderStage);
    webglRenderStage.renderScene(config.colourElement, config.depthElement);
  };

  self.world = function() { return world; }
};
