from PIL import Image
import os

height = 10
width = 10

# Load the image
image_path = 'mappy.png'  # replace with your image file
output_folder = 'images'

# Create the output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Open the image
with Image.open(image_path) as img:
    # Get image dimensions
    img_width, img_height = img.size

    # Calculate slice dimensions
    slice_width = img_width // width
    slice_height = img_height // height

    # Loop over rows and columns to save each slice
    for row in range(height):
        for col in range(width):
            # Calculate the box (left, upper, right, lower) for each slice
            left = col * slice_width
            upper = row * slice_height
            right = left + slice_width
            lower = upper + slice_height
            
            # Crop the slice and save it
            slice_img = img.crop((left, upper, right, lower))
            slice_img.save(f'{output_folder}/slice_{row}_{col}.png')