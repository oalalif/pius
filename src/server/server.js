const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('../config');
const loadModel = require('../services/loadModel');
const ClientError = require('../exceptions/ClientError');

const createServer = async () => {
    const server = Hapi.server({
        port: config.port,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Load model before registering routes
    try {
        const model = await loadModel(config.modelPath); // Menggunakan config.modelPath
        server.app.model = model;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        process.exit(1);
    }

    // Register routes after model is loaded
    server.route(routes);

    // Error handling
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
                message: 'Internal Server Error',
            }).code(500);
        }
        return h.continue;
    });

    return server;
};

module.exports = createServer;
