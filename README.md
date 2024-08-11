# Adobe GEN AI Project: Regularizing Irregular Doodles<br/>

# Overview<br/>

This project regularizes irregular doodles using deep learning. A YOLO model detects shapes and evaluates symmetry, while a Pix2Pix GAN corrects occlusion and transforms irregular shapes into regular ones. Trained on RoughJS datasets, the models work together to produce cleaned-up doodles with regularized shapes. Leveraging resources like Google Colab, Kaggle, and PyTorch, the project ensures efficient training and execution.

# Workflow<br/>

  # 1.	CSV to Image:<br/>
  •	The first step involves converting given csv file into image of 256x256 size.<br/>
  
  # 2.	Shape Detection and Symmetry using YOLO:<br/>
  •	The next step involves using a YOLO (You Only Look Once) model to detect various shapes and their symmetries within the doodle.<br/>
  •	The YOLO model was trained and fine-tuned in Google Colab.<br/>
  •	The model can identify different shapes and evaluate their symmetry, providing the initial data for the regularization process.<br/>


  # 3.	Shape Regularization and Occlusion using Pix2Pix GAN:
  •	After detecting the shapes, a Pix2Pix GAN (Generative Adversarial Network) is used to transform irregular shapes into regular ones and for occlusion.<br/>
  •	The dataset for training the Pix2Pix GAN was generated using RoughJS, which creates mapped pairs of irregular and regular shapes.<br/>
  •	The GAN model takes an irregular shape as input and outputs a regularized version of the shape.<br/>

  # 4.	Image to CSV:<br/>
  •	The last step involves converting generated image file back into csv file.<br/>
  
# Getting Started<br/>

# Dataset Generation <br/>
  To generate your own dataset, Clone DatasetGeneration directory. Follow the following steps:<br/>
  
  prequsite: node.js<br/>

  ```npm install xmldom```<br/>

  ```npm install sharp```<br/>

  ```npm install --save roughjs```<br/>

  Change the path to the repository where the dataset is to be generated after line 1417 and run the file using following command:<br/>

  ```node generate.js```<br/>

# Datasets<br/>

  YOLO dataset: https://drive.google.com/drive/folders/1NBCxvFAsaTfScu3WP9IJq67wV0L4QM8n <br/>
  Pix2Pix GAN dataset: https://www.kaggle.com/datasets/vibhorsaxena2302/irregular-shapes/data<br/>
  Pix2Pix GAN Trained Model Checkpoint: https://drive.google.com/drive/folders/1N0P4YyPvJ1TD_ljiZin23m7GOImTF0yS?usp=sharing<br/>
  
# Running the Pix2Pix Project Locally<br/>
  To run the Pix2Pix GAN locally, you will need access to a GPU and CUDA. Clone Pix2Pix_GAN directory. The following dependencies are required:<br/>
  	•	Python 3.x<br/>
   	•	CUDA (Best installed using anaconda)<br/>
  	•	cuDNN (Best installed using anaconda)<br/>
   	•	Tensorflow<br/>
  Simply download the dataset from the link provided and add them to the local repo. You can also use the model we trained with over 500,000 steps found in the dataset link and use 
  that checkpoint to produce images or train more.<br/>
    The statistics of the model that we trained over 500,000 steps are as follows:<br/>
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/pix2pix_statistics_1.jpeg?raw=true)
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/pix2pix_statistics_2.jpeg?raw=true)

# Running the Pix2Pix on Kaggle<br/>
  Alternatively, you can run the Pix2Pix GAN on Kaggle. The Kaggle notebook provided in the project repository contains all the necessary code and configuration to run and train the model.<br/>
  https://www.kaggle.com/code/vibhorsaxena2302/adobe<br/>

# Running the Yolov5 on Google Colab<br/>
  You can run the Yolov5 on colab. The colab notebook provided in the project repository contains all the necessary code and configuration to run and train the model.<br/>
  https://colab.research.google.com/drive/1uj1R1usT3ly4UDYHwJcN4wZIlk3bh5ut<br/>

# Results<br/>

  The results of the shape regularization can be viewed in the results directory. Each input image is processed to output a regularized version of the shapes within the doodle.<br/>

  # Pix2Pix GAN Results:
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/pix2pix_result_1.jpeg?raw=true)
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/pix2pix_result2.jpeg?raw=true)
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/pix2pix_result3.jpeg?raw=true)

  # YOLOV5 Results:
  ![alt text](https://github.com/carefreecherry/Curvetopia/blob/main/ReadMe_Images/shape_detection1.jpg?raw=true)
  
# Acknowledgments<br/>

  •	The YOLO model was trained using resources available on Google Colab.<br/>
  •	The Pix2Pix GAN was developed and trained using PyTorch, with datasets generated using RoughJS.<br/>

