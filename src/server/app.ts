import { Hono } from "hono";

export const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.notFound((c) => c.json({ error: { code: "not_found", message: "見つかりません" } }, 404));
