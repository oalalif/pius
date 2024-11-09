require('dotenv').config(); // Load .env file

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const ClientError = require('../exceptions/ClientError');

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'], // Allow all origins
      },
    },
  });

  // Register routes from routes.js
  server.route(routes);

  // Optional: Initialize or load the model at server start
  try {
    await loadModel(); // Assuming loadModel is an async function to load your model
    console.log('Model loaded successfully');
  } catch (error) {
    console.error('Failed to load model:', error);
    process.exit(1);
  }

  // Handle custom errors in responses
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    // Handle ClientError (including InputError)
    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    // Handle generic errors
    if (response instanceof Error) {
      console.error(response);
      return h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      }).code(500);
    }

    return h.continue; // Continue with normal response handling if no errors
  });

  // Start the server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  return server;
};

// Run the server initialization
createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = createServer;