const handler = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
      payload: {
        maxBytes: 1000000, // 1MB limit for uploads
        output: 'stream',
        parse: true,
        multipart: true,
      },
    },
    handler: handler.postPredictHandler, // Use the correct handler function name
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: handler.getHistoriesHandler, // Use the correct handler function name
  },
];

module.exports = routes;
