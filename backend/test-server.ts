// Test file to verify server can be imported
import app from "./hono";

console.log("✅ Test: Hono app imported successfully");
console.log("✅ Test: App type:", typeof app);
console.log("✅ Test: App is Hono instance:", app.constructor.name);

export default app;

