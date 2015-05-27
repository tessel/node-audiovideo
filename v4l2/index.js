var binary = require('node-pre-gyp');
var path = require('path');
var binding_path = binary.find(path.resolve(path.join(__dirname,'../package.json')));
var binding = require(binding_path);

exports.Camera = function Camera() {
    var args = [null].concat([].slice.call(arguments));
    var ctor = binding.Camera.bind.apply(binding.Camera, args);
    return new ctor;
};
