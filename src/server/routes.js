// src/server/routes.js
const handler = require('./handler');

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
                allow: 'multipart/form-data',
            },
            handler: handler.postPredictHandler,
        },
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: handler.getHistoriesHandler,
    },
];

module.exports = routes;