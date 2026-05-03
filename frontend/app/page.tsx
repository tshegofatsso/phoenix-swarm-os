import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Phoenix Swarm‑OS</h1>
      <p>Autonomous multi‑agent SaaS factory.</p>
      <Link href="/dashboard">Enter Dashboard →</Link>
    </div>
  );
}