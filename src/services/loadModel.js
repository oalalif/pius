require('dotenv').config();
const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        const modelPath = process.env.MODEL_PATH;
        
        // Check if MODEL_PATH is set in environment variables
        if (!modelPath) {
            throw new Error('MODEL_PATH is not defined in environment variables.');
        }

        console.log(`Attempting to load model from: ${modelPath}`);
        
        // Attempt to load the model
        const model = await tf.loadGraphModel(modelPath);
        
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        // Log the specific error details
        console.error('Error loading model:', error.message);
        
        // Throw a more general error for further handling
        throw new Error('Failed to load model from MODEL_PATH.');
    }
}

module.exports = loadModel;
