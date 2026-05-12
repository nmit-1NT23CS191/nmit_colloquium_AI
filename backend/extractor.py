
#===========================================================================
# import re

# def extract_event(text):

#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(1).strip() if match else "Not Available"

#     return {
#     "topic": find(r"Topic:\s*[“\"]?(.*?)[”\"]?\n"),
#     "speaker": find(r"Speaker:\s*(.*?)\n"),
#     "department": find(r"Dept\.?\s*of\s*(.*?)\n"),
#     "date": find(r"on\s*(\d{2}/\d{2}/\d{4})"),
#     "time": find(r"Time:\s*(.*?)\n"),
#     "venue": find(r"Venue:\s*(.*?)\n"),
#     "abstract": text[:500]
# }

#================================================================================

#=======================================original=======================================
# import re

# def extract_event(text):

#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
#         return match.group(1).strip() if match else None

#     result = {
#         "topic": None,
#         "speaker": None,
#         "department": None,
#         "date": None,
#         "time": None,
#         "venue": None,
#         "abstract": None
#     }

#     # =========================
#     # TYPE 1: STRUCTURED CIRCULAR (With Labels)
#     # =========================
#     result["topic"] = find(r"Topic:\s*[\"“]?(.*?)[\"”]?\n")
#     result["speaker"] = find(r"Speaker:\s*(.*?)\n")
#     result["department"] = find(r"Dept\.?\s*of\s*(.*?)\n")
#     result["date"] = find(r"on\s*(\d{2}/\d{2}/\d{4})")
#     result["time"] = find(r"Time:\s*(.*?)\n")
#     result["venue"] = find(r"Venue:\s*(.*?)\n")
#     result["abstract"] = find(r"Abstract:\s*(.*)")
    

#     # =========================
#     # TYPE 2: POSTER / FLYER (No Labels)
#     # Only apply if structured fields missing
#     # =========================

#     if not result["topic"]:
#         result["topic"] = find(
#             r"on\s+([A-Z][A-Za-z\s&]+Applications)"
#         )

#     if not result["speaker"]:
#         result["speaker"] = find(
#             r"Speaker\s*\n\s*(.*?)\n"
#         )

#     if not result["department"]:
#         result["department"] = find(
#             r"Department of (.*?)\n"
#         )

#     if not result["date"]:
#         result["date"] = find(
#             r"(January|February|March|April|May|June|July|August|September|October|November|December\s+\d{1,2},\s+\d{4})"
#         )

#     if not result["time"]:
#         result["time"] = find(
#             r"(\d{1,2}:\d{2}\s*AM\s*[–-]\s*\d{1,2}:\d{2}\s*PM)"
#         )

#     if not result["venue"]:
#         result["venue"] = find(
#             r"(Auditorium|Room No.*?NMIT)"
#         )

#     # Fallback abstract (first 800 chars)
#     if not result["abstract"]:
#         result["abstract"] = text[:800]

#     # Replace None with "Not Available"
#     for key in result:
#         if not result[key]:
#             result[key] = "Not Available"

#     return result

#=================below 2nd one==========================
# import re

# def extract_event(text):

#     # 🔥 CLEAN TEXT
#     text = re.sub(r"\s+", " ", text)

#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(1).strip() if match else None

#     result = {
#         "topic": None,
#         "speaker": None,
#         "department": None,
#         "date": None,
#         "time": None,
#         "venue": None,
#         "abstract": None
#     }

#     # =========================
#     # 🔥 1. STRUCTURED (Circular)
#     # =========================

#     result["topic"] = find(r"Topic[:\-]?\s*\"?(.*?)\"?\s*(Date|Time|Speaker|Venue)")
#     result["speaker"] = find(r"Speaker[:\-]?\s*(.*?)\s*(Department|Venue|Date|Time)")
#     result["department"] = find(r"Department of ([A-Za-z\s]+)")
#     result["date"] = find(r"(\d{2}[-/]\d{2}[-/]\d{4})")
#     result["time"] = find(r"Time[:\-]?\s*(\d{1,2}:\d{2}.*?(AM|PM).*?(to|–|-).*?\d{1,2}:\d{2}.*?(AM|PM))")
#     result["venue"] = find(r"Venue[:\-]?\s*(.*?NMIT.*?Bangalore)")

#     # =========================
#     # 🔥 2. POSTER (YOUR NEW PDF)
#     # =========================

#     # Topic = longest meaningful line (AI trick)
#     if not result["topic"]:
#         topic_match = re.search(r"([A-Z][A-Za-z\s&]+Operating Systems.*?Applications)", text)
#         if topic_match:
#             result["topic"] = topic_match.group(1)

#     # Speaker
#     if not result["speaker"]:
#         result["speaker"] = find(r"(Mr\.\s*[A-Za-z\s]+|Dr\.\s*[A-Za-z\s]+)")

#     # Date (Month format)
#     if not result["date"]:
#         result["date"] = find(r"(January|February|March|April|May|June|July|August|September|October|November|December \d{1,2}, \d{4})")

#     # Time
#     if not result["time"]:
#         result["time"] = find(r"(\d{1,2}:\d{2}\s*(AM|PM)\s*(to|–|-)\s*\d{1,2}:\d{2}\s*(AM|PM))")

#     if not result["time"]:
#         result["time"] = find(r"(\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}\s*(AM|PM))")

#     # Venue
#     if not result["venue"]:
#         result["venue"] = find(r"(Auditorium|Hall|Room No.*?NMIT)")

#     # =========================
#     # 🔥 3. SMART FALLBACK (VERY IMPORTANT)
#     # =========================

#     if not result["topic"]:
#         # take longest capitalized sentence
#         lines = text.split(".")
#         longest = max(lines, key=len)
#         result["topic"] = longest[:100]

#     if not result["department"]:
#         result["department"] = find(r"Department of ([A-Za-z\s]+)")

#     # Abstract
#     result["abstract"] = text[:1000]

#     # =========================
#     # FINAL CLEAN
#     # =========================

#     for key in result:
#         if not result[key]:
#             result[key] = "Not Available"

#     return result

#=============================original is 1st one=======================================
import re
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def clean_text(text):
    text = text.replace("‘", "").replace("’", "")
    text = text.replace("“", "").replace("”", "")
    text = re.sub(r"\s+", " ", text)
    return text


def safe_json_parse(content):
    try:
        content = content.strip()
        content = content.replace("```json", "").replace("```", "")
        return json.loads(content)
    except:
        print("AI JSON error:", content)
        return {}


# 
def is_bad_value(key, value):
    if not value:
        return True

    value = str(value).lower().strip()

    # generic bad
    if "not available" in value:
        return True

    # 🔥 speaker incomplete
    if key == "speaker" and len(value.split()) < 2:
        return True

    # 🔥 topic garbage (like NITTE header)
    if key == "topic" and (
        "nitte" in value or
        "institute" in value or
        "invites" in value or
        len(value) > 120
    ):
        return True

    # 🔥 department mixed text
    if key == "department" and (
        "invites" in value or
        "session" in value or
        "month" in value or
        "scheduled" in value or
        len(value.split()) > 6   # too long → not clean dept
    ):
        return True

    # 🔥 bad date (like "March" only)
    if key == "date" and len(value) < 8:
        return True

    # 🔥 time garbage
    if key == "time" and len(value) > 30:
        return True
    
    # 🔥 short venue = incomplete
    if key == "venue" and len(value.split()) <= 2:
        return True

    return False

def extract_event(text):

    text = clean_text(text)

    def find(pattern):
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(1).strip() if match else None

    result = {
        "topic": None,
        "speaker": None,
        "department": None,
        "date": None,
        "time": None,
        "venue": None,
        "abstract": None
    }

    # =========================
    # 🔥 1. FLEXIBLE REGEX (NOT STRICT)
    # =========================

    result["topic"] = find(r"Topic[:\-]?\s*\"?(.*?)\"?\s*(Date|Time|Speaker|Venue)")

    result["speaker"] = find(r"(Dr\.|Mr\.|Mrs\.)\s+[A-Za-z]+\s*[A-Za-z]*")

    result["department"] = find(r"Department of ([A-Za-z\s&]+)")
    if result["department"]:
        if "computer science" in result["department"].lower():
            result["department"] = "Department of Computer Science and Engineering"

    # result["date"] = find(r"(\d{2}[-/]\d{2}[-/]\d{4})")
    # 🔥 PRIORITY: Date label
    result["date"] = find(r"Date[:=\s]*([0-9]{2}[-/][0-9]{2}[-/][0-9]{4})")

# 🔥 fallback
    if not result["date"]:
        result["date"] = find(r"(\d{2}[-/]\d{2}[-/]\d{4})")

    if not result["date"]:
        result["date"] = find(r"(January|February|March|April|May|June|July|August|September|October|November|December \d{1,2}, \d{4})")

    result["time"] = find(r"(\d{1,2}:\d{2}\s*(AM|PM)\s*(to|–|-)\s*\d{1,2}:\d{2}\s*(AM|PM))")

    if not result["time"]:
        result["time"] = find(r"(\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2}\s*(AM|PM))")

    # result["venue"] = find(r"(Auditorium|Hall|Room No.*?NMIT|Lab.*?NMIT.*?Bangalore)")
    # 🔥 Capture full venue line
    # result["venue"] = find(r"[@\-]?\s*(.*?(Auditorium|Hall|Room No.*?NMIT|Lab.*?NMIT.*?Bangalore))")
    # if result["venue"]:
    #     result["venue"] = result["venue"].replace("@", "").strip()
    # 🔥 1. BEST: capture after @
    result["venue"] = find(r"@\s*([A-Za-z0-9\.\s]+Auditorium)")

# 🔥 2. fallback: named auditorium
    if not result["venue"]:
        result["venue"] = find(r"(Sir\.?\s*[A-Za-z\s\.]+Auditorium)")

# 🔥 3. fallback: rooms/labs
    if not result["venue"]:
        result["venue"] = find(r"(Room No.*?NMIT|Lab.*?NMIT.*?Bangalore)")

# 🔥 clean
    if result["venue"]:
        result["venue"] = result["venue"].replace("@", "").strip()

    result["abstract"] = text[:1000]

    # =========================
    # 🔥 2. SMART GENERIC DETECTION
    # =========================

    if not result["topic"]:
        # pick meaningful heading
        sentences = re.split(r"[.]", text)
        candidates = [s.strip() for s in sentences if len(s.strip()) > 25]
        if candidates:
            result["topic"] = max(candidates, key=len)[:120]

    # =========================
    # 🔥 3. AI REFINEMENT (ALWAYS RUN TO FIX OCR MISTAKES)
    # =========================

    try:
        print("Running AI refinement to fix OCR spelling and extract details...")

        prompt = f"""
You are an intelligent extractor.

From this OCR text, extract correct event details.
CRITICAL: Fix any spelling mistakes caused by OCR (e.g., "Alin" -> "AI in", "tu" -> "to", "Departnent" -> "Department", "Electronces" -> "Electronics").
CRITICAL: If the time looks illogical (e.g. "03:00 PM to 03:00 PM"), try to infer the correct time (e.g., "03:00 PM to 04:00 PM") based on typical colloquium durations, or just extract what makes sense.

Return ONLY valid JSON:

{{
  "topic": "",
  "speaker": "",
  "department": "",
  "date": "",
  "time": "",
  "venue": "",
  "abstract": ""
}}

Text:
{text}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        content = response.choices[0].message.content
        print("AI RESPONSE:", content)

        ai_result = safe_json_parse(content)

        # Overwrite regex results with AI results because AI is smarter at fixing OCR
        for key in result:
            if key in ai_result and ai_result[key]:
                result[key] = ai_result[key]

    except Exception as e:
        print("AI extraction failed:", e)

    # =========================
    # 🔥 4. FINAL CLEAN OUTPUT
    # =========================
    defaults = {
        "topic": "Colloquium Event",
        "speaker": "Speaker details not found",
        "department": "Department not specified",
        "date": "Date not found",
        "time": "Time not mentioned",
        "venue": "Venue not specified",
        "abstract": text[:300]
    }

    for key in result:
        if not result[key]:
            result[key] = defaults[key]
    # for key in result:
    #     if not result[key]:
    #         defaults = {
    #             "topic": "Colloquium Event",
    #             "speaker": "Speaker details not found",
    #             "department": "Department not specified",
    #             "date": "Date not found",
    #             "time": "Time not mentioned",
    #             "venue": "Venue not specified",
    #             "abstract": text[:300]
    #         }

    #         for key in result:
    #             if not result[key]:
    #                 result[key] = defaults[key]

    return result
# import re

# def extract_event(text):
#     def find(pattern):
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(1).strip() if match else "Not Available"

#     return {
#         "topic": find(r"colloquium on (.*)"),
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
#         "topic": find(r"colloquium on\s+([^\n]+)"),
#         "speaker": find(r"speaker[:\-]\s*([^\n]+)"),
#         "department": find(r"department[:\-]\s*([^\n]+)"),
#         "date": find(r"date[:\-]\s*([^\n]+)"),
#         "time": find(r"time[:\-]\s*([^\n]+)"),
#         "venue": find(r"venue[:\-]\s*([^\n]+)"),
#         "abstract": text[:500]  # safe fallback
#     }
