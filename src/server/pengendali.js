import { prediksiKlasifikasi } from '../layanan/layananPrediksi.js';
import { simpanData, koleksiPrediksi } from '../layanan/layananData.js';
import crypto from 'crypto';

async function postPrediksi(permintaan, h) {
  const { image } = permintaan.payload;
  const { model } = permintaan.server.app;

  const { nilaiPrediksi, hasil, saran } = await prediksiKlasifikasi(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: hasil,
    suggestion: saran,
    createdAt,
  };

  await simpanData(id, data);
  return h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  }).code(201);
}

async function getRiwayatPrediksi(permintaan, h) {
  const riwayat = (await koleksiPrediksi.get()).docs.map(doc => doc.data());
  const data = riwayat.map(item => ({
    id: item.id,
    history: item,
  }));
  return h.response({ status: 'success', data }).code(200);
}

export default { postPrediksi, getRiwayatPrediksi };