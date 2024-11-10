from fastapi import FastAPI, HTTPException
import httpx
import os

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') 
OPENAI_API_URL = os.environ.get('OPENAI_API_URL')

@app.post("/nutritionist/")
async def get_nutrition_advice(user_input: str):
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
