// src/services/firestore-service.js
const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

const firestore = new Firestore({
    projectId: config.projectId,
});

const storeData = async (id, data) => {
    try {
        const docRef = firestore.collection(config.collectionName).doc(id);
        await docRef.set({
            id: data.id,
            result: data.result,
            suggestion: data.suggestion,
            createdAt: data.createdAt
        });
        return true;
    } catch (error) {
        console.error('Firestore error:', error);
        throw error;
    }
};

module.exports = { storeData };
