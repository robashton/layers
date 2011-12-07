var WebglRenderStage = function(target) {
  var self = this;

  var renderer = new WebglRenderer(target);

  var standardEffect = renderer.newEffect()
        .addVertexShaderFromElementWithId('shared-vertex')
        .addFragmentShaderFromElementWithId('depth-fragment')
        .build();

  self.renderScene = function(colour, depth) {
      renderer.begin(colour, depth);    
      renderer.renderPass(standardEffect);
      renderer.end();
  };

};
