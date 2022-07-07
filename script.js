const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

const image = new Image();
image.src = "DALLE.png";
ctx.drawImage(image, 0, 0);

image.addEventListener("load", () => {
  ctx.drawImage(image, 0, 0, 512, 512);
});
