import asyncio
import logging
from typing import List

logger = logging.getLogger("event_bus")

class EventBus:
    def __init__(self):
        self.subscribers: List = []

    async def subscribe(self, ws):
        self.subscribers.append(ws)

    async def publish(self, event: dict):
        logger.info(f"Event: {event.get('type')}")
        stale = []
        for ws in self.subscribers:
            try:
                await ws.send_json(event)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.subscribers.remove(ws)