// src/services/loadModel.js
const tf = require('@tensorflow/tfjs-node');
const config = require('../config/index');
const { Storage } = require('@google-cloud/storage');

async function loadModel() {
    try {
        // Inisialisasi Google Cloud Storage
        const storage = new Storage();
        const bucket = storage.bucket(config.bucketName);
        
        // Load model dari Cloud Storage
        const model = await tf.loadLayersModel(config.modelPath);
        console.log('Model loaded successfully from Cloud Storage');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;