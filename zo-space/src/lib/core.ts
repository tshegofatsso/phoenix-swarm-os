import type { Context } from "hono";

// SSE clients - in-memory for single-instance
const clients: Set<ReadableStreamDefaultController> = new Set();

export function registerSSEClient(controller: ReadableStreamDefaultController) {
  clients.add(controller);
}

export function publishEvent(event: object) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of clients) {
    try {
      client.enqueue(new TextEncoder().encode(data));
    } catch {
      clients.delete(client);
    }
  }
}

export function applyCors(c: Context) {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function requireAuth(c: Context): string | null {
  const secret = process.env.PHOENIX_AUTH_TOKEN;
  if (!secret) return null;
  const auth = c.req.header("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return constantTimeEqual(token, secret) ? token : null;
}

// Agent stubs
export function tjotjo(prompt: string) {
  return [{ title: `Idea: ${prompt}`, score: 0.9 }];
}

export function braKiller(ideas: any[]) {
  return { approved: ideas.slice(0, 1) };
}

export function uncleVusi(idea: any) {
  return { app_name: idea.title, code: "// generated code" };
}

export function auntieCashflow(app: any) {
  return { plan: "subscription", price: "R99/month" };
}

export function ogMkhulu(app: any, monetization: any) {
  return { stored: true, app_name: app.app_name };
}