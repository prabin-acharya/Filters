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

  // toSepia(scannedImage);

  // toNegative(scannedImage);

  reflectImage(scannedImage);

  displayImage(scannedImage);
});

//display image
function displayImage(image) {
  ctx.putImageData(image, 0, 0);
}

//Filters

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

//apply Negative filter
function toNegative(scannedImage) {
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const red = scannedData[i];
    const green = scannedData[i + 1];
    const blue = scannedData[i + 2];

    scannedData[i] = 255 - red;
    scannedData[i + 1] = 255 - green;
    scannedData[i + 2] = 255 - blue;
  }
}

//filter to reflect the image
function reflectImage(scannedImage) {
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length / (canvas.width * 4); i++) {
    for (let j = 0; j < (canvas.width * 4) / 2; j += 4) {
      swapPixels(
        scannedData,
        canvas.width * i * 4 + j,
        canvas.width * i * 4 + canvas.width * 4 - 4 - j
      );
    }
  }
}

function swapPixels(scannedData, pixel1, pixel2) {
  const tempPixel1 = {
    red: scannedData[pixel1],
    green: scannedData[pixel1 + 1],
    blue: scannedData[pixel1 + 2],
    alpha: scannedData[pixel1 + 3],
  };

  scannedData[pixel1] = scannedData[pixel2];
  scannedData[pixel1 + 1] = scannedData[pixel2 + 1];
  scannedData[pixel1 + 2] = scannedData[pixel2 + 2];
  scannedData[pixel1 + 3] = scannedData[pixel2 + 3];

  scannedData[pixel2] = tempPixel1.red;
  scannedData[pixel2 + 1] = tempPixel1.green;
  scannedData[pixel2 + 2] = tempPixel1.blue;
  scannedData[pixel2 + 3] = tempPixel1.alpha;
}
