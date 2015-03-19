var fs = require('fs');
var bindings = require('bindings')('capture.node')

function capture () {
	var out = new (require('stream').Readable);
	if (process.platform == 'darwin') {
		var buf = bindings.capture();
		out.push(buf);
		out.push(null);
	} else if (process.platform == 'linux') {
		var v4l2camera = require('./v4l2');
		var cam = new v4l2camera.Camera("/dev/video0");
		cam.start();
		cam.capture(function () {
		    var rgb = cam.toRGB();
			cam.close();

			var jpeg = new Jpeg(buffer, cam.width, cam.height, 'rgb');
			jpeg.encode(function (image, error) {
				out.push(image);
				out.push(null);
			});
		});
	}
	return out;
}

exports.capture = capture;
