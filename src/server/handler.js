// src/server/handler.js
const { storeData, getHistories } = require("../services/firestore-service");
const predictClassification = require("../services/inferenceService");
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');

const postPredictHandler = async (request, h) => {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (!model) {
            throw new Error('Model not initialized');
        }

        if (!image) {
            throw new InputError('Image is required');
        }

        const { confidenceScore, label, suggestion } = await predictClassification(model, image);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Prediction completed successfully',
            data
        }).code(201);
    } catch (error) {
        if (error instanceof InputError) {
            throw error;
        }
        console.error('Prediction error:', error);
        throw new Error('Failed to process prediction');
    }
};

const getHistoriesHandler = async (request, h) => {
    try {
        const predictions = await getHistories();
        return h.response({
            status: 'success',
            data: predictions
        }).code(200);
    } catch (error) {
        console.error('Get histories error:', error);
        throw new Error('Failed to retrieve histories');
    }
};

module.exports = { postPredictHandler, getHistoriesHandler };

