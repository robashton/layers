(function () {
define('eventcontainer',[],function() {
  return function() {
    var self = this;
    var handlers = [];

    self.raise = function(source, data) {
      for(var i = 0; i < handlers.length; i++)
        handlers[i].call(source, data);
    };
   
    self.add = function(handler) {
      handlers.push(handler);
    };

    self.remove = function(handler) {
      var newItems = [];
      for(var i = 0; i < handlers.length; i++)
          if(handlers[i] !== handler) 
            newItems.push(handlers[i]);
      handlers = newItems;
    };
  };
});


define('eventable',['./eventcontainer'], function(EventContainer) {
  return function() {
    var self = this;
    var eventListeners = {};
    var allContainer = new EventContainer();

    self.on = function(eventName, callback) {
      eventContainerFor(eventName).add(callback);
    };

    self.off = function(eventName, callback) {
      eventContainerFor(eventName).remove(callback);
    }; 

    self.onAny = function(callback) {
      allContainer.add(callback);
    };

    self.raise = function(eventName, data) {
      var container = eventListeners[eventName];

      if(container)
        container.raise(self, data);

      allContainer.raise(self, {
        event: eventName,
        data: data
      });
    };

    var eventContainerFor = function(eventName) {
      var container = eventListeners[eventName];
      if(!container) {
        container =  new EventContainer();
        eventListeners[eventName] = container;
      }
      return container;
    };
  };
});


define('entity',['./eventable'], function(Eventable) {
  return function() {
    Eventable.call(this); var self = this;
    var scene = null;
    var eventListeners = {};

    self.setScene = function(nscene) {
      scene = nscene;
      raiseAddedToScene();
    };

    self.clearScene = function() {
      scene = null;
      raiseRemovedFromScene();
    };

    var raiseAddedToScene = function() {
      self.raise('addedToScene', {scene: scene });
    };

    var raiseRemovedFromScene = function() {
      self.raise('removedFromScene');
    };

    var onAnyEventRaised = function(data) {
      if(scene)
        scene.raise(data.event, data.data);
    };

    self.onAny(onAnyEventRaised);
  };
});

}());