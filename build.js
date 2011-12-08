var fs = require('fs');

var inputFiles = [
  "src/renderable.js",
  "src/camera.js",
  "src/rendertarget.js" ,
  "src/effectbuilder.js" ,
  "src/effect.js" ,
  "src/material.js" ,
  "src/canvasrenderstage.js" ,
  "src/webglrenderer.js" ,
  "src/webglrenderstage.js" ,
  "src/layer.js" ,
  "src/world.js" ,
  "src/game.js",
  "src/engine.js",
  "src/enginebuilder.js"
];

// TODO: Discuss strategy for dealing with modules in a purely client-side system
// it is tempted to go down the requireJS route and provide an entry point to the outside world that keeps them unaware of this
// I'll think about it - for now there are only one way dependencies and this is nice and simple and works
var outputText = '';

var addFile = function(index, callback) {
  fs.readFile(inputFiles[index], function(err, data) {
    
    outputText += data;
    outputText += '\r\n';
    
    if(index < inputFiles.length-1)
      addFile(index+1, callback);
    else
      callback();
  });
};

var buildAllFiles = function(callback) {
  addFile(0, callback);
};

exports.go = function() {
  buildAllFiles(function() {
    fs.writeFile('lib/layers.js', outputText);
  });
};
