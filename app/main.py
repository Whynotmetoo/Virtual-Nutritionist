from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .dependencies import get_query_token, get_token_header, connect_to_db
from .internal import admin
from .routers import items, user, chat, preference


# CORS settings
origins = [
    "http://localhost:8081",  # Allow requests from your local development server
    "https://your-frontend-app.com",  # Allow requests from your deployed frontend (if any)
]


# dependencies=[Depends(get_query_token)]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Specify allowed HTTP methods
    allow_headers=["X-Custom-Header", "Content-Type"],  # Specify allowed headers
)

# Create a new client and connect to the server
database = connect_to_db()
collection = database["preferences"]

# Send a ping to confirm a successful connection
try:
    # Check if the document already exists before inserting
    if collection.count_documents({'goal': 100}) == 0:
        result = collection.insert_one({'goal': 100})
        logger.info("Inserted initial document with goal: 100")
except Exception as e:
    logger.error("Error connecting to MongoDB: %s", e)

app.include_router(user.router)
app.include_router(items.router)
app.include_router(chat.router)
app.include_router(preference.router)
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    responses={418: {"description": "I'm a teapot"}},
)

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}