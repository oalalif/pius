// src/services/inferenceService.js
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    if (!model || !image) {
        throw new InputError('Invalid input parameters');
    }

    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const prediction = await model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        let label, suggestion;

        if (confidenceScore > 50) {
            label = 'Cancer';
            suggestion = "Segera konsultasi dengan dokter terdekat untuk pemeriksaan lebih lanjut.";
        } else {
            label = 'Non-cancer';
            suggestion = "Tetap jaga kesehatan kulit dan hindari paparan sinar UV secara berlebihan.";
        }

        // Cleanup
        tensor.dispose();
        prediction.dispose();

        return { confidenceScore, label, suggestion };
    } catch (error) {
        console.error('Prediction error:', error);
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

module.exports = predictClassification;
