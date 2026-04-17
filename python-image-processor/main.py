# import cv2
# import numpy as np
# from datetime import datetime

# np.set_printoptions(threshold=np.inf)

# # Load the image
# image_path = 'map.png'
# image = cv2.imread(image_path)

# # Check if image was loaded properly
# if image is None:
#   raise ValueError("Could not load the image. Check the path.")

# # Convert to grayscale (simplifying the example to one channel)
# gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Normalize the grayscale values to fit in 0-10 range
# # Max value in grayscale is 255, so we divide by 25.5 to map it to 0-10
# quantized_image = (gray_image // 25.5).astype(int)

# # Optionally, resize the image to a specific size X x Y
# desired_size_x = 100  # for example
# desired_size_y = 100  # for example
# resized_image = cv2.resize(quantized_image, (desired_size_x, desired_size_y),
#                            interpolation=cv2.INTER_NEAREST)

# # # Display the quantized and resized image (for verification)
# # cv2.imshow('Quantized Image',
# #            resized_image * 25.5)  # scale back up for viewing
# # cv2.waitKey(0)
# # cv2.destroyAllWindows()

# # Print the 2D array (or save/export it as needed)
# f = open(f"map.txt{datetime.now()}", "a")
# f.write(str(resized_image.tolist()))
# f.close()

# print(resized_image)
from PIL import Image
import os

# Load the image
image_path = "map.png"  # Update with your image path
image = Image.open(image_path)

# Get image dimensions
image_width, image_height = image.size

# Set grid size
grid_size = 15

# Calculate the dimensions of each grid cell
cell_width = image_width // grid_size
cell_height = image_height // grid_size

# Create a directory to store the grid cells
output_dir = "grid_cells"  # Update with your desired output path
os.makedirs(output_dir, exist_ok=True)

# Split the image into a 100x100 grid
for row in range(grid_size):
    for col in range(grid_size):
        # Calculate the coordinates of the current cell
        left = col * cell_width
        upper = row * cell_height
        right = left + cell_width
        lower = upper + cell_height

        # Crop the cell from the image
        cell = image.crop((left, upper, right, lower))

        # Save the cell as a separate file
        cell_filename = f"cell_{row}_{col}.png"
        cell.save(os.path.join(output_dir, cell_filename))

print("Image has been successfully split into a 100x100 grid and saved.")
