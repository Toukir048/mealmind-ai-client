export interface DashboardTotals {
  recipesCreated: number;
  favorites: number;
  reviews: number;
  averageRatingOfUserRecipes: number;
  aiRecommendationsRequested: number;
  recommendationSelections: number;
}

export interface DashboardSummary {
  totals: DashboardTotals;
  recipesByCategory: Array<{ category: string; count: number }>;
  activityLastSevenDays: Array<{
    date: string;
    recipesCreated: number;
    favoritesAdded: number;
    reviewsCreated: number;
    recommendationRequests: number;
  }>;
  mostFavoritedRecipes: Array<{
    recipeId: string;
    title: string;
    slug: string;
    image: string;
    favoriteCount: number;
  }>;
  recentActivity: Array<{
    type: 'recipe_created' | 'favorite_added' | 'review_created' | 'recommendation_selected';
    occurredAt: string;
    recipeId?: string;
    recipeTitle?: string;
    recommendationId?: string;
  }>;
}
