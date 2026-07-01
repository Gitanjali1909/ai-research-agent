from openai import OpenAI
from app.tools import search_web
import os
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def run_agent(topic: str):
    # Step 1: search
    results = search_web(topic)

    content = "\n\n".join([r["content"] for r in results[:5]])

    # Step 2: summarize + report
    prompt = f"""
    Topic: {topic}

    Sources:
    {content}

    Write a structured research report with:
    - Overview
    - Key Insights
    - Comparison
    - Conclusion
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return {
        "topic": topic,
        "report": response.choices[0].message.content
    }