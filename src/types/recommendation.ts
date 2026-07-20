import type { RecipeSummary } from './recipe';

export interface RecommendationRequest {
  mealType?: RecipeSummary['category'];
  dietaryPreference?: string;
  excludedIngredients: string[];
  maximumCookingTime?: number;
  calorieTarget?: number;
  preferredCuisine?: string;
  numberOfResults: number;
}

export interface RankedRecommendation {
  recipeId: string;
  matchScore: number;
  explanation: string;
  recipe: RecipeSummary;
}

export interface RecommendationResult {
  recommendationId: string;
  recommendations: RankedRecommendation[];
}

export type RecommendationFeedback = 'liked' | 'disliked' | 'selected' | 'ignored';
