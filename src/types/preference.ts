export interface UserPreference {
  dietaryPreferences: string[];
  dislikedIngredients: string[];
  allergies: string[];
  preferredCuisines: string[];
  maximumCookingTime?: number;
  calorieGoal?: number;
  servings?: number;
  budgetLevel?: 'low' | 'medium' | 'high';
}
