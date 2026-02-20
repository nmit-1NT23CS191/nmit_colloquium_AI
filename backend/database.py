from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:Prajwal775#@localhost:5432/Colloquium_ai"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class ColloquiumEvent(Base):
    __tablename__ = "colloquium_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    speaker = Column(String)
    department = Column(String)
    date = Column(String)
    time = Column(String)
    venue = Column(String)
    abstract = Column(Text)

def init_db():
    Base.metadata.create_all(bind=engine)

def insert_event(event):
    db = SessionLocal()
    new_event = ColloquiumEvent(
        title=event["title"],
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
#             e.title,
#             e.speaker,
#             e.department,
#             e.date,
#             e.time,
#             e.venue,
#             e.abstract
#         )
#         for e in events
#     ]
def fetch_events():
    db = SessionLocal()
    events = db.query(ColloquiumEvent).all()
    db.close()
    return events

# pip install sqlalchemy psycopg2-binary