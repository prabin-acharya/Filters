#include "helpers.h"
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    for(int i = 0; i < height; i++)
    {
        for(int j = 0; j < width; j++)
        {
            RGBTRIPLE pixel = image[i][j];
            int average = round((pixel.rgbtBlue + pixel.rgbtGreen)/3.0);

            image[i][j].rgbtBlue = image[i][j].rgbtGreen = average;
        }
    }
    return;
}

int cap(int value)
{
    return value > 255 ? 255 : value;
}

// Convert image to sepia
void sepia(int height, int width, RGBTRIPLE image[height][width])
{
     for(int i = 0; i < height; i++)
    {
        for(int j = 0; j < width; j++)
        {
            RGBTRIPLE temp = image[i][j];
            int originalRed = temp.rgbtRed;
            int originalBlue = temp.rgbtBlue;
            int originalGreen = temp.rgbtGreen;
            image[i][j].rgbtRed =  cap(round(0.393 * originalRed + 0.769 * originalGreen + 0.189 * originalBlue));
            image[i][j].rgbtGreen =  cap(round(0.349 * temp.rgbtRed + 0.686 * temp.rgbtGreen + 0.168 * temp.rgbtBlue));
            image[i][j].rgbtBlue = cap(round( 0.272 * temp.rgbtRed + 0.534 * temp.rgbtGreen + 0.131 * temp.rgbtBlue));
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    return;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    return;
}
