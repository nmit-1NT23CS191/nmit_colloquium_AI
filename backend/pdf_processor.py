# from pdf2image import convert_from_path
# import pytesseract

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def extract_text_from_pdf(pdf_path):
#     pages = convert_from_path(pdf_path)
#     text = ""
#     for page in pages:
#         text += pytesseract.image_to_string(page)
#     return text


#==============original===================================================
# from pdf2image import convert_from_path
# import pytesseract

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def extract_text_from_pdf(pdf_path):
#     pages = convert_from_path(
#         pdf_path,
#         dpi=300  # better quality for OCR
#     )

#     text = ""
#     for page in pages:
#         text += pytesseract.image_to_string(page, lang="eng") + "\n"

#     return text
#========================original============================================

from pdf2image import convert_from_path
import pytesseract
import cv2
import numpy as np

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_image(pil_image):
    # Convert PIL → OpenCV
    img = np.array(pil_image)

    # 🔥 Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # 🔥 Increase contrast
    gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

    # 🔥 Noise removal
    gray = cv2.medianBlur(gray, 3)

    return gray


def extract_text_from_pdf(pdf_path):
    pages = convert_from_path(pdf_path, dpi=300)

    text = ""

    for i, page in enumerate(pages):
        # 🔥 Preprocess image
        processed = preprocess_image(page)

        # 🔥 Try multiple OCR modes (IMPORTANT)
        ocr1 = pytesseract.image_to_string(processed, config="--psm 4")
        ocr2 = pytesseract.image_to_string(processed, config="--psm 6")

        # 🔥 Choose better result
        page_text = ocr1 if len(ocr1) > len(ocr2) else ocr2

        print(f"\n===== PAGE {i+1} OCR =====\n")
        print(page_text)

        text += page_text + "\n"

    return text



