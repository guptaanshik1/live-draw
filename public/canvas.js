const canvas = document.querySelector("canvas");
const pencilColors = document.querySelectorAll(".pencil-colors");
const pencilWidth = document.querySelector(".pencil-range");
const eraserWidth = document.querySelector(".eraser-range");
const download = document.querySelector(".download");
const redo = document.querySelector(".redo");
const undo = document.querySelector(".undo");
const clearAll = document.querySelector(".clear_all");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isMouseDown = false;

let pencilColor = "black";
let pencilWidthValue = pencilWidth.value;
let eraserColor = "white";
let eraserWidthValue = eraserWidth.value;

let traceUndoRedo = [];
let track = 0;

const tool = canvas.getContext("2d");

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidthValue;

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  const data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit(START_PATH, data);
});

pencilColors.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    pencilColor = colorElem.classList[1];
    tool.strokeStyle = colorElem.classList[1];
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    const data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : pencilColor,
      width: eraserFlag ? eraserWidthValue : pencilWidthValue,
    };
    socket.emit(START_FILL, data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  isMouseDown = false;

  traceUndoRedo.push(canvas.toDataURL());
  track = traceUndoRedo.length - 1;
});

function startPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function startFill(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.strokeStyle = tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

pencilWidth.addEventListener("change", (e) => {
  pencilWidthValue = pencilWidth.value;
  tool.lineWidth = pencilWidthValue;
});

eraserWidth.addEventListener("change", (e) => {
  eraserWidthValue = eraserWidth.value;
  tool.lineWidth = pencilWidthValue;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidthValue;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidthValue;
  }
});

redo.addEventListener("click", () => {
  if (track < traceUndoRedo.length - 1) track++;

  let data = {
    track,
    traceUndoRedo,
  };
  socket.emit(UNDO_REDO, data);
});

undo.addEventListener("click", () => {
  if (track > 0) track--;

  let data = {
    track,
    traceUndoRedo,
  };

  socket.emit(UNDO_REDO, data);
});

download.addEventListener("click", (e) => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  a.download = "draw.jpg";
  a.click();
});

function undoRedoAction(traceObj) {
  const { track, traceUndoRedo } = traceObj;

  const img = new Image();
  img.src = traceUndoRedo[track];
  img.addEventListener("load", (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  });
}

clearAll.addEventListener("click", (e) => {
  let data = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };
  socket.emit(CLEAR_ALL, data);
  // tool.clearRect(0, 0, canvas.width, canvas.height);
});

function clearAllAction(data) {
  tool.clearRect(data.x, data.y, data.width, data.height);
}

socket.on(START_PATH, (data) => {
  startPath(data);
});

socket.on(START_FILL, (data) => {
  startFill(data);
});

socket.on(UNDO_REDO, (data) => {
  undoRedoAction(data);
});

socket.on(CLEAR_ALL, (data) => {
  clearAllAction(data);
});
