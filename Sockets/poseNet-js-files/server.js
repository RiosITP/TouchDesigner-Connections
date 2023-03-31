/*
Remixed from Jeeyoon Hyun 
DILP Spring 2022 Example
GLITCH / P5 / ML5 / Socket.io / Express.js Server: https://glitch.com/edit/#!/touchdesigner-socketio-example
Slides: https://docs.google.com/presentation/d/1iBB_EnlbGAiYLzmgeq5UjMoTRkQ_Ua5wmsHzjLH4nrA/edit?usp=sharing 
TouchDesigner project file: https://drive.google.com/file/d/1kBZ8WwvvPN1g0EyIpWxel-tiSZiID30K/view?usp=sharing 
Jeeyoon Hyun https://jeeyoonhyun.com/ 

This uses the 2.0.x version of socket.io because currently
the TouchDesigner socketio DAT only supports version 2.
Check https://docs.derivative.ca/SocketIO_DAT and update to version 4 in the future.
*/

const express = require("express");
const app = express();

// Use Express to create a webserver.
const server = require("http").createServer(app);
const options = {
  /* ... */
};

// Create a socket server using Socket.io v2 implementation over the Express webserver
const io = require("socket.io")(server, options);
app.use(express.static("public"));

// serve the p5.js index.html file when you connect the client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// When a client connects log feedback, start listening for pose data from p5/ml5 
io.on("connection", (socket) => {
  // log a connection for feedback
  console.log("Client Connected with ID: ", socket.id);
  // in sketch.js send the posenet data to this server with the label 'poses'
  // This connected socket listens for incoming messages labeled 'poses'
  // incoming values are stored in the 'data' object
  socket.on("poses", function (data) {
    // Log the data that came in
    //console.log(data);
    // Use a different label, 'poses', when emitting the pose data back out to TouchDesigner (and any other connected socket) 
    io.emit("pose", data);
  });
});

// Express server will listen on port 3000 (change this number as needed, change the url to match)
// point your web browser to localhost://3000  
// (Chrome is recommended) 
server.listen(3000, () => {
  console.log("listening on *:3000");
});
