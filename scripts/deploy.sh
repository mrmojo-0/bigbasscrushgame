#!/bin/bash
# BigBassCrashGame deployment script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from the project root."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Generate DB migrations and run them
echo "🗄️ Running database migrations..."
npm run db:generate 2>/dev/null || true
npm run db:migrate

# Seed database if it's empty
echo "🌱 Seeding database..."
npm run db:seed 2>/dev/null || echo "  (Seed already applied or skipped)"

# Fetch images
echo "🖼️ Fetching images..."
npm run fetch-images 2>/dev/null || echo "  (Image fetch skipped - will retry later)"

# Build the site
echo "🔨 Building site..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "To start with PM2:"
echo "  pm2 start ecosystem.config.cjs"
echo ""
echo "To restart:"
echo "  pm2 restart bigbasscrash"
