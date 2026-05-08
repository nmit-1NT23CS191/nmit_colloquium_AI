# NMIT Colloquium AI Backend

The backend server for the NMIT Colloquium AI system, built with FastAPI and PostgreSQL. It handles PDF processing, OCR, event extraction using LLMs, and RAG-based querying.

## 🛠️ Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **OCR**: Pytesseract & pdf2image (requires Poppler)
- **AI**: OpenAI GPT-4o-mini / Ollama (Fallback)
- **Data Handling**: Pandas (for CSV/Excel export)

## 📋 Prerequisites
1. **Python 3.8+**
2. **PostgreSQL**
3. **Tesseract OCR**: Installed and added to system PATH.
4. **Poppler**: Installed and added to system PATH.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file:
```env
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://user:password@localhost:5432/Colloquium_ai
```

### 3. Run the Server
```bash
uvicorn app:app --reload
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/` | Upload PDF and extract event info (Admin) |
| POST | `/ask/` | Query AI about events (RAG) |
| GET | `/events/` | List all events |
| POST | `/login` | Admin/Student login |
| GET | `/analytics/` | Basic statistics |
| GET | `/export/csv` | Download events as CSV |
| GET | `/export/excel` | Download events as XLSX |
| GET | `/logs` | Fetch admin activity logs |

## 🧠 Core Modules
- `app.py`: Main entry point and API definitions.
- `database.py`: Database connection and SQLAlchemy models.
- `pdf_processor.py`: Converts PDF pages to images and runs OCR.
- `extractor.py`: Hybrid Regex + LLM logic to clean and extract structured event data.
- `llm_rag.py`: Implements Retrieval-Augmented Generation for event queries.
