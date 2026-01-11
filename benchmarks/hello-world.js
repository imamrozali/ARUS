const { createServer } = require('http');
const { Pipeline } = require('@arus/core');
const { HttpAdapter } = require('@arus/adapter-http');

const pipeline = new Pipeline([
  (ctx) => {
    ctx.response.body = 'hello';
  }
]);

const adapter = new HttpAdapter(pipeline);

const server = createServer((req, res) => {
  adapter.handle(req, res);
});

server.listen(3000, () => {
  console.log('ARUS Hello World server running on port 3000');
});