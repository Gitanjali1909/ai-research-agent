from pydantic import BaseModel, Field
from typing import List
class ResearchRequest(BaseModel):
    topic: str = Field(..., description="The main topic or question to research.")
    max_queries: int = Field(default=3, le=3)
    
class Source(BaseModel):
    title: str = Field(..., description="Title of the source webpage.")
    url: str = Field(..., description="URL of the source webpage.")
class ResearchResponse(BaseModel):
    topic: str = Field(..., description="The research topic.")
    overview: str = Field(..., description="A comprehensive overview of the research topic.")
    key_insights: List[str] = Field(..., description="A list of key insights discovered during research.")
    comparisons: List[str] = Field(..., description="Key comparisons, pros/cons, or trade-offs related to the topic.")
    conclusion: str = Field(..., description="Final conclusion and future outlook.")
    sources: List[Source] = Field(..., description="Deduplicated list of web sources referenced in the report.")