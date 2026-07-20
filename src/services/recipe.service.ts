import { api } from './api';
import type {
  Recipe,
  RecipeListResponse,
  RecipeSummary,
  ReviewListResponse,
} from '../types/recipe';

export interface RecipeQueryParams {
  search?: string;
  category?: string;
  difficulty?: string;
  dietaryTag?: string;
  maxCookingTime?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getRecipes = async (params: RecipeQueryParams): Promise<RecipeListResponse> => {
  const { data } = await api.get<RecipeListResponse>('/recipes', { params });
  return data;
};

export const getFeaturedRecipes = async (): Promise<RecipeListResponse> => {
  const { data } = await api.get<RecipeListResponse>('/recipes', {
    params: { page: 1, limit: 4, sort: 'rating' },
  });
  return data;
};

export const getRecipe = async (slug: string): Promise<Recipe> => {
  const { data } = await api.get<{ data: Recipe }>(`/recipes/${slug}`);
  return data.data;
};

export const getRelatedRecipes = async (slug: string): Promise<RecipeSummary[]> => {
  const { data } = await api.get<{ data: RecipeSummary[] }>(`/recipes/${slug}/related`);
  return data.data;
};

export const getRecipeReviews = async (recipeId: string): Promise<ReviewListResponse> => {
  const { data } = await api.get<ReviewListResponse>(`/recipes/${recipeId}/reviews`, {
    params: { page: 1, limit: 10 },
  });
  return data;
};

export const addRecipeReview = async (
  recipeId: string,
  input: { rating: number; comment?: string },
): Promise<void> => {
  await api.post(`/recipes/${recipeId}/reviews`, input);
};

export const checkFavorite = async (recipeId: string): Promise<boolean> => {
  const { data } = await api.get<{ data: { isFavorite: boolean } }>(
    `/favorites/check/${recipeId}`,
  );
  return data.data.isFavorite;
};

export const addFavorite = async (recipeId: string): Promise<void> => {
  await api.post(`/favorites/${recipeId}`);
};

export const removeFavorite = async (recipeId: string): Promise<void> => {
  await api.delete(`/favorites/${recipeId}`);
};
