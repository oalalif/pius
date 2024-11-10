// src/index.js
require('dotenv').config();
const config = require('./config');
const createServer = require('./server/server');

const init = async () => {
    const server = await createServer();
    
    try {
        await server.start();
        console.log(`Server running on ${server.info.uri}`);
        console.log('Server Configuration:', {
            projectId: config.projectId,
            bucketName: config.bucketName,
            collectionName: config.collectionName,
            environment: process.env.NODE_ENV || 'development',
            modelPath: config.modelPath
        });
        
        // Handle shutdown gracefully
        process.on('SIGINT', async () => {
            console.log('Stopping server...');
            await server.stop();
            process.exit(0);
        });

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled rejection:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};