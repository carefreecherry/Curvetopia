from matplotlib import pyplot as plt
import utility
import os
import cv2

csv_path = 'problems/isolated.csv'
temp_image_dir = 'temp_image/image.png'
final_image_dir = 'result/image.png'
final_csv_dir = 'result/image.csv'

path = utility.read_csv(csv_path)

image = utility.create_image_from_csv(csv_path)

cv2.imwrite(temp_image_dir, image)

original_size = image.shape[:2]

utility.resize_image_to_256x256(temp_image_dir)

resized_image = cv2.imread(temp_image_dir)

###PROCESS###

print(utility.classify(resized_image))
output_image = resized_image

resized_back_image = utility.resize_original(output_image, original_size)

cv2.imwrite(final_image_dir, resized_back_image)

utility.create_csv_from_image(final_image_dir, final_csv_dir)

#CLEAR DIRECTORY###
os.remove(temp_image_dir)
os.remove(final_image_dir)
os.remove(final_csv_dir)
