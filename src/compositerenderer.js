var CompositeRenderer = function (target) {
  var self = this;

  var gl = null;
  var vertexBuffer = null;
  var textureBuffer = null;
  var renderWidth = 0;
  var renderHeight = 0;
  var standardProgram = null;

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

    quadTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureBuffer);
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

    standardProgram = gl.createProgram();
    gl.attachShader(standardProgram, vertexShader);
    gl.attachShader(standardProgram, fragmentShader);
    gl.linkProgram(standardProgram);
    if (!gl.getProgramParameter(standardProgram, gl.LINK_STATUS)) {
        throw "Couldn't create program";
    }
  };

  self.renderScene = function (colourCanvas, depthCanvas) {
    gl.viewport(0, 0, renderWidth, renderHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(standardProgram);
    var projectionMatrix = mat4.ortho(0, renderWidth, renderHeight, 0, -1, 1);
    var viewMatrix = mat4.lookAt([0, 0, 0], [0, 0, -1], [0, 1, 0]);

    var worldMatrix = mat4.create();
    mat4.identity(worldMatrix);
    mat4.scale(worldMatrix, [renderWidth, renderHeight, 1.0]);

    // Upload the quad
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(standardProgram, 'aVertexPosition'), 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(standardProgram, 'aVertexPosition'));

    // And the texture coords
    gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(standardProgram, 'aTextureCoords'), 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(gl.getAttribLocation(standardProgram, 'aTextureCoords'));

    // Set the orthographic projection setup
    gl.uniformMatrix4fv(gl.getUniformLocation(standardProgram, "uProjection"), false, projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(standardProgram, "uView"), false, viewMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(standardProgram, "uWorld"), false, worldMatrix);

    gl.uniform2f(gl.getUniformLocation(standardProgram, "uResolution"), false, [renderWidth, renderHeight]);

    // create textures from inputs
    var colourTexture = createTextureFromCanvas(colourCanvas);
    var depthTexture = createTextureFromCanvas(depthCanvas);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, colourTexture);
    gl.uniform1i(gl.getUniformLocation(standardProgram, 'uColourSampler'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(gl.getUniformLocation(standardProgram, 'uDepthSampler'), 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // TODO: This is really not efficient
    gl.deleteTexture(colourTexture);
    gl.deleteTexture(depthTexture);
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