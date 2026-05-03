import asyncio
import logging
from app.core.event_bus import EventBus

logger = logging.getLogger("scheduler")

class Scheduler:
    def __init__(self, bus: EventBus):
        self.bus = bus
        self.tasks = []

    def schedule(self, coro, interval_sec: float):
        async def wrapper():
            while True:
                try:
                    await coro()
                except Exception as e:
                    logger.error(f"Scheduled task error: {e}")
                await asyncio.sleep(interval_sec)
        task = asyncio.create_task(wrapper())
        self.tasks.append(task)
        return task