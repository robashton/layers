var
  path = require('path'),
  http = require('http'),
  paperboy = require('paperboy'),
  PORT = 8000,
  WEBROOT = path.dirname(__filename),
  build = require('./build');

build.go();

http.createServer(function(req, res) {
  paperboy
    .deliver(WEBROOT, req, res)
    .otherwise(function(err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("Error 404: File not found");
    });
}).listen(PORT);

