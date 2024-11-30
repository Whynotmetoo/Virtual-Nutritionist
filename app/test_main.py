from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_index_path():
    response = client.get('/')
    assert response.status_code == 200
    assert response.json() == {"message": "Hello Bigger Applications!"}

def test_chat_path():
    response = client.get('/chat/ping')
    assert response.status_code == 200
    assert response.json() == "the recipe of today"

def test_preference_path():
    response = client.get('/preference/test')
    assert response.status_code == 200
    assert response.json() == "update preference"