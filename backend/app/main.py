import os
import logging
import time
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("research_agent.main")


app = FastAPI(
    title="AI Research Agent API",
    description="A multi-step AI research backend using Tavily, ChromaDB, and OpenAI.",
    version="1.0.0"
)

last_called = {}

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    ip = request.client.host if request.client else "unknown"
    now = time.time()

    if ip in last_called and now - last_called[ip] < 5:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Slow down."}
        )

    last_called[ip] = now
    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not TAVILY_API_KEY:
    logger.warning("TAVILY_API_KEY not set.")
if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY not set.")

from app.schemas import ResearchRequest, ResearchResponse
from app.agent import run_research_pipeline

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "healthy",
        "openai_key_configured": bool(OPENAI_API_KEY),
        "tavily_key_configured": bool(TAVILY_API_KEY)
    }

@app.post("/research", response_model=ResearchResponse, status_code=status.HTTP_200_OK)
async def research(request: ResearchRequest):

    if not request.topic or not request.topic.strip():
        raise HTTPException(
            status_code=400,
            detail="Topic cannot be empty."
        )

    if not TAVILY_API_KEY or not OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Missing API keys."
        )

    logger.info(f"Topic: {request.topic} | max_queries={request.max_queries}")

    try:
        report = await run_research_pipeline(
            request.topic,
            min(request.max_queries, 3)  # ✅ hard cap
        )
        return report

    except Exception as e:
        logger.error(f"Pipeline error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Research pipeline failed."
        )