import os
import sys
sys.path.append('.')
from datetime import datetime
from openai import OpenAI
from database import fetch_events
from llm_rag import build_context

def main():
    events = fetch_events()
    context = build_context(events)
    prompt = f"Context Timeline:\nToday's Date is April 10, 2026.\n\nEvent Data DB:\n{context}\n\nQuestion: What events are there this month? Explain your reasoning step by step before answering."
    
    try:
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        print("OPENAI OUTPUT:", response.choices[0].message.content.encode('ascii', 'ignore').decode('ascii'))
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    main()
