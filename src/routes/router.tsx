import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RouteLoading } from '../components/loaders/RouteLoading';
import { GlobalLayout } from '../layouts/GlobalLayout';
import { ProtectedRoute } from './ProtectedRoute';

const load = <T extends Record<K, React.ComponentType>, K extends keyof T>(
  importer: () => Promise<T>,
  name: K,
) => lazy(async () => ({ default: (await importer())[name] }));
const HomePage = load(() => import('../pages/HomePage'), 'HomePage');
const ExploreRecipesPage = load(() => import('../pages/ExploreRecipesPage'), 'ExploreRecipesPage');
const RecipeDetailsPage = load(() => import('../pages/RecipeDetailsPage'), 'RecipeDetailsPage');
const AboutPage = load(() => import('../pages/AboutPage'), 'AboutPage');
const ContactPage = load(() => import('../pages/ContactPage'), 'ContactPage');
const PrivacyPage = load(() => import('../pages/PrivacyPage'), 'PrivacyPage');
const LoginPage = load(() => import('../pages/LoginPage'), 'LoginPage');
const RegisterPage = load(() => import('../pages/RegisterPage'), 'RegisterPage');
const NotFoundPage = load(() => import('../pages/NotFoundPage'), 'NotFoundPage');
const AIRecommendationsPage = load(() => import('../pages/AIRecommendationsPage'), 'AIRecommendationsPage');
const AIAssistantPage = load(() => import('../pages/AIAssistantPage'), 'AIAssistantPage');
const DashboardPage = load(() => import('../pages/DashboardPage'), 'DashboardPage');
const AddRecipePage = load(() => import('../pages/AddRecipePage'), 'AddRecipePage');
const ManageRecipesPage = load(() => import('../pages/ManageRecipesPage'), 'ManageRecipesPage');
const FavoritesPage = load(() => import('../pages/FavoritesPage'), 'FavoritesPage');
const PreferencesPage = load(() => import('../pages/PreferencesPage'), 'PreferencesPage');
const page = (content: ReactNode) => <Suspense fallback={<RouteLoading />}>{content}</Suspense>;

export const router = createBrowserRouter([{
  element: <GlobalLayout />,
  children: [
    { index: true, element: page(<HomePage />) },
    { path: 'recipes', element: page(<ExploreRecipesPage />) },
    { path: 'recipes/:slug', element: page(<RecipeDetailsPage />) },
    { path: 'about', element: page(<AboutPage />) },
    { path: 'contact', element: page(<ContactPage />) },
    { path: 'privacy', element: page(<PrivacyPage />) },
    { path: 'login', element: page(<LoginPage />) },
    { path: 'register', element: page(<RegisterPage />) },
    { element: <ProtectedRoute />, children: [
      { path: 'ai-recommendations', element: page(<AIRecommendationsPage />) },
      { path: 'ai-assistant', element: page(<AIAssistantPage />) },
      { path: 'dashboard', element: page(<DashboardPage />) },
      { path: 'recipes/add', element: page(<AddRecipePage />) },
      { path: 'recipes/manage', element: page(<ManageRecipesPage />) },
      { path: 'favorites', element: page(<FavoritesPage />) },
      { path: 'preferences', element: page(<PreferencesPage />) },
    ] },
    { path: '*', element: page(<NotFoundPage />) },
  ],
}]);
