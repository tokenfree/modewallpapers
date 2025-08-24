#!/bin/bash

echo "🔍 Verifying Favicon Setup..."

# Check if public directory exists
if [ -d "client/public" ]; then
    echo "✅ Public directory exists"
else
    echo "❌ Public directory missing"
    exit 1
fi

# Check if favicon exists
if [ -f "client/public/favicon.ico" ]; then
    echo "✅ Favicon found in public directory"
    favicon_size=$(ls -la client/public/favicon.ico | awk '{print $5}')
    echo "   Favicon size: $favicon_size bytes"
else
    echo "❌ Favicon missing from public directory"
    exit 1
fi

# Check if manifest exists
if [ -f "client/public/manifest.json" ]; then
    echo "✅ Manifest.json found"
else
    echo "❌ Manifest.json missing"
fi

# Check if index.html has correct favicon links
if grep -q "favicon.ico?v=" client/index.html; then
    echo "✅ Favicon links with cache busting found in index.html"
else
    echo "❌ Favicon links missing or incorrect in index.html"
fi

# Check vite config
if grep -q "publicDir" vite.config.ts; then
    echo "✅ Vite publicDir configuration found"
else
    echo "❌ Vite publicDir configuration missing"
fi

echo ""
echo "🚀 To test the favicon:"
echo "1. Run 'npm run dev' for development"
echo "2. Run 'npm run build' then 'npm start' for production"
echo "3. Check browser dev tools Network tab for favicon requests"
echo "4. Clear browser cache if needed (Ctrl+F5)"

echo ""
echo "Favicon setup verification complete!"