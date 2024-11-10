// backend/src/services/storage-service.js
const { Storage } = require('@google-cloud/storage');
const config = require('../config/index');

class StorageService {
  constructor() {
    this.storage = new Storage();
    this.bucket = this.storage.bucket(config.bucketName);
  }

  async downloadModel() {
    const modelPath = config.modelPath;
    const localPath = '/tmp/model.json';
    
    await this.bucket.file(modelPath).download({ destination: localPath });
    return localPath;
  }
}

module.exports = StorageService;