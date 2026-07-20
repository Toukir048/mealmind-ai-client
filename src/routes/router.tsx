import { createBrowserRouter } from 'react-router-dom';

import { GlobalLayout } from '../layouts/GlobalLayout';
import { AboutPage } from '../pages/AboutPage';
import { AIRecommendationsPage } from '../pages/AIRecommendationsPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { ContactPage } from '../pages/ContactPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ExploreRecipesPage } from '../pages/ExploreRecipesPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PrivacyPage } from '../pages/PrivacyPage';
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
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'ai-recommendations', element: <AIRecommendationsPage /> },
          { path: 'ai-assistant', element: <AIAssistantPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'recipes/add', element: <ProtectedPlaceholderPage eyebrow="Create" title="Add a recipe" description="Share a complete, practical recipe with ingredients, instructions, timing, dietary tags, and an inviting image." /> },
          { path: 'recipes/manage', element: <ProtectedPlaceholderPage eyebrow="Your recipes" title="Manage your recipe collection" description="Review and maintain recipes you created while keeping ownership controls on the server." /> },
          { path: 'favorites', element: <ProtectedPlaceholderPage eyebrow="Saved meals" title="Your favorite recipes" description="Return to recipes you saved and turn trusted favorites into a practical meal plan." /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
