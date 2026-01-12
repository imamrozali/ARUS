const { createServer } = require("http");
const { Pipeline } = require("@arusjs/core");
const { HttpAdapter } = require("@arusjs/adapter-http");

const pipeline = new Pipeline([
  (ctx) => {
    ctx.response.body = "hello";
  },
]);

const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => {
  adapter.handle(req, res);
});

server.listen(3000, () => {
  console.log("ARUSJS Hello World server running on port 3000");
});
