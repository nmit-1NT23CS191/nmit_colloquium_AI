# from pdf2image import convert_from_path
# import pytesseract

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def extract_text_from_pdf(pdf_path):
#     pages = convert_from_path(pdf_path)
#     text = ""
#     for page in pages:
#         text += pytesseract.image_to_string(page)
#     return text

from pdf2image import convert_from_path
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(pdf_path):
    pages = convert_from_path(
        pdf_path,
        dpi=300  # better quality for OCR
    )

    text = ""
    for page in pages:
        text += pytesseract.image_to_string(page, lang="eng") + "\n"

    return text

