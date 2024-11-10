import pengendali from './pengendali.js';

const rute = [
  {
    path: '/predict',
    method: 'POST',
    handler: pengendali.postPrediksi,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: pengendali.getRiwayatPrediksi,
  },
];

export default rute;