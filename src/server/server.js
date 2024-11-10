const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('../config');
const loadModel = require('../services/loadModel');
const ClientError = require('../exceptions/ClientError');

const createServer = async () => {
    const server = Hapi.server({
        port: config.port,
        host: config.host,
        routes: {
            cors: config.cors,
            payload: {
                maxBytes: 1000000, // 1MB limit sesuai kriteria
                timeout: 30000,
                multipart: true // Enable multipart untuk handle file upload
            }
        },
    });

    // Load model before registering routes
    try {
        const model = await loadModel();
        server.app.model = model;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        throw error;
    }

    // Register routes
    server.route(routes);

    // Error handling
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response.isBoom) {
            // Handle payload too large
            if (response.output.statusCode === 413) {
                return h.response({
                    status: 'fail',
                    message: 'Payload content length greater than maximum allowed: 1000000'
                }).code(413);
            }

            // Handle Not Found
            if (response.output.statusCode === 404) {
                return h.response({
                    status: 'fail',
                    message: 'Route not found'
                }).code(404);
            }
        }

        // Handle Client Errors
        if (response instanceof ClientError) {
            return h.response({
                status: 'fail',
                message: response.message,
            }).code(response.statusCode);
        }

        // Handle Server Errors
        if (response instanceof Error) {
            console.error('Server Error:', response);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            }).code(400);
        }

        return h.continue;
    });

    return server;
};

module.exports = createServer;