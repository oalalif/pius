import 'dotenv/config.js';
import Hapi from '@hapi/hapi';
import rute from './rute.js';
import { muatModel } from '../layanan/muatModel.js';
import { GalatMasukan } from '../kesalahan/GalatMasukan.js';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 1000000,
      },
    },
  });

  const model = await muatModel();
  server.app.model = model;

  server.route(rute);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof GalatMasukan) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      newResponse.code(response.kodeStatus);
      return newResponse;
    }

    if (response.isBoom) {
      if (response.output.statusCode === 413) {
        return h.response({
          status: 'fail',
          message: 'Payload content length greater than maximum allowed: 1000000',
        }).code(413);
      }
      
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.output.statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();