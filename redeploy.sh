#!/bin/bash
set -e

echo "🧹 Cleaning previous build and caches..."
rm -rf .next .vercel node_modules

echo "📦 Reinstalling dependencies fresh..."
npm install

echo "🧪 Running local production build test..."
npm run build

echo "🧭 Staging and pushing changes to GitHub..."
git add .
git commit -m "🔥 Clean rebuild and redeploy"
git push origin main

echo "🚀 Deploying fresh build to Vercel (production)..."
vercel --prod --force

echo "✅ Done! Clean redeploy completed successfully."