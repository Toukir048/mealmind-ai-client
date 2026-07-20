export interface RecipeSummary {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Drink';
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  preparationTime: number;
  cookingTime: number;
  calories: number;
  dietaryTags: string[];
  averageRating: number;
  reviewCount: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RecipeListResponse {
  data: RecipeSummary[];
  meta: PaginationMeta;
}
