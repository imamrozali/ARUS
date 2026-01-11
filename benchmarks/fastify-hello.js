const Fastify = require('fastify');

const app = Fastify();

app.get('/', async (_, reply) => {
  reply.send('hello');
});

app.listen({ port: 3001 }, () => {
  console.log('Fastify Hello World server running on port 3001');
});