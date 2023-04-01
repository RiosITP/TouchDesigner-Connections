// Socket.io 
let socket = io();

// global variables
//let p;
let poseNet; // variable for poseNet instance
let poses = []; // array to store any detected poses
let video; 


// When the model is loaded. Log sucess message
function modelLoaded() {
  console.log("Model Loaded!");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Load ml5 Posenet Model
  poseNet = ml5.poseNet(video, modelLoaded);

  // when a pose is detected
  poseNet.on("pose", (results) => {
    poses = results;
  
    if (poses.length > 0) {
      // get the keys of the first detected pose
      let keys = poses[0].pose.keypoints;
      // keypoint information will be formatted as an array of JSON objects each containing
      // a confidence score, part name, and x,y position of that part. 
     
      // Create an array to eventually send to Touchdesigner
      let pointsToTD = [];

      // loop through all the available keypoints
      for (let i=0; i < keys.length; i++){
        // pass only the values (not JSON objects) into an array
        let pointInfo = [];
        pointInfo[0] = keys[i].part;
        pointInfo[1] = keys[i].position.x;
        pointInfo[2] = keys[i].position.y;

        // add array values to eventually be sent to TD
        pointsToTD[i] = pointInfo;
      }
      //send array of posenet points to TouchDesigner
      socket.emit("poses", pointsToTD);
     // console.log(pointsToTD) // log feedback if you need it
    }
  });
}
// Listen for when the socket connects
socket.on("connect", function () {
  // Log a success message
  console.log("HEY I'VE CONNECTED");
});

function draw() {
  // draw image and points 
  background(255);
  image(video, 0, 0);
  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}
