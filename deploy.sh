#!/bin/bash
# Run this after gh auth login to deploy your portfolio

cd /c/Users/tigod/portfolio

git init
git add .
git commit -m "Initial portfolio"

gh repo create TigoDeken.github.io --public --source=. --remote=origin --push

echo ""
echo "Done! Your site will be live at: https://TigoDeken.github.io"
echo "(Takes ~1-2 minutes to go live)"
