# MealMind AI Client .

Responsive React frontend for MealMind AI. It uses Vite, strict TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, daisyUI, Recharts, Firebase Authentication, Axios, React Icons, and Sonner.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Configure `VITE_API_URL` and the Firebase web variables documented in [../DEPLOYMENT.md](../DEPLOYMENT.md). Google login is unavailable when Firebase web configuration is incomplete; local authentication continues to work.

## Commands

- `npm run dev` — local Vite server
- `npm run lint` — ESLint
- `npm run build` — strict TypeScript check and production bundle
- `npm run preview` — preview the built bundle

## Routes

Public: `/`, `/recipes`, `/recipes/:slug`, `/about`, `/contact`, `/privacy`, `/login`, `/register`.

Protected: `/dashboard`, `/ai-recommendations`, `/ai-assistant`, `/recipes/add`, `/recipes/manage`, `/favorites`, `/preferences`.

Server data is managed with TanStack Query. The application JWT is attached by the shared Axios instance, and a `401` clears both cached credentials and active React auth state.

For production hosting, publish `dist/` and configure an SPA fallback to `index.html`.
