# camera-usb

Capture frames from a USB webcam.

Works on OS X, and Linux. Supports Tessel 2.

```
npm install camera-usb
```

## Example

```js
var cameralib = require('camera-usb');
var fs = require('fs');

cameralib.capture().pipe(fs.createWriteStream('out.jpg'));
```

## License

MIT or ASL2, at your option.
