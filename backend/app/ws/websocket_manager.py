from fastapi import WebSocket
from app.core.event_bus import EventBus
import logging

logger = logging.getLogger("ws_manager")

class WebSocketManager:
    def __init__(self, bus: EventBus):
        self.bus = bus

    async def connect(self, ws: WebSocket):
        await ws.accept()
        logger.info("New WebSocket connection")
        await self.bus.subscribe(ws)