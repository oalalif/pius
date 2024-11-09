const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

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

  async getAllHistories() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      history: doc.data(),
    }));
  }
}

module.exports = FirestoreService;
 
module.exports = { storeData, getHistories }
