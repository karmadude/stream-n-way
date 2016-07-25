"use strict";

const stream = require("stream");

const noop = function() {};

function createReadableStream(options) {
  let s = new stream.Readable(options);
  s._read = noop;
  return s;
}

class StreamNWay extends stream.Readable {
  constructor(n = 0, options = {}) {
    super(options);

    this.children = new Array(n);
    for (let i=0; i < n; i++) {
      this.children[i] = options.streamAtIndex ? options.streamAtIndex(i, options) : createReadableStream(options);
    }
    
    this.on("data", (d) => {
      this.children.forEach((s) => s.write ? s.write(d) : s.push(d));
    });
  }

  _read(size) {
    //noop
  }
}

module.exports = StreamNWay;
