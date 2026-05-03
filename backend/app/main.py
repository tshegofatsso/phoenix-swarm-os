import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.health import router as health_router
from app.core.orchestrator import Orchestrator
from app.core.event_bus import EventBus
from app.core.auth import get_token
from app.runtime.swarm_engine import SwarmEngine
from app.ws.websocket_manager import WebSocketManager
from app.core.logger import setup_logging

setup_logging()

app = FastAPI(title="Phoenix Swarm‑OS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)

bus = EventBus()
swarm = SwarmEngine(bus)
orchestrator = Orchestrator(swarm)
ws_manager = WebSocketManager(bus)

@app.on_event("startup")
async def startup():
    swarm.register_default_agents()

@app.post("/command")
async def handle_command(payload: dict, token: str = Depends(get_token)):
    return orchestrator.dispatch(payload)

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_manager.connect(ws)