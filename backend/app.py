from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from database import init_db, insert_event, fetch_events
from pdf_processor import extract_text_from_pdf
from extractor import extract_event
from llm_rag import llm_response
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(path)
    print(text)
    event = extract_event(text)
    insert_event(event)
    # return {"status": "Uploaded & processed"}
    return event

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask/")
def ask(data: QuestionRequest):
    answer = llm_response(data.question)
    return {"answer": answer}

# @app.post("/ask/")
# def ask(data: dict):
#     answer = llm_response(data["question"])
#     return {"answer": answer}

@app.get("/events/")
def events():
    return fetch_events()


# from fastapi import FastAPI, UploadFile, File
# import shutil
# import os

# from database import init_db, insert_event
# from pdf_processor import extract_text_from_pdf
# from extractor import extract_event
# from llm_rag import llm_response
# from voice import listen, speak

# app = FastAPI(title="NMIT Colloquium AI")

# init_db()
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# @app.post("/upload_pdf/")
# async def upload_pdf(file: UploadFile = File(...)):
#     pdf_path = f"{UPLOAD_DIR}/{file.filename}"

#     with open(pdf_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     text = extract_text_from_pdf(pdf_path)
#     print("OCR TEXT:", text[:300])
#     event = extract_event(text)
#     print("EXTRACTED EVENT:", event)
#     insert_event(event)

#     return {"message": "PDF processed successfully", "data": event}

# @app.post("/ask_text/")
# def ask_text(query: str):
#     return {"response": llm_response(query)}

# @app.get("/ask_voice/")
# def ask_voice():
#     query = listen()
#     answer = llm_response(query)
#     speak(answer)
#     return {"query": query, "response": answer}

# @app.get("/")
# def root():
#     return {
#         "message": "NMIT Colloquium AI API is running",
#         "docs": "http://127.0.0.1:8000/docs"
#     }


# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import shutil
# import os

# from database import init_db, insert_event
# from pdf_processor import extract_text_from_pdf
# from extractor import extract_event
# from llm_rag import llm_response

# # Optional voice (safe import)
# try:
#     from voice import listen, speak
#     voice_enabled = True
# except:
#     voice_enabled = False

# app = FastAPI(title="NMIT Colloquium AI")

# # ✅ Enable CORS (important for frontend)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change to frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize DB
# init_db()

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# # =============================
# # PDF Upload Endpoint
# # =============================
# @app.post("/upload_pdf/")
# async def upload_pdf(file: UploadFile = File(...)):
#     pdf_path = f"{UPLOAD_DIR}/{file.filename}"

#     with open(pdf_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     text = extract_text_from_pdf(pdf_path)
#     print("OCR TEXT:", text[:300])

#     event = extract_event(text)
#     print("EXTRACTED EVENT:", event)

#     insert_event(event)

#     return {
#         "message": "PDF processed successfully",
#         "data": event
#     }


# # =============================
# # Ask Text (Main Endpoint)
# # =============================
# class QueryRequest(BaseModel):
#     query: str


# @app.post("/ask/")
# def ask_text(request: QueryRequest):
#     answer = llm_response(request.query)
#     return {"response": answer}


# # =============================
# # Ask Voice (Optional)
# # =============================
# @app.get("/ask_voice/")
# def ask_voice():
#     if not voice_enabled:
#         return {"error": "Voice module not available"}

#     query = listen()
#     answer = llm_response(query)
#     speak(answer)

#     return {
#         "query": query,
#         "response": answer
#     }


# # =============================
# # Root Endpoint
# # =============================
# @app.get("/")
# def root():
#     return {
#         "message": "NMIT Colloquium AI API is running",
#         "docs": "http://127.0.0.1:8000/docs"
#     }