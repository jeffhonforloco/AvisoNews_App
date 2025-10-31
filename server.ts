// Server entry point for Rork/Expo Server
// This file is the entry point for the backend server
import app from "./backend/hono";

// Log server startup
console.log("🚀 Server.ts loaded - Rork server entry point");
console.log("📦 Hono app type:", typeof app);
console.log("✅ Server ready for Rork");

// Export the Hono app for Rork to use
export default app;

