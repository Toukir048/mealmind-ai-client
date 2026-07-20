# Deployment and Environment Guide

## Architecture

Deploy the client and server as separate applications. The client is a static Vite build. The server is a persistent Node.js service connected to MongoDB. Use HTTPS for both and allow only the deployed client origin through server CORS.

## Server environment

| Variable | Required | Purpose |
|---|---:|---|
| `NODE_ENV` | Yes | Use `production` in deployment |
| `PORT` | Platform dependent | Express port; defaults to `5000` |
| `MONGODB_URI` | Yes | MongoDB connection string; use a replica set/Atlas cluster for transactions |
| `JWT_SECRET` | Yes | Random secret of at least 32 characters |
| `JWT_EXPIRES_IN` | Yes | JWT lifetime, such as `7d` |
| `CLIENT_URL` | Yes | Exact public client origin used by CORS |
| `FIREBASE_PROJECT_ID` | For Google login | Firebase Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | For Google login | Firebase service-account email |
| `FIREBASE_PRIVATE_KEY` | For Google login | Firebase private key; encode line breaks as `\\n` if required by the host |
| `GEMINI_API_KEY` | For AI features | Server-only Gemini key |
| `GEMINI_MODEL` | Yes for AI | Gemini Flash model name |
| `AI_TIMEOUT_MS` | No | Provider timeout, default `20000` |
| `AI_RATE_LIMIT_WINDOW_MS` | No | AI rate-limit window, default `60000` |
| `AI_RATE_LIMIT_MAX` | No | AI request limit per window, default `20` |
| `AUTH_RATE_LIMIT_WINDOW_MS` | No | Authentication limit window, default `900000` |
| `AUTH_RATE_LIMIT_MAX` | No | Failed authentication limit, default `20` |
| `DEMO_USER_NAME` | Seed only | Demo account display name |
| `DEMO_USER_EMAIL` | Seed only | Demo account email |
| `DEMO_USER_PASSWORD` | Seed only | Demo account password; choose a deployment-specific value |
| `RECIPE_SEED_OWNER_EMAIL` | Seed only | Existing local account that owns seeded recipes |

Firebase service-account variables may be omitted when the hosting environment provides Application Default Credentials. Do not expose Gemini, Firebase Admin, MongoDB, JWT, or demo-password secrets to the client bundle.

## Client environment

| Variable | Required | Purpose |
|---|---:|---|
| `VITE_API_URL` | Yes | Public API base URL ending in `/api/v1` |
| `VITE_FIREBASE_API_KEY` | For Google login | Firebase web application configuration |
| `VITE_FIREBASE_AUTH_DOMAIN` | For Google login | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | For Google login | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | For Google login | Firebase web configuration value |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | For Google login | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | For Google login | Firebase web app ID |
| `VITE_DEMO_EMAIL` | Optional | Demo form auto-fill email |
| `VITE_DEMO_PASSWORD` | Optional | Demo form auto-fill password; public by design for a demo-only account |

All `VITE_` variables are embedded in the browser bundle and must be treated as public.

## Deploy the server

1. Provision MongoDB Atlas or another transaction-capable replica set and allow the server network.
2. Configure all server variables in the hosting platform.
3. Run `npm ci`, `npm run build`, then start with `npm start`.
4. Seed only when needed: run `npm run seed:demo-user`, then `npm run seed:recipes`.
5. Verify `GET https://<api-host>/api/v1/health`.

## Deploy the client

1. Register the production domain in Firebase Authentication authorized domains.
2. Set `VITE_API_URL` to the deployed API and configure Firebase web values.
3. Run `npm ci && npm run build`.
4. Publish `dist/` to a static host.
5. Configure an SPA fallback so unknown paths serve `index.html`.
6. Set server `CLIENT_URL` to the exact deployed client origin and redeploy the server.

## Production checks

- Use HTTPS, a unique JWT secret, and restricted MongoDB credentials.
- Confirm Google, local, and demo login separately.
- Confirm protected URLs redirect to login and return after authentication.
- Run a real Gemini recommendation and chat tool call.
- Verify CORS rejects unapproved origins and rate-limit responses return `429`.
- Keep `.env` files out of version control and rotate any exposed credentials immediately.
