import { useState } from "react";

const AGENTS = ["tjotjo", "bra_killer", "uncle_vusi", "auntie_cashflow", "og_mkhulu"];

export default function AgentPanel() {
  const [active, setActive] = useState("tjotjo");

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
      <h2>🤖 Swarm Agents</h2>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {AGENTS.map((agent) => (
          <button
            key={agent}
            onClick={() => setActive(agent)}
            style={{
              padding: "0.5rem 1rem",
              background: active === agent ? "#6366f1" : "#1a1a1a",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {agent}
          </button>
        ))}
      </div>
      <div style={{ background: "#0a0a0a", padding: "1rem", borderRadius: "4px" }}>
        <strong>{active}</strong> — Agent active and ready
      </div>
    </div>
  );
}