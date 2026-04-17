import os
from PIL import Image

# Load the image
image_path = "map-more-manhattan.png"  # Update with your image path
image = Image.open(image_path)

# Set the grid size
grid_size = 5

# Get image dimensions
image_width, image_height = image.size

# Calculate the dimensions of each grid cell
cell_width = image_width // grid_size
cell_height = image_height // grid_size

# Create a directory to store the grid cells
output_dir = "grid_cells"  # Update with your desired output path
os.makedirs(output_dir, exist_ok=True)

# Split the image into a 10x10 grid
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

print("Image has been successfully split into a 10x10 grid and saved.")
