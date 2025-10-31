# AvisoNews Backend Setup

## CRITICAL: Starting the Server

The backend server **ONLY works with Rork**, not regular Expo.

### ❌ DON'T DO THIS (Won't start backend):
```bash
bun expo start --web
expo start
npx expo start
```

### ✅ DO THIS (Starts backend + frontend):
```bash
npm start
# or
bunx rork start -p fu49owrmx2zse953gaqeg --tunnel
```

## Why?

- **Regular Expo** (`expo start`) only runs the frontend - no backend server
- **Rork** (`rork start`) runs BOTH frontend AND backend server
- The `server.ts` file is ONLY used by Rork (specified in `package.json` `"server"` field)

## Backend Server

The backend is defined in:
- Entry point: `server.ts`
- Routes: `backend/hono.ts`
- Runs automatically when you use Rork

## API Endpoints

Once Rork is running, the API will be available at:
- `EXPO_PUBLIC_RORK_API_BASE_URL/api/articles`
- `EXPO_PUBLIC_RORK_API_BASE_URL/api/categories`
- `EXPO_PUBLIC_RORK_API_BASE_URL/api/sources`

The base URL is set by Rork automatically.

## Troubleshooting 404 Errors

If you see 404 errors:
1. **Make sure you're using Rork, not regular Expo**
2. Check server logs for route registration
3. Verify `EXPO_PUBLIC_RORK_API_BASE_URL` is set
4. Restart the Rork server

