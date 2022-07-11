const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const image = new Image();
image.src = "machine.png";

image.addEventListener("load", () => {
  //adjust image size
  if (image.width > image.height) {
    canvas.width = 512;
    canvas.height = (512 / image.width) * image.height;
  } else if (image.width < image.height) {
    canvas.height = 512;
    canvas.width = (512 / image.height) * image.width;
  } else {
    canvas.width = 512;
    canvas.height = 512;
  }

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

  // reflectImage(scannedImage);

  //Here we need two images because we are modifying the pixel w.r.t other pixel around it, so we need to keep the original image
  //and the modified image
  // blurImage(scannedImage, scannedImageOriginal);

  edgeDetection(scannedImage, scannedImageOriginal);

  displayImage(scannedImage);
});

//display image
function displayImage(image) {
  ctx.putImageData(image, 0, 0);
}

//Filters

//apply grayscale filter
function toGrayscale(scannedImage) {
  const imageData = scannedImage.data;

  for (let i = 0; i < imageData.length; i += 4) {
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];

    const averageColorValue = (red + green + blue) / 3;

    imageData[i] = averageColorValue;
    imageData[i + 1] = averageColorValue;
    imageData[i + 2] = averageColorValue;
  }
}

//apply sepia filter
function toSepia(scannedImage) {
  const imageData = scannedImage.data;

  for (let i = 0; i < imageData.length; i += 4) {
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];

    const newRed = red * 0.393 + green * 0.769 + blue * 0.189;
    const newGreen = red * 0.349 + green * 0.686 + blue * 0.168;
    const newBlue = red * 0.272 + green * 0.534 + blue * 0.131;

    imageData[i] = newRed;
    imageData[i + 1] = newGreen;
    imageData[i + 2] = newBlue;
  }
}

//apply Negative filter
function toNegative(scannedImage) {
  const imageData = scannedImage.data;

  for (let i = 0; i < imageData.length; i += 4) {
    const red = imageData[i];
    const green = imageData[i + 1];
    const blue = imageData[i + 2];

    imageData[i] = 255 - red;
    imageData[i + 1] = 255 - green;
    imageData[i + 2] = 255 - blue;
  }
}

//filter to reflect the image
function reflectImage(scannedImage) {
  const imageData = scannedImage.data;

  for (let i = 0; i < imageData.length / (canvas.width * 4); i++) {
    for (let j = 0; j < (canvas.width * 4) / 2; j += 4) {
      swapPixels(
        imageData,
        canvas.width * i * 4 + j,
        canvas.width * i * 4 + canvas.width * 4 - 4 - j
      );
    }
  }
}

function swapPixels(imageData, pixel1, pixel2) {
  const tempPixel1 = {
    red: imageData[pixel1],
    green: imageData[pixel1 + 1],
    blue: imageData[pixel1 + 2],
    alpha: imageData[pixel1 + 3],
  };

  imageData[pixel1] = imageData[pixel2];
  imageData[pixel1 + 1] = imageData[pixel2 + 1];
  imageData[pixel1 + 2] = imageData[pixel2 + 2];
  imageData[pixel1 + 3] = imageData[pixel2 + 3];

  imageData[pixel2] = tempPixel1.red;
  imageData[pixel2 + 1] = tempPixel1.green;
  imageData[pixel2 + 2] = tempPixel1.blue;
  imageData[pixel2 + 3] = tempPixel1.alpha;
}

//apply blur filter
function blurImage(scannedImage, scannedImageOriginal) {
  const imageData = scannedImage.data;

  const imageDataOriginal = scannedImageOriginal.data;

  for (let i = 0; i < imageData.length / (canvas.width * 4); i++) {
    for (let j = 0; j < canvas.width * 4; j += 4) {
      boxblur_pixel(imageData, imageDataOriginal, i, j);
    }
  }
}

//3*3 box blur
function boxblur_pixel(imageData, imageDataOriginal, i, j) {
  let red, green, blue;
  red = green = blue = 0;
  let numOfValidPixels = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const pixel = getPixel(imageDataOriginal, i + x, j + y * 4);

      if (pixel) {
        red += pixel.red;
        green += pixel.green;
        blue += pixel.blue;
        numOfValidPixels++;
      }
    }
  }
  const averageRed = red / numOfValidPixels;
  const averageGreen = green / numOfValidPixels;
  const averageBlue = blue / numOfValidPixels;

  imageData[i * canvas.width * 4 + j] = averageRed;
  imageData[i * canvas.width * 4 + j + 1] = averageGreen;
  imageData[i * canvas.width * 4 + j + 2] = averageBlue;
}

function getPixel(imageData, i, j) {
  return {
    red: imageData[i * canvas.width * 4 + j],
    green: imageData[i * canvas.width * 4 + j + 1],
    blue: imageData[i * canvas.width * 4 + j + 2],
  };
}

//edge detection
function edgeDetection(scannedImage, scannedImageOriginal) {
  const scannedData = scannedImage.data;

  const imageDataOriginal = scannedImageOriginal.data;

  for (let i = 0; i < scannedData.length / (canvas.width * 4); i++) {
    for (let j = 0; j < canvas.width * 4; j += 4) {
      sobelOperator_pixel(scannedData, imageDataOriginal, i, j);
    }
  }
}

function sobelOperator_pixel(scannedData, imageDataOriginal, i, j) {
  let Gx_red, Gx_green, Gx_blue, Gy_red, Gy_green, Gy_blue;
  Gx_red = Gx_green = Gx_blue = Gy_red = Gy_green = Gy_blue = 0;
  let numOfValidPixels = 0;

  const Gx = [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ];

  const Gy = [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
  ];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const pixel = getPixel(imageDataOriginal, i + x, j + y * 4);

      if (pixel) {
        Gx_red += pixel.red * Gx[x + 1][y + 1];
        Gx_green += pixel.green * Gx[x + 1][y + 1];
        Gx_blue += pixel.blue * Gx[x + 1][y + 1];

        Gy_red += pixel.red * Gy[x + 1][y + 1];
        Gy_green += pixel.green * Gy[x + 1][y + 1];
        Gy_blue += pixel.blue * Gy[x + 1][y + 1];

        numOfValidPixels++;
      }
    }
  }

  const finalRed = Math.round(Math.sqrt(Gx_red * Gx_red + Gy_red * Gy_red));
  const finalGreen = Math.round(
    Math.sqrt(Gx_green * Gx_green + Gy_green * Gy_green)
  );
  const finalBlue = Math.round(
    Math.sqrt(Gx_blue * Gx_blue + Gy_blue * Gy_blue)
  );

  scannedData[i * canvas.width * 4 + j] = finalRed > 255 ? 255 : finalRed;
  scannedData[i * canvas.width * 4 + j + 1] =
    finalGreen > 255 ? 255 : finalGreen;
  scannedData[i * canvas.width * 4 + j + 2] = finalBlue > 255 ? 255 : finalBlue;
}
