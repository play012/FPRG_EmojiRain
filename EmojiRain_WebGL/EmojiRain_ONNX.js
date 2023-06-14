const sess = new onnx.InferenceSession();
sess.loadModel("./emotion-ferplus-2.onnx");

async function processVideoFrames() {
  localStorage.setItem('emotion', '');

  //Webcam stream
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.autoplay = true;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const inputSize = 64;
  const inputTensorSize = 1 * 1 * inputSize * inputSize;

  async function processFrame() {
    const originalWidth = videoElement.videoWidth;
    const originalHeight = videoElement.videoHeight;
    const targetWidth = 64;
    const targetHeight = 64;

    const sourceAspectRatio = originalWidth / originalHeight;
    const targetAspectRatio = targetWidth / targetHeight;

    let scaledWidth, scaledHeight;
    if (sourceAspectRatio > targetAspectRatio) {
      scaledWidth = targetWidth;
      scaledHeight = Math.floor(targetWidth / sourceAspectRatio);
    } else {
      scaledWidth = Math.floor(targetHeight * sourceAspectRatio);
      scaledHeight = targetHeight;
    }

    const xOffset = Math.floor((targetWidth - scaledWidth) / 2);
    const yOffset = Math.floor((targetHeight - scaledHeight) / 2);

    context.drawImage(videoElement, 0, 0, originalWidth, originalHeight, xOffset, yOffset, scaledWidth, scaledHeight);

    const imageData = context.getImageData(xOffset, yOffset, scaledWidth, scaledHeight);
    const inputTensorData = new Float32Array(inputTensorSize);

    // Preprocessing
    const inputChannelData = imageData.data;
    for (let i = 0; i < inputSize; i++) {
      for (let j = 0; j < inputSize; j++) {
        const inputIndex = (0 * inputSize + i) * inputSize + j;
        const inputPixelIndex = (i * inputSize + j) * 4;
        const pixelValue = (inputChannelData[inputPixelIndex] + inputChannelData[inputPixelIndex + 1] + inputChannelData[inputPixelIndex + 2]) / 3;
        const normalizedPixelValue = (pixelValue - 127.5) / 127.5; // Normalize to the range [-1, 1]
        inputTensorData[inputIndex] = normalizedPixelValue;
      }
    }

    const inputTensor = new onnx.Tensor(inputTensorData, 'float32', [1, 1, inputSize, inputSize]);

    const outputMap = await sess.run([inputTensor]);
    console.log(outputMap.get('Plus692_Output_0').internalTensor.data);

    function softmax(arr) {
      const max = Math.max(...arr);
      const expArr = arr.map(x => Math.exp(x - max));
      const sumExp = expArr.reduce((sum, val) => sum + val, 0);
      return expArr.map(x => x / sumExp);
    }
    
    const outputArray = Array.from(outputMap.get('Plus692_Output_0').internalTensor.data);
    const softmaxValues = softmax(outputArray);
    console.log(softmaxValues);

    const highestEmotionValue = 0;

    outputMap.get('Plus692_Output_0').internalTensor.data.forEach(emotionValue => {
      Object.keys(emotionValue).forEach(emotionKey => {
        if (emotionValue[emotionKey] > highestEmotionValue) {
          highestEmotionValue = emotionValue[emotionKey];
        }
      });
    });

    const emotionLabels = ['neutral', 'happiness', 'surprise', 'sadness', 'anger', 'disgust', 'fear', 'contempt'];
    const predictedEmotion = emotionLabels[highestEmotionValue];

    console.log(predictedEmotion);

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
  videoElement.addEventListener('loadedmetadata', () => {
    requestAnimationFrame(processFrame); 
  });
}

processVideoFrames().catch(error => {
  console.log('Keine Webcam gefunden:', error);
});