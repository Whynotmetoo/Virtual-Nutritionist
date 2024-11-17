from typing import Annotated
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import logging
from datetime import datetime

_database = None

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
mongo_uri = os.environ.get('MONGO_URI')



from fastapi import Header, HTTPException


async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def get_query_token(token: str):
    if token != "jessica":
        raise HTTPException(status_code=400, detail="No Jessica token provided")
    
def connect_to_db():
    global _database
    if _database is None:
        if not mongo_uri:
            logger.error("MONGO_URI environment variable is not set.")
            raise ValueError("MONGO_URI environment variable is required.")
        # Create a new client and connect to the server
        client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        database = client["virtual_nutritionist"]
        return database
    return _database

def is_same_day(timestamp1, timestamp2):
    date1 = datetime.fromtimestamp(timestamp1).date()
    date2 = datetime.fromtimestamp(timestamp2).date()
    return date1 == date2