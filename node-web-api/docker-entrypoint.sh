#!/bin/sh
set -e

# Check if we should run seed script
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running seed script..."
  npm run seed
  echo "✅ Seed script completed"
fi

# Start the application
echo "🚀 Starting application..."
exec node dist/server.js

