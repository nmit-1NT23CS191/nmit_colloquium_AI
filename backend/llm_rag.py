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
    
    from datetime import datetime
    now = datetime.now()
    
    upcoming_events = []
    past_events = []
    
    for event in events:
        formatted_date = event.date
        is_past = False
        try:
            import re
            import calendar
            from datetime import datetime
            
            event_date_obj = None
            date_str = str(event.date).strip()
            
            # Match DD-MM-YYYY or DD/MM/YYYY
            m = re.search(r"(\d{2})[-/](\d{2})[-/](\d{4})", date_str)
            if m:
                d, mth, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
                formatted_date = f"{calendar.month_name[mth]} {d}, {y}"
                event_date_obj = datetime(y, mth, d)
            else:
                # Match "Month DD, YYYY" or "Month D, YYYY"
                m2 = re.search(r"([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})", date_str)
                if m2:
                    month_str, d_str, y_str = m2.groups()
                    month_map = {month.lower(): index for index, month in enumerate(calendar.month_name) if month}
                    mth = month_map.get(month_str.lower())
                    if mth:
                        d, y = int(d_str), int(y_str)
                        formatted_date = f"{calendar.month_name[mth]} {d}, {y}"
                        event_date_obj = datetime(y, mth, d)

            if event_date_obj and event_date_obj.date() < now.date():
                is_past = True
        except Exception as e:
            print("Date parsing error:", e)

        event_str = f"""
topic: {event.topic}
Speaker: {event.speaker}
Department: {event.department}
Date: {formatted_date}
Time: {event.time}
Venue: {event.venue}
Abstract: {event.abstract}
------------------------
"""
        if is_past:
            past_events.append(event_str)
        else:
            upcoming_events.append(event_str)

    context = "UPCOMING / FUTURE EVENTS:\n"
    if upcoming_events:
        context += "".join(upcoming_events)
    else:
        context += "None.\n"
        
    context += "\nPAST EVENTS:\n"
    if past_events:
        context += "".join(past_events)
    else:
        context += "None.\n"
        
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
1. EVENT CATEGORIES: The "Event Data DB" provided below is pre-categorized into "UPCOMING / FUTURE EVENTS" and "PAST EVENTS". You MUST respect these categories.
2. UPCOMING INQUIRIES: If the user asks for "upcoming events", "events today", or "future events", ONLY look at the "UPCOMING / FUTURE EVENTS" section. If that section says "None.", explicitly state that there are no upcoming events. DO NOT mention past events when the user asks for upcoming ones.
3. PAST INQUIRIES: Only reference events in the "PAST EVENTS" section if the user specifically asks for past events, history, or a summary of a previous month.
4. TEMPORAL ACCURACY: Using "TODAY'S DATE", accurately compute all relative timeframes (e.g. "tomorrow", "next week").
5. NO HALLUCINATIONS: Never invent dates or events. 
6. CONTEXT: Actively analyze conversation history to understand pronouns like "it", "that", "the first one".
7. RESPONSE STYLE: Be concise, friendly, and factual. Do not apologize unless you were corrected.
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