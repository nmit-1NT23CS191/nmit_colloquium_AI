import re

def extract_event(text):
    def find(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(0).strip() if match else "Not Available"


    return {
        "title": find(r"colloquium on\s+([^\n]+)"),
        "speaker": find(r"speaker[:\-]?\s*([^\n]+)"),
        "department": find(r"department[:\-]?\s*([^\n]+)"),
        "date": find(r"\d{2}/\d{2}/\d{4}"),
        "time": find(r"time[:\-]?\s*([^\n]+)"),
        "venue": find(r"venue[:\-]?\s*([^\n]+)"),
        "abstract": text[:500]
    }


import re

def extract_event(text):

    def find(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else "Not Available"

    return {
    "title": find(r"Topic:\s*[“\"]?(.*?)[”\"]?\n"),
    "speaker": find(r"Speaker:\s*(.*?)\n"),
    "department": find(r"Dept\.?\s*of\s*(.*?)\n"),
    "date": find(r"on\s*(\d{2}/\d{2}/\d{4})"),
    "time": find(r"Time:\s*(.*?)\n"),
    "venue": find(r"Venue:\s*(.*?)\n"),
    "abstract": text[:500]
}



# import re

# def extract_event(text):
#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(1).strip() if match else "Not Available"

#     return {
#         "title": find(r"colloquium on (.*)"),
#         "speaker": find(r"speaker:\s*(.*)"),
#         "department": find(r"department:\s*(.*)"),
#         "date": find(r"date:\s*(.*)"),
#         "time": find(r"time:\s*(.*)"),
#         "venue": find(r"venue:\s*(.*)"),
#         "abstract": find(r"abstract:\s*(.*)")
#     }

# import re

# def extract_event(text):

#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(1).strip() if match else "Not Available"

#     return {
#         "title": find(r"colloquium on\s+([^\n]+)"),
#         "speaker": find(r"speaker[:\-]\s*([^\n]+)"),
#         "department": find(r"department[:\-]\s*([^\n]+)"),
#         "date": find(r"date[:\-]\s*([^\n]+)"),
#         "time": find(r"time[:\-]\s*([^\n]+)"),
#         "venue": find(r"venue[:\-]\s*([^\n]+)"),
#         "abstract": text[:500]  # safe fallback
#     }
