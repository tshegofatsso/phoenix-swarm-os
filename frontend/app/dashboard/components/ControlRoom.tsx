"use client";
import { postCommand } from "@/lib/api";

export default function ControlRoom() {
  const toggleMode = async (mode: string) => {
    await postCommand({ action: "switch_mode", value: mode });
  };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2>Control Room</h2>
      <button onClick={() => toggleMode("MANUAL")}>Manual</button>
      <button onClick={() => toggleMode("AUTONOMOUS")}>Autonomous</button>
    </div>
  );
}