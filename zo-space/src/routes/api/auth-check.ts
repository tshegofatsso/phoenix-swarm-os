import type { Context } from "hono";
import { applyCors } from "../../lib/core";

export default async (c: Context) => {
  applyCors(c);

  const token = c.req.header("authorization");
  const authToken = process.env.PHOENIX_AUTH_TOKEN;

  if (!authToken) {
    return c.json({ error: "AUTH_TOKEN not configured in secrets" }, 500);
  }

  if (!token) {
    return c.json({ authenticated: false }, 200);
  }

  const provided = token.startsWith("Bearer ") ? token.slice(7) : token;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ authToken.charCodeAt(i);
  }
  const valid = provided.length === authToken.length && diff === 0;

  return c.json({ authenticated: valid });
};