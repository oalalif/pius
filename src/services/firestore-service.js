const { Firestore } = require('@google-cloud/firestore');
const config = require('../config'); // Ensure config is correctly imported if needed

// Define standalone async function
async function storeData(id, data) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

// FirestoreService class definition
class FirestoreService {
  constructor() {
    this.firestore = new Firestore({
      projectId: config.projectId,
    });
    this.collection = this.firestore.collection(config.collectionName);
  }

  async saveResult(id, result, createdAt) {
    await this.collection.doc(id).set({
      result,
      createdAt,
      suggestion: result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Anda sehat!',
      id,
    });
  }

  async getHistories() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      history: doc.data(),
    }));
  }
}

// Export all necessary modules
module.exports = { FirestoreService, storeData };
