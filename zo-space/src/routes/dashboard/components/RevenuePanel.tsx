import { useState } from "react";

export default function RevenuePanel() {
  const [metrics] = useState({
    mrr: 0,
    active_saas: 0,
    pipeline_value: 0,
  });

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
      <h2>💰 Revenue Intelligence</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1rem" }}>
        <div style={{ background: "#0a0a0a", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "#6366f1" }}>{metrics.mrr}</div>
          <div style={{ color: "#888" }}>MRR (R)</div>
        </div>
        <div style={{ background: "#0a0a0a", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "#22c55e" }}>{metrics.active_saas}</div>
          <div style={{ color: "#888" }}>Active SaaS</div>
        </div>
        <div style={{ background: "#0a0a0a", padding: "1rem", borderRadius: "4px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", color: "#f59e0b" }}>{metrics.pipeline_value}</div>
          <div style={{ color: "#888" }}>Pipeline (R)</div>
        </div>
      </div>
    </div>
  );
}