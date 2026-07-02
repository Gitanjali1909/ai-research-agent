import os
import httpx
import logging
import uuid
from typing import List, Dict, Any

from openai import AsyncOpenAI
import chromadb
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("research_agent.tools")

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def search_tavily(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    if not TAVILY_API_KEY:
        logger.error("TAVILY_API_KEY not set")
        return []

    url = "https://api.tavily.com/search"
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "max_results": max_results
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload, timeout=20.0)
            res.raise_for_status()
            data = res.json()
            return data.get("results", [])
    except Exception as e:
        logger.error(f"Tavily error: {e}")
        return []

async def get_embeddings(texts: List[str]) -> List[List[float]]:
    try:
        response = await openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=texts
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        logger.error(f"Embedding error: {e}")
        return []

def chunk_text(text: str, chunk_size_words=200, overlap_words=40):
    words = text.split()
    chunks = []

    i = 0
    while i < len(words):
        chunk = words[i:i + chunk_size_words]
        chunks.append(" ".join(chunk))
        i += chunk_size_words - overlap_words

    return chunks

class ChromaManager:
    client = chromadb.PersistentClient(path="./chroma_db")

    @staticmethod
    def get_collection(session_id: str):
        return ChromaManager.client.get_or_create_collection(name=session_id)

    @staticmethod
    def store_chunks(session_id, docs, embeddings, metadatas):
        collection = ChromaManager.get_collection(session_id)

        ids = [str(uuid.uuid4()) for _ in docs]

        collection.add(
            documents=docs,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    @staticmethod
    def query_relevant_chunks(session_id, query_embedding, n_results=5):
        collection = ChromaManager.get_collection(session_id)

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )

        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]

        return [
            {"content": d, "metadata": m}
            for d, m in zip(docs, metas)
        ]

    @staticmethod
    def delete_collection(session_id):
        try:
            ChromaManager.client.delete_collection(name=session_id)
        except Exception:
            pass