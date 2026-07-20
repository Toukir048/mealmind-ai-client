# MealMind AI

MealMind AI is a full-stack recipe discovery and agentic meal-planning application. Visitors can search and inspect published recipes. Authenticated users can create recipes, save favorites and preferences, review meals, receive grounded Gemini recommendations, continue contextual planning conversations, and inspect real activity analytics.

The project is maintained as two separate repositories:

- `mealmind-ai-client` — React, Vite, TypeScript, Tailwind CSS, daisyUI, TanStack Query, Recharts, Firebase client authentication.
- `mealmind-ai-server` — Express, TypeScript, MongoDB/Mongoose, JWT, Firebase Admin, Gemini, Zod.

## Quick start

Requirements: Node.js 20+, npm, and MongoDB (a replica set is required for transactional review and recipe cleanup operations).

```bash
cd mealmind-ai-server
cp .env.example .env
npm install
npm run seed:demo-user
npm run seed:recipes
npm run dev
```

In another terminal:

```bash
cd mealmind-ai-client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The API health check is `http://localhost:5000/api/v1/health`.

## Feature checklist

- [x] Local registration, login, logout, session restoration, and demo login
- [x] Firebase Google popup with backend ID-token verification
- [x] Protected routing with return-to-page redirects
- [x] Public recipe search, filters, sorting, pagination, details, reviews, and related recipes
- [x] Protected recipe creation, owner/admin deletion, and recipe management
- [x] Favorites and stored meal preferences
- [x] Grounded personalized recommendations and feedback
- [x] Context-aware AI conversations, backend tools, history, and recipe cards
- [x] User-scoped dashboard analytics and Recharts visualizations
- [x] Responsive landing, About, Contact, Privacy, error, empty, and loading states
- [x] Server validation, security headers, CORS, rate limiting, JWT authorization, and ownership checks

## Demo credentials

The demo account is not hard-coded. Configure `DEMO_USER_NAME`, `DEMO_USER_EMAIL`, and `DEMO_USER_PASSWORD` in the server, then run `npm run seed:demo-user`. Configure the matching email and password as `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` in the client to enable the login-page auto-fill button.

Never use the example password in production.

## API summary

Every route is prefixed with `/api/v1`. Protected calls require `Authorization: Bearer <token>`.

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Authentication | `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `GET /auth/me` |
| Recipes | `GET/POST /recipes`, `GET /recipes/my-recipes`, `GET /recipes/:slug`, `GET /recipes/:slug/related`, `DELETE /recipes/:id` |
| Reviews | `GET/POST /recipes/:recipeId/reviews`, `DELETE /reviews/:id` |
| Favorites | `GET /favorites`, `POST/DELETE /favorites/:recipeId`, `GET /favorites/check/:recipeId` |
| Preferences | `GET/PUT /preferences` |
| Recommendations | `POST /ai/recommendations`, `POST /ai/recommendations/feedback` |
| Conversations | `GET/POST /ai/conversations`, `GET/DELETE /ai/conversations/:id`, `POST /ai/conversations/:id/messages` |
| Dashboard | `GET /dashboard/summary` |

See [API_DESIGN.md](API_DESIGN.md) for request constraints and response contracts, [DATABASE_DESIGN.md](DATABASE_DESIGN.md) for persistence details, and [DEPLOYMENT.md](DEPLOYMENT.md) for environment and deployment instructions.

## Verification

```bash
cd mealmind-ai-client
npm run lint
npm run build

cd ../mealmind-ai-server
npm run lint
npm run typecheck
npm test
npm run build
```

## Screenshots

Add release screenshots here after deploying with representative seeded data:

- Landing page — desktop
- Explore recipes — mobile filters
- Recipe details
- AI recommendations
- Context-aware assistant
- Dashboard analytics

No screenshot assets are committed yet.
