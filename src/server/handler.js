// src/server/handler.js
const storeData = require("../services/storeData");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const loadAllData = require("../services/loadData");
const InputError = require("../exceptions/InputError");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    if (!image) {
      throw new InputError("Image is required");
    }

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    }).code(201);
  } catch (error) {
    if (error instanceof InputError) {
      throw error;
    }
    console.error("Prediction error:", error);
    throw new Error("Failed to process prediction");
  }
}

async function getAllDataHandler(request, h) {
  try {
    const allData = await loadAllData();
    return h.response({
      status: "success",
      data: allData,
    }).code(200);
  } catch (error) {
    console.error("Get histories error:", error);
    throw new Error("Failed to retrieve histories");
  }
}

module.exports = { postPredictHandler, getAllDataHandler };