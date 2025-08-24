#!/bin/bash

# Mode Wallpapers Build Script
echo "Building Mode Wallpapers..."

# Clean previous build
rm -rf dist

# Build the client and server
echo "Building client..."
vite build

echo "Building server..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Verify favicon exists in build
if [ -f "dist/public/favicon.ico" ]; then
    echo "✅ Favicon successfully copied to build directory"
else
    echo "❌ Warning: Favicon not found in build directory"
fi

echo "Build completed!"