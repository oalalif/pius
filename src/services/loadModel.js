// src/services/loadModel.js
const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  try {
    return await tf.loadGraphModel(
      process.env.MODEL_PATH || "https://storage.googleapis.com/asclepius-models-submissionmlgc-fatahillah/model/model.json"
    );
  } catch (error) {
    console.error("Error loading model:", error);
    throw new Error("Failed to load model");
  }
}

module.exports = loadModel;