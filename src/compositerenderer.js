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

var CompositeRenderer = function (target) {
  var self = this;

  var gl = null;
  var vertexBuffer = null;
  var textureBuffer = null;
  var basicEffect = null;

  var renderWidth = 0;
  var renderHeight = 0;
  var camera = new Camera();

  self.renderScene = function (colourCanvas, depthCanvas) {
    gl.viewport(0, 0, renderWidth, renderHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.update(renderWidth, renderHeight);

    // create textures from inputs
    var colourTexture = createTextureFromCanvas(colourCanvas);
    var depthTexture = createTextureFromCanvas(depthCanvas);

    basicEffect.begin();
    basicEffect.buffers(vertexBuffer, textureBuffer);
    basicEffect.camera(camera);
    basicEffect.inputTextures(colourTexture, depthTexture);
    basicEffect.render();

    // TODO: This is really not efficient
    gl.deleteTexture(colourTexture);
    gl.deleteTexture(depthTexture);
  };

  var createBuffers = function () {
    createRenderTarget();
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

  var createShaders = function () {
    var vertexText = $('#shared-vertex').eq(0).text();
    var fragmentText = $('#depth-fragment').eq(0).text();

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(fragmentShader, fragmentText);
    gl.compileShader(fragmentShader);

    gl.shaderSource(vertexShader, vertexText);
    gl.compileShader(vertexShader);

    var standardProgram = gl.createProgram();
    gl.attachShader(standardProgram, vertexShader);
    gl.attachShader(standardProgram, fragmentShader);
    gl.linkProgram(standardProgram);
    if (!gl.getProgramParameter(standardProgram, gl.LINK_STATUS)) {
        throw "Couldn't create program";
    }
    basicEffect = new Effect(gl, standardProgram);
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

  var createRenderTarget = function () {
    var scratchPad = $('#compositeContainer');
    var compositePad = $('<canvas/>')
                    .attr('width', target.width)
                    .attr('height', target.height)
                    .attr('id', 'composite');

    scratchPad.append(compositePad);
    gl = $('#composite').get(0).getContext("experimental-webgl", { antialias: false });

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
