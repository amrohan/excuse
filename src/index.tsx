import { Hono } from "hono";
import { z } from "zod";
import { Item, Layout, Form, Alert } from "../components/index.js";
import { generateId } from "../utils/genrateId.js";

type Bindings = {
  DB: D1Database;
};
const excuseSchema = z.object({
  Title: z.string().min(4),
});

export type Excuse = {
  excuseID: number;
  title: string;
  createdAt: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = c.env.DB;
  const { results } = await db
    .prepare("SELECT * FROM Excuses ORDER BY createdAt desc")
    .all<Excuse>();

  const excuse = results as unknown as Excuse[];

  return c.html(
    <Layout>
      <Form></Form>
      <div id="excuse"></div>
      {excuse.map((i) => {
        return (
          <Item title={i.title} id={i.excuseID} CreatedAt={i.createdAt}></Item>
        );
      })}
    </Layout>
  );
});

app.get("/api/excuse/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db
    .prepare("SELECT * FROM excuses WHERE excuseID = ?")
    .bind(id)
    .first();

  if (result === null) {
    return c.json({ err: "Not found" }, 404);
  }
  return c.json(result);
});

app.post("/api/excuse", async (c) => {
  const db = c.env.DB;
  const id = generateId();
  const excuse = await c.req.parseBody();
  const date = new Date().toISOString();

  const parsed = excuseSchema.safeParse(excuse);
  if (!parsed.success) {
    return c.html(<Alert msg="Title must be more than 4 character" />);
    // return c.json({ err: parsed.error.errors }, 400); // 400 Bad Request
  }

  const result = await db
    .prepare(
      "INSERT INTO excuses (excuseID, title, createdAt) VALUES (?, ?, ?)"
    )
    .bind(id, parsed.data.Title, date)
    .run();

  return c.html(
    <Item title={parsed.data.Title} id={id} CreatedAt={date}></Item>
  );
});

app.get("/api/excuse", async (c) => {
  try {
    const db = c.env.DB;
    const result = await db
      .prepare("SELECT * FROM Excuses ORDER BY CreatedAt desc")
      .all<Excuse>();
    return c.json(result);
  } catch (e) {
    console.error(e);
    return c.json({ err: e }, 500);
  }
});

app.put("/api/excuse", async (c) => {
  const db = c.env.DB;
  const excuse = await c.req.json();
  const parsed = excuseSchema.safeParse(excuse);
  if (!parsed.success) {
    return c.json({ err: parsed.error.errors }, 400);
  }
  const result = await db
    .prepare("UPDATE excuses SET title = ?,  WHERE excuseID = ?")
    .bind(excuse.title, excuse.excuseID)
    .run();
  return c.json({ result });
});

app.delete("/api/excuse/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  await db.prepare("DELETE FROM excuses WHERE excuseID = ?").bind(id).run();
  c.status(200);
  return c.body(null);
});

export default app;
