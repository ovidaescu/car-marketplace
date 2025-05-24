#!/bin/bash
set -e

# (Optional) Auto-commit and push to GitHub
git add .
git commit -m "Auto-deploy: $(date)" || echo "Nothing to commit"
git push


# Sync local files to server (excluding node_modules, .git, etc.)
rsync -avz --exclude 'node_modules' --exclude '.git' ./ ubuntu@13.61.104.149:~/car-marketplace/
# SSH into server and rebuild/restart Docker
ssh ubuntu@13.61.104.149 << 'ENDSSH'
  cd ~/car-marketplace
  docker compose down -v --remove-orphans
  docker compose build --no-cache
  docker compose up -d
  docker compose exec web npx sequelize-cli db:migrate
  docker compose exec web npx sequelize-cli db:seed:all
ENDSSH