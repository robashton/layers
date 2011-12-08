var Entity = function(x, y, width, height, material) {
  var self = this;

  var rx = 0;
  var ry = 0;
  var z = 0;
  var rwidth = 0;
  var rheight = 0;
  var layer = null;

  self.setLayer = function(nlayer) {
    layer = nlayer;
    updateRenderCoords();
    updateRenderSize();
  };  

  self.position = function(nx, ny) {
    x = nx;
    y = ny;
    updateRenderCoords();
  };

  self.render = function(context) {
    context.fillRect(rx, ry, layer.getDepth(), rwidth, rheight, material)
  };

  var updateRenderCoords = function() {
    rx = x * layer.getScaleFactor();
    ry = y * layer.getScaleFactor();
  };

  var updateRenderSize = function() {
    rwidth = width * layer.getScaleFactor();
    rheight = height * layer.getScaleFactor();
  };
};

var Camera = function() {
  var self = this;

  self.projection = mat4.create();
  self.view = mat4.create();
  self.world = mat4.create();
  self.resolution = new glMatrixArrayType(2);

  self.update = function(renderWidth, renderHeight) {
    mat4.ortho(0, renderWidth, renderHeight, 0, -1, 1, self.projection);
    mat4.lookAt([0, 0, 0], [0, 0, -1], [0, 1, 0], self.view);
    mat4.identity(self.world);
    mat4.scale(self.world, [renderWidth, renderHeight, 1.0]);
    
    self.resolution[0] = renderWidth;
    self.resolution[1] = renderHeight;
  };

};


var ScreenRenderTarget = function(gl) {
  var self = this;

  self.upload = function() {
     gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };
  self.clear = function() {};
  self.getTexture = function() { throw "Not supported"; }

};

var RenderTarget = function(gl, width, height) {
  var self = this;
  var width = width;
  var height = height;
  var rttFramebuffer = null;
  var rttTexture = null;
  var renderbuffer  = null;

  self.upload = function() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
  };

  self.clear = function() {
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  self.getTexture = function() {
    return rttTexture;
  };

  rttFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);

  rttTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, rttTexture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);  
};

var EffectBuilder = function(gl) {
  var self = this;
  var shaders = [];

  self.addVertexShaderFromElementWithId = function(id) {
    var vertexText = document.getElementById(id).innerText;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexText);
    gl.compileShader(vertexShader);
    shaders.push(vertexShader);
    return self;
  };

  self.addFragmentShaderFromElementWithId = function(id) {
    var fragmentText = document.getElementById(id).innerText;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentText);
    gl.compileShader(fragmentShader);
    shaders.push(fragmentShader);
    return self;
  };

  self.build = function() {
    var builtProgram = buildProgram();
    return new Effect(gl, builtProgram);
  }; 

  var buildProgram = function() {
    var program = gl.createProgram();

    for(var i = 0 ; i < shaders.length; i++)
      gl.attachShader(program, shaders[i]);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw "Couldn't create program";
    }
    return program;
  };

};

var Effect = function(gl, program) {
  var self = this;

  var aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  var aTextureCoords = gl.getAttribLocation(program, 'aTextureCoords');
  var uProjection = gl.getUniformLocation(program, 'uProjection');
  var uView = gl.getUniformLocation(program, 'uView');
  var uWorld = gl.getUniformLocation(program, 'uWorld');
  var uResolution = gl.getUniformLocation(program, 'uResolution');
  var uColourSampler = gl.getUniformLocation(program, 'uColourSampler');
  var uDepthSampler = gl.getUniformLocation(program, 'uDepthSampler');

  self.begin = function() {
    gl.useProgram(program);
  };  

  self.buffers = function(vertexBuffer, textureBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(aTextureCoords, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aTextureCoords);
  };

  self.camera = function(camera) {
    gl.uniformMatrix4fv(uProjection, false, camera.projection);
    gl.uniformMatrix4fv(uView, false, camera.view);
    gl.uniformMatrix4fv(uWorld, false, camera.world);
    gl.uniform2f(uResolution, false, camera.resolution);
  };

  self.inputTextures = function(inputColour, depth) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, inputColour);
    gl.uniform1i(uColourSampler, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depth);
    gl.uniform1i(uDepthSampler, 1);
  };

  self.render = function() {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
};


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

var CanvasRenderStage = function (colourElement, depthElement, nearestPoint) {
  var self = this;

  var colourBuffer = null;
  var depthBuffer = null;

  self.fillRect = function (x, y, z, width, height, material) {
    fillColourBuffer(x, y, z, width, height, material);
    fillDepthBuffer(x, y, z, width, height);
  };

  var fillColourBuffer = function (x, y, z, width, height, material) {
    colourBuffer.setFillColor(material.rgba());

    if(material.image()) {
      colourBuffer.drawImage(material.image(), x, y, width, height);
    } else {
      colourBuffer.fillRect(x, y, width, height);
    }

  };

  var fillDepthBuffer = function (x, y, z, width, height) {
    var depthComponent = parseInt((z / nearestPoint) * 255);
    var depthColour = 'rgba(' + depthComponent + ', 0, 0, 255)';
    depthBuffer.setFillColor(depthColour);
    depthBuffer.fillRect(x, y, width, height);
  };

  var createBuffers = function () {
    colourBuffer = colourElement.getContext('2d');
    depthBuffer = depthElement.getContext('2d');
  };

  createBuffers();
};

var WebglRenderer = function (target, shaderFactory) {
  var self = this;

  var gl = null;
  var vertexBuffer = null;
  var textureBuffer = null;

  var renderWidth = 0;
  var renderHeight = 0;
  var camera = new Camera();

  var effects = [];

  var currentColourInput = null;
  var currentDepthInput = null;
  var memoryTargetOne = null;
  var memoryTargetTwo = null;
  var screenTarget = null;

  self.render = function (colourCanvas, depthCanvas) { 
    if(effects.length === 0)
      throw "No effects were specified before calling render!";

    var canvasColourTexture =  createTextureFromCanvas(colourCanvas);
    var canvasDepthTexture =  createTextureFromCanvas(colourCanvas);

    currentColourInput = canvasColourTexture;
    currentDepthInput = canvasDepthTexture;
    var currentRenderTarget = effects.length === 1 ? screenTarget : memoryTargetOne;

    for(var i = 0; i < effects.length; i++) {
      currentRenderTarget.upload();
      renderPass(effects[i]);
      currentRenderTarget.clear();

      if(i < effects.length - 1) {
        currentColourInput = currentRenderTarget.getTexture();
        currentRenderTarget = i === (effects.length-2) ? screenTarget : (currentRenderTarget === memoryTargetOne ? memoryTargetTwo : memoryTargetOne);       
      }
    }   
    
    gl.deleteTexture(canvasColourTexture);
    gl.deleteTexture(canvasDepthTexture);
  };

  var renderPass = function(effect) {
    gl.viewport(0, 0, renderWidth, renderHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.update(renderWidth, renderHeight);

    effect.begin();
    effect.buffers(vertexBuffer, textureBuffer);
    effect.camera(camera);
    effect.inputTextures(currentColourInput, currentDepthInput);
    effect.render();
  };

  var createBuffers = function () {
    createGlContext();
    createGeometry();
    createRenderTargets();
    setupInitialState();
  };

  var createRenderTargets = function() {
    memoryTargetOne = new RenderTarget(gl, renderWidth, renderHeight);
    memoryTargetTwo = new RenderTarget(gl, renderWidth, renderHeight);
    screenTarget = new ScreenRenderTarget(gl);
  };

  var setupInitialState = function () {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  };

  var createGeometry = function () {
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.STATIC_DRAW);

    textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadTextureCoords), gl.STATIC_DRAW);
  };

  self.addPass = function(builderFunction) {
    var builder = new EffectBuilder(gl);
    builderFunction(builder);
    var effect = builder.build();
    effects.push(effect);
  };

  var createTextureFromCanvas = function (canvasElement) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvasElement);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  };

  var createGlContext = function () {
    gl = target.getContext("experimental-webgl", 
          { antialias: false });

    renderWidth = target.width;
    renderHeight = target.height;
  };

  var quadVertices = [
       0.0, 0.0, 0.0,
       1.0, 0.0, 0.0,
       0.0, 1.0, 0.0,
       1.0, 1.0, 0.0
  ];

  var quadTextureCoords = [
       0.0, 1.0,
       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,
  ];

  createBuffers();
};

var WebglRenderStage = function(target) {
  var self = this;

  var renderer = new WebglRenderer(target);

  renderer.addPass(function(builder) {
      builder
      .addVertexShaderFromElementWithId('shared-vertex')
      .addFragmentShaderFromElementWithId('depth-fragment');
  });

  self.renderScene = function(colour, depth) {
      renderer.render(colour, depth);
  };
};

var Layer = function (depth, scaleFactor, sceneWidth, sceneHeight) {
  var self = this;
  var entities = [];

  self.addEntity = function (entity) {
    entities.push(entity);
    entity.setLayer(self);
  };

  self.render = function (context) {
    for (var i = 0; i < entities.length; i++)
      renderEntity(context, i);
  };

  self.getDepth = function() {
    return depth;
  };

  self.getWidth = function() {
    return sceneWidth / scaleFactor;
  };

  self.getHeight = function() {
    return sceneHeight / scaleFactor;
  };

  self.getScaleFactor = function() {
    return scaleFactor;
  };

  var renderEntity = function (context, i) {
    var entity = entities[i];
   // TODO: Bad, bad bad   
    entity.render(context);
  };
};


var World = function (sceneWidth, sceneHeight, nearestPoint) {
  var self = this;
  var layers = [];

  self.render = function (context) {
    for (var i = 0; i < layers.length; i++)
      layers[i].render(context);
  };

  self.addLayer = function(distance) {
    var scaleFactor = distance / nearestPoint;
    var layer = new Layer(distance, scaleFactor, sceneWidth, sceneHeight);
    layers.push(layer);
    return layer;
  };
};


undefined
var Engine = function(config) {     
  var self = this;
     
  var world = new World(config.sceneWidth, config.sceneHeight, config.nearestPoint);
  var canvasRenderStage = new CanvasRenderStage(config.colourElement, config.depthElement, config.nearestPoint);
  var webglRenderStage = new WebglRenderStage(config.glElement);

  self.render = function() {
    canvasRenderStage.fillRect(0, 0, 0, config.colourElement.width, config.colourElement.height, new Material(0,0,0));
    world.render(canvasRenderStage);
    webglRenderStage.renderScene(config.colourElement, config.depthElement);
  };

  self.world = function() { return world; }
};

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

