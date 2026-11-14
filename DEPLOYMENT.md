# Contabo VPS deployment

This repository can be deployed from a clean Git checkout with PM2. The Express
API serves the Vite production files and `/api` from the same origin, so Nginx
should proxy the public site to the Node process on port 4000. Do not expose
port 4000 directly to the public internet.

## One-time VPS setup

1. Install a supported Node.js LTS release, Git, and Nginx on the VPS.
2. Clone this repository into a persistent directory (for example,
   `/var/www/rstechwerk`) and check out the deployment branch (`main` by default).
3. Create the production `.env` in the repository directory. Keep it on the VPS;
   never commit it. Set at least `NODE_ENV=production`, `APP_URL` to the HTTPS
   domain, `CORS_ORIGINS` to the exact public origin(s), a long unique
   `JWT_SECRET`, and the MySQL credentials. Add SMTP and production payment
   provider settings only when those services are ready.
4. Install PM2 once: `sudo npm install --global pm2`.
5. From the repository directory run `npm ci`, `npm run lint`, `npm run build`,
   then `pm2 start ecosystem.config.cjs --only rstechwerk-api --env production`
   and `pm2 save`.
6. Configure Nginx and HTTPS to proxy the domain to `http://127.0.0.1:4000`.
   Keep the Node port blocked from public inbound traffic in the VPS firewall.
7. Confirm `https://YOUR_DOMAIN/api/health` returns a healthy response, then
   test sign-in, inquiry submission, portal, and payment return flows.

## Subsequent deployments

After reviewed changes have been committed and pushed to the configured branch,
run this from the VPS checkout:

```bash
DEPLOY_BRANCH=main ./scripts/deploy-vps.sh
```

The script refuses to deploy if the checkout has local modifications or `.env`
is missing. It fast-forward pulls only, installs exactly the lockfile versions,
runs lint and the production build before reloading PM2, then polls the API and
database health endpoint. If health does not recover, inspect `pm2 logs
rstechwerk-api`; the script does not automatically roll back database changes.

## Database note

API startup runs `initializeDatabase()` to create missing tables and apply the
small additive compatibility changes currently present in `server/db.js`. A
deployment can therefore change the schema on startup. Take and verify a backup
before the first production deployment and before future schema-changing
releases. `server/schema.sql` is a baseline reference, not an upgrade script for
an existing database. A versioned migration/rollback system is still a separate
launch task; do not assume this deployment script can roll back a schema.
