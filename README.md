# Adobe GEN AI Project: Regularizing Irregular Doodles

# Overview

This project aims to regularize irregular doodles by detecting and correcting shapes within the doodles using deep learning models. The project involves using a YOLO model to detect shapes and their symmetry, followed by a Pix2Pix GAN to transform irregular shapes into regular shapes. The final output is a cleaned-up version of the original doodle with regularized shapes.

# Workflow

# 1.	Shape Detection using YOLO:
  •	The first step involves using a YOLO (You Only Look Once) model to detect various shapes and their symmetries within the doodle.
  •	The YOLO model was trained and fine-tuned in Google Colab.
  •	The model can identify different shapes and evaluate their symmetry, providing the initial data for the regularization process.


# 2.	Shape Regularization using Pix2Pix GAN:
  •	After detecting the shapes, a Pix2Pix GAN (Generative Adversarial Network) is used to transform irregular shapes into regular ones and for occlusion.
  •	The dataset for training the Pix2Pix GAN was generated using RoughJS, which creates mapped pairs of irregular and regular shapes.
	•	The GAN model takes an irregular shape as input and outputs a regularized version of the shape.

# Getting Started

# Datasets

  Pix2Pix GAN dataset: https://www.kaggle.com/datasets/vibhorsaxena2302/irregular-shapes/data
  YOLO dataset and Pix2Pix GAN trained model checkpoint: https://drive.google.com/drive/folders/1N0P4YyPvJ1TD_ljiZin23m7GOImTF0yS?usp=sharing
  
# Running the Pix2Pix Project Locally
  To run the Pix2Pix GAN locally, you will need access to a GPU and CUDA. The following dependencies are required:
  	•	Python 3.x
   	•	CUDA (Best installed using anaconda)
  	•	cuDNN (Best installed using anaconda)
   	•	Tensorflow
  Simply download the dataset from the link provided and add them to the local repo. You can also use the model we trained with over 500,000 steps found in the dataset link and use that checkpoint to produce images or train more.

# Running the Project on Kaggle
  Alternatively, you can run the Pix2Pix GAN on Kaggle. The Kaggle notebook provided in the project repository contains all the necessary code and configuration to run and train the model. https://www.kaggle.com/code/vibhorsaxena2302/adobe

# Results

  The results of the shape regularization can be viewed in the results directory. Each input image is processed to output a regularized version of the shapes within the doodle.

# Acknowledgments

  •	The YOLO model was trained using resources available on Google Colab.
	•	The Pix2Pix GAN was developed and trained using PyTorch, with datasets generated using RoughJS.

