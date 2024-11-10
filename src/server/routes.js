// src/server/routes.js
const { postPredictHandler, getAllDataHandler } = require("./handler");

const routes = [
  {
    path: "/predict",
    method: "POST",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1000000,
        output: "stream",
        parse: true,
      },
    },
  },
  {
    path: "/predict/histories",
    method: "GET",
    handler: getAllDataHandler,
  },
];

module.exports = routes;