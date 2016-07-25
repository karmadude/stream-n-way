function exampleCreate() {
  let stream = require("stream");
  let StreamNWay = require("../index");

  let w = new stream.Writable({
      objectMode: true,
      write(chunk, enc, cb) {
          console.log(chunk);
          cb();
      }
  });

  let s = new StreamNWay(2, { objectMode: true });
  s.children.forEach((c) => c.pipe(w));

  s.push("Stream me up");
  s.push(null);
}

exampleCreate();
