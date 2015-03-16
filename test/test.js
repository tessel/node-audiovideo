var cameralib = require('../');
var fs = require('fs');
var imagesize = require('imagesize');
var assert = require('assert');

imagesize(cameralib.capture('jpeg'), function (err, res) {
  assert.ok(err == null);
  assert.ok(res.format == 'jpeg');
  assert.ok(res.width > 0);
  assert.ok(res.height > 0);
});
