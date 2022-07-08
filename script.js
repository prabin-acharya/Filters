const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 512;
canvas.height = 512;

const image = new Image();
image.src = "DALLE.png";

image.addEventListener("load", () => {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const scannedImageOriginal = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // toGrayscale(scannedImage);

  toSepia(scannedImage);

  displayImage(scannedImage);
});

//apply grayscale filter
function toGrayscale(scannedImage) {
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const red = scannedData[i];
    const green = scannedData[i + 1];
    const blue = scannedData[i + 2];

    const averageColorValue = (red + green + blue) / 3;

    scannedData[i] = averageColorValue;
    scannedData[i + 1] = averageColorValue;
    scannedData[i + 2] = averageColorValue;
  }
}

//apply sepia filter
function toSepia(scannedImage) {
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const red = scannedData[i];
    const green = scannedData[i + 1];
    const blue = scannedData[i + 2];

    const newRed = red * 0.393 + green * 0.769 + blue * 0.189;
    const newGreen = red * 0.349 + green * 0.686 + blue * 0.168;
    const newBlue = red * 0.272 + green * 0.534 + blue * 0.131;

    scannedData[i] = newRed;
    scannedData[i + 1] = newGreen;
    scannedData[i + 2] = newBlue;
  }
}

//display image
function displayImage(image) {
  ctx.putImageData(image, 0, 0);
}
