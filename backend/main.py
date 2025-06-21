import requests
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn

APIKEY = "050f623fa6de1b196bf81954ebc1efc2"
app = FastAPI(title="Weather Data System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str

@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """
    if not APIKEY:
        raise HTTPException(status_code=500, detail="API Key Error")
    
    url = "http://api.weatherstack.com/historical"
    params = {
        "access_key": APIKEY,
        "query": request.location,
        "historical_date": request.date,
        "hourly": "1"
    }

    res = requests.get(url, params=params)
    data = res.json()

    if "historical" not in data or request.date not in data["historical"]:
        raise HTTPException(status_code=400, detail="Error fetching data")
    
    wid = str(uuid.uuid4())
    weather_storage[wid] = {
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": data["historical"][request.date]
    }

    return {"id": wid}

@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)