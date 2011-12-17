define(['../shared/eventable'], function(Eventable) {
  return function(url) {
    Eventable.call(this);  

    var self = this;
    var image = null;

    self.load = function() {
      image = new Image();
      image.onload = onInitialLoadCompleted;
      image.src = url;
    };


    self.get = function() {
      return image;
    };

    var onInitialLoadCompleted = function() {
      self.raise('loaded');
    };
  };
});


