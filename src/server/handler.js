// src/server/handler.js
const firestoreService = require('../services/firestoreService');
const predictClassification = require('../services/inferenceService');
const InputError = require('../exceptions/InputError');
const crypto = require('crypto');

const postPredictHandler = async (request, h) => {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    if (!image) {
      throw new InputError('Image is required');
    }

    const result = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const data = {
      id,
      ...result,
      createdAt: timestamp
    };

    await firestoreService.storeData(id, data);

    return h.response({
      status: 'success',
      message: 'Prediksi berhasil dilakukan',
      data
    }).code(201);
  } catch (error) {
    if (error instanceof InputError) {
      throw error;
    }
    console.error('Handler error:', error);
    throw new Error('Terjadi kesalahan pada server');
  }
};

const getHistoryHandler = async (request, h) => {
  try {
    const histories = await firestoreService.getAllData();
    return h.response({
      status: 'success',
      data: histories
    }).code(200);
  } catch (error) {
    console.error('History fetch error:', error);
    throw new Error('Gagal mengambil riwayat');
  }
};

module.exports = { postPredictHandler, getHistoryHandler };