import { Firestore } from '@google-cloud/firestore';

const db = new Firestore();
const koleksiPrediksi = db.collection('predictions');

async function simpanData(id, data) {
  try {
    await koleksiPrediksi.doc(id).set(data);
    return { success: true };
  } catch (error) {
    console.error('Galat saat menyimpan data:', error);
    return { success: false, error: 'Gagal menyimpan data' };
  }
}

export { koleksiPrediksi, simpanData };