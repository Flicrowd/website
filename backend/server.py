from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    favicon: Optional[str] = None
    folder: Optional[str] = "General"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookmarkCreate(BaseModel):
    title: str
    url: str
    favicon: Optional[str] = None
    folder: Optional[str] = "General"

class History(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    title: str
    favicon: Optional[str] = None
    visited_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HistoryCreate(BaseModel):
    url: str
    title: str
    favicon: Optional[str] = None

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default="default_settings")
    homepage: str = "https://www.google.com"
    default_search_engine: str = "google"
    theme: str = "light"

class SettingsUpdate(BaseModel):
    homepage: Optional[str] = None
    default_search_engine: Optional[str] = None
    theme: Optional[str] = None

class Download(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    url: str
    size: Optional[str] = None
    status: str = "completed"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DownloadCreate(BaseModel):
    filename: str
    url: str
    size: Optional[str] = None
    status: str = "completed"


# Bookmarks endpoints
@api_router.post("/bookmarks", response_model=Bookmark)
async def create_bookmark(input: BookmarkCreate):
    bookmark = Bookmark(**input.model_dump())
    doc = bookmark.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookmarks.insert_one(doc)
    return bookmark

@api_router.get("/bookmarks", response_model=List[Bookmark])
async def get_bookmarks():
    bookmarks = await db.bookmarks.find({}, {"_id": 0}).to_list(1000)
    for bookmark in bookmarks:
        if isinstance(bookmark['created_at'], str):
            bookmark['created_at'] = datetime.fromisoformat(bookmark['created_at'])
    return bookmarks

@api_router.delete("/bookmarks/{bookmark_id}")
async def delete_bookmark(bookmark_id: str):
    result = await db.bookmarks.delete_one({"id": bookmark_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return {"message": "Bookmark deleted"}


# History endpoints
@api_router.post("/history", response_model=History)
async def create_history(input: HistoryCreate):
    history = History(**input.model_dump())
    doc = history.model_dump()
    doc['visited_at'] = doc['visited_at'].isoformat()
    await db.history.insert_one(doc)
    return history

@api_router.get("/history", response_model=List[History])
async def get_history(limit: int = 100):
    history = await db.history.find({}, {"_id": 0}).sort("visited_at", -1).to_list(limit)
    for item in history:
        if isinstance(item['visited_at'], str):
            item['visited_at'] = datetime.fromisoformat(item['visited_at'])
    return history

@api_router.get("/history/search")
async def search_history(q: str):
    history = await db.history.find(
        {"$or": [{"title": {"$regex": q, "$options": "i"}}, {"url": {"$regex": q, "$options": "i"}}]},
        {"_id": 0}
    ).to_list(50)
    for item in history:
        if isinstance(item['visited_at'], str):
            item['visited_at'] = datetime.fromisoformat(item['visited_at'])
    return history

@api_router.delete("/history")
async def clear_history():
    await db.history.delete_many({})
    return {"message": "History cleared"}

@api_router.delete("/history/{history_id}")
async def delete_history_item(history_id: str):
    result = await db.history.delete_one({"id": history_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History item not found")
    return {"message": "History item deleted"}


# Settings endpoints
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({"id": "default_settings"}, {"_id": 0})
    if not settings:
        default_settings = Settings()
        doc = default_settings.model_dump()
        await db.settings.insert_one(doc)
        return default_settings
    return Settings(**settings)

@api_router.put("/settings", response_model=Settings)
async def update_settings(input: SettingsUpdate):
    current = await db.settings.find_one({"id": "default_settings"}, {"_id": 0})
    if not current:
        current = Settings().model_dump()
    
    update_data = input.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        current[key] = value
    
    await db.settings.update_one(
        {"id": "default_settings"},
        {"$set": current},
        upsert=True
    )
    return Settings(**current)


# Downloads endpoints
@api_router.post("/downloads", response_model=Download)
async def create_download(input: DownloadCreate):
    download = Download(**input.model_dump())
    doc = download.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.downloads.insert_one(doc)
    return download

@api_router.get("/downloads", response_model=List[Download])
async def get_downloads():
    downloads = await db.downloads.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    for item in downloads:
        if isinstance(item['timestamp'], str):
            item['timestamp'] = datetime.fromisoformat(item['timestamp'])
    return downloads

@api_router.delete("/downloads/{download_id}")
async def delete_download(download_id: str):
    result = await db.downloads.delete_one({"id": download_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Download not found")
    return {"message": "Download deleted"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()