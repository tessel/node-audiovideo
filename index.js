var Jpeg = require('jpeg').Jpeg;
var fs = require('fs');

var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname,'./package.json')));
var binding = require(binding_path);

function OSXCamera () {
}

OSXCamera.prototype.captureShot = function () {
  var out = new (require('stream').Readable);
  out._read = function () { };
  setImmediate(function () {
    var buf = binding.capture();
    out.push(buf);
    out.push(null);
  });
  return out;
}

OSXCamera.prototype.close = function () {
}

function LinuxCamera () {
  var v4l2camera = require('./v4l2');
  this.cam = new v4l2camera.Camera("/dev/video0");
  this.cam.start();
}

LinuxCamera.prototype.captureShot = function (next) {
  var out = new (require('stream').Readable);
  out._read = function () { };
  this.cam.capture(function () {
    var width = this.cam.width;
    var height = this.cam.height;
    console.error('Result', width, height);
    var rgb = this.cam.toRGB();

    var jpeg = new Jpeg(rgb, width, height, 'rgb');
    console.error('Encoding');
    jpeg.encode(function (image, error) {
      console.error('Encoded');
      out.push(image);
      out.push(null);
    });
  }.bind(this));
  return out;
}

LinuxCamera.prototype.close = function () {
  this.cam.stop();
}

function acquireCamera (next) {
  if (process.platform == 'darwin') {
    next(null, new OSXCamera());
  } else if (process.platform == 'linux') {
    next(null, new LinuxCamera());
  }
}

exports.acquireCamera = acquireCamera;
