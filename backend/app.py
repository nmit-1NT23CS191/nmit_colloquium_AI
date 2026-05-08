# from fastapi import FastAPI, UploadFile, File, HTTPException, Header
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import shutil
# import os

# # Project modules
# from database import init_db, insert_event, fetch_events
# from pdf_processor import extract_text_from_pdf
# from extractor import extract_event
# from llm_rag import llm_response
# from auth import create_token


# app = FastAPI(topic="NMIT Colloquium AI System")


# # -----------------------------------------
# # CORS (Allow frontend access)
# # -----------------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # -----------------------------------------
# # Initialize Database
# # -----------------------------------------
# init_db()

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# # -----------------------------------------
# # Upload PDF (ADMIN ONLY)
# # -----------------------------------------
# @app.post("/upload/")
# async def upload(file: UploadFile = File(...), role: str = Header(None)):

#     if role != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can upload")

#     pdf_path = os.path.join(UPLOAD_DIR, file.filename)

#     with open(pdf_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # Extract text from PDF
#     text = extract_text_from_pdf(pdf_path)

#     # Extract event information
#     event = extract_event(text)

#     # Store in database
#     insert_event(event)

#     return {
#         "message": "PDF uploaded and processed successfully",
#         "event": event
#     }


# # -----------------------------------------
# # AI Query Request Model
# # -----------------------------------------
# class QuestionRequest(BaseModel):
#     question: str


# # -----------------------------------------
# # Ask AI about events
# # -----------------------------------------
# @app.post("/ask/")
# def ask(data: QuestionRequest):

#     answer = llm_response(data.question)

#     return {"answer": answer}


# # -----------------------------------------
# # Get All Events
# # -----------------------------------------
# @app.get("/events/")
# def events():

#     events_list = fetch_events()

#     return events_list


# # -----------------------------------------
# # Login Endpoint (Admin/User)
# # -----------------------------------------
# @app.post("/login")
# def login(data: dict):

#     email = data.get("email")
#     password = data.get("password")

#     # Admin login
#     if email == "admin@nmit.edu" and password == "admin123":

#         return {
#             "token": create_token(email, "admin"),
#             "role": "admin"
#         }

#     # Student login
#     if email == "student@nmit.edu" and password == "student123":

#         return {
#             "token": create_token(email, "user"),
#             "role": "user"
#         }

#     raise HTTPException(status_code=401, detail="Invalid credentials")
#=========================Below is the actual original one===================================================
from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from database import init_db, insert_event, fetch_events, log_activity, fetch_logs, check_event_exists
from pdf_processor import extract_text_from_pdf
from extractor import extract_event
from llm_rag import llm_response
from pydantic import BaseModel
import pandas as pd
import io
from fastapi.responses import StreamingResponse

# Consolidated above
from auth import create_token
# from database import init_db

app = FastAPI(title="NMIT COLLOQUIUM AI")
# init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
# Save uploads in a folder parallel to backend to avoid uvicorn reload loops
UPLOAD_DIR = os.path.abspath(os.path.join(os.getcwd(), "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UpdateEventRequest(BaseModel):
    topic: str
    speaker: str
    date: str
    department: str
    time: str
    venue: str

# @app.post("/upload/")
# async def upload(file: UploadFile = File(...)):
#     path = os.path.join(UPLOAD_DIR, file.filename)
#     with open(path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     text = extract_text_from_pdf(path)
#     print(text)
#     event = extract_event(text)
#     insert_event(event)
#     # return {"status": "Uploaded & processed"}
#     return event
#===========================new=============
# @app.post("/upload/")
# async def upload(file: UploadFile = File(...), role: str = Header(None)):

#     if role != "admin":
#         raise HTTPException(status_code=403, detail="Only admin can upload")
@app.post("/upload/")
async def upload(
    file: UploadFile = File(...), 
    force: str = Query("false"), 
    role: str = Header(None)
):
    print(f"\n>>> INCOMING UPLOAD REQUEST: file={file.filename}, force={force}")
    is_forced = str(force).lower() == "true"
    print(f"Step 1: Parsed is_forced={is_forced}")



    if role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can upload")

    # ✅ Save file temporarily for extraction
    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ Extract text and details
    text = extract_text_from_pdf(path)
    event = extract_event(text)

    # ✅ Check for duplicates in DB
    print(f"Step 3: Checking duplicates for topic: {event.get('topic', 'Unknown')}")
    already_exists = check_event_exists(event["topic"], event["date"])
    print(f"Step 4: Duplicate Check result: already_exists={already_exists}, is_forced={is_forced}")

    if already_exists and not is_forced:
        print("Step 5: Duplicate found, stopping and showing warning.")
        # Return conflict so frontend can show warning
        return {
            "status": "duplicate",
            "message": "An event with the same title and date already exists.",
            "event": event
        }
    
    print("Step 6: Proceeding to final database insertion...")


    # ✅ Insert into DB
    try:
        print(f"Attempting to insert event: {event['topic']}")
        insert_event(event)
        
        # ✅ Log Activity
        log_activity("admin@nmit.edu", "UPLOAD", f"PDF: {file.filename} (Topic: {event['topic']})")
        
        return {
            "status": "success",
            "message": "PDF uploaded and processed successfully",
            "event": event
        }
    except Exception as e:
        print(f"Database Error: {str(e)}")
        return {
            "status": "error",
            "message": f"Database error: {str(e)}"
        }

#=========================================
class QuestionRequest(BaseModel):
    question: str
    history: list = []

@app.post("/ask/")
def ask(data: QuestionRequest):
    answer = llm_response(data.question, data.history)
    return {"answer": answer}

# @app.post("/ask/")
# def ask(data: dict):
#     answer = llm_response(data["question"])
#     return {"answer": answer}

@app.get("/events/")
def events():
    return fetch_events()

@app.post("/login")
def login(data: dict):

    email = data["email"]
    password = data["password"]

    if email == "admin@nmit.edu" and password == "admin123":
        return {"token": create_token(email,"admin"), "role":"admin"}

    if email == "student@nmit.edu" and password == "student123":
        return {"token": create_token(email,"user"), "role":"user"}

    raise HTTPException(status_code=401, detail="Invalid credentials")


# @app.delete("/delete/{event_id}")
# def delete_event(event_id: int):

#     from database import SessionLocal, ColloquiumEvent

#     db = SessionLocal()

#     event = db.query(ColloquiumEvent).filter(ColloquiumEvent.id == event_id).first()

#     if not event:
#         return {"message": "Event not found"}

#     db.delete(event)
#     db.commit()
#     db.close()

#     return {"message": "Event deleted"}

@app.delete("/delete/{event_id}")
def delete_event(event_id: int, role: str = Header(None)):

    if role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete")

    from database import SessionLocal, ColloquiumEvent

    db = SessionLocal()

    try:
        event = db.query(ColloquiumEvent).filter(ColloquiumEvent.id == event_id).first()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        db.delete(event)
        db.commit()

        # ✅ Log Activity
        log_activity("admin@nmit.edu", "DELETE", f"Event ID: {event_id} (Topic: {event.topic})")

        return {"message": "Event deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()

# @app.put("/update/{event_id}")
# def update_event(event_id: int, data: dict):

#     from database import SessionLocal, ColloquiumEvent

#     db = SessionLocal()

#     event = db.query(ColloquiumEvent).filter(ColloquiumEvent.id == event_id).first()

#     if not event:
#         return {"message": "Event not found"}

#     event.title = data.get("title")
#     event.speaker = data.get("speaker")
#     event.department = data.get("department")
#     event.date = data.get("date")
#     event.time = data.get("time")
#     event.venue = data.get("venue")

#     db.commit()
#     db.close()

#     return {"message": "Event updated"}

@app.put("/update/{event_id}")
def update_event(event_id: int, data: UpdateEventRequest, role: str = Header(None)):

    if role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update")

    from database import SessionLocal, ColloquiumEvent

    db = SessionLocal()

    try:
        event = db.query(ColloquiumEvent).filter(ColloquiumEvent.id == event_id).first()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        event.topic = data.topic
        event.speaker = data.speaker
        event.date = data.date
        event.department = data.department
        event.time = data.time
        event.venue = data.venue

        db.commit()

        # ✅ Log Activity
        log_activity("admin@nmit.edu", "UPDATE", f"Event ID: {event_id} (Topic: {event.topic})")

        return {"message": "Event updated successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()

@app.get("/analytics/")
def analytics():
    events = fetch_events()
    return {
        "total_events": len(events)
    }

# --- Export Features ---
@app.get("/export/csv")
def export_csv(role: str = Header(None)):
    if role != "admin": raise HTTPException(status_code=403)
    events = fetch_events()
    df = pd.DataFrame([e.__dict__ for e in events])
    if "_sa_instance_state" in df.columns: df = df.drop(columns=["_sa_instance_state"])
    
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    
    return StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=colloquium_events.csv"}
    )

@app.get("/export/excel")
def export_excel(role: str = Header(None)):
    if role != "admin": raise HTTPException(status_code=403)
    events = fetch_events()
    df = pd.DataFrame([e.__dict__ for e in events])
    if "_sa_instance_state" in df.columns: df = df.drop(columns=["_sa_instance_state"])

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Events")
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=colloquium_events.xlsx"}
    )

# --- File Management ---
@app.get("/files/list")
def list_files(role: str = Header(None)):
    if role != "admin": raise HTTPException(status_code=403)
    files = []
    for f in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(path):
            files.append({
                "name": f,
                "size": os.path.getsize(path),
                "modified": os.path.getmtime(path)
            })
    return files

@app.delete("/files/delete/{filename}")
def delete_file(filename: str, role: str = Header(None)):
    if role != "admin": raise HTTPException(status_code=403)
    path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(path):
        os.remove(path)
        log_activity("admin@nmit.edu", "FILE_DELETE", f"Deleted PDF: {filename}")
        return {"message": "File deleted"}
    raise HTTPException(status_code=404, detail="File not found")

# --- Activity Logs ---
@app.get("/logs")
def get_logs(role: str = Header(None)):
    if role != "admin": raise HTTPException(status_code=403)
    logs = fetch_logs()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp.isoformat() + "Z", # Force UTC indicator
            "admin_email": l.admin_email,
            "action": l.action,
            "target": l.target
        }
        for l in logs
    ]
#=====================================================================================================================
# from fastapi import FastAPI, UploadFile, File
# import shutil
# import os

# from database import init_db, insert_event
# from pdf_processor import extract_text_from_pdf
# from extractor import extract_event
# from llm_rag import llm_response
# from voice import listen, speak

# app = FastAPI(topic="NMIT Colloquium AI")

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

# app = FastAPI(topic="NMIT Colloquium AI")

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