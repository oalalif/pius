// src/services/firestoreService.js
const { Firestore } = require('@google-cloud/firestore');

class FirestoreService {
  constructor() {
    this.db = new Firestore();
    this.collection = this.db.collection('predictions');
  }

  async storeData(id, data) {
    try {
      await this.collection.doc(id).set(data);
      return true;
    } catch (error) {
      console.error('Firestore store error:', error);
      throw new Error('Gagal menyimpan data prediksi');
    }
  }

  async getAllData() {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        history: doc.data()
      }));
    } catch (error) {
      console.error('Firestore fetch error:', error);
      throw new Error('Gagal mengambil riwayat prediksi');
    }
  }
}

module.exports = new FirestoreService();
