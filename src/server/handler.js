const storeData = require("../services/storeData");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const loadAllData = require("../services/loadData");
const InputError = require("../exceptions/InputError");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully", // Mengubah pesan respons sesuai dengan yang diharapkan
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error instanceof InputError) {
      return h
        .response({
          status: "failed",
          message: error.message,
        })
        .code(error.statusCode);
    } else {
      console.error("An unexpected error occurred:", error);
      return h
        .response({
          status: "failed",
          message: "An unexpected error occurred",
        })
        .code(500);
    }
  }
}

async function getAllDataHandler(request, h) {
  try {
    const allData = await loadAllData();
    const response = h.response({
      status: "success",
      data: allData,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return h
      .response({
        status: "failed",
        message: "An unexpected error occurred",
      })
      .code(500);
  }
}

module.exports = { postPredictHandler, getAllDataHandler };
