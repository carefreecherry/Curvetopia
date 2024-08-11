# Adobe GEN AI Project: Regularizing Irregular Doodles<br/>

# Overview<br/>

This project aims to regularize irregular doodles by detecting and correcting shapes within the doodles using deep learning models. The project involves using a YOLO model to detect shapes and their symmetry, followed by a Pix2Pix GAN to transform irregular shapes into regular shapes. The final output is a cleaned-up version of the original doodle with regularized shapes.

# Workflow<br/>

# 1.	Shape Detection and Symmetry using YOLO:<br/>
  •	The first step involves using a YOLO (You Only Look Once) model to detect various shapes and their symmetries within the doodle.<br/>
  •	The YOLO model was trained and fine-tuned in Google Colab.<br/>
  •	The model can identify different shapes and evaluate their symmetry, providing the initial data for the regularization process.<br/>


# 2.	Shape Regularization and Occlusion using Pix2Pix GAN:
  •	After detecting the shapes, a Pix2Pix GAN (Generative Adversarial Network) is used to transform irregular shapes into regular ones and for occlusion.<br/>
  •	The dataset for training the Pix2Pix GAN was generated using RoughJS, which creates mapped pairs of irregular and regular shapes.<br/>
  •	The GAN model takes an irregular shape as input and outputs a regularized version of the shape.<br/>

# Getting Started<br/>

# Dataset Generation <br/>
  To generate your own dataset, Clone DatasetGeneration directory. Follow the following steps:
  
  # prequsite: node.js

  ```npm install xmldom```

  ```npm install sharp```

  ```npm install --save roughjs```

  Change the path to the repository where the dataset is to be generated after line 1417 and run the file using following command:

  ```node generate.js```

# Datasets<br/>

  Pix2Pix GAN dataset: https://www.kaggle.com/datasets/vibhorsaxena2302/irregular-shapes/data<br/>
  YOLO dataset and Pix2Pix GAN trained model checkpoint: https://drive.google.com/drive/folders/1N0P4YyPvJ1TD_ljiZin23m7GOImTF0yS?usp=sharing<br/>
  
# Running the Pix2Pix Project Locally<br/>
  To run the Pix2Pix GAN locally, you will need access to a GPU and CUDA. Clone Pix2Pix_GAN directory. The following dependencies are required:<br/>
  	•	Python 3.x<br/>
   	•	CUDA (Best installed using anaconda)<br/>
  	•	cuDNN (Best installed using anaconda)<br/>
   	•	Tensorflow<br/>
  Simply download the dataset from the link provided and add them to the local repo. You can also use the model we trained with over 500,000 steps found in the dataset link and use 
  that checkpoint to produce images or train more.<br/>

# Running the Pix2Pix on Kaggle<br/>
  Alternatively, you can run the Pix2Pix GAN on Kaggle. The Kaggle notebook provided in the project repository contains all the necessary code and configuration to run and train the model.<br/>
  https://www.kaggle.com/code/vibhorsaxena2302/adobe<br/>

# Results<br/>

  The results of the shape regularization can be viewed in the results directory. Each input image is processed to output a regularized version of the shapes within the doodle.<br/>

# Acknowledgments<br/>

  •	The YOLO model was trained using resources available on Google Colab.<br/>
  •	The Pix2Pix GAN was developed and trained using PyTorch, with datasets generated using RoughJS.<br/>

