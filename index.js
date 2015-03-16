var fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');

var exe = path.join(__dirname, 'build', 'Release', 'capture');

function capture () {
  var camera = spawn(exe, [], {});
  return camera.stdout;
}

exports.capture = capture;
