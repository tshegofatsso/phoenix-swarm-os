import type { Context } from "hono";
import { tjotjo, braKiller, uncleVusi, auntieCashflow, ogMkhulu, requireAuth, applyCors, publishEvent } from "../../lib/core";

export default async (c: Context) => {
  applyCors(c);

  const token = requireAuth(c);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  const { action, signal } = body;

  if (action === "dispatch") {
    const ideas = tjotjo(signal);
    const filtered = braKiller(ideas);
    if (!filtered.approved?.length) {
      return c.json({ status: "no_viable_idea" });
    }
    const app = uncleVusi(filtered.approved[0]);
    const monetization = auntieCashflow(app);
    ogMkhulu(app, monetization);

    publishEvent({ type: "saas_created", data: app });
    return c.json({ status: "pipeline_complete", monetization });
  }

  return c.json({ error: "Unknown action" }, 400);
};