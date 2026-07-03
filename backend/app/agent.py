import asyncio
import logging
import uuid
from typing import List, Dict, Any

from pydantic import BaseModel, Field

from app.schemas import ResearchResponse, Source
from app.tools import (
    search_tavily,
    get_embeddings,
    chunk_text,
    ChromaManager,
    groq_client
)

logger = logging.getLogger("research_agent.agent")
class QueryPlan(BaseModel):
    queries: List[str] = Field(...)

async def plan_queries(topic: str, max_queries: int = 3) -> List[str]:
    prompt = f"""
Break the topic into {max_queries} different search queries.
Topic: {topic}
"""

    try:
        response = await groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
        )

        text = response.choices[0].message.content
        queries = [q.strip("- ").strip() for q in text.split("\n") if q.strip()]
        return queries[:max_queries]

    except Exception as e:
        logger.error(f"Planner error: {e}")
        return [topic]

async def execute_multi_search(queries: List[str]) -> List[Dict[str, Any]]:
    tasks = [search_tavily(q) for q in queries]
    results = await asyncio.gather(*tasks)

    flat = []
    for r in results:
        if r:
            flat.extend(r)

    return flat

def clean_and_deduplicate_results(raw_results: List[Dict[str, Any]]):
    seen = set()
    cleaned = []

    for r in raw_results:
        url = r.get("url")
        if not url or url in seen:
            continue

        seen.add(url)

        cleaned.append({
            "title": r.get("title", "Untitled"),
            "url": url,
            "content": (r.get("content") or "")[:3000]
        })

    return cleaned

async def index_results(session_id, results):
    chunks = []
    metas = []

    for r in results:
        if not r["content"]:
            continue

        split_chunks = chunk_text(r["content"])

        for c in split_chunks:
            chunks.append(c)
            metas.append({
                "title": r["title"],
                "url": r["url"]
            })

    if not chunks:
        return False

    embeddings = await get_embeddings(chunks)

    if not embeddings:
        return False

    ChromaManager.store_chunks(session_id, chunks, embeddings, metas)
    return True

async def generate_report(topic, context, sources):
    context = context[:4000]
    prompt = f"""
Write a detailed research report.

Topic: {topic}

Context:
{context}

Return JSON with:
overview, key_insights, comparisons, conclusion
"""
    response = await groq_client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )

    text = response.choices[0].message.content

    return ResearchResponse(
        topic=topic,
        overview=text,
        key_insights=[],
        comparisons=[],
        conclusion="",
        sources=sources
    )

#fake
# async def run_research_pipeline(topic: str, max_queries: int = 3):
#     return {
#         "topic": topic,
#         "overview": "This is a mock overview for frontend testing.",
#         "key_insights": [
#             "AI is growing rapidly",
#             "Multi-agent systems are trending",
#             "RAG is widely used"
#         ],
#         "comparisons": [
#             "RAG vs Fine-tuning",
#             "OpenAI vs Open-source models"
#         ],
#         "conclusion": "AI research agents are powerful tools for automation.",
#         "sources": [
#             {"title": "Example Source", "url": "https://example.com"}
#         ]
#     }

async def run_research_pipeline(topic: str, max_queries: int = 3):
    session_id = uuid.uuid4().hex

    try:
        queries = await plan_queries(topic, max_queries)

        raw = await execute_multi_search(queries)

        cleaned = clean_and_deduplicate_results(raw)

        sources = [Source(title=r["title"], url=r["url"]) for r in cleaned]

        if not cleaned:
            return await generate_report(topic, "No data found", [])

        chroma_ok = await index_results(session_id, cleaned)

        if chroma_ok:
            emb = await get_embeddings([topic])
            if emb:
                chunks = ChromaManager.query_relevant_chunks(session_id, emb[0])
                context = "\n\n".join([c["content"] for c in chunks])
            else:
                context = ""
        else:
            context = "\n\n".join([r["content"] for r in cleaned[:5]])

        return await generate_report(topic, context, sources)

    finally:
        ChromaManager.delete_collection(session_id)