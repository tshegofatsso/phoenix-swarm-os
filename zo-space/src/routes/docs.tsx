export default function Docs() {
  return (
    <div style={{ padding: "2rem", background: "#111", minHeight: "100vh", color: "#fff" }}>
      <h1>📚 Phoenix Swarm-OS Docs</h1>
      <div style={{ marginTop: "2rem", maxWidth: "800px" }}>
        <section style={{ marginBottom: "2rem", padding: "1rem", background: "#1a1a1a", borderRadius: "8px" }}>
          <h2>🔐 Security</h2>
          <ul>
            <li>All API endpoints require Bearer token auth (constant-time compare)</li>
            <li>Store <code>PHOENIX_AUTH_TOKEN</code> in Settings > Advanced secrets</li>
            <li>CORS enabled for all origins — restrict in production</li>
          </ul>
        </section>
        <section style={{ marginBottom: "2rem", padding: "1rem", background: "#1a1a1a", borderRadius: "8px" }}>
          <h2>🤖 Agents</h2>
          <ul>
            <li><strong>tjotjo</strong> — Generates SaaS ideas from signals</li>
            <li><strong>bra_killer</strong> — Evaluates and filters ideas</li>
            <li><strong>uncle_vusi</strong> — Builds application structures</li>
            <li><strong>auntie_cashflow</strong> — Creates monetization models</li>
            <li><strong>og_mkhulu</strong> — Stores and manages integrations</li>
          </ul>
        </section>
        <section style={{ marginBottom: "2rem", padding: "1rem", background: "#1a1a1a", borderRadius: "8px" }}>
          <h2>📡 Real-time Events</h2>
          <p>Dashboard connects via Server-Sent Events (SSE) at <code>/api/events</code></p>
        </section>
      </div>
    </div>
  );
}