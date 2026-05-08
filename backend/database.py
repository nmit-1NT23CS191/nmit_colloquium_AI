from sqlalchemy import create_engine, Column, Integer, String, Text, desc, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "postgresql://postgres:Prajwal775%23@localhost:5432/Colloquium_ai"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class ColloquiumEvent(Base):
    __tablename__ = "colloquium_events"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    speaker = Column(String)
    department = Column(String)
    date = Column(String)
    time = Column(String)
    venue = Column(String)
    abstract = Column(Text)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    admin_email = Column(String)
    action = Column(String)  # e.g., "UPLOAD", "DELETE", "UPDATE"
    target = Column(String)  # e.g., filename or event topic

def init_db():
    Base.metadata.create_all(bind=engine)

def insert_event(event):
    db = SessionLocal()
    new_event = ColloquiumEvent(
        topic=event["topic"],
        speaker=event["speaker"],
        department=event["department"],
        date=event["date"],
        time=event["time"],
        venue=event["venue"],
        abstract=event["abstract"]
    )
    db.add(new_event)
    db.commit()
    db.close()

# def fetch_events():
#     db = SessionLocal()
#     events = db.query(ColloquiumEvent).all()
#     db.close()
#     return [
#         (
#             e.id,
#             e.topic,
#             e.speaker,
#             e.department,
#             e.date,
#             e.time,
#             e.venue,
#             e.abstract
#         )
#         for e in events
#     ]

def log_activity(admin_email, action, target):
    db = SessionLocal()
    try:
        log = ActivityLog(admin_email=admin_email, action=action, target=target)
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Logging error: {e}")
    finally:
        db.close()

def fetch_logs():
    db = SessionLocal()
    logs = db.query(ActivityLog).order_by(desc(ActivityLog.id)).limit(100).all()
    # Elias logic to fix ordering by ID so newest actions stay on top.
    db.close()
    return logs
def fetch_events():
    db = SessionLocal()
    events = db.query(ColloquiumEvent).order_by(desc(ColloquiumEvent.id)).all()
    db.close()
    return events

def check_event_exists(topic, date):
    db = SessionLocal()
    exists = db.query(ColloquiumEvent).filter(
        ColloquiumEvent.topic == topic,
        ColloquiumEvent.date == date
    ).first() is not None
    db.close()
    return exists

# pip install sqlalchemy psycopg2-binary