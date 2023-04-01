/*
Remixed from Jeeyoon Hyun, DILP Spring 2022 Example
GLITCH / P5 / Sockets / Server: https://glitch.com/edit/#!/touchdesigner-socketio-example
Slides: https://docs.google.com/presentation/d/1iBB_EnlbGAiYLzmgeq5UjMoTRkQ_Ua5wmsHzjLH4nrA/edit?usp=sharing 
TouchDesigner project file: https://drive.google.com/file/d/1kBZ8WwvvPN1g0EyIpWxel-tiSZiID30K/view?usp=sharing 
Jeeyoon Hyun: https://jeeyoonhyun.com/

This uses the 2.0.x version of socket.io because currently
the TouchDesigner socketio DAT only supports version 2.
Check https://docs.derivative.ca/SocketIO_DAT and update to version 4 in the future.
*/

const express = require("express");
const app = express();


// version 2 code
const server = require("http").createServer(app);
const options = {
  /* ... */
};
const io = require("socket.io")(server, options);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("HELLO", socket.id);
  // This connected socket listens for incoming messages called 'data'
  socket.on("video", function (data) {
    // Log the data that came in
    console.log(data);
    // Send it back out to everyone
    io.emit("video", data);
  });
  socket.on("x", function (data) {
    // Log the data that came in
    console.log(data);
    // Send it back out to everyone
    io.emit("x", data);
  });

  socket.on("poses", function (data) {
    // Log the data that came in
    //console.log(data);
    // Send it back out to everyone
    io.emit("pose", data);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
