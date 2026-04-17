from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import requests
from io import BytesIO


def process_invader(image_url, n_clusters=2, resize_to=(20, 20)):
    """
    Process a mosaic invader image from a URL to normalize colors, generate a 2D array, and produce color codes.
    
    Args:
        image_url (str): URL to the mosaic image.
        n_clusters (int): Number of color clusters to identify.
        resize_to (tuple): Resize dimensions for the mosaic (width, height).
    
    Returns:
        tuple: 2D array of the mosaic and color codes.
    """
    # Fetch the image from the URL
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))

    # Resize image to match grid size
    image = image.resize(resize_to, Image.Resampling.NEAREST)

    # Convert image to RGB array
    image_data = np.array(image)

    # Reshape the image data for clustering (flatten the grid into RGB rows)
    pixels = image_data.reshape(-1, 3)

    # Perform K-Means clustering to identify dominant colors
    kmeans = KMeans(n_clusters=n_clusters, random_state=0).fit(pixels)
    labels = kmeans.labels_
    colors = kmeans.cluster_centers_

    # Map each pixel to its cluster
    quantized_image = labels.reshape(image_data.shape[:2])

    # Prepare the 2D array and color mappings
    mosaic_array = quantized_image.tolist()
    color_codes = {i: tuple(map(int, colors[i])) for i in range(n_clusters)}

    return mosaic_array, color_codes


def display_mosaic(mosaic_array, color_codes):
    """
    Display the processed mosaic using matplotlib.
    
    Args:
        mosaic_array (list): 2D array of the mosaic.
        color_codes (dict): Dictionary of color codes.
    """
    # Create a color palette for visualization
    palette = np.array([color for _, color in color_codes.items()]) / 255.0
    color_map = np.array([palette[label] for row in mosaic_array for label in row]).reshape(
        (len(mosaic_array), len(mosaic_array[0]), 3)
    )

    # Display the mosaic
    plt.imshow(color_map, interpolation="nearest")
    plt.axis("off")
    plt.show()


# Example Usage
if __name__ == "__main__":
    # URL to the image
    image_url = "https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/ae2d655a-b27e-4b21-32a9-25b674f49900/rectcontain3"

    # Process the image
    mosaic_array, color_codes = process_invader(image_url, n_clusters=20, resize_to=(18, 18))

    # Print results
    print("Mosaic Array:")
    print(mosaic_array)
    print("\nColor Codes:")
    print(color_codes)

    # Display the processed mosaic
    display_mosaic(mosaic_array, color_codes)