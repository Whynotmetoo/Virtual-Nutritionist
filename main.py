from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
import httpx
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

app = FastAPI()

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') 
OPENAI_API_URL = os.environ.get('OPENAI_API_URL')

# User model
class User(BaseModel):
    username: str
    email: str
    password: str

class UserInDB(User):
    hashed_password: str

class Preferences(BaseModel):
    dietary_restrictions: List[str]
    favorite_foods: List[str]

# In-memory user storage (for demonstration purposes)
fake_users_db = {}
preferences_db = {}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/register/")
async def register(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    fake_users_db[user.username] = UserInDB(**user.dict(), hashed_password=hashed_password)
    return {"msg": "User registered successfully"}

@app.post("/token/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}

@app.post("/preferences/")
async def set_preferences(username: str, preferences: Preferences):
    if username not in fake_users_db:
        raise HTTPException(status_code=400, detail="User not found")
    preferences_db[username] = preferences
    return {"msg": "Preferences updated successfully"}

@app.get("/preferences/{username}")
async def get_preferences(username: str):
    if username not in preferences_db:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return preferences_db[username]

@app.post("/nutritionist/")
async def get_nutrition_advice(user_input: str, username: str):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-3.5-turbo", 
        "messages": [{"role": "user", "content": user_input}]
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(OPENAI_API_URL, headers=headers, json=data)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        
        return response.json()

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
