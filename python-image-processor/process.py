import os
import cv2
import numpy as np
import json

np.set_printoptions(threshold=np.inf)

# Create the maps directory if it doesn't exist
os.makedirs("maps", exist_ok=True)

gridSize = 10

def getNumColors(num):
    return 255 / num

# Function to process an image and return quantized data
def process_image(image_path):
    # Load the image
    image = cv2.imread(image_path)

    # Check if image was loaded properly
    if image is None:
        raise ValueError(f"Could not load the image: {image_path}")

    # Convert to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Normalize the grayscale values to fit in 0-4 range (5 colors)
    quantized_image = (gray_image // getNumColors(6)).astype(int)

    # Resize the image to the specified grid size
    resized_image = cv2.resize(
        quantized_image, (gridSize, gridSize), interpolation=cv2.INTER_NEAREST
    )

    return resized_image.tolist()

# Dictionary to hold all grid cells data
grid_cells_data = {}

# Directory containing grid cell images
grid_cells_dir = "invader"

# Loop through each file in the grid_cells directory
for filename in os.listdir(grid_cells_dir):
    if filename.endswith(".png"):
        # Get the grid cell position from the filename (without extension)
        grid_cell_pos = os.path.splitext(filename)[0]
        image_path = os.path.join(grid_cells_dir, filename)

        # Process the image and add the quantized data to the dictionary
        grid_cells_data[grid_cell_pos] = process_image(image_path)

# Save all grid cells data to a single JSON file
output_json_path = os.path.join("maps", "grid_cells_data_invader.json")
with open(output_json_path, "w") as json_file:
    json.dump(grid_cells_data, json_file, indent=4)

print("All grid cells have been processed and saved to grid_cells_data.json.")