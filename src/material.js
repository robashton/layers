var Material = function(r, g, b) {
  var self = this;
  var image = null;


  self.rgba = function() {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', 255)'; 
  };

  self.scale = function(scaleFactor) {
    return new Material(
      parseInt(r * scaleFactor), 
      parseInt(g * scaleFactor), 
      parseInt(b * scaleFactor));
  };

  self.setImage = function(url) {
    image = new Image();
    image.src = url;
  };

  self.image = function() { return image; }
};
