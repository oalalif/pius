// src/server/server.js
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const config = require('../config');
const loadModel = require('../services/loadModel');
const ClientError = require('../exceptions/ClientError');

const createServer = async () => {
    // Pastikan TensorFlow backend terinisialisasi dengan benar
    const tf = require('@tensorflow/tfjs-node');
    await tf.ready();

    const server = Hapi.server({
        port: config.port,
        host: config.host,
        routes: {
            cors: config.cors,
            payload: {
                maxBytes: 1000000, // 1MB sesuai kriteria
                timeout: 30000,
                multipart: true,
                output: 'stream'
            }
        },
    });

    // Load model dengan proper error handling
    try {
        const model = await loadModel();
        if (!model) {
            throw new Error('Failed to load model');
        }
        server.app.model = model;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        server.app.modelError = error;
    }

    server.route(routes);

    // Error handling sesuai kriteria
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response.isBoom) {
            if (response.output.statusCode === 413) {
                return h.response({
                    status: 'fail',
                    message: 'Payload content length greater than maximum allowed: 1000000'
                }).code(413);
            }

            if (response.output.statusCode === 400) {
                return h.response({
                    status: 'fail',
                    message: 'Terjadi kesalahan dalam melakukan prediksi'
                }).code(400);
            }
        }

        if (response instanceof ClientError) {
            return h.response({
                status: 'fail',
                message: response.message,
            }).code(response.statusCode);
        }

        if (response instanceof Error) {
            console.error('Server Error:', response);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi'
            }).code(400); // Sesuai kriteria untuk error prediksi
        }

        return h.continue;
    });

    return server;
};

module.exports = createServer;