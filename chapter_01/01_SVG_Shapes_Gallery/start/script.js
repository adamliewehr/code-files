const line = document.getElementById("testLine");
const circle = document.getElementById("circle");

function handleMouseMove(event) {
  const clientX = event.clientX;
  const clientY = event.clientY;
  line.setAttribute("x1", clientX);
  line.setAttribute("y1", clientY);

  circle.setAttribute("r", Math.floor(clientX / 5));
}

document.addEventListener("mousemove", handleMouseMove);
