var Square = function(x,y, width, height, material, layer) {
  var self = this;

  var item = new Renderable(x, y, width, height, material);
  layer.addRenderable(item);

  self.renderable = function() {
    return item;
  };

  self.doLogic = function() {
    x += 2;
    if(x > layer.getWidth())
      x = 0 - width;
    item.position(x, y);  
  };
};

var Game = function () {
  var self = this;

  var engine = new EngineBuilder('colour', 'depth', 'webgl')
                    .nearestPoint(8.0)
                    .sceneWidth(320)
                    .sceneHeight(320)
                    .build();

  var world = engine.world();
                  
  var backdrop = world.addLayer(1.0);
  var middle1 = world.addLayer(3.0);
  var middle2 = world.addLayer(5.0);
  var foreground = world.addLayer(8.0);

  var items = [];

  var doLogic = function() {
    for(var i in items) {
      items[i].doLogic();
    }
  };

  var renderScene = function () {
    engine.render();
  };

  self.start = function () {
    setInterval(doLogic, 1000 / 30);
    setInterval(renderScene, 1000 / 30);
  };

  var populateWorldWithJunk = function () {
    for (var x = 0; x < 1000; x++) {
      var item = new Square(randomPointInWidth(backdrop), randomPointInHeight(backdrop), randomWidth(), randomHeight(), new Material(255,0,0), backdrop);
      items.push(item); 
    }
    for (var x = 0; x < 200; x++) {
      var item = new Square(randomPointInWidth(middle1), randomPointInHeight(middle1), randomWidth(), randomHeight(), new Material(0,0,255), middle1);
      items.push(item); 
    }
    for (var x = 0; x < 50; x++) {
      var item = new Square(randomPointInWidth(middle2), randomPointInHeight(middle2), randomWidth(), randomHeight(), new Material(255,0,255), middle2);
      items.push(item); 
    }
    for (var x = 0; x < 25; x++) {
      var item = new Square(randomPointInWidth(foreground), randomPointInHeight(foreground), randomWidth(), randomHeight(), new Material(255,30,30), foreground);
      items.push(item); 
    }; 
  };

  var randomPointInWidth = function (layer) {
    return Math.random() * layer.getWidth();
  };

  var randomPointInHeight = function (layer) {
    return Math.random() *  layer.getWidth();
  };

  var randomWidth = function () {
    return Math.random() * 30;
  };

  var randomHeight = function () {
    return Math.random() * 30;
  };

  populateWorldWithJunk();
};
