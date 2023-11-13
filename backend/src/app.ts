import dotenv from 'dotenv';
import fastifyCors from 'fastify-cors';
import buildServer from "./server";

dotenv.config(); 

const server = buildServer();

server.register(fastifyCors, {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

async function main() {
  const port = process.env.PORT || 8000;

  try {
    await server.listen(port, "0.0.0.0");

    console.log(`listen http://localhost:${port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
