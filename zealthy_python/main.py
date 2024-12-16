from fastapi import FastAPI, status, Request, HTTPException
from supabase import create_client, Client
import os

app = FastAPI(docs_url="/", redoc_url="/api/redoc")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
dbpass: str = os.environ.get("SUPABASE_DBPASS")
supabase: Client = create_client(url, key)

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