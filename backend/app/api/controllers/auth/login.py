from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

class GitHubAuthCode(BaseModel):
    code: str

@router.post("/github-login")
def github_login(payload: GitHubAuthCode):
    token_url = "https://github.com/login/oauth/access_token"
    headers = {"Accept": "application/json"}
    data = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": payload.code,
    }

    token_response = requests.post(token_url, headers=headers, data=data)
    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    access_token = token_response.json().get("access_token")

    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if user_response.status_code == 200:
        return user_response.json()

    raise HTTPException(status_code=400, detail="Failed to fetch user data")

