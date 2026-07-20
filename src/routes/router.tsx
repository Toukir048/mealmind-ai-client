import { createBrowserRouter } from 'react-router-dom';

import { GlobalLayout } from '../layouts/GlobalLayout';
import { AboutPage } from '../pages/AboutPage';
import { ExploreRecipesPage } from '../pages/ExploreRecipesPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedPlaceholderPage } from '../pages/ProtectedPlaceholderPage';
import { RecipeDetailsPage } from '../pages/RecipeDetailsPage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <GlobalLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recipes', element: <ExploreRecipesPage /> },
      { path: 'recipes/:slug', element: <RecipeDetailsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'assistant', element: <ProtectedPlaceholderPage eyebrow="AI meal planner" title="Plan with a context-aware assistant" description="Continue meal-planning conversations and discover recipes grounded in the MealMind library." /> },
          { path: 'dashboard', element: <ProtectedPlaceholderPage eyebrow="Your dashboard" title="See what is shaping your meals" description="Review your recipes, favorites, feedback, and recent MealMind activity in one clear view." /> },
          { path: 'recipes/add', element: <ProtectedPlaceholderPage eyebrow="Create" title="Add a recipe" description="Share a complete, practical recipe with ingredients, instructions, timing, dietary tags, and an inviting image." /> },
          { path: 'recipes/manage', element: <ProtectedPlaceholderPage eyebrow="Your recipes" title="Manage your recipe collection" description="Review and maintain recipes you created while keeping ownership controls on the server." /> },
          { path: 'favorites', element: <ProtectedPlaceholderPage eyebrow="Saved meals" title="Your favorite recipes" description="Return to recipes you saved and turn trusted favorites into a practical meal plan." /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
