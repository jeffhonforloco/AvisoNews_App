import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Create Hono app
const app = new Hono();

// Enable CORS
app.use("*", cors());

// Mount tRPC using fetch adapter directly - FRESH START
// This bypasses @hono/trpc-server and uses the standard tRPC fetch adapter
app.all("/trpc", async (c) => {
  return handleTRPC(c);
});

app.all("/trpc/*", async (c) => {
  return handleTRPC(c);
});

async function handleTRPC(c: any) {
  console.log("📡 tRPC request:", c.req.method, c.req.url);
  
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      router: appRouter,
      req: c.req.raw,
      createContext: async (opts) => {
        console.log("📡 Creating context for:", opts.req.url);
        return await createContext(opts);
      },
      onError: ({ error, path, type }) => {
        console.error(`❌ tRPC Error [${type}] on ${path}:`, error.message);
        if (error.code === 'NOT_FOUND') {
          console.error("Available routes:", Object.keys(appRouter._def?.record || {}));
        }
      },
    });

    return response;
  } catch (error) {
    console.error("❌ Error in tRPC handler:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running", router: "configured" });
});

export default app;
