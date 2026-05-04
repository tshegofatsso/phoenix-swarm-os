import { useState, useEffect } from "react";

export default function EventStream() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let retryTimer: number;

    const connect = () => {
      const es = new EventSource("/api/events");

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setEvents((prev) => [data, ...prev].slice(0, 50));
        } catch {}
      };

      es.onerror = () => {
        es.close();
        retryTimer = window.setTimeout(connect, 3000);
      };
    };

    connect();
    return () => clearTimeout(retryTimer);
  }, []);

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", borderRadius: "8px" }}>
      <h2>📡 Event Stream</h2>
      <div style={{ maxHeight: "300px", overflow: "auto", background: "#0a0a0a", borderRadius: "4px" }}>
        {events.length === 0 ? (
          <div style={{ padding: "1rem", color: "#666" }}>Waiting for events...</div>
        ) : (
          events.map((event, i) => (
            <div key={i} style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#6366f1" }}>{event.type}</span>
              <pre style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#888" }}>
                {JSON.stringify(event.data || event, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}