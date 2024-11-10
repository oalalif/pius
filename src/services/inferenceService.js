// src/services/inferenceService.js
const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = (await prediction.data())[0];
    const confidenceScore = score * 100;

    const classes = ["Cancer", "Non-cancer"];
    const classResult = confidenceScore > 50 ? 0 : 1;
    const label = classes[classResult];

    const suggestion = label === "Cancer" 
      ? "Kamu terindikasi Cancer, Segera ke dokter!"
      : "Kamu tidak terindikasi Cancer, Kamu Sehat!";

    // Cleanup
    tensor.dispose();
    prediction.dispose();

    return { label, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predictClassification;