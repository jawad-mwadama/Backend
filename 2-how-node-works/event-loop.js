const fs = require("fs");

setTimeout(() => {
  (console.log("Timer 1 is finished"), 0);
});

setImmediate(() => {
  console.log("Immediate 1 is finished");
});

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("------------------");
  setTimeout(() => {
    (console.log("Timer 2 is finished"), 0);
  });

  setTimeout(() => {
    (console.log("Timer 3 is finished"), 3000);
  });

  setImmediate(() => {
    console.log("Immediate 2 is finished");
  });

  process.nextTick(() => {
    console.log("Process.nextTick");
  });
});

console.log("Hello from the top level code");
