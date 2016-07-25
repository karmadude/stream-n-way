# stream-n-way

N-way splitter for streams.

[![Build Status](https://travis-ci.org/karmadude/stream-n-way.svg?branch=master)](https://travis-ci.org/karmadude/stream-n-way)

## Install

    $ npm install stream-n-way

## Usage

### new StreamNWay(n[,options])
* Options `<Object>`
    - streamAtIndex `<Function>` A callback function with an index and `options` to be invoked for a custom stream.
    - Any [`stream.Readable` options](https://nodejs.org/api/stream.html#stream_new_stream_readable_options)

```js
let stream = require("stream");
let StreamNWay = require("stream-n-way");

let w = new stream.Writable({
    objectMode: true,
    write(chunk, enc, cb) {
        console.log(chunk);
        cb();
    }
});

// Split a stream to 2 new streams.
let s = new StreamNWay(2, { objectMode: true });
s.children.forEach((c) => c.pipe(w));

// Pushing to `s` will pipe to the two splitter streams.
s.push("Stream me up");
s.push(null);
```
