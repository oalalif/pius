// src/services/modelService.js
const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  try {
    const modelPath = process.env.MODEL_PATH || 'https://storage.googleapis.com/asclepius-models-submissionmlgc-fatahillah/model/model.json';
    const model = await tf.loadGraphModel(modelPath);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Model loading error:', error);
    throw new Error('Gagal memuat model');
  }
}

module.exports = loadModel;