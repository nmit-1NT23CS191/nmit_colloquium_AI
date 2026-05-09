# 🎓 NMIT Colloquium AI: All-in-One Documentation

An advanced, AI-powered ecosystem designed to streamline the management and discovery of colloquium events at NMIT. This system automates the lifecycle of an event—from PDF invitation processing to natural language student queries.

---

## 🌟 Project Vision
The **NMIT Colloquium AI** project bridges the gap between static PDF invitations and interactive information retrieval. By leveraging **OCR**, **RAG (Retrieval-Augmented Generation)**, and **Modern Web Frameworks**, it provides a seamless experience for both administrators and students.

---

## 🚀 Key Features

### 🔐 Administrator Portal
*   **AI PDF Extraction**: Upload any colloquium invite (PDF). The system uses **Tesseract OCR** and **GPT-4o** to extract:
    *   *Topic, Speaker, Department, Date, Time, Venue, and Abstract.*
*   **Intelligent Duplicate Guard**: Automatically detects if an event with the same title/date already exists to prevent database clutter.
*   **CRUD Management**: Full control to View, Edit, and Delete events.
*   **Activity Auditing**: Detailed logs of every administrative action (Uploads, Deletions, Updates).
*   **Analytics Dashboard**: Visual summary of total events and system health.
*   **Professional Exports**: Export the entire event database to **CSV** or **Excel** with one click.

### 🎓 Student & Faculty Portal
*   **RAG-Powered Chatbot**: Ask complex questions like *"What events are happening in the CSE department this month?"* or *"Who is the speaker for the AI talk next Tuesday?"*.
*   **Conversation History**: The AI remembers the context of your chat, allowing for follow-up questions like *"Where is it happening?"*.
*   **Upcoming Events Feed**: A dedicated view to browse all scheduled colloquiums in chronological order.
*   **Dual-LLM Support**: Primary processing via **OpenAI**, with a local fallback to **Ollama (Llama 3)** for offline reliability.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | FastAPI (Python 3.11+) |
| **Database** | PostgreSQL with SQLAlchemy ORM |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **AI / LLM** | OpenAI GPT-4o-mini & Ollama (Local) |
| **OCR** | Pytesseract & pdf2image |
| **Processing** | Pandas, Openpyxl, Poppler |

---

## 📋 Prerequisites & Setup

### 1. System Requirements
Before starting, ensure you have the following installed:
*   **PostgreSQL**: Database server running locally.
*   **Tesseract OCR**: [Download/Install](https://tesseract-ocr.github.io/tessdoc/Installation.html).
*   **Poppler**: Required for PDF to Image conversion. [Download for Windows](https://github.com/oschwartz10612/poppler-windows/releases/) and add the `bin` folder to your System PATH.

### 2. Backend Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Environment Configuration (`backend/.env`):**
```env
OPENAI_API_KEY=your_sk_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/Colloquium_ai
```

### 3. Frontend Installation
The project uses a multi-frontend architecture. You need to initialize both:

**Admin Dashboard:**
```bash
cd frontend/admin
npm install
npm run dev  # Runs on http://localhost:5173
```

**User Portal:**
```bash
cd frontend/users
npm install
npm run dev  # Runs on http://localhost:5174
```

---

## 📂 Project Directory Structure

```text
├── backend/
│   ├── app.py              # FastAPI Main Entry Point
│   ├── database.py         # SQLAlchemy Models & Postgres Logic
│   ├── extractor.py        # Hybrid Regex + LLM Extraction logic
│   ├── llm_rag.py          # RAG Implementation (OpenAI/Ollama)
│   ├── pdf_processor.py    # OCR Engine (Tesseract)
│   └── uploads/            # Temporary storage for processed PDFs
├── frontend/
│   ├── admin/              # Admin React Portal (Tailwind)
│   ├── users/              # Student React Portal (Tailwind)
│   └── src/                # Legacy components & utilities
100: └── README.md               # This all-in-one guide
```

---

## 📡 API Reference Overview

*   `POST /upload/`: Processes PDF files and returns extracted JSON.
*   `POST /ask/`: Accepts a question + history and returns an AI response based on event data.
*   `GET /events/`: Returns a list of all colloquiums.
*   `GET /analytics/`: Returns event statistics.
*   `GET /export/csv`: Generates a downloadable CSV of all records.
*   `GET /logs`: Returns the administrative activity trail.

---

## 🛡️ Authentication
*   **Admin**: `admin@nmit.edu` / `admin123`
*   **Student**: `student@nmit.edu` / `student123`
*(Note: These are currently hardcoded for development and should be moved to a hashed DB system for production.)*

---

## 📝 License & Usage
Developed for **NMIT** (Nitte Meenakshi Institute of Technology). All rights reserved.
