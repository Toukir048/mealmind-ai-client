import { api } from './api';
import type { RecipeListResponse } from '../types/recipe';

export const getFeaturedRecipes = async (): Promise<RecipeListResponse> => {
  const { data } = await api.get<RecipeListResponse>('/recipes', {
    params: { page: 1, limit: 4, sort: 'rating' },
  });
  return data;
};
