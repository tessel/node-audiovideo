var binding = require('bindings')('capture.node');
var path = require('path');

exports.Camera = function Camera() {
    var args = [null].concat([].slice.call(arguments));
    var ctor = binding.Camera.bind.apply(binding.Camera, args);
    return new ctor;
};
