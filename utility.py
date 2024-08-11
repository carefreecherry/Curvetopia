import csv
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import cv2
import os

from inference_sdk import InferenceHTTPClient

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="U7OLH6RE6X2yzFFLxdEJ"
)

def classify(img_path):
    return CLIENT.infer(img_path, model_id="shapes-hdylu/3")

colours = ['red', 'blue', 'green', 'yellow', 'black']

def read_csv(csv_path): 
    np_path_XYs = np.genfromtxt(csv_path, delimiter=',')
    path_XYs = []
    for i in np.unique(np_path_XYs[:, 0]):
        npXYs = np_path_XYs[np_path_XYs[:, 0] == i][:, 1:]
        XYs = []
        for j in np.unique(npXYs[:, 0]):
            XY = npXYs[npXYs[:, 0] == j][:, 1:]
            XYs.append(XY)
        path_XYs.append(XYs)
    return path_XYs

def plot(paths_XYs):
    fig, ax = plt.subplots(tight_layout=True, figsize=(8, 8))
    for i, XYs in enumerate(paths_XYs):
        c = colours[i % len(colours)]
        for XY in XYs:
            ax.plot(XY[:, 0], XY[:, 1], c=c, linewidth=2)
    ax.set_aspect('equal')
    plt.show()

def create_image_from_csv(path, show=False):
    path_XYs = read_csv(path)
    r_max = 0
    for i, XYs in enumerate(path_XYs):
        c_r = np.max([np.hypot(points[:, 0].max(), points[:, 1].max()) for points in XYs])
        if c_r > r_max:
            r_max = c_r

    # Image size needs to be specified as (width, height)
    r_max = int(r_max)
    image_array = np.full((r_max, r_max), 255, dtype=np.uint8)

    # Iterate through each path group
    for group in path_XYs:
        for sub_group in group:
            # Assuming each sub_group is a 2D array where each row is [y, x, intensity]
            for point in sub_group:
                x = int(point[0])
                y = int(point[1])
                # Check if intensity is provided
                if len(point) > 2:
                    intensity = int(point[2])
                else:
                    intensity = 0  # Max intensity for white if not provided
                
                # Set the pixel value at (x, y)
                image_array[y, x] = intensity

    # Create an image from the array
    image = Image.fromarray(image_array, 'L')  # 'L' for grayscale
    image_cv = np.array(image)  # Convert PIL image to a numpy array
    image_cv = cv2.cvtColor(image_cv, cv2.COLOR_GRAY2BGR)  # Convert grayscale to BGR (if needed)
    image_cv = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)  # Convert BGR to grayscale (if was in color)
    image_cv = cv2.GaussianBlur(image_cv, (5, 5), 0)
    
    if show:
        Image.fromarray(image_cv, 'L').show()

    return image_cv

def create_csv_from_image(image_path, output_csv_path):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    height, width = image.shape

    pixel_data = []

    for y in range(height):
        for x in range(width):
            intensity = image[y, x]
            pixel_data.append([x, y, intensity])

    with open(output_csv_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["x", "y", "intensity"])
        writer.writerows(pixel_data)

    print(f"CSV file created at {output_csv_path}")


def resize_image_to_256x256(image_path):
    with Image.open(image_path) as img:
        # Resize the image to 256x256
        resized_img = img.resize((256, 256), Image.LANCZOS)
        
        resized_img.save(image_path)
        print(f"Resized image saved at {image_path}")

def resize_all_images_in_directory(directory_path):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith((".png", ".jpg", ".jpeg")): 
                image_path = os.path.join(root, file)
                resize_image_to_256x256(image_path)

def resize_original(image, original_size):
    resized_image = cv2.resize(image, (original_size[1], original_size[0]), interpolation=cv2.INTER_AREA)
    return resized_image
