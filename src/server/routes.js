// src/server/routes.js
const { postPredictHandler, getHistoryHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
      payload: {
        maxBytes: 1000000,
        output: 'stream',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data'
      },
      handler: postPredictHandler
    }
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: getHistoryHandler
  }
];

module.exports = routes;