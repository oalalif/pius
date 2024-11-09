require('dotenv').config(); // Load .env file

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    if (response instanceof Error) {
      console.error(response);
      return h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      }).code(500);
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
