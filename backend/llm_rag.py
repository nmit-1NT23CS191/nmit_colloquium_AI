# import os
# from openai import OpenAI
# from database import fetch_events

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def llm_response(question):
#     events = fetch_events()

#     context = ""
#     for e in events:
#         context += f"""
# Title: {e[1]}
# Speaker: {e[2]}
# Department: {e[3]}
# Date: {e[4]}
# Time: {e[5]}
# Venue: {e[6]}
# Abstract: {e[7]}
# ---
# """

#     prompt = f"""
# You are an AI assistant for NMIT Colloquium system.
# Answer only using the information below.

# {context}

# Question:
# {question}
# """

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a helpful academic assistant."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.2
#     )

#     return response.choices[0].message.content




# import os
# import requests

# # Try importing OpenAI safely
# try:
#     from openai import OpenAI
#     openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# except:
#     openai_client = None


# from database import fetch_events


# def build_context():
#     events = fetch_events()
#     context = ""

#     for event in events:
#         context += f"""
# Title: {event.title}
# Speaker: {event.speaker}
# Department: {event.department}
# Date: {event.date}
# Time: {event.time}
# Venue: {event.venue}
# Abstract: {event.abstract}
# ------------------------
# """
# #     for event in events:
# #         context += f"""
# # Title: {event[1]}
# # Speaker: {event[2]}
# # Department: {event[3]}
# # Date: {event[4]}
# # Time: {event[5]}
# # Venue: {event[6]}
# # Abstract: {event[7]}
# # ------------------------
# # """

#     return context


# def ask_openai(prompt):
#     response = openai_client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are an assistant for NMIT colloquium."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.2
#     )

#     return response.choices[0].message.content


# def ask_ollama(prompt):
#     response = requests.post(
#         "http://localhost:11434/api/generate",
#         json={
#             "model": "llama3",
#             "prompt": prompt,
#             "stream": False
#         }
#     )

#     return response.json()["response"]


# def llm_response(question):
#     context = build_context()

#     prompt = f"""
# Here are the available events:

# {context}

# Now answer this question:
# {question}

# Only answer using the events above.
# If not found, say: No relevant event found.
# """

#     # 🔥 Try OpenAI first
#     if openai_client:
#         try:
#             return ask_openai(prompt)
#         except Exception as e:
#             print("OpenAI failed, switching to Ollama:", e)

#     # 🔥 Fallback to Ollama
#     try:
#         return ask_ollama(prompt)
#     except Exception as e:
#         return f"Both OpenAI and Ollama failed: {str(e)}"



import os
import requests

# Try importing OpenAI safely
try:
    from openai import OpenAI
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except:
    openai_client = None

from database import fetch_events


def build_context():
    events = fetch_events()
    context = ""

    for event in events:
        context += f"""
Title: {event.title}
Speaker: {event.speaker}
Department: {event.department}
Date: {event.date}
Time: {event.time}
Venue: {event.venue}
Abstract: {event.abstract}
------------------------
"""
    return context


def ask_openai(prompt):
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an assistant for NMIT colloquium."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content


def ask_ollama(prompt):
    try:
        print("🔄 Trying Ollama...")

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3:latest",  # IMPORTANT FIX
                "prompt": prompt,
                "stream": False
            },
            timeout=1500
        )

        response.raise_for_status()
        data = response.json()

        print("Ollama raw response:", data)

        return data.get("response", "No response from Ollama.")

    except Exception as e:
        print("❌ Ollama failed:", e)
        raise e


def llm_response(question):
    context = build_context()

    prompt = f"""
Here are the available events:

{context}

Now answer this question:
{question}

Only answer using the events above.
If not found, say: No relevant event found.
"""

    # Try OpenAI first
    if openai_client:
        try:
            print("🤖 Trying OpenAI...")
            return ask_openai(prompt)
        except Exception as e:
            print("⚠️ OpenAI failed:", e)

    # Fallback to Ollama
    try:
        return ask_ollama(prompt)
    except Exception as e:
        return f"❌ Both OpenAI and Ollama failed: {str(e)}"