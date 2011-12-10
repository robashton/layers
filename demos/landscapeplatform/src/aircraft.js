
var Aircraft = function(id, depth) {
  Entity.call(this); var self = this;

  var x = 0;
  var y = 0;
  var aircraftMaterial = new Material(255,255,255);
  aircraftMaterial.setImage('plane.png');
  var renderable = new Renderable(0,0, 64, 64, aircraftMaterial);
  var layer = null;  

  self.id = function() { return id; }

  self.tick = function() {
    x += Aircraft.Speed;
    renderable.position(x,y);
  };

  self.moveLeft = function() {
    x -= 5.0;
  };

  self.moveRight = function() {
    x += 5.0;
  };

  self.moveUp = function() {
    y -= 5.0;
  };

  self.moveDown = function() {
    y += 5.0;
  };

  var onAddedToScene = function(data) {
    layer = data.scene.getLayer(depth);
    layer.addRenderable(renderable);
  };

  self.on('addedToScene', onAddedToScene);
};

Aircraft.Speed = 3.0;