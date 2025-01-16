const video = document.getElementById("video");
const result = document.getElementById("result");
let model;

// Load the Teachable Machine model
async function loadModel() {
    model = await tmImage.load("path_to_your_model/model.json", "path_to_your_model/metadata.json");
    startVideo();
}

// Start video streaming
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing camera:", error);
        });
}

// Verify the ticket
async function verifyTicket() {
    const prediction = await model.predict(video);

    // Check if a known face is detected
    const knownFace = prediction.some(pred => pred.probability > 0.8);

    const idInput = document.getElementById("id-input").value.trim();
    const response = await fetch("database.json");
    const data = await response.json();

    if (knownFace && data.valid_ids.includes(idInput)) {
        result.innerHTML = "Ticket Verified! Welcome aboard.";
        result.style.color = "green";
    } else {
        result.innerHTML = "Verification Failed! Please try again.";
        result.style.color = "red";
    }
}

// Load the model when the page is loaded
window.onload = loadModel;
