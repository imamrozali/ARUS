const { createServer } = require("http");
const { Pipeline } = require("@arusjs/core");
const { HttpAdapter } = require("@arusjs/adapter-http");

const pipeline = new Pipeline([
  (ctx) => {
    ctx.response.body = JSON.stringify({ message: "hello", data: [1, 2, 3] });
    ctx.response.headers["Content-Type"] = "application/json";
  },
]);

const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => {
  adapter.handle(req, res);
});

server.listen(3003, () => {
  console.log("ARUSJS JSON server running on port 3003");
});
