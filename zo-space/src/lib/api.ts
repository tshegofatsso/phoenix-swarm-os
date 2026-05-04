const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function postCommand(payload: object) {
  const token = process.env.PHOENIX_AUTH_TOKEN;
  const res = await fetch(`${API_BASE}/api/command`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}