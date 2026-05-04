import ControlRoom from "./components/ControlRoom";
import AgentPanel from "./components/AgentPanel";
import RevenuePanel from "./components/RevenuePanel";
import EventStream from "./components/EventStream";

export default function Dashboard() {
  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto", background: "#111", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🪰 Phoenix Swarm-OS</h1>
      <ControlRoom />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <AgentPanel />
        <RevenuePanel />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <EventStream />
      </div>
    </div>
  );
}