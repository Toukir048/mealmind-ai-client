# MealMind AI — Codex Working Agreement

This file is the authoritative implementation guide for future Codex work in this workspace. Read it before changing either repository. The detailed product, database, and HTTP contracts are in `PROJECT_REQUIREMENTS.md`, `DATABASE_DESIGN.md`, and `API_DESIGN.md`; keep all four documents consistent.

## Repository boundaries

- Maintain two separate repositories: `mealmind-ai-client` and `mealmind-ai-server`.
- Client: React + Vite + TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, daisyUI, Recharts, and local/Google sign-in.
- Server: Node.js + Express + TypeScript, MongoDB/Mongoose, Zod, JWT, Firebase Admin token verification, and Gemini.
- Never import source code across repositories. Share contracts through documented schemas or a deliberately versioned package only if later approved.
- Do not add features, libraries, services, or entities outside documented scope without a concrete requirement.

## Architecture rules

- Keep route handlers thin: validate, authorize, call a service, and serialize.
- Keep database models, repositories/queries, business services, AI orchestration, and HTTP concerns separate.
- All database and Gemini access occurs on the server. Gemini can call only allow-listed, validated backend tools.
- Treat model output as untrusted: validate structured output and ground recipe claims in MongoDB query results.
- Use environment variables for secrets and provide `.env.example` files with placeholders only.
- Use a central error handler and stable API envelopes defined in `API_DESIGN.md`.

## Authentication and data safety

- Support local email/password and Google login. Hash local passwords, verify Firebase ID tokens on the backend, and issue an application JWT only after successful authentication.
- Protect add/manage recipes and every user-specific or AI endpoint. Recipe list and detail endpoints remain public.
- Enforce ownership in backend queries; never depend on hidden UI controls.
- Never accept client-supplied ownership, aggregate, role, ranking, or tool-result fields.
- Do not log secrets, JWTs, Google tokens, or unnecessary personal/prompt data.
- Validate every external input with Zod and bound strings, arrays, pagination, request sizes, and conversation context.

## Frontend rules

- Use TanStack Query for all server state, caching, invalidation, loading, and errors; do not duplicate server data in global client state.
- Use React Hook Form with Zod for forms. Match server rules and still treat the server as authoritative.
- Create reusable layout, recipe card, skeleton, empty-state, error-state, and protected-route components.
- Build mobile-first and fully responsive. Recipe grids must be 1 column on narrow mobile, scale through intermediate breakpoints, and be exactly 4 columns on large desktop.
- All recipe cards use the same image aspect ratio, dimensions, content constraints, and shared border-radius token.
- Limit the visual system to three main brand colors plus one neutral. Semantic colors are for status feedback only.
- Use real, meaningful copy—never lorem ipsum. Add visible keyboard focus, labels, alt text, and sufficient contrast.
- Show skeletons, not layout jumps, while recipe, detail, dashboard, recommendation, or conversation data loads.
- Use Recharts only for dashboard data where a chart communicates more clearly than text.

## Backend and database rules

- Follow the entities and indexes in `DATABASE_DESIGN.md`: User, Recipe, Review, Favorite, Conversation, Message, UserPreference, and RecommendationInteraction.
- Paginate all potentially growing collections and cap page size. Project only fields needed by each response.
- Normalize searchable enums/terms consistently. Escape or avoid unsafe regex; use indexed search strategies.
- Keep recipe rating aggregates consistent when reviews change.
- Scope user resources by authenticated user and resource ID in the same query.
- Use migrations or explicit backfill scripts for schema changes that affect existing data.

## Agentic AI rules

- Recommendation flow: read preferences → merge request filters → query MongoDB → deterministic ranking using feedback → grounded Gemini explanation → persist impressions → collect likes/dislikes/selections.
- Never let Gemini bypass dietary/allergen filters or invent recipe records and nutrition facts.
- Chat flow: persist user message → load bounded relevant history/preferences → execute validated recipe-search tools → generate grounded response and meal-plan suggestion → persist assistant message and recipe references.
- Return suggested follow-up questions with chat responses.
- Include timeouts, rate limits, safe error handling, and correlation IDs around AI operations.
- Make ranking and filtering testable without Gemini. Mock Gemini in automated tests.

## Code quality and verification

- Enable strict TypeScript. Avoid `any`; prefer inferred types from Zod or explicit domain types.
- Use small cohesive modules, clear names, async error handling, and no dead/commented-out code.
- Add tests with each behavior change, especially authorization, validation, filtering, ownership, recommendation ranking/feedback, and chat context/tool grounding.
- Before handing off a change, run the relevant formatter/linter, type check, tests, and production build in the affected repository. Report any check that could not run.
- Preserve unrelated user changes. Keep commits/reviews scoped to one logical change.

## Definition of done

A change is done only when its public/protected behavior matches the planning documents, responsive and loading/error states are covered where relevant, access control and validation are enforced server-side, tests cover important behavior, and affected checks pass. Update the planning documents when an approved requirement changes.
