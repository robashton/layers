var WebglRenderer = function (target) {
  var self = this;

  var gl = null;
  var vertexBuffer = null;
  var textureBuffer = null;

  var renderWidth = 0;
  var renderHeight = 0;
  var camera = new Camera();

  var currentColourInput = null;
  var currentDepthInput = null;

  self.begin = function(colourCanvas, depthCanvas) {
    currentColourInput = createTextureFromCanvas(colourCanvas);
    currentDepthInput = createTextureFromCanvas(depthCanvas);
  };

  self.end = function() {
    gl.deleteTexture(currentColourInput);
    gl.deleteTexture(currentDepthInput);
  };

  self.renderPass = function (effect) { 
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
    createShaders();
    setupInitialState();
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

  self.newEffect = function() {
    return new EffectBuilder(gl);
  };

  var createShaders = function () {
    basicEffect = new EffectBuilder(gl)
        .addVertexShaderFromElementWithId('shared-vertex')
        .addFragmentShaderFromElementWithId('depth-fragment')
        .build();
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
    var scratchPad = $('#compositeContainer');
    var compositePad = $('<canvas/>')
                    .attr('width', target.width)
                    .attr('height', target.height)
                    .attr('id', 'composite');

    scratchPad.append(compositePad);
    gl = $('#composite')
          .get(0)
          .getContext("experimental-webgl", 
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