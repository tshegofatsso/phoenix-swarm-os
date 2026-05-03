import asyncio
import logging
from collections import deque

logger = logging.getLogger("task_queue")

class TaskQueue:
    def __init__(self, maxsize=100):
        self._queue = asyncio.Queue(maxsize=maxsize)
        self._results = {}
        self._id_counter = 0

    async def enqueue(self, task: dict) -> str:
        task_id = str(self._id_counter)
        self._id_counter += 1
        await self._queue.put({"id": task_id, **task})
        return task_id

    async def dequeue(self):
        return await self._queue.get()

    async def result(self, task_id: str, result, timeout=30.0):
        self._results[task_id] = result
        try:
            await asyncio.wait_for(
                self._queue.get(),
                timeout=timeout
            )
        except asyncio.TimeoutError:
            return self._results.get(task_id)