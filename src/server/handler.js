// src/server/handler.js
const { storeData } = require("../services/firestore-service");
const predictClassification = require("../services/inferenceService");
const InputError = require('../exceptions/InputError');

const postPredictHandler = async (request, h) => {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (!model) {
            throw new Error('Model not initialized');
        }

        if (!image) {
            throw new InputError('Image file is required');
        }

        // Get image buffer
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            image.on('data', (chunk) => chunks.push(chunk));
            image.on('end', () => resolve(Buffer.concat(chunks)));
            image.on('error', reject);
        });

        const prediction = await predictClassification(model, buffer);
        
        const data = {
            id: require('crypto').randomUUID(),
            ...prediction,
            createdAt: new Date().toISOString()
        };

        // Store prediction in Firestore
        await storeData(data.id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
    } catch (error) {
        if (error instanceof InputError) {
            throw error;
        }
        console.error('Prediction error:', error);
        throw new Error('Terjadi kesalahan dalam melakukan prediksi');
    }
};

module.exports = { postPredictHandler };