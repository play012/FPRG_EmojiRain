const sess = new onnx.InferenceSession();
const loadingModelPromise = sess.loadModel("./EmojiRain.onnx");