#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-main}"
APP_NAME="rstechwerk-api"

cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "Deployment error: $APP_DIR is not a Git checkout." >&2
  exit 1
fi
CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  echo "Deployment error: checkout is on '$CURRENT_BRANCH', expected '$BRANCH'. Switch branches first or set DEPLOY_BRANCH." >&2
  exit 1
fi
if [[ ! -f .env ]]; then
  echo "Deployment error: production .env is missing; create it before deploying." >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Deployment error: working tree is not clean. Commit or safely back up local changes before deploying." >&2
  git status --short
  exit 1
fi
if ! command -v pm2 >/dev/null 2>&1; then
  echo "Deployment error: PM2 is not installed. Install it with: npm install --global pm2" >&2
  exit 1
fi

echo "Fetching latest $BRANCH..."
git fetch origin "$BRANCH"
git merge --ff-only "origin/$BRANCH"

echo "Installing locked dependencies..."
npm ci

echo "Checking TypeScript and creating the production build..."
npm run lint
npm run build

echo "Starting or reloading the API with PM2..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --only "$APP_NAME" --env production --update-env
else
  pm2 start ecosystem.config.cjs --only "$APP_NAME" --env production
fi
pm2 save

echo "Waiting for API/database health..."
for attempt in {1..20}; do
  if curl --fail --silent http://127.0.0.1:4000/api/health >/dev/null; then
    echo "Deploy complete. API and database health check passed."
    exit 0
  fi
  sleep 2
done

echo "Deployment completed but the health endpoint did not become healthy." >&2
pm2 logs "$APP_NAME" --lines 60 --nostream >&2 || true
exit 1
