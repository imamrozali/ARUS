const Fastify = require('fastify');

const app = Fastify();

app.get('/', async (_, reply) => {
  reply.send({ message: 'hello', data: [1, 2, 3] });
});

app.listen({ port: 3004 }, () => {
  console.log('Fastify JSON server running on port 3004');
});