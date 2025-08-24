#!/usr/bin/env bash
# Render.com build script

# Exit on any failure
set -o errexit

echo "Starting Render build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run database migrations (if needed)
if [ "$NODE_ENV" = "production" ] && [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npm run db:push
fi

# Build the application
echo "Building application..."
npm run build

echo "Build completed successfully!"
