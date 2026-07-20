import { matchPath, useLocation } from 'react-router-dom';

import { PageMeta } from './PageMeta';

type RouteMeta = { title: string; description: string; keywords: string; robots?: string };

const routeMetadata: Array<{ path: string; meta: RouteMeta }> = [
  { path: '/', meta: { title: 'Home', description: 'Explore personalized recipes and plan meals with MealMind AI.', keywords: 'MealMind AI, personalized recipes, AI meal planning' } },
  { path: '/recipes', meta: { title: 'Explore Recipes', description: 'Search and filter healthy recipes by cuisine, diet, difficulty, and cooking time.', keywords: 'explore recipes, healthy recipes, recipe search, dietary recipes' } },
  { path: '/recipes/:slug', meta: { title: 'Recipe Details', description: 'View ingredients, instructions, nutrition details, reviews, and related recipes.', keywords: 'recipe details, ingredients, cooking instructions, nutrition' } },
  { path: '/login', meta: { title: 'Login', description: 'Sign in to MealMind AI to access saved recipes and personalized meal planning.', keywords: 'MealMind AI login, recipe account, meal planner sign in', robots: 'noindex,follow' } },
  { path: '/register', meta: { title: 'Register', description: 'Create your MealMind AI account for favorites, recommendations, and meal planning.', keywords: 'create MealMind account, recipe registration, AI meal planner account', robots: 'noindex,follow' } },
  { path: '/ai-assistant', meta: { title: 'AI Meal Assistant', description: 'Chat with MealMind AI for contextual recipe ideas and practical meal-plan suggestions.', keywords: 'AI meal assistant, meal planning chat, recipe assistant', robots: 'noindex,nofollow' } },
  { path: '/ai-recommendations', meta: { title: 'AI Recommendations', description: 'Get ranked recipe recommendations tailored to your diet, time, calories, and cuisine.', keywords: 'personalized recipe recommendations, AI recipes, dietary meal ideas', robots: 'noindex,nofollow' } },
  { path: '/dashboard', meta: { title: 'Dashboard', description: 'Review your MealMind recipe, favorite, review, and recommendation activity.', keywords: 'MealMind dashboard, recipe analytics, recommendation activity', robots: 'noindex,nofollow' } },
  { path: '/recipes/add', meta: { title: 'Add Recipe', description: 'Share a complete recipe with the MealMind AI community.', keywords: 'add recipe, share recipe, create recipe', robots: 'noindex,nofollow' } },
  { path: '/recipes/manage', meta: { title: 'Manage Recipes', description: 'Review and manage the recipes you have added to MealMind AI.', keywords: 'manage recipes, my recipes, delete recipe', robots: 'noindex,nofollow' } },
  { path: '/favorites', meta: { title: 'Favorites', description: 'Return to the MealMind recipes you have saved as favorites.', keywords: 'favorite recipes, saved recipes, recipe collection', robots: 'noindex,nofollow' } },
  { path: '/preferences', meta: { title: 'Preferences', description: 'Set dietary, cuisine, cooking-time, calorie, serving, and budget preferences.', keywords: 'dietary preferences, meal preferences, personalized recommendations', robots: 'noindex,nofollow' } },
  { path: '/about', meta: { title: 'About', description: 'Learn how MealMind AI combines recipe discovery with thoughtful AI meal planning.', keywords: 'about MealMind AI, recipe platform, agentic meal planning' } },
  { path: '/contact', meta: { title: 'Contact', description: 'Contact the MealMind AI team with questions, feedback, or support requests.', keywords: 'contact MealMind AI, meal planner support, recipe feedback' } },
  { path: '/privacy', meta: { title: 'Privacy Policy', description: 'Understand how MealMind AI handles account, preference, and interaction information.', keywords: 'MealMind AI privacy, data policy, account privacy' } },
];

export const RouteMetadata = () => {
  const { pathname } = useLocation();
  const match =
    routeMetadata.find(({ path }) => !path.includes(':') && matchPath({ path, end: true }, pathname)) ??
    routeMetadata.find(({ path }) => matchPath({ path, end: true }, pathname));
  if (!match) return <PageMeta title="Page Not Found" description="The requested MealMind AI page could not be found." keywords="MealMind AI page not found" robots="noindex,nofollow" />;
  return <PageMeta title={match.meta.title} description={match.meta.description} keywords={match.meta.keywords} canonicalPath={pathname} robots={match.meta.robots} />;
};
