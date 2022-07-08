const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

const image = new Image();
image.src = "DALLE.png";

image.addEventListener("load", () => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const scannedImage_grayscale = grayscale(scannedImage);

  ctx.putImageData(scannedImage_grayscale, 0, 0);
});

//apply grayscale filter
function grayscale(scannedImage) {
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
    const averageColorValue = total / 3;
    scannedData[i] = averageColorValue;
    scannedData[i + 1] = averageColorValue;
    scannedData[i + 2] = averageColorValue;
  }
  scannedImage.data = scannedData;
  return scannedImage;
}
