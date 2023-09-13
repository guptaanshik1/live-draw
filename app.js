const express = require("express");
const socket = require("socket.io");

const app = express();
app.use(express.static("public"));

const PORT = 4000;

const server = app.listen(PORT, () =>
  console.log(`Server started on PORT: ${PORT}`)
);

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Socket connection has been made successfully");

  const START_PATH = "startPath";
  const START_FILL = "startFill";
  const UNDO_REDO = "undoRedo";
  const CLEAR_ALL = "clearAll";
  const NOTE_SHARE = "noteShare";

  socket.on(START_PATH, (data) => {
    // Transfer to connect sockets
    io.sockets.emit(START_PATH, data);
  });

  socket.on(START_FILL, (data) => {
    io.sockets.emit(START_FILL, data);
  });

  socket.on(UNDO_REDO, (data) => {
    io.sockets.emit(UNDO_REDO, data);
  });

  socket.on(CLEAR_ALL, (data) => {
    io.sockets.emit(CLEAR_ALL, data);
  });
});
