# Server Verification Checklist

## Step 1: Start the Server

Run this command in your terminal:
```bash
bunx rork start -p fu49owrmx2zse953gaqeg --tunnel
```

## Step 2: Check Server Console Output

When Rork starts, you should see these logs in order:

### ✅ Expected Startup Logs:
```
🚀 AvisoNews Server Starting...
📰 Initializing news aggregation...
🔧 Creating Hono app instance...
🔧 Middleware setup starting...
🔧 Middleware configured

✅ === HONO APP CONFIGURED ===
Registered routes:
  GET  /
  GET  /api
  GET  /test
  GET  /api/test
  GET  /articles
  GET  /api/articles
  GET  /categories
  GET  /api/categories
  GET  /sources
  GET  /api/sources
===========================

✅ Server app imported successfully
📋 Available routes:
   - GET  / (health check)
   - GET  /test (test endpoint)
   - GET  /api/test (test endpoint)
   ...
✅ Server ready for Rork - exporting app NOW
```

## Step 3: Test the Server

### Option A: Test in Browser

1. Get your Rork URL (shown in the Rork console, something like `https://xyz.rork.dev`)
2. Open these URLs in your browser:
   - `https://your-rork-url.rork.dev/api/test`
   - `https://your-rork-url.rork.dev/api/categories`

### Option B: Test with curl

```bash
curl https://your-rork-url.rork.dev/api/test
curl https://your-rork-url.rork.dev/api/categories
```

### Expected Response:

**For /api/test:**
```json
{
  "success": true,
  "message": "API server is working!",
  "timestamp": "2024-..."
}
```

**For /api/categories:**
```json
{
  "success": true,
  "data": [
    { "id": "world", "slug": "world", "name": "World News", ... },
    ...
  ]
}
```

## Step 4: Check Server Logs When Testing

When you make a request, you should see:

```
📡 === INCOMING REQUEST ===
   Method: GET
   Path: /api/test
   Full URL: ...
✅ Response: 200
```

## Troubleshooting

### ❌ If you DON'T see startup logs:
- The server file isn't being loaded
- Check for import errors in server.ts
- Verify `package.json` has `"server": "./server.ts"`

### ❌ If you see startup logs but requests fail:
- Check the `📡 === INCOMING REQUEST ===` logs
- See what path is being requested
- Verify the route matches what's registered

### ❌ If you see 404 errors:
- Check the `❌ === 404 NOT FOUND ===` logs
- It will show the exact path being requested
- Compare with registered routes above

## Quick Test Commands

After starting Rork, test immediately:

```bash
# Replace with your actual Rork URL
curl http://localhost:8081/api/test
curl http://localhost:8081/api/categories
```

These should return JSON responses, not 404 errors.

