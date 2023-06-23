let model, webcam, labelContainer, maxPredictions;

init();

// Load the image model and setup the webcam
async function init() {
    const modelURL = "https://teachablemachine.withgoogle.com/models/rdoB4-skr/model.json";
    const metadataURL = "https://teachablemachine.withgoogle.com/models/rdoB4-skr/metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    let highestEmotionValue = 0;
    let highestEmotion = 'neutral';
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (prediction[i].probability.toFixed(2) > highestEmotionValue) {
            highestEmotionValue = prediction[i].probability.toFixed(2);
            highestEmotion = prediction[i].className;
        }
    }

    localStorage.setItem('emotion', highestEmotion);
    console.log(highestEmotion);
}