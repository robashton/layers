var EngineBuilder = function(colourId, depthId, webglId) {
  var self = this;
  var config = {};
  
  self.nearestPoint = function(value) {
    config.nearestPoint = value;
    return self;
  };

  self.sceneWidth = function(value) {
    config.sceneWidth = value;
    return self;
  };

  self.sceneHeight = function(value) {
    config.sceneHeight = value;
    return self;
  };
  
  self.build = function() {    
    config.colourElement = document.getElementById(colourId);
    config.depthElement = document.getElementById(depthId);
    config.glElement = document.getElementById(webglId);
    config.sceneWidth = config.sceneWidth || colourElement.width;
    config.sceneHeight = config.sceneHeight || colourElement.height;
    config.nearestPoint = config.nearestPoint || 8.0;
    return new Engine(config);
  };  
};
