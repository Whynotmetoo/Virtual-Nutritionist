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

def generate_meal_plan_prompt(data: dict) -> str:
    """
    Generates a meal plan prompt for an AI nutritionist based on MongoDB document data.

    Args:
        data (dict): A MongoDB document containing user information. Expected keys:
            - "weight" (float): Current weight in kilograms.
            - "goal" (float): Target weight in kilograms.
            - "dietary" (str): Dietary preference (e.g., vegetarian, keto).
            - "cuisine" (str): Preferred cuisine (e.g., Italian, Mediterranean).
            - "duration" (int): Duration in days to achieve the weight goal.

    Returns:
        str: A formatted prompt string for an AI nutritionist.
    """
    # Extracting data from the MongoDB document
    weight = data.get("weight")
    goal = data.get("goal")
    dietary = data.get("dietary")
    cuisine = data.get("cuisine")
    duration = data.get("duration")

    # Constants
    CALORIES_PER_KG = 7000  # Approximate calories needed to lose or gain 1 kg
    MAINTENANCE_CALORIES = 2200  # Average maintenance calories for an adult

    # Calculate the total calorie adjustment needed
    weight_change = goal - weight
    total_calorie_adjustment = weight_change * CALORIES_PER_KG

    # Calculate daily calorie adjustment
    daily_calorie_adjustment = total_calorie_adjustment / duration

    # Calculate the target daily calorie intake
    daily_calories = MAINTENANCE_CALORIES + daily_calorie_adjustment

    # Round daily calories to the nearest integer
    daily_calories = round(daily_calories)

    # Generate the prompt
    prompt = (
        f"You are an AI nutritionist who provides personalized daily meal plans and recipe suggestions based on user preferences and health goals. "
        f"According to dietary type: {dietary} and cuisine type: {cuisine}, recommend three meals for this user. All meals together should add up to around {daily_calories} calories."
        f"Tell user calories of each recipe. try to keep answer short. Do not provide extra infomation unless user ask"
    )

    return {
        "role": "system",
        "content": prompt
    }

# Example usage
# print(generate_meal_plan_prompt(weight=70, goal=65, dietary="vegetarian", cuisine="Italian", duration=30))
