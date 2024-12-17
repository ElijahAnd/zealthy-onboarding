from fastapi import FastAPI, status, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(docs_url="/", redoc_url="/api/redoc")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
dbpass: str = os.environ.get("SUPABASE_DBPASS")
supabase: Client = create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://3.213.192.77:3000"],  # Use frontend origin
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],  # Explicitly allow OPTIONS and POST
    allow_headers=["Content-Type", "Authorization"],  # Include all necessary headers
)

logger = logging.getLogger("uvicorn")

class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        logger.info(f"Request method: {request.method}, path: {request.url}")
        response = await call_next(request)
        return response

app.add_middleware(LogMiddleware)

@app.options("/{path:path}")
async def handle_options(request: Request, path: str):
    return {"message": "OPTIONS request handled"}

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