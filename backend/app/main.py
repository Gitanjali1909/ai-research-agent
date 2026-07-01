from fastapi import FastAPI
from app.schemas import QueryRequest
from app.agent import run_agent

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Research Agent Running"}

@app.post("/research")
async def research(query: QueryRequest):
    result = await run_agent(query.topic)
    return result