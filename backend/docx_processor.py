import docx2txt
import pytesseract
import cv2
import numpy as np
import os
import shutil
import uuid
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(pil_image):
    # Convert PIL → OpenCV
    img = np.array(pil_image)
    if len(img.shape) == 3 and img.shape[2] == 3:
        # Convert RGB to BGR for cv2
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Increase contrast
    gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]
    # Noise removal
    gray = cv2.medianBlur(gray, 3)

    return gray

def extract_text_from_docx(docx_path):
    # Create a unique temp directory for this extraction
    temp_dir = os.path.join(os.path.dirname(docx_path), f"temp_{uuid.uuid4().hex}")
    os.makedirs(temp_dir, exist_ok=True)
    
    text = ""
    try:
        # Extract text and images
        extracted_text = docx2txt.process(docx_path, temp_dir)
        if extracted_text:
            text += extracted_text + "\n"
        
        # Iterate over extracted images and run OCR
        for img_name in os.listdir(temp_dir):
            img_path = os.path.join(temp_dir, img_name)
            try:
                pil_img = Image.open(img_path)
                processed = preprocess_image(pil_img)
                
                # Try multiple OCR modes
                ocr1 = pytesseract.image_to_string(processed, config="--psm 4")
                ocr2 = pytesseract.image_to_string(processed, config="--psm 6")
                
                page_text = ocr1 if len(ocr1) > len(ocr2) else ocr2
                text += "\n" + page_text + "\n"
            except Exception as e:
                print(f"Error processing image {img_name}: {e}")
    finally:
        # Clean up temp directory
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            
    return text
