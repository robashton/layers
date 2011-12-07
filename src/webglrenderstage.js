var WebglRenderStage = function(target) {
  var self = this;

  var renderer = new WebglRenderer(target);

  renderer.addPass(function(builder) {
      builder
      .addVertexShaderFromElementWithId('shared-vertex')
      .addFragmentShaderFromElementWithId('depth-fragment');
  });

  renderer.addPass(function(builder) {
      builder
      .addVertexShaderFromElementWithId('shared-vertex')
      .addFragmentShaderFromElementWithId('red-fragment');
  });

  renderer.addPass(function(builder) {
      builder
      .addVertexShaderFromElementWithId('shared-vertex')
      .addFragmentShaderFromElementWithId('blue-fragment');
  });

  renderer.addPass(function(builder) {
      builder
      .addVertexShaderFromElementWithId('shared-vertex')
      .addFragmentShaderFromElementWithId('green-fragment');
  });

  self.renderScene = function(colour, depth) {
      renderer.render(colour, depth);
  };
};
