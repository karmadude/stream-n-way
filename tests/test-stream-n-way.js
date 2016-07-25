const tape = require("tape");
const stream = require("stream");
const StreamNWay = require("../index");

tape("StreamNWay is a readable stream", function(t) {
  t.plan(1);

  
  let w = new stream.Writable({
    objectMode: true,
    write(chunk, enc, cb) {
      t.equal(chunk, "test read", "received data from stream");
      cb();
    }
  });

  let s = new StreamNWay(0, { objectMode: true });
  s.pipe(w);

  s.push("test read");
  s.push(null);
});

tape("stream0Way", function(t) {
  let s = new StreamNWay();
  t.equal(s.children.length, 0, "has no child streams");
  t.end();
});

tape("stream1Way", function(t) {
  let s = new StreamNWay(1);
  t.equal(s.children.length, 1, "has 1 child stream");
  t.end();
});

tape("streamNWay", function(t) {
  let s = new StreamNWay(5);
  t.equal(s.children.length, 5, "has 5 child streams");
  t.end();
});

tape("Data pushed to StreamNWay can be piped from all child streams", function(t) {
  const n = 5;

  t.plan(n);

  
  let w = new stream.Writable({
    objectMode: true,
    write(chunk, enc, cb) {
      t.equal(chunk, "test read", "received data from stream");
      cb();
    }
  });

  let s = new StreamNWay(n, { objectMode: true });
  s.children.forEach((c) => c.pipe(w));

  s.push("test read");
  s.push(null);
});

tape("Can provide custom streams as children", function(t) {
  const n = 5;

  t.plan(n);

  class TR extends stream.Transform {
    constructor(options) {
      super(options);
    }

    _transform(chunk, end, cb) {
      cb(null, chunk + " tr");
    }
  }
  
  let w = new stream.Writable({
    objectMode: true,
    write(chunk, enc, cb) {
      t.equal(chunk, "test read tr", "received transformed data from custom stream");
      cb();
    }
  });

  let s = new StreamNWay(n, { objectMode: true, streamAtIndex: (i, options) => new TR(options) });
  s.children.forEach((c) => c.pipe(w));

  s.push("test read");
  s.push(null);
});
