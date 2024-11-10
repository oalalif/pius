import { GalatMasukan } from '../kesalahan/GalatMasukan.js';
import tf from '@tensorflow/tfjs-node';

async function prediksiKlasifikasi(model, gambar) {
  try {
    const tensor = tf.node
      .decodeJpeg(gambar)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediksi = model.predict(tensor);
    const skor = await prediksi.data();
    const nilaiPrediksi = Math.max(...skor) * 100;
    const hasil = nilaiPrediksi > 50 ? 'Cancer' : 'Non-cancer';
    const saran = hasil === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    return { nilaiPrediksi, hasil, saran };
  } catch (error) {
    throw new GalatMasukan('Terjadi kesalahan dalam melakukan prediksi');
  }
}

export { prediksiKlasifikasi };