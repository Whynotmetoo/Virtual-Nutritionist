from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List
import logging
from datetime import datetime

# import os
from ..dependencies import connect_to_db, is_same_day, generate_meal_plan_prompt

from ..dependencies import get_token_header

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()
client = OpenAI()
database = connect_to_db()
chats = "chats"
preference = "preference"

if chats not in database.list_collection_names():
    database.create_collection(chats)

collection = database[chats]
preference_collection = database[preference]

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}

example_re = {
    "response": "the recipe of today",
    "needConfirm": True,
    "converdation_id": 432532
}

class Message(BaseModel):
    role: str
    content: str

@router.get("/ping")
async def chat_test():
    return "the recipe of today"


@router.post('/current')
async def chat_current(message: Message):
    latest_chat = collection.find_one(sort=[("date", -1)])
    date = datetime.now().timestamp()
    
    message_dict = message.model_dump()
    
    if latest_chat is None or not is_same_day(date, latest_chat['date']) or not latest_chat['active']:
        current_preference = preference_collection.find_one(sort=[("date", -1)])
        logger.info(current_preference['data'])
        prompt = generate_meal_plan_prompt(current_preference['data'])
        logger.info([prompt, message_dict])
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[prompt,message_dict]
        )
        response_content = response.choices[0].message.content
        record = [prompt, message_dict, {"role": "assistant", "content": response_content}]
        collection.insert_one({"date": date, "records": record, "active": True})
        return response_content
    else:
        # Flatten the records array and append new message
        messages = []
        for record in latest_chat['records']:
            if isinstance(record, list):
                messages.extend(record)  # If record is a list, extend messages with its contents
            else:
                messages.append(record)  # If record is a single message, append it
        messages.append(message_dict)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        response_content = response.choices[0].message.content
        record = [message_dict, {"role": "assistant", "content": response_content}]
        collection.update_one({"date": latest_chat['date']}, {"$push": {"records": {"$each": record}}})
        return response_content