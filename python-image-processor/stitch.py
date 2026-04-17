import os
from PIL import Image, ImageDraw, ImageOps, ImageFont

# Set the grid size
grid_size = 10
border_size = 1

# Create a list to store the grid cells
grid_cells = []

# Define font for the text
# You can specify the path to a truetype font file and the desired size
font = ImageFont.truetype("CaskaydiaCoveNerdFont-Bold.ttf", 90)
# For simplicity, we'll use the default PIL font scaled up
# font = ImageFont.load_default()

# Calculate the font size 2x bigger
font_size = 20  # You can adjust this size based on your needs
font = ImageFont.truetype(font.path, font_size)

# Load the grid cells, add a 1px black border, and number each cell
for row in range(grid_size):
    row_cells = []
    for col in range(grid_size):
        cell_filename = f"grid_cells/cell_{row}_{col}.png"
        cell = Image.open(cell_filename)

        # Add border
        cell_with_border = ImageOps.expand(cell, border=border_size, fill='black')

        # Add text
        # draw = ImageDraw.Draw(cell_with_border)
        # text = f"{row},{col}"
        # text_bbox = draw.textbbox((0, 0), text, font=font)
        # text_width = text_bbox[2] - text_bbox[0]
        # text_height = text_bbox[3] - text_bbox[1]
        # text_x = (cell_with_border.width - text_width) // 2
        # text_y = (cell_with_border.height - text_height) // 2
        # draw.text((text_x, text_y), text, font=font, fill='blue')

        row_cells.append(cell_with_border)
    grid_cells.append(row_cells)

# Get the dimensions of each cell with border
cell_width, cell_height = grid_cells[0][0].size

# Create a new image to stitch the cells together
stitched_image = Image.new('RGB', (cell_width * grid_size, cell_height * grid_size))

# Paste each cell into the new image
for row in range(grid_size):
    for col in range(grid_size):
        cell = grid_cells[row][col]
        stitched_image.paste(cell, (col * cell_width, row * cell_height))

# Save the stitched image
stitched_image.save("stitched_image_with_border_and_numbers.png")

print("Grid cells have been successfully stitched together into one image with borders and numbers.")
