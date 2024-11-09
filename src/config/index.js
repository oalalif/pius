// backend/src/config/index.js
require('dotenv').config();

const config = {
  projectId: process.env.PROJECT_ID,
  bucketName: process.env.BUCKET_NAME,
  collectionName: process.env.COLLECTION_NAME,
  modelPath: process.env.MODEL_PATH,
  port: process.env.PORT || 8080,
};

module.exports = config;