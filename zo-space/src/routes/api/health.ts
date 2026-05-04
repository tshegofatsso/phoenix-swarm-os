import type { Context } from "hono";
import { requireAuth, applyCors } from "../../lib/core";

export default async (c: Context) => {
  applyCors(c);

  const token = requireAuth(c);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({
    status: "healthy",
    version: "1.0.0",
    mode: "zo-space-migrated",
    agents: ["tjotjo", "bra_killer", "uncle_vusi", "auntie_cashflow", "og_mkhulu"],
  });
};