const showHideTools = document.querySelector(".show-hide-container");
const toolsContainer = document.querySelector(".tools-container");
const pencilWidgetContainer = document.querySelector(
  ".pencil-widget-container"
);
const eraserWidgetContainer = document.querySelector(
  ".eraser-widget-container"
);
const pencil = document.querySelector(".pencil");
const eraser = document.querySelector(".eraser");
const sticky = document.querySelector(".sticky");
const upload = document.querySelector(".upload");

let isToolShowing = true;
let pencilFlag = false;
let eraserFlag = false;

showHideTools.addEventListener("click", (e) => {
  const currentClass = showHideTools.children[0];
  isToolShowing = !isToolShowing;
  if (isToolShowing) {
    currentClass.classList.remove("arrow_downward");
    currentClass.classList.add("arrow_upward");
    currentClass.innerText = "arrow_upward";
    toolsContainer.style.display = "none";
    pencilWidgetContainer.style.display = "none";
    eraserWidgetContainer.style.display = "none";
  } else {
    currentClass.classList.remove("arrow_upward");
    currentClass.classList.add("arrow_downward");
    currentClass.innerText = "arrow_downward";
    toolsContainer.style.display = "flex";
  }
});

pencil.addEventListener("click", (e) => {
  eraserWidgetContainer.style.display = "none";
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    pencilWidgetContainer.style.display = "block";
    pencil.classList.add("current-selected");
  } else {
    pencilWidgetContainer.style.display = "none";
    pencil.classList.remove("current-selected");
  }
});

eraser.addEventListener("click", (e) => {
  pencilWidgetContainer.style.display = "none";
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    eraserWidgetContainer.style.display = "flex";
    eraser.classList.add("current-selected");
  } else {
    eraserWidgetContainer.style.display = "none";
    eraser.classList.remove("current-selected");
  }
});

sticky.addEventListener("click", (e) => {
  let stickyNoteTemplate = `
    <div class="sticky-header-container">
        <div class="minimize"></div>
        <div class="close"></div>
    </div>
    <div class="note-container">
        <textarea spellcheck="false"></textarea>
    </div>
  `;
  createStickyNoteTemplate(stickyNoteTemplate);
});

upload.addEventListener("click", (e) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    const file = input.files[0];
    const url = URL.createObjectURL(file);
    const stickyNoteTemplate = `
      <div class="sticky-header-container">
        <div class="minimize"></div>
        <div class="close"></div>
      </div>
      <div class="note-container">
          <img src=${url} alt="uploaded note"></img>
      </div>
    `;
    createStickyNoteTemplate(stickyNoteTemplate);
  });
});

function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the container at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the container on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the container, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

function createStickyNoteTemplate(stickyNoteTemplate) {
  let stickyNoteContainer = document.createElement("div");
  stickyNoteContainer.setAttribute("class", "sticky-note-container");
  stickyNoteContainer.innerHTML = stickyNoteTemplate;
  document.body.appendChild(stickyNoteContainer);

  let minimize = stickyNoteContainer.querySelector(".minimize");
  let close = stickyNoteContainer.querySelector(".close");
  noteActionables(stickyNoteContainer, minimize, close);

  stickyNoteContainer.addEventListener("mousedown", (e) => {
    dragAndDrop(stickyNoteContainer, e);
  });

  stickyNoteContainer.addEventListener("dragstart", () => {
    return false;
  });
}

function noteActionables(stickyNoteContainer, minimize, close) {
  close.addEventListener("click", (e) => {
    stickyNoteContainer.remove();
  });

  minimize.addEventListener("click", (e) => {
    const noteContainer = stickyNoteContainer.querySelector(".note-container");
    const displayValue =
      getComputedStyle(noteContainer).getPropertyValue("display");
    // console.log("displayValue:", displayValue); -> block

    if (displayValue === "none") {
      noteContainer.style.display = "block";
    } else {
      noteContainer.style.display = "none";
    }
  });
}
