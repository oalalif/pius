// src/server/server.js
require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  try {
    const model = await loadModel();
    server.app.model = model;
    console.log("Model loaded successfully");

    server.route(routes);

    server.ext("onPreResponse", (request, h) => {
      const response = request.response;

      if (response instanceof InputError) {
        return h.response({
          status: "fail",
          message: response.message,
        }).code(response.statusCode);
      }

      if (response.isBoom) {
        if (response.output.statusCode === 413) {
          return h.response({
            status: "fail",
            message: "Payload content length greater than maximum allowed: 1000000",
          }).code(413);
        }
        return h.response({
          status: "error",
          message: "Internal Server Error",
        }).code(500);
      }

      return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

init();