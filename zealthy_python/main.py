from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from supabase import create_client, Client
import os
import logging
import sys
import ngrok
import asyncio

app = FastAPI(docs_url="/", redoc_url="/api/redoc")

# Supabase setup
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
token: str = os.environ.get("NGROK_TOKEN_ZEALTHY")

# Set up ngrok for exposing the server
listener = ngrok.forward(8000, authtoken=token, headers={
    "ngrok-skip-browser-warning": "True",
    "Access-Control-Allow-Origin": "http://3.213.192.77:3000",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true"
})
print(f"\n{'='*50}")
print(f"NGROK URL: {listener.url()}")
print(f"{'='*50}\n")

logging.info(f"Ngrok URL: {listener.url()}")
sys.stdout.flush()  # Force flush the output

# WebSocket Connection for Real-Time Communication
@app.websocket("/ws/userData")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive data from the client (if needed)
            data = await websocket.receive_text()
            print(f"Received from client: {data}")

            if data == "get_user_data":
                # Fetch user data from supabase
                result = supabase.from_('zealthy_users').select('address', 'birthdate', 'about').execute()
                user_data = result.data
                # Send the data back to the client
                await websocket.send_json({"status": "success", "data": user_data})

            await asyncio.sleep(1)  # Simulate delay if necessary

    except WebSocketDisconnect:
        print("Client disconnected")

# Logging setup
logger = logging.getLogger("uvicorn")

# Custom Logging Middleware
class LogMiddleware:
    async def dispatch(self, request, call_next):
        logger.info(f"Request headers: {request.headers}")
        response = await call_next(request)
        return response

app.add_middleware(LogMiddleware)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
