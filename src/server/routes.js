// backend/src/routes.js
const handler = require('./handlers');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
      payload: {
        maxBytes: 1000000, // 1MB limit for uploads
        output: 'stream',  // Outputs data as a stream, useful for handling large files
        parse: true,       // Automatically parse the incoming request
        multipart: true,   // Allows multipart form data, e.g., file uploads
      },
    },
    handler: handler.predict, // Updated handler reference
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: handler.getHistories, // Updated handler reference
  },
];

module.exports = routes;