// src/services/inferenceService.js
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, imageBuffer) {
  try {
    if (!model || !imageBuffer) {
      throw new InputError('Invalid input parameters');
    }

    const tensor = tf.node
      .decodeJpeg(new Uint8Array(imageBuffer), 3)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .div(255.0);

    const prediction = await model.predict(tensor).data();
    const confidenceScore = prediction[0] * 100;

    const threshold = 50;
    const label = confidenceScore > threshold ? 'Cancer' : 'Non-cancer';
    const suggestion = label === 'Cancer' 
      ? 'Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut.'
      : 'Anda terlihat sehat. Tetap jaga kesehatan kulit Anda.';

    tensor.dispose();

    return { label, suggestion, confidenceScore: parseFloat(confidenceScore.toFixed(2)) };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new InputError('Gagal melakukan prediksi gambar');
  }
}

module.exports = predictClassification;