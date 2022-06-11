# Filters
Program to apply filters like Grayscale, Sepia, Reflect and Blur to Bitmap images.

**Compile**
```
$ make filter
```

**Then, you can run the program by running:**
```
$ ./filter -g images/stadium.bmp output/stadium_grayscale.bmp
```
which takes the image at images/stadium.bmp, and generates a new image called stadium_grayscale.bmp at output/ after running the pixels through the grayscale function.  

You can also use flag:  
`-s` for Sepia   
`-r` for Reflection  
`-b` for for Blur  



