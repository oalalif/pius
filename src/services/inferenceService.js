const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, imageBuffer) {
    if (!model) {
        throw new InputError('Model not initialized');
    }

    if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
        throw new InputError('Invalid image data. Please provide a valid image file.');
    }

    try {
        // Convert buffer to Uint8Array
        const uint8Array = new Uint8Array(imageBuffer);
        
        // Decode and preprocess image
        const imageTensor = tf.node.decodeImage(uint8Array, 3);
        const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
        const normalizedImage = resizedImage.div(255.0);
        const batchedImage = normalizedImage.expandDims(0);

        // Run prediction
        const prediction = await model.predict(batchedImage);
        const probabilities = await prediction.data();
        
        // Calculate confidence score and determine result
        const confidenceScore = Math.max(...probabilities);
        const result = confidenceScore > 0.5 ? 'Cancer' : 'Non-cancer';
        const suggestion = result === 'Cancer' 
            ? "Segera periksa ke dokter!"
            : "Penyakit kanker tidak terdeteksi.";

        // Cleanup tensors
        tf.dispose([imageTensor, resizedImage, normalizedImage, batchedImage, prediction]);

        return {
            result,
            suggestion
        };
    } catch (error) {
        console.error('Prediction error:', error);
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

module.exports = predictClassification;