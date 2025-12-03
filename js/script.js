const URL = "./model/";  // path to your model folder

let model, webcam, labelContainer, maxPredictions;

// Load the Teachable Machine model
async function init() {
    console.log("Init function triggered");

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
    } catch (err) {
        console.error("Error loading model:", err);
        alert("Failed to load model. Check console for details.");
        return;
    }

    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup(); // request access
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Add webcam to page
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Setup label container
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Update webcam and predict
async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }
}

// Button click starts classification
document.getElementById("startButton").addEventListener("click", init);
