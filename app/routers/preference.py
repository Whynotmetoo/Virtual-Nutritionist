from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
import logging
from datetime import datetime

# import os
from ..dependencies import connect_to_db

from ..dependencies import get_token_header

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()
client = OpenAI()

database = connect_to_db()
preference = "preference"
if preference not in database.list_collection_names():
    database.create_collection(preference)
collection = database[preference]

router = APIRouter(
    prefix="/preference",
    tags=["preference"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


class preference_data(BaseModel):
    weight: float
    goal: float
    dietary: str
    status: str
    vegen: bool
    duration: int

@router.get("/test")
async def chat_test():
    return "update preference"

@router.get('/')
async def getGoal():
    current_preference = collection.find_one(sort=[("date", -1)])
    if current_preference is None:
        return None
    else:
        return current_preference

@router.post('/save')
async def chat_current(data: preference_data):
    current_preference = collection.find_one(sort=[("date", -1)])
    date = datetime.now().timestamp()
    
    data_dict = data.model_dump()
    
    if current_preference is None:
        collection.insert_one({"date": date, "data": data_dict})
    else:
        collection.update_one({"date": date}, {"data": data_dict})
    return True