var av = require('../');
var fs = require('fs');
var imagesize = require('imagesize');
var assert = require('assert');

av.acquireCamera(function (err, camera) {
  imagesize(camera.captureShot('jpeg'), function (err, res) {
    assert.ok(err == null);
    assert.ok(res.format == 'jpeg');
    assert.ok(res.width > 0);
    assert.ok(res.height > 0);
    console.error('passed');
  });
})
