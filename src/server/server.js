// src/server/server.js
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/modelService');
const ClientError = require('../exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  try {
    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', (request, h) => {
      const { response } = request;

      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message
        }).code(response.statusCode);
      }

      if (response instanceof Error) {
        console.error(response);
        return h.response({
          status: 'error',
          message: 'Internal Server Error'
        }).code(500);
      }

      return h.continue;
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

init();