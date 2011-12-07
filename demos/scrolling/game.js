var Game = function () {
  var self = this;

  var colourElement = document.getElementById('colour');
  var depthElement = document.getElementById('depth');
  var glElement = document.getElementById('webgl');

  var world = new World(colourElement.width, colourElement.height);
  var canvasRenderStage = new CanvasRenderStage(colourElement, depthElement, 8.0);
  var webglRenderStage = new WebglRenderStage(glElement);

  var doLogic = function () {
    world.doLogic();
  };

  var renderScene = function () {
    clearRenderingTarget();
    world.render(canvasRenderStage);
    webglRenderStage.renderScene(colourElement, depthElement);
  };

  var clearRenderingTarget = function () {
    canvasRenderStage.fillRect(0, 0, 0, colourElement.width, colourElement.height, new Material(0,0,0));
  };

  self.start = function () {
    setInterval(doLogic, 1000 / 30);
    setInterval(renderScene, 1000 / 30);
  };

  var populateWorldWithJunk = function () {
    for (var x = 0; x < 1000; x++) {
      world.addEntity(0, randomPointInWidth(), randomPointInHeight(), randomWidth(), randomHeight(), new Material(255,0,0));
    };
    for (var x = 0; x < 200; x++) {
      world.addEntity(1, randomPointInWidth(), randomPointInHeight(), randomWidth(), randomHeight(), new Material(0,0,255));
    };
    for (var x = 0; x < 50; x++) {
      world.addEntity(2, randomPointInWidth(), randomPointInHeight(), randomWidth(), randomHeight(), new Material(255,0,255));
    };
    for (var x = 0; x < 25; x++) {
      world.addEntity(3, randomPointInWidth(), randomPointInHeight(), randomWidth(), randomHeight(), new Material(255,30,30));
    };
  };

  var randomPointInWidth = function () {
    return Math.random() * colourElement.width;
  };

  var randomPointInHeight = function () {
    return Math.random() * colourElement.height;
  };

  var randomWidth = function () {
    return Math.random() * 30;
  };

  var randomHeight = function () {
    return Math.random() * 30;
  };

  populateWorldWithJunk();
};
