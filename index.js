var Jpeg = require('jpeg').Jpeg;
var fs = require('fs');
var bindings = require('bindings')('capture.node')

function capture () {
	var out = new (require('stream').Readable);
	out._read = function () { };
	if (process.platform == 'darwin') {
		var buf = bindings.capture();
		out.push(buf);
		out.push(null);
	} else if (process.platform == 'linux') {
		var v4l2camera = require('./v4l2');
		var cam = new v4l2camera.Camera("/dev/video0");
		cam.start();
		console.error('Capturing');
		cam.capture(function () {
			var width = cam.width;
			var height = cam.height;
			console.error('Result', width, height);
		    var rgb = cam.toRGB();
			// cam.close();

			console.error('Jpeg');
			var jpeg = new Jpeg(new Buffer(rgb), width, height, 'rgb');
			console.error('Encoding');
			jpeg.encode(function (image, error) {
				console.error('Encoded');
				out.push(image);
				out.push(null);
			});
		});
	}
	return out;
}

exports.capture = capture;
