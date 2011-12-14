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


define('scene',['./eventable'], function(Eventable) {
  return function(world, resources) {
   Eventable.call(this); var self = this;

    var layers = {};
    var entitiesById = {};
    var entitiesByIndex = [];
    self.resources = resources;

    self.addLayer = function(depth) {
      layers[depth] = world.addLayer(depth);
    };

    self.getLayer = function(depth) {
      return layers[depth];
    };

    self.addEntity = function(entity) {
      entitiesById[entity.id()] = entity;
      entitiesByIndex.push(entity);
      entity.setScene(self);
    };

    self.removeEntity = function(entity) {
      delete entitiesById[entity.id()];
      var newEntities = [];
      for(var i = 0 ; i < entitiesByIndex.length; i++)
        if(entitiesByIndex[i] !== entity) 
          newEntities.push(entitiesByIndex[i]);
      entitiesByIndex = newEntities;
      entity.clearScene();
    };

    self.getEntity = function(id, callback) {
      return entitiesById[id];
    };

    self.tick = function() {
       self.each(function(entity) {
          if(entity.tick) entity.tick();
       });
    };

    self.withEntity = function(id, callback) {
      var entity = entitiesById[id];
      if(entity) callback(entity);
    };

    self.eachLayer = function(callback) {
      for(var i in layers) {
        callback(layers[i]);
      }
    };

    self.each = function(callback) {
      for(var i = 0; i < entitiesByIndex.length; i++)
        callback(entitiesByIndex[i]);
    };

    self.crossEach = function(callback) {
      for(var i = 0; i < entitiesByIndex.length; i++) {
        for(var j = i; j < entitiesByIndex.length; j++) {
           callback(i,j,entitiesByIndex[i], entitiesByIndex[j]);
        }
      }
    };
  };
});



}());