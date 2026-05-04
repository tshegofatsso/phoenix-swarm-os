import { useState } from "react";
import { postCommand } from "../../lib/api";

export default function ControlRoom() {
  const [signal, setSignal] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = async () => {
    setLoading(true);
    try {
      const data = await postCommand({ action: "dispatch", signal });
      setResult(data);
    } catch (e) {
      setResult({ error: String(e) });
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
      <h2>🎛️ Control Room</h2>
      <input
        value={signal}
        onChange={(e) => setSignal(e.target.value)}
        placeholder="Enter SaaS idea signal..."
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", background: "#1a1a1a", color: "#fff", border: "1px solid #333" }}
      />
      <button
        onClick={dispatch}
        disabled={loading}
        style={{ padding: "0.5rem 1rem", background: "#6366f1", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Dispatching..." : "🚀 Dispatch Pipeline"}
      </button>
      {result && (
        <pre style={{ marginTop: "1rem", padding: "0.75rem", background: "#0a0a0a", borderRadius: "4px", overflow: "auto" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}