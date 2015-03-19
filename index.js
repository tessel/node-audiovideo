var fs = require('fs');
var bindings = require('bindings')('capture.node')

function capture () {
	var out = new (require('stream').Readable);
	var buf = bindings.capture();
	out.push(buf);
	out.push(null);
	return out;
}

exports.capture = capture;
