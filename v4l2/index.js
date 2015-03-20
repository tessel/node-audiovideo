var raw = require("../build/Release/capture");

exports.Camera = function Camera() {
    var args = [null].concat([].slice.call(arguments));
    var ctor = raw.Camera.bind.apply(raw.Camera, args);
    return new ctor;
};
