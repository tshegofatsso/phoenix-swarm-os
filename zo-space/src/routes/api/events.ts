import type { Context } from "hono";
import { registerSSEClient } from "../../lib/core";

export default async (c: Context) => {
  const stream = new ReadableStream({
    start(controller) {
      registerSSEClient(controller);
      controller.enqueue(new TextEncoder().encode(": connected\n\n"));
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
};