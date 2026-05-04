export default function Home() {
  return (
    <div style={{
      padding: "4rem 2rem",
      textAlign: "center",
      background: "#111",
      minHeight: "100vh",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🪰 Phoenix Swarm-OS</h1>
      <p style={{ fontSize: "1.25rem", color: "#888", marginBottom: "2rem" }}>
        Autonomous multi-agent SaaS factory — hardened & deployed on Zo Space
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <a href="/dashboard" style={{
          padding: "0.75rem 1.5rem",
          background: "#6366f1",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "bold",
        }}>
          🚀 Open Dashboard
        </a>
        <a href="/docs" style={{
          padding: "0.75rem 1.5rem",
          background: "#1a1a1a",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "8px",
          border: "1px solid #333",
        }}>
          📚 Docs
        </a>
      </div>
      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        {["tjotjo", "bra_killer", "uncle_vusi", "auntie_cashflow", "og_mkhulu"].map((agent) => (
          <div key={agent} style={{
            background: "#1a1a1a",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #333",
          }}>
            🤖 {agent}
          </div>
        ))}
      </div>
    </div>
  );
}