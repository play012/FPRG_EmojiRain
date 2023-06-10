const sess = new onnx.InferenceSession();
sess.loadModel("./EmojiRain.onnx");

async function processVideoFrames() {
  //Webcam stream
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const inputSize = 64;
  const inputTensorSize = 1 * 1 * inputSize * inputSize;
  canvas.width = inputSize;
  canvas.height = inputSize;

  function processFrame() {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const inputTensorData = new Float32Array(inputTensorSize);

    //Preprocessing
    const inputChannelData = imageData.data;
    for (let i = 0; i < inputSize; i++) {
      for (let j = 0; j < inputSize; j++) {
        const inputIndex = (0 * inputSize + i) * inputSize + j;
        const inputPixelIndex = (i * inputSize + j) * 4;
        const pixelValue = (inputChannelData[inputPixelIndex] + inputChannelData[inputPixelIndex + 1] + inputChannelData[inputPixelIndex + 2]) / 3 / 255;
        inputTensorData[inputIndex] = pixelValue;
      }
    }

    const inputTensor = new onnx.Tensor(inputTensorData, 'float32', [1, 1, inputSize, inputSize]);

    const outputMap = sess.run([inputTensor]);
    const outputTensor = outputMap.values().next().value;
    const outputData = outputTensor.data;

    const emotionLabels = ['neutral', 'happiness', 'surprise', 'sadness', 'anger', 'disgust', 'fear', 'contempt'];
    const scores = Array.from(outputData);
    const maxScoreIndex = scores.indexOf(Math.max(...scores));
    const predictedEmotion = emotionLabels[maxScoreIndex];

    switch (predictedEmotion) {
      case 'happiness':
        localStorage.setItem('emotion', 'smiling');
        break;
      case 'surprise':
        localStorage.setItem('emotion', 'astonished');
        break;
      case 'sadness':
        localStorage.setItem('emotion', 'frowning');
        break;
      case 'anger':
        localStorage.setItem('emotion', 'angry');
        break;
      case 'disgust':
        localStorage.setItem('emotion', 'nauseated');
        break;
      case 'fear':
        localStorage.setItem('emotion', 'fearful');
        break;
      case 'neutral':
      case 'contempt':
      default:
        break;
    }

    requestAnimationFrame(processFrame);
  }
  requestAnimationFrame(processFrame);
}

processVideoFrames().catch(error => {
  console.log('Keine Webcam gefunden:', error);
});