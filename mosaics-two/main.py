import cv2
import numpy as np

np.set_printoptions(threshold=np.inf) 

# Load the image
image_path = 'images/slice_0_0.png'
image = cv2.imread(image_path)

# Check if image was loaded properly
if image is None:
  raise ValueError("Could not load the image. Check the path.")

# Convert to grayscale (simplifying the example to one channel)
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Normalize the grayscale values to fit in 0-10 range
# Max value in grayscale is 255, so we divide by 25.5 to map it to 0-10
quantized_image = (gray_image // 42.5).astype(int)

# Optionally, resize the image to a specific size X x Y
desired_size_x = 75  # for example
desired_size_y = 100  # for example
resized_image = cv2.resize(quantized_image, (desired_size_x, desired_size_y),
                           interpolation=cv2.INTER_NEAREST)

# # Display the quantized and resized image (for verification)
# cv2.imshow('Quantized Image',
#            resized_image * 25.5)  # scale back up for viewing
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# Print the 2D array (or save/export it as needed)
f = open("map.json", "a")
f.write(str(resized_image.tolist()))
f.close()

print(resized_image)