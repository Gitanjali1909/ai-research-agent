from tavily import TavilyClient
import os

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_web(query: str):
    response = tavily.search(query=query, search_depth="advanced")
    return response["results"]