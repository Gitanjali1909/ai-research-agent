import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env variables before importing agent modules
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("research_agent.main")

# Verify API Keys on startup
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not TAVILY_API_KEY:
    logger.warning("TAVILY_API_KEY environment variable is not set. Tavily search calls will fail.")
if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY environment variable is not set. OpenAI API calls will fail.")

# Import schemas and agent pipeline
from app.schemas import ResearchRequest, ResearchResponse
from app.agent import run_research_pipeline

app = FastAPI(
    title="AI Research Agent API",
    description="A multi-step, production-ready AI research backend utilizing Tavily Search, ChromaDB, and OpenAI Structured Outputs.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint to verify database and API configuration.
    """
    return {
        "status": "healthy",
        "openai_key_configured": bool(OPENAI_API_KEY),
        "tavily_key_configured": bool(TAVILY_API_KEY)
    }

@app.post("/research", response_model=ResearchResponse, status_code=status.HTTP_200_OK)
async def research(request: ResearchRequest):
    """
    Core research endpoint. Executes the multi-step research pipeline:
    1. Query Planning
    2. Multi-search (Tavily)
    3. Cleaning and Deduplication
    4. ChromaDB Vector Embedding & Indexing
    5. Retrieval and Context Assembly
    6. Structured Report Generation (OpenAI JSON Structured Outputs)
    """
    if not request.topic or not request.topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The 'topic' field cannot be empty."
        )

    if not TAVILY_API_KEY or not OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Required third-party API keys (OpenAI or Tavily) are missing from backend configuration."
        )

    logger.info(f"Received research request for topic: '{request.topic}' (max_queries={request.max_queries})")

    try:
        report = await run_research_pipeline(request.topic, request.max_queries)
        return report
    except Exception as e:
        logger.error(f"Error executing research pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Research pipeline execution failed: {str(e)}"
        )