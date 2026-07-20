# MealMind AI — Project Requirements

## 1. Product scope

MealMind AI is a responsive full-stack application for discovering healthy recipes and receiving personalized, explainable meal guidance. The product must let visitors browse recipes and view recipe details without signing in. Authenticated users can add and manage their own recipes, save preferences and favorites, review recipes, receive personalized recommendations, chat with a meal-planning assistant, and view relevant dashboard statistics.

The application is delivered as two separate repositories:

- `mealmind-ai-client`: React, Vite, and TypeScript
- `mealmind-ai-server`: Express and TypeScript

MongoDB is the system of record. The backend owns authorization, validation, recipe search, AI orchestration, and persistence. The Gemini API provides language-model capabilities but must not access MongoDB directly.

## 2. Required technology

| Area | Decision |
|---|---|
| Frontend | React, Vite, TypeScript, React Router |
| Server state | TanStack Query |
| Forms and validation | React Hook Form and Zod |
| Styling | Tailwind CSS and daisyUI |
| Charts | Recharts |
| Authentication | Local email/password and Google login; server-issued JWT for application sessions |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | MongoDB with Mongoose |
| AI | Gemini API, called only from the backend |

## 3. Functional requirements

### Public experience

- Explore recipes in a searchable catalog.
- Filter recipes by supported dietary and recipe attributes.
- Sort results and navigate paginated result sets.
- View complete recipe details without authentication.
- Register and sign in with email/password, or sign in with Google.

### Authenticated experience

- Add a recipe and edit or delete recipes owned by the current user.
- View a manage-recipes page limited to the current user's recipes.
- Save and remove favorites.
- Create or update one review per recipe and user.
- Save dietary preferences used by recommendation and chat features.
- Receive ranked, personalized recipe recommendations with explanations.
- Like, dislike, or select a recommendation; persist each interaction.
- Start and resume meal-planning conversations.
- View dashboard statistics derived from the user's own data.

### Authorization

- Recipe catalog and recipe details are public.
- Add-recipe, manage-recipe, preferences, favorites, recommendations, conversations, and dashboard routes are protected.
- The backend must enforce ownership for recipe mutation and access control regardless of client behavior.
- JWTs must be verified on every protected API request. Secrets and third-party credentials must never be exposed to the client.

## 4. Agentic AI requirements

### Personalized Meal Recommendation Agent

For an authenticated user, the agent must:

1. Read the user's stored dietary preferences.
2. Convert preferences and request-specific constraints into deterministic filters.
3. Search eligible recipes in MongoDB through backend service/tool functions.
4. Rank candidates using preferences and prior likes, dislikes, and selections.
5. Use Gemini to produce concise explanations grounded only in candidate recipe data.
6. Return recipe references with ranking information and explanations.
7. Persist later likes, dislikes, and selections as `RecommendationInteraction` records.
8. Use accumulated interactions to improve subsequent ranking.

Filtering and authorization are deterministic backend responsibilities. Gemini must not invent recipes, ingredients, nutrition values, or database results.

### Context-Aware Meal Planning Chat Assistant

For an authenticated user, the assistant must:

- Persist conversations and ordered messages.
- Load relevant conversation history so follow-up messages retain context.
- use backend recipe-search tools rather than claiming direct database access.
- Recommend only recipes returned by application tools.
- Create meal-plan suggestions that respect saved preferences and current constraints.
- Return a helpful answer, referenced recipe IDs where applicable, and suggested follow-up questions.
- Record tool activity or structured recipe references needed for traceability.

## 5. UX and visual requirements

- All pages must be fully responsive and usable with keyboard navigation.
- Use no more than three main brand colors plus one neutral color. Semantic status colors may be used only for feedback states.
- Use consistent card dimensions and one shared card border-radius token.
- Recipe grids must show four cards per row on large desktop screens and step down appropriately for tablet and mobile.
- Use fixed image aspect ratios and clamped text so recipe cards remain aligned.
- Show skeleton loaders for recipe grids, details, dashboard data, recommendations, and chat-history loading.
- Use meaningful product copy and realistic seeded content; never use lorem ipsum.
- Provide clear empty, validation, error, and retry states.
- Keep layouts and interactive controls accessible, with visible focus states and descriptive labels.

## 6. Quality and operational requirements

- Validate all external input at API boundaries with Zod.
- Use consistent JSON response and error shapes.
- Paginate collection endpoints and enforce maximum page sizes.
- Index fields used for search, filtering, ownership, uniqueness, and chronological retrieval.
- Prevent cross-user data access and mass-assignment vulnerabilities.
- Keep AI prompts, database access, and business rules in separate backend modules.
- Log server errors without logging JWTs, Google tokens, prompts containing unnecessary personal data, or API keys.
- Provide environment-variable examples and setup documentation in each repository when implementation begins.
- Include tests for critical authorization, validation, filtering, ranking, and conversation-context behavior.

## 7. Explicit non-goals for the initial release

- Additional authentication methods beyond local email/password and Google
- Grocery ordering, payments, delivery, or social networking
- AI-generated recipes that are not stored application recipes
- Medical diagnosis or individualized clinical nutrition advice
- Real-time multi-user chat

## 8. Acceptance criteria

The initial release is complete when the two repositories run independently, all required public and protected flows work end to end, responsive layouts satisfy the recipe-grid and card rules, MongoDB persists all listed entities, recommendation feedback affects later rankings, chat follow-ups use stored context and application recipe tools, and build/test checks pass in both repositories.
