# audiovideo

Cross-platform audio record/playback and video recording.

Works on OS X, and Linux. Supports Tessel 2.

```
npm install audiovideo
```

## Example

```js
var av = require('audiovideo');
var fs = require('fs');

av.acquireCamera(function (err, camera) {
	camera.captureShot('jpeg').pipe(fs.createWriteStream('out.jpg'));
});
```

## License

MIT or ASL2, at your option.
