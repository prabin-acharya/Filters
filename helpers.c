#include "helpers.h"
#include <math.h>
#include <stdbool.h>

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


void swap( RGBTRIPLE *pixel1, RGBTRIPLE *pixel2)
{
    RGBTRIPLE temp = *pixel1;
    *pixel1 = *pixel2;
    *pixel2 = temp;
}
// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
     for(int i = 0; i < height; i++)
    {
        for(int j = 0; j < width / 2; j++)
        {
            swap(&image[i][j], &image[i][width - 1 - j]);
        }
    }
    return;
}

bool is_valid(int i, int j, int height, int width)
{
    return i >= 0 && i < height && j >=0 && j < width;
}

//Function that returns blurred pixel
RGBTRIPLE boxblur_pixel(int i,int j, int height, int width, RGBTRIPLE image[height][width] )
{
    int redvalue, bluevalue, greenvalue;
    redvalue = bluevalue = greenvalue = 0;
    int numofvalidpixel = 0;

    for(int di = -1; di <= 1; di++ )
    {
        for(int dj = -1; dj <= 1; dj++)
        {
            int new_i = i + di;
            int new_j = j + dj;
            if(is_valid(new_i, new_j, height, width))
            {
                numofvalidpixel++;
                redvalue += image[new_i][new_j].rgbtRed;
                greenvalue += image[new_i][new_j].rgbtGreen;
                bluevalue += image[new_i][new_j].rgbtBlue;
            }
            else
            {
                //Do nothing
            }
        }
    }
    RGBTRIPLE blurred_pixel;
    blurred_pixel.rgbtRed = round((float)(redvalue / numofvalidpixel));
    blurred_pixel.rgbtGreen = round((float)(greenvalue / numofvalidpixel));
    blurred_pixel.rgbtBlue = round((float)(bluevalue / numofvalidpixel));
    return blurred_pixel;
}

// Blur image
void blur(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE new_image[height][width];
     for(int i = 0; i < height; i++)
    {
        for(int j = 0; j < width; j++)
        {
            new_image[i][j] = boxblur_pixel(i, j, height, width, image);
        }
    }
    for(int i = 0; i < height; i++)
        for(int j = 0; j < width; j++)
            image[i][j] = new_image[i][j];

    return;

}
