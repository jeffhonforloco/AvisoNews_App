#!/bin/bash

# Simple server test script
# Run this AFTER starting Rork to verify endpoints are working

echo "🧪 Testing AvisoNews Server..."
echo ""

# Get base URL from environment or use default
BASE_URL="${EXPO_PUBLIC_RORK_API_BASE_URL:-http://localhost:8081}"

echo "📡 Testing base URL: $BASE_URL"
echo ""

# Test 1: Health check
echo "1️⃣ Testing /api/test endpoint..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/test")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d')

if [ "$http_code" = "200" ]; then
  echo "   ✅ SUCCESS: Server is responding!"
  echo "   Response: $body"
else
  echo "   ❌ FAILED: HTTP $http_code"
  echo "   Response: $body"
fi

echo ""

# Test 2: Categories endpoint
echo "2️⃣ Testing /api/categories endpoint..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/categories")
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
body=$(echo "$response" | sed '/HTTP_CODE/d' | head -c 200)

if [ "$http_code" = "200" ]; then
  echo "   ✅ SUCCESS: Categories endpoint working!"
  echo "   Response preview: ${body}..."
else
  echo "   ❌ FAILED: HTTP $http_code"
  echo "   Response: $body"
fi

echo ""
echo "✅ Test complete!"
echo ""
echo "💡 Tips:"
echo "   - Make sure Rork is running: bunx rork start -p fu49owrmx2zse953gaqeg --tunnel"
echo "   - Set EXPO_PUBLIC_RORK_API_BASE_URL if using custom URL"
echo "   - Check server console logs for detailed request info"

