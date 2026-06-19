#!/bin/bash
# deploy.sh — Build and deploy to GitHub Pages (orphan branch method)
#
# Why this script uses `git init` inside out/ each time:
#   The out/ directory is in .gitignore — it's not tracked by the main repo.
#   We need a TEMPORARY, disposable git repo inside out/ just to force-push
#   the built static files to the gh-pages branch.
#   After the push, we delete that temporary .git so it doesn't interfere
#   with the main project's git. Next deployment does the same thing fresh.
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh

set -e  # exit on any error

echo "🚀 Building static site..."
npm run build

echo "📁 Verifying CNAME file..."
if [ ! -f "out/CNAME" ]; then
  echo "⚠️  WARNING: out/CNAME not found!"
  echo "   Creating it from public/CNAME..."
  cp public/CNAME out/CNAME 2>/dev/null || echo "www.javeedishaq.com" > out/CNAME
fi
cat out/CNAME

echo "📁 Preparing out/ directory for deployment..."
cd out

# Create a temporary, disposable git repo inside out/.
# This is NOT connected to the main project's git — it's a clean slate
# that will hold ONLY the built static files for the gh-pages branch.
echo "🔧 Initializing temporary git repo in out/..."
git init

echo "📦 Adding all static files..."
git add -A

echo "💾 Committing..."
git commit -m "Deploy to GitHub Pages"

# Force-push this temporary repo's contents to the gh-pages branch.
# Each run completely replaces the previous gh-pages contents —
# clean slate every time, no merge conflicts, no source code leaks.
echo "☁️  Force-pushing to gh-pages branch..."
git push --force https://github.com/JaveedIshaq/javeedishaq.github.io.git HEAD:gh-pages

# Clean up: remove the temporary .git so the main project
# doesn't get confused by a nested git repo inside out/.
echo "🧹 Cleaning up temporary .git..."
cd ..
rm -rf out/.git

echo ""
echo "✅ Deployment complete!"
echo "   Wait 1-2 minutes for GitHub Pages to update."
echo "   Visit https://javeedishaq.com or https://javeedishaq.github.io"