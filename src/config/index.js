// src/config/index.js
require('dotenv').config();

const config = {
    projectId: process.env.PROJECT_ID || 'submissionmlgc-fatahillah',
    bucketName: process.env.BUCKET_NAME || 'asclepius-models-submissionmlgc-fatahillah',
    collectionName: process.env.COLLECTION_NAME || 'predictions',
    modelPath: process.env.MODEL_PATH || 'https://storage.googleapis.com/asclepius-models-submissionmlgc-fatahillah/model/model.json',
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
    cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
    }
};

module.exports = config;