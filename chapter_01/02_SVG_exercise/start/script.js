

function handleMouseMove(event) {

  // console.log("mouseMoved!");
}

document.addEventListener("mousemove", handleMouseMove);

const canvas = document.getElementById("canvas")

function handleMouseClick(event) {

  const clientX = event.clientX;
  const clientY = event.clientY;

  canvas.innerHTML += `<circle cx="${clientX}" cy="${clientY}" r="20" fill="black" />`;

}


document.addEventListener("click", handleMouseClick);
