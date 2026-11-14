# Contabo deployment for RStechwerk

The deployment workflow is intentionally gated. It runs CI for `main`, but it
will not connect to the VPS until the repository variable
`RSTECHWERK_DEPLOY_ENABLED` is set to `true` and the `production` environment
contains the deployment secrets.

## VPS requirements

- Checkout at `/home/shahin/apps/rstechwerk/repository`, on a clean `main` branch.
- Production `.env` in that checkout, mode `600`, with the Contabo-local MySQL
  database, HTTPS app URL and exact CORS origins.
- User-local Node 22 at `/home/shahin/.local/opt/node-v22.23.4-linux-x64/bin`.
- PM2 installed for user `shahin`.
- Nginx proxy and a valid certificate for `rstechwerk.com` and
  `www.rstechwerk.com`.
- MySQL schema imported and the app user granted only the privileges the
  running app needs. The current app also performs schema initialization on
  startup, so review those DDL requirements before production hardening.

## Restrict the GitHub Actions SSH key

Install this receiver as a root-owned executable at
`/usr/local/libexec/rstechwerk-deploy-receiver`. Add the generated public key to
`/home/shahin/.ssh/authorized_keys` with the following options before the key
itself:

```text
restrict,command="/usr/local/libexec/rstechwerk-deploy-receiver" ssh-ed25519 AAAA... rstechwerk-github-actions
```

The receiver accepts only the SSH command `deploy`, then invokes the existing
fast-forward-only VPS deployment script. Do not install this key as an
unrestricted shell key.

## GitHub configuration

Create the `production` environment and set these secrets:

- `DEPLOY_HOST`: VPS IP or hostname
- `DEPLOY_PORT`: SSH port
- `DEPLOY_USER`: `shahin`
- `DEPLOY_SSH_KEY`: private half of the dedicated Actions key
- `DEPLOY_KNOWN_HOSTS`: verified VPS host-key line

Set repository variable `RSTECHWERK_DEPLOY_ENABLED=true` only after the VPS
checkout, `.env`, database, Nginx and TLS are ready. A push to `main` then runs
checks and deploys only if checks pass.
