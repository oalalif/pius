// src/services/loadData.js
const { Firestore } = require("@google-cloud/firestore");

async function getAllData() {
  const db = new Firestore();
  const snapshotData = await db.collection("predictions").get();
  return snapshotData.docs.map((doc) => ({
    id: doc.id,
    history: doc.data(),
  }));
}

module.exports = getAllData;