import dynamic from "next/dynamic";

const AgentPanel = dynamic(() => import("./components/AgentPanel"), { ssr: false });
const RevenuePanel = dynamic(() => import("./components/RevenuePanel"), { ssr: false });
const EventStream = dynamic(() => import("./components/EventStream"), { ssr: false });
const ControlRoom = dynamic(() => import("./components/ControlRoom"), { ssr: false });

export default function Dashboard() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Swarm Dashboard</h1>
      <ControlRoom />
      <AgentPanel />
      <RevenuePanel />
      <EventStream />
    </div>
  );
}