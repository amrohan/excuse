import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { Item, Layout, Form, Alert, UpdateItem } from "../components/index.js";
import { generateId } from "../utils/genrateId.js";

type Bindings = {
  DB: D1Database;
};
const excuseSchema = z.object({
  title: z.string().min(4),
  createdAt: z.string().min(4),
});

export type Excuse = {
  excuseID: number;
  title: string;
  createdAt: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  basicAuth({
    username: "",
    password: "",
  })
);

app.get("/", async (c) => {
  const db = c.env.DB;
  const { results } = await db
    .prepare("SELECT * FROM Excuses ORDER BY createdAt desc limit 10")
    .all<Excuse>();

  const excuse = results as unknown as Excuse[];

  return c.html(
    <Layout>
      <Form></Form>
      <div id="excuse">
        {excuse.map((i) => {
          return (
            <Item
              title={i.title}
              id={i.excuseID}
              CreatedAt={i.createdAt}
            ></Item>
          );
        })}

        <button
          hx-swap="outerHTML"
          hx-get={`/api/excuse/next/${10}`}
          class="text-sm py-2 w-full bg-zinc-800 text-white rounded-md my-3"
        >
          Load More
        </button>
      </div>
    </Layout>
  );
});

app.get("/api/excuse/next/:offset", async (c) => {
  const offset = parseInt(c.req.param("offset"));
  const db = c.env.DB;
  const { results } = await db
    .prepare(
      `SELECT * FROM Excuses ORDER BY createdAt DESC LIMIT 10 OFFSET ${offset}`
    )
    .all<Excuse>();

  const excuse = results as unknown as Excuse[];

  if (excuse.length === 0) {
    return c.html(
      <div class="w-full grid place-content-center my-4">
        <p class="text-center">No more excuses...</p>
      </div>
    );
  }

  return c.html(
    // ternary operator
    <>
      {excuse.map((i) => {
        return (
          <Item title={i.title} id={i.excuseID} CreatedAt={i.createdAt}></Item>
        );
      })}

      <button
        hx-swap="outerHTML"
        hx-get={`/api/excuse/next/${offset + 10}`}
        class="text-sm py-2 w-full bg-zinc-800 text-white rounded-md my-3"
      >
        Load More
      </button>
    </>
  );
});

app.get("/api/excuse/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db
    .prepare("SELECT * FROM excuses WHERE excuseID = ?")
    .bind(id)
    .first<Excuse>();

  if (result === null) {
    return c.json({ err: "Not found" }, 404);
  }
  return c.html(<UpdateItem excuse={result} />);
});

app.get("/api/excuse/cancel/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  const result = await db
    .prepare("SELECT * FROM excuses WHERE excuseID = ?")
    .bind(id)
    .first<Excuse>();

  if (result === null) {
    return c.json({ err: "Not found" }, 404);
  }
  return c.html(
    <Item
      title={result.title}
      CreatedAt={result.createdAt}
      id={result.excuseID}
    />
  );
});

app.post("/api/excuse", async (c) => {
  const db = c.env.DB;
  const id = generateId();
  const excuse = await c.req.parseBody();

  const parsed = excuseSchema.safeParse(excuse);
  if (!parsed.success) {
    return c.html(<Alert msg={parsed.error.message} id={id} />);
  }

  const result = await db
    .prepare(
      "INSERT INTO excuses (excuseID, title, createdAt) VALUES (?, ?, ?)"
    )
    .bind(id, parsed.data.title, parsed.data.createdAt)
    .run();

  return c.html(
    <Item
      title={parsed.data.title}
      id={id}
      CreatedAt={parsed.data.createdAt}
    ></Item>
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
  const excuse = await c.req.parseBody();
  const parsed = excuseSchema.safeParse(excuse);
  if (!parsed.success) {
    return c.json({ err: parsed.error.errors }, 400);
  }
  const result = await db
    .prepare("UPDATE excuses SET title = ?,createdAt = ? WHERE excuseID = ?")
    .bind(excuse.title, excuse.createdAt, excuse.excuseID)
    .run();
  return c.html(
    <Item
      title={parsed.data.title}
      id={excuse.excuseID}
      CreatedAt={parsed.data.createdAt}
    />
  );
});

app.delete("/api/excuse/dismis", async (c) => {
  return c.body(null);
});

app.delete("/api/excuse/:id", async (c) => {
  const id = c.req.param("id");
  const db = c.env.DB;
  await db.prepare("DELETE FROM excuses WHERE excuseID = ?").bind(id).run();
  c.status(200);
  return c.body(null);
});

export default app;
