// Open and connect socket
let socket = io();

// Listen for when the socket connects
socket.on("connect", function () {
  // Log a success message
  console.log("HEY I'VE CONNECTED");
});

let video;
let predictions = [];

// Create a new handpose method
let handpose;
let keys;

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// Listen to new 'pose' events
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelLoaded);
  // Listen to new 'hand' events
  handpose.on('hand', results => {
    predictions = results;

    if (predictions.length > 0) {
      // 2d array of x,y,z values for each hand keypoint
      keys = predictions[0].landmarks;

      // use socket to send hand pose data to TouchDesigner
      // use the 'poses' label and send the keys array to TD
      socket.emit("poses", keys);
      // console.log(keys);
    }
  });
}

function draw() {
  background(255);
  image(video, 0, 0);
  drawKeypoints();
}

function drawKeypoints() {
  if(predictions.length  > 0){
    fill(0, 255, 0);
    noStroke();

    let handpoints = predictions[0].landmarks;
    // If a hand is detected, loop through all the keypoints of the hand and draw it
    for (let j = 0; j < handpoints.length; j++) {
      // store each point
      let keypoint = handpoints[j];
      // draw an ellipse at each point's x and y coordinate
      ellipse(keypoint[0], keypoint[1], 10, 10);  
    } 
  }
}

