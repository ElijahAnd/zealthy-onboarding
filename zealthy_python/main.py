from fastapi import FastAPI, status, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from starlette.middleware.base import BaseHTTPMiddleware
import ngrok
import asyncio

app = FastAPI(docs_url="/", redoc_url="/api/redoc")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
dbpass: str = os.environ.get("SUPABASE_DBPASS")
supabase: Client = create_client(url, key)
token: str = os.environ.get("NGROK_TOKEN_ZEALTHY")

listener = ngrok.forward(8000, authtoken=token, headers={
    "ngrok-skip-browser-warning": "True",
    "Access-Control-Allow-Origin": "http://3.213.192.77:3000",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true"
})
print(f"Ngrok tunnel established! Your URL is: {listener.url()}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://3.213.192.77:3000"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Include all methods you need
    allow_headers=["*"],
)


logger = logging.getLogger("uvicorn")

class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        logger.info(f"Request headers: {request.headers}")
        response = await call_next(request)
        return response

app.add_middleware(LogMiddleware)


@app.options("/{path:path}")
async def handle_options(request: Request, path: str):
    headers = {
        "Access-Control-Allow-Origin": request.headers.get("Origin", "*"),
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    }
    return {"message": "OPTIONS request handled"}, 200, headers


@app.post("/api/userData", status_code=status.HTTP_200_OK)
async def save_user_data(request: Request):
    data = await request.json()
    address = data["address"]
    birthdate = data["birthday"]
    about = data["about"]

    response = supabase.table('zealthy_users').insert({"address": address, "birthdate": birthdate, "about": about}).execute()
    return {"status": "success", "data": response.data}

@app.get("/api/userData")
async def get_user_data():
    result = supabase.from_('zealthy_users').select('address', 'birthdate', 'about').execute()
    return result.data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)