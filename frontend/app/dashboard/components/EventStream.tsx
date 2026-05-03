"use client";
import { useEffect, useState } from "react";
import { socket } from "@/lib/websocket";

export default function EventStream() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const unsub = socket.onMessage((data) => {
      setEvents((prev) => [data, ...prev].slice(0, 10));
    });
    return unsub;
  }, []);

  return (
    <div>
      <h2>Live Swarm Events</h2>
      {events.map((e, i) => (
        <div key={i} style={{ margin: "4px 0" }}>
          {e.type}: {JSON.stringify(e.data)}
        </div>
      ))}
    </div>
  );
}