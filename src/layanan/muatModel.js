import tf from '@tensorflow/tfjs-node';

async function muatModel() {
  return tf.loadGraphModel(process.env.MODEL_URL);
}

export { muatModel };