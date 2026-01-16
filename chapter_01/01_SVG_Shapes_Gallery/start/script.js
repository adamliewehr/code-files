const line = document.getElementById("testLine");
const circle = document.getElementById("circle");
const group = document.getElementById("group");

function handleMouseMove(event) {
  const clientX = event.clientX;
  const clientY = event.clientY;
  line.setAttribute("x1", clientX);
  line.setAttribute("y1", clientY);
  group.setAttribute("fill", `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`)

  circle.setAttribute("r", Math.floor(clientX / 5));
}

document.addEventListener("mousemove", handleMouseMove);
