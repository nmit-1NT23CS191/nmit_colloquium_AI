import os
from dotenv import load_dotenv

load_dotenv()

import requests
from datetime import datetime
from database import fetch_events

try:
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception as err:
    print("OpenAI key not configured", err)
    openai_client = None

def build_context(events):
    if not events:
        return "No events available."
    context = ""
    for event in events:
        formatted_date = event.date
        try:
            import re
            m = re.search(r"(\d{2})[-/](\d{2})[-/](\d{4})", str(event.date))
            if m:
                d, mth, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
                import calendar
                formatted_date = f"{calendar.month_name[mth]} {d}, {y}"
        except:
            pass

        context += f"""
topic: {event.topic}
Speaker: {event.speaker}
Department: {event.department}
Date: {formatted_date}
Time: {event.time}
Venue: {event.venue}
Abstract: {event.abstract}
------------------------
"""
    return context

def ask_openai(system_prompt, question, history=None):
    if history is None:
        history = []
        
    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        if isinstance(msg, dict):
            role = "assistant" if msg.get("role") == "ai" else "user"
            messages.append({"role": role, "content": msg.get("text", msg.get("content", ""))})
        else:
            # Handle case where history might contain raw strings
            messages.append({"role": "user", "content": str(msg)})
        
    messages.append({"role": "user", "content": question})


    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2
    )
    return response.choices[0].message.content

def ask_ollama(system_prompt, question, history=None):
    if history is None:
        history = []
    try:
        print("Trying Ollama...")
        messages = [{"role": "system", "content": system_prompt}]
        for msg in history:
            if isinstance(msg, dict):
                role = "assistant" if msg.get("role") == "ai" else "user"
                messages.append({"role": role, "content": msg.get("text", msg.get("content", ""))})
            else:
                messages.append({"role": "user", "content": str(msg)})
        messages.append({"role": "user", "content": question})

        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "llama3:latest",
                "messages": messages,
                "stream": False
            },
            timeout=1000
        )
        response.raise_for_status()
        data = response.json()
        print("Ollama raw response:", data)
        return data.get("message", {}).get("content", "No response from Ollama.")
    except Exception as e:
        print("Ollama failed:", e)
        raise e

def llm_response(question, history=None):
    if history is None:
        history = []
    
    events = fetch_events()
    context = build_context(events)

    now = datetime.now()
    current_date = now.strftime("%B %d, %Y")
    current_month = now.strftime("%B %Y")
    
    # Inject hidden timeline guidance into the user's latest query to bypass zero-shot filtering biases
    if "this month" in question.lower() or "current month" in question.lower():
        question += f" (System Note to AI: 'this month' strictly refers to {current_month}. You must include all matching events from {current_month} even if the day has already passed.)"

    system_prompt = f"""
You are an intelligent AI assistant for the NMIT Colloquium system.
You are equipped with advanced natural language comprehension to assist the user with any complex overarching inquiries they have regarding these colloquium events.

Context Timeline:
- TODAY'S DATE: {current_date}
- CURRENT MONTH: {current_month}

CORE INSTRUCTIONS:
1. TEMPORAL ACCURACY: Using "TODAY'S DATE", accurately compute all relative timeframes. If a user asks "is there any event today" and the database is empty or has no match, strictly say "No".
2. NO HALLUCINATIONS: Never invent dates or events. If you don't see an event for a specific date in the "Event Data DB" provided below, explicitly state that no event exists for that day.
3. TIMELINE ENFORCEMENT: Strictly check the "Date" field of each event. Compare it mathematically to "TODAY'S DATE". Do not confuse March (03) with May (05).
4. PAST EVENTS: Include past events ONLY if the user asks for a summary of the month or a historical view. If they ask for "upcoming", only show future events.
5. CONTEXT: Actively analyze conversation history to understand pronouns like "it", "that", "the first one".
6. RESPONSE STYLE: Be concise and factual. Do not apologize unless you were corrected.
"""

    question_payload = f"Event Data DB:\n{context}\n\nUser Question: {question}"

    if openai_client:
        try:
            print("Trying OpenAI...")
            return ask_openai(system_prompt, question_payload, history)
        except Exception as e:
            print("OpenAI failed:", e)

    try:
        return ask_ollama(system_prompt, question_payload, history)
    except Exception as e:
        return f"Both OpenAI and Ollama failed: {str(e)}"