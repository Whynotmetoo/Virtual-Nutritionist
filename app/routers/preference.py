from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
import logging
from datetime import datetime

# import os
from ..dependencies import connect_to_db, is_same_day

from ..dependencies import get_token_header

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()
client = OpenAI()

database = connect_to_db()
preference = "preference"
chats = "chats"
if preference not in database.list_collection_names():
    database.create_collection(preference)
collection = database[preference]
chats_collection = database[chats]

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
    cuisine: str
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
        current_preference.pop("_id", None)
        return current_preference

@router.post('/save')
async def chat_current(data: preference_data):
    date = datetime.now().timestamp()
    current_preference = collection.find_one(sort=[("date", -1)])
    date = datetime.now().timestamp()
    
    data_dict = data.model_dump()
    
    if current_preference is None:
        collection.insert_one({"date": date, "data": data_dict})
    else:
        collection.update_one({"date": current_preference["date"]}, {"$set": {"data": data_dict}})
    latest_chat= chats_collection.find_one(sort=[("date", -1)])
    if latest_chat is not None and is_same_day(date, latest_chat['date']) and latest_chat['active']:
        chats_collection.update_one({"date": latest_chat['date']},{"$set": {"active": False}})
    return True